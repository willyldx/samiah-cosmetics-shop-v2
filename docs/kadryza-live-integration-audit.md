# Audit — Samiah Kadryza Live Integration 1A

Date de l'audit : 2026-07-28

## Base et périmètre

- dépôt : `willyldx/samiah-cosmetics-shop-v2`
- base : `main` à `357b378807c4a2a10bbca9ce301f0a7c74cf0ca2`
- contrat Kadryza lu en lecture seule sur `willyldx/Kadryza-Pay` à
  `2c13fb340442c3c1aedebb44e27fc701895fc499`
- aucun fichier du dépôt Kadryza-Pay, du Gateway Android ou du provisioning n'a
  été modifié

## Checkout avant intégration

`/commander` calculait dans le navigateur le sous-total, les frais et le total,
puis insérait directement la commande avec la clé anon Supabase. Les lignes
envoyaient le titre, le prix et le sous-total fournis par le panier local. Le
flux cash vidait ensuite le panier et ouvrait WhatsApp.

Frais observés :

| Ville | Frais XAF |
| --- | ---: |
| N'Djamena | 1 000 |
| Moundou, Sarh, Kelo, Pala, Koumra | 2 000 |
| Abeche | 2 500 |
| Bongor | 1 500 |
| Faya-Largeau | 3 000 |

La livraison devient gratuite à partir de 20 000 XAF de sous-total.

## Supabase

Les colonnes utilisées par le code de production sont : `order_number`,
`client_name`, `client_phone`, `client_city`, `client_address`, `items`,
`subtotal`, `shipping_fee`, `total`, `payment_method`, `status`, `created_at` et
`id`. Les produits actifs sont lus depuis `products` avec au moins `id`,
`title`, `price` et `active`.

Limite de l'audit : les deux clés anon présentes dans le checkout/local
répondaient `401` à PostgREST le 2026-07-28, et aucune session Supabase CLI
authentifiée n'était disponible. Les types SQL exacts, noms de contraintes et
politiques RLS de production n'ont donc pas pu être exportés sans accès
administrateur. La migration est défensive, ne modifie aucune politique
existante sur `orders`, et doit être validée dans un clone/staging par :

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

La table d'audit webhook créée par la migration active RLS sans politique pour
`anon`/`authenticated`; seul `service_role` exécute les fonctions sensibles.

## Vercel

Le déploiement GitHub Production au SHA de base est réussi et pointe vers
`https://samiah-cosmetics-shop-v2-ntienpb4p-willys-projects-7d6d3eba.vercel.app`.
Le dépôt contient `vercel.json`, mais pas de lien `.vercel` versionné. Aucun CLI
Vercel authentifié n'était disponible ; les variables distantes existantes
n'ont donc pas pu être lues. Le fichier local ne contenait que les noms
`NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Contrat Payment Sessions actif

- authentification : `X-API-Key`
- création : `POST /v1/payment-sessions`
- la clé `kadryza_test_...` ou `kadryza_live_...` détermine l'environnement
- ne pas envoyer `merchant_id`, `is_test` ou `environment`
- `currency=XAF`, opérateurs documentés `AIRTEL` et `MOOV`
- réponse `201` avec `id`, `reference`, `ticket`, `amount`, `operator`,
  `environment`, `assigned_collection_number`, `expires_at` et
  `checkout_url`
- `409` si la référence existe déjà dans l'environnement
- aucun paramètre `return_url` n'est documenté

Le checkout officiel est utilisé dans un nouvel onglet depuis la page d'attente
Samiah. Cela conserve la page de statut, car aucun retour marchand documenté ne
peut être supposé.

Le site reste sans compte client : `/commander` est un checkout invité. Il
collecte avant tout appel Kadryza le nom, le contact WhatsApp, la ville,
l'adresse de livraison et, pour Airtel Money uniquement, le numéro du payeur.
Le contact de livraison et le numéro Mobile Money sont volontairement séparés.

## Idempotence webhook

Le contrat actif ne fournit actuellement ni header de livraison ni `event_id`
dédié. Sa règle documentée est une clé dérivée de
`event + data.id + data.status`. L'intégration accepte un futur `event_id`
top-level s'il apparaît ; sinon elle calcule cette clé, la hache et la stocke
durablement dans `kadryza_webhook_events.event_id`.

La machine d'état autorise `awaiting_payment → under_review → paid`. La seconde
transition exige un nouveau webhook signé `payment_session.succeeded` avec
`data.status=SUCCESS` et tous les invariants concordants. `under_review` ne
modifie pas le statut métier de la commande et la page continue le polling.
`paid` et `expired` sont terminaux ; un événement ultérieur ne peut pas les
faire régresser.

## Décision produit — opérateurs dynamiques

Le contrat produit final attendu de
`Kadryza Hosted-Checkout-Dynamic-Operators-1A` est le suivant :

- Samiah proposera uniquement « Payer avec Kadryza » ;
- le marchand Samiah ne choisira ni Airtel ni Moov ;
- Kadryza déterminera et affichera automatiquement les opérateurs disponibles ;
- le client choisira son opérateur sur le checkout hébergé Kadryza ;
- un opérateur momentanément indisponible ne sera pas proposé au client ;
- Samiah n'embarquera aucune logique propre de readiness Airtel/Moov.

La présente PR reste volontairement couplée à Airtel jusqu'à la disponibilité
de ce contrat backend. Elle ne doit pas anticiper une API encore inexistante.

### Éléments provisoires à remplacer

Les adaptations suivantes devront être faites ensemble lorsque le nouveau
contrat Kadryza sera disponible :

1. retirer ou remplacer `KADRYZA_OPERATOR` dans
   `src/lib/checkout/config.ts` ;
2. ne plus initialiser `orders.kadryza_operator` à `AIRTEL` lors de la création
   d'une commande ;
3. remplacer dans `/commander` les libellés « Airtel Money avec Kadryza » et
   les champs spécifiques à Airtel par le seul choix « Payer avec Kadryza » ;
4. supprimer du formulaire Samiah le « numéro Airtel du payeur », selon le
   futur contrat de collecte du checkout hébergé ;
5. adapter le payload `POST /v1/payment-sessions` afin que Samiah ne transmette
   plus `operator=AIRTEL`, si et seulement si le nouveau contrat le documente ;
6. persister l'opérateur effectivement choisi et retourné par Kadryza, puis
   valider les webhooks contre cette valeur sans liste de readiness locale ;
7. adapter les validations TypeScript/SQL actuellement liées à `AIRTEL` ;
8. mettre à jour les tests, les captures du checkout et le runbook Airtel.

Aucun de ces changements n'est implémenté dans cette PR : le choix
d'opérateur reste provisoirement imposé à `AIRTEL`.
