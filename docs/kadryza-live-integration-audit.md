# Audit — Samiah Kadryza Live Integration 1A

Dernière mise à jour : 2026-08-24

## Base et périmètre

- dépôt modifié : `willyldx/samiah-cosmetics-shop-v2` uniquement ;
- base historique : `main` à
  `357b378807c4a2a10bbca9ce301f0a7c74cf0ca2` ;
- contrat Kadryza relu en lecture seule sur `willyldx/Kadryza-Pay` à
  `0e0d4825999b5f488a48368ba4c2b31467820991` ;
- contrat dynamique fusionné par Kadryza PR #228,
  `Hosted Checkout — Dynamic Operators 1A` ;
- aucun fichier Kadryza, Gateway Android ou provisioning n'a été modifié ;
- aucun appel financier, paiement ou onboarding LIVE n'a été effectué.

## Existant conservé

Le checkout invité collecte le nom, le contact WhatsApp, la ville et l'adresse
de livraison. Le serveur relit les produits actifs dans Supabase et recalcule
les prix, quantités, sous-total, livraison et total. Le montant navigateur
n'est jamais une autorité.

Le paiement à la livraison conserve son flux : création de commande, vidage du
panier, puis WhatsApp. Le flux Kadryza conserve le panier jusqu'au statut
serveur `paid` et utilise un jeton de lecture de statut haché.

Frais serveur observés :

| Ville | Frais XAF |
| --- | ---: |
| N'Djamena | 1 000 |
| Moundou, Sarh, Kelo, Pala, Koumra | 2 000 |
| Abeche | 2 500 |
| Bongor | 1 500 |
| Faya-Largeau | 3 000 |

La livraison devient gratuite à partir de 20 000 XAF de sous-total.

## Contrat Hosted Checkout dynamique

Samiah crée désormais un intent avec `POST /v1/hosted-checkouts` :

- authentification serveur par `X-API-Key` ;
- `reference`, `amount`, `currency=XAF`, description et metadata minimales ;
- aucun `operator`, `customer_phone`, `merchant_id`, `environment` ou
  `is_test` transmis ;
- marchand et environnement déduits exclusivement de la clé API ;
- réponse `201` avec l'identifiant d'intent, son environnement, son expiration
  et le `checkout_url` officiel HTTPS.

Le navigateur ouvre ce Hosted Checkout. Kadryza recalcule sa propre readiness,
n'affiche que les opérateurs disponibles, collecte le numéro Mobile Money et
crée une unique Payment Session après le choix du client. Samiah n'appelle pas
les endpoints publics de sélection et n'embarque aucune logique de readiness.

Le contrat ne documente toujours pas de `return_url`. La page de statut Samiah
reste donc ouverte et le checkout est lancé dans un nouvel onglet. Le retour,
le polling et le bouton client ne confirment jamais le paiement.

La création est idempotente chez Kadryza par marchand, environnement,
référence et empreinte de requête. Un timeout peut donc être retenté avec la
même commande. Une création serveur interrompue est libérée après un lease
PostgreSQL de deux minutes ; elle ne crée pas une nouvelle commande.

## Liaison dynamique et webhook

À la création de commande, l'opérateur et la Payment Session sont inconnus.
Samiah stocke l'identifiant du Hosted Checkout, la référence, le montant,
l'environnement, l'URL et l'expiration.

Au premier événement de Payment Session, le serveur Samiah relit en HTTPS la
vue publique de l'intent chez Kadryza. Il vérifie intent, référence, montant,
devise, environnement, session et opérateur, puis lie atomiquement la session
et l'opérateur choisis à la commande. Aucune liste Airtel/Moov n'est maintenue
par Samiah.

Le webhook :

- lit le body brut avec `request.text()` ;
- vérifie `X-Kadryza-Signature` en HMAC-SHA256 timing-safe ;
- vérifie la cohérence entre le `event_id` du body et
  `X-Kadryza-Event-ID` lorsqu'ils sont tous deux présents ;
- utilise le `event_id` durable Kadryza, avec fallback dérivé uniquement pour
  les anciennes livraisons ;
- répète les invariants critiques dans la fonction SQL transactionnelle ;
- accepte `SUCCESS` depuis `awaiting_payment` ou `under_review` ;
- conserve `UNDER_REVIEW` comme état non payé ;
- empêche toute régression de `paid` ou `expired` ;
- déduplique avant toute transition métier.

Si l'intent expire avant tout choix d'opérateur, aucune Payment Session
n'existe encore. Une RPC réservée au `service_role` utilise alors uniquement
l'horloge PostgreSQL pour passer cet intent à `expired`. Cette route ne peut ni
créer une session ni produire `paid`.

Seul `payment_session.succeeded` avec `data.status=SUCCESS`, reçu par ce
webhook signé, peut produire `paid`. Le panier n'est vidé qu'après lecture de
ce statut serveur.

## Supabase

La migration versionnée ajoute notamment l'intent Hosted Checkout, la session,
la référence, le ticket, l'opérateur choisi chez Kadryza, l'environnement, le
montant attendu, les dates et la table d'événements webhook. RLS est activée
sur cette table sans politique `anon`/`authenticated`; les RPC sensibles sont
accordées au seul `service_role`.

Limite inchangée : le schéma SQL, les contraintes et les politiques RLS de la
base distante n'ont pas pu être exportés avec les identifiants disponibles.
Avant application, vérifier en staging :

```sql
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name in ('orders', 'products')
order by table_name, ordinal_position;

select conname, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'public.orders'::regclass;

select * from pg_policies
where schemaname = 'public' and tablename in ('orders', 'products');
```

La migration `202607280001_samiah_kadryza_live_integration_1a` a été appliquée
sur le projet Supabase Production `dzzblqlteirtzyegplgu` le 2026-08-25 via
`supabase db push`. Son historique, ses colonnes, ses politiques RLS et les
droits des quatre RPC ont été relus après application.

Audit LIVE du 2026-08-25 : la base contient une commande historique cash au
statut `annulee`, sans doublon de `order_number`, sans montant fractionnaire et
sans valeur critique nulle. La contrainte versionnée conserve explicitement ce
statut. Les anciennes politiques `allow_all_select` et `allow_all_insert` sur
`orders` sont supprimées ; le suivi client passe désormais par une route
serveur exigeant numéro de commande et WhatsApp exacts.

## Vercel et HTTPS

Le domaine canonique public répond en HTTPS :
`https://www.samiahcosmetics.shop`.

La route webhook finale à enregistrer est :
`https://www.samiahcosmetics.shop/api/webhooks/kadryza`.

Le domaine sans `www` répond par une redirection `307`; il ne doit pas être
utilisé pour le webhook signé.

Le Preview Vercel du SHA `3492bb72f545858c4ad5919851a7e19f31e9a2a3`
est `Ready`. Le build distant, `/commander`, la validation du suivi et le refus
d'une signature webhook invalide ont été vérifiés avec le bypass de protection
Vercel. Le feature flag reste `false` sur ce Preview.

Validation Production du 2026-08-25 : le checkout cash a créé une commande
technique ensuite annulée, le suivi protégé l'a retrouvée et la clé anon n'a
retourné aucune commande. Le flux Kadryza a créé un intent LIVE `OPEN`, ouvert
le Hosted Checkout officiel en HTTP 200 et observé la disponibilité `AIRTEL`
calculée par Kadryza. Aucune sélection d'opérateur, Payment Session ou opération
financière n'a été effectuée.

## Dépendances restantes

- confirmer que le webhook marchand enregistré utilise exactement le domaine
  `www` et réussir une livraison signée non financière ;
- conserver Financial E2E à OFF jusqu'au GO explicite du premier paiement ;
- rapprocher puis laisser expirer l'intent technique sans sélectionner
  d'opérateur.
