# Déploiement contrôlé Kadryza — Samiah Cosmetics

Ce runbook ne déclenche aucun déploiement, aucune migration et aucun paiement.

## URL webhook

Route applicative exacte :

```text
/api/webhooks/kadryza
```

URL correspondant au déploiement Production audité :

```text
https://samiah-cosmetics-shop-v2-ntienpb4p-willys-projects-7d6d3eba.vercel.app/api/webhooks/kadryza
```

Avant enregistrement dans Kadryza, remplacer cette URL de déploiement immuable
par le domaine canonique stable du projet Vercel s'il existe. L'URL finale doit
être HTTPS, publique, sans redirection et pointer exactement vers cette route.

## Variables Vercel

À configurer uniquement dans l'environnement visé :

| Variable | Secret | Valeur/contrainte |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | non | URL publique Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | non | clé anon publique |
| `SUPABASE_URL` | non | URL Supabase côté serveur |
| `SUPABASE_SERVICE_ROLE_KEY` | oui | service-role, serveur uniquement |
| `KADRYZA_API_URL` | non | `https://api.kadryza.app` |
| `KADRYZA_API_KEY` | oui | clé fournie par Kadryza |
| `KADRYZA_WEBHOOK_SECRET` | oui | secret du webhook créé |
| `KADRYZA_PAYMENT_ENABLED` | non | `false` pendant le déploiement |

La clé API détermine seule `test` ou `live`. Ne pas créer de variables `_TEST`
ou `_LIVE`. Une clé au préfixe inconnu est refusée par l'application.

## Procédure de déploiement

1. Créer un clone ou projet Supabase de staging depuis le schéma réel.
2. Exécuter les trois requêtes d'audit listées dans
   `docs/kadryza-live-integration-audit.md`.
3. Comparer les types et contraintes avec la migration. En particulier,
   confirmer que `orders.id` est `uuid`, `total` est compatible `bigint`, et que
   les valeurs historiques de `status` sont toutes couvertes.
4. Appliquer la migration en staging et exécuter les tests API/webhook.
5. Sauvegarder la base de production et planifier une fenêtre de rollback.
6. Appliquer manuellement la migration versionnée en production.
7. Configurer les variables Vercel avec
   `KADRYZA_PAYMENT_ENABLED=false`.
8. Déployer la PR validée. Vérifier le cash, le build et la route de statut sans
   appeler Kadryza.
9. Enregistrer l'URL webhook canonique chez Kadryza et stocker immédiatement le
   secret dans Vercel.
10. Faire livrer un webhook de test signé si Kadryza le permet, puis contrôler
    la ligne d'audit et l'absence de changement `paid`.
11. Obtenir le feu vert explicite de la readiness Kadryza pour Airtel live.
12. Avant de remplacer une clé test par une clé live, confirmer qu'aucune
    commande test n'est encore `awaiting_payment` ou en reprise.
13. Passer `KADRYZA_PAYMENT_ENABLED=true`, puis redéployer la configuration.

## Premier petit paiement Airtel réel

Toutes les cases doivent être cochées avant d'envoyer de l'argent :

- [ ] readiness Airtel live Kadryza officiellement verte ;
- [ ] clé `kadryza_live_...` confirmée et limitée au marchand Samiah ;
- [ ] webhook HTTPS canonique actif, secret vérifié et test signé reçu ;
- [ ] migration production appliquée et fonctions accordées au seul
      `service_role` ;
- [ ] service-role absente de tout bundle navigateur et des logs ;
- [ ] feature flag toujours `false` pendant les contrôles techniques ;
- [ ] commande cash testée sans régression ;
- [ ] opérateur affiché `AIRTEL`, devise `XAF`, environnement retourné `live` ;
- [ ] équipe Kadryza et équipe Samiah disponibles pendant la fenêtre ;
- [ ] montant de test commercial minimal décidé et produit correspondant actif ;
- [ ] numéro Airtel payeur et numéro de collecte vérifiés par deux personnes ;
- [ ] observabilité ouverte : logs Vercel, ligne `orders`, événements webhook ;
- [ ] procédure de stop immédiat connue : remettre le feature flag à `false`.

Exécution contrôlée :

1. Activer le feature flag et ouvrir `/commander` dans une session dédiée.
2. Ajouter un seul produit de faible montant et choisir Airtel Money.
3. Vérifier avant paiement que le total serveur, la commande
   `pending_payment`, la référence et l'environnement `live` concordent.
4. Ouvrir le `checkout_url` Kadryza officiel depuis la page d'attente.
5. Vérifier visuellement montant, ticket, opérateur et numéro de collecte.
6. Envoyer exactement le montant affiché depuis le numéro Airtel prévu.
7. Ne cliquer sur aucun mécanisme local de confirmation : il n'en existe pas.
8. Attendre `payment_session.succeeded` signé avec `data.status=SUCCESS`.
9. Vérifier atomiquement : événement `accepted`, `payment_status=paid`,
   `payment_confirmed_at` renseigné, puis seulement le panier vidé.
10. Vérifier le bouton WhatsApp et le passage de la commande à la préparation.
11. Rapprocher le paiement côté Kadryza et documenter ticket, ordre, timestamps
    et résultat, sans copier de secrets.

Si le statut devient `UNDER_REVIEW`, `expired`,
`reconciliation_required`, si un montant diverge ou si le webhook n'arrive
pas : désactiver immédiatement le feature flag, ne pas repayer et escalader à
Kadryza.

`UNDER_REVIEW` n'est pas une confirmation et ne vide jamais le panier. La page
continue à consulter le statut serveur. Un webhook signé `SUCCESS` ultérieur
peut effectuer l'unique transition `under_review → paid`; les replays du même
`event_id` restent sans effet.

Cette version reste couplée à Airtel. Le passage futur au checkout Kadryza
multi-opérateurs doit suivre la liste de modifications de
`docs/kadryza-live-integration-audit.md` : Samiah proposera Kadryza, puis le
client choisira l'opérateur uniquement sur le checkout hébergé.
