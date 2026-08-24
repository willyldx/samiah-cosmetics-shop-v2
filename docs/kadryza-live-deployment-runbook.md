# Déploiement contrôlé Kadryza — Samiah Cosmetics

Ce runbook prépare le premier paiement LIVE. Il ne déclenche aucun déploiement,
aucune migration, aucun onboarding et aucun paiement.

## Webhook HTTPS

```text
https://samiah-cosmetics-shop-v2.vercel.app/api/webhooks/kadryza
```

L'URL est canonique, publique et HTTPS. Au moment de l'onboarding Kadryza,
créer le webhook marchand sur cette URL puis copier immédiatement le secret
affiché une seule fois vers `KADRYZA_WEBHOOK_SECRET` côté Vercel.

## Variables Vercel nécessaires

| Variable | Secret | Valeur/contrainte |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | non | URL publique Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | non | clé anon publique |
| `SUPABASE_URL` | non | URL Supabase côté serveur |
| `SUPABASE_SERVICE_ROLE_KEY` | oui | service-role, serveur uniquement |
| `KADRYZA_API_URL` | non | `https://api.kadryza.app` |
| `KADRYZA_API_KEY` | oui | future clé LIVE du marchand Samiah |
| `KADRYZA_WEBHOOK_SECRET` | oui | secret affiché à la création du webhook |
| `KADRYZA_PAYMENT_ENABLED` | non | `false` jusqu'au go/no-go final |

La clé API détermine seule l'environnement. Ne pas ajouter de variables
`_TEST`, `_LIVE`, d'opérateur ou de readiness dans Samiah.

## Avant fermeture du MFA

Ce qui peut être préparé sans AAL2 :

1. relire le schéma réel et les RLS Supabase ;
2. appliquer la migration uniquement en staging ;
3. tester le cash et les webhooks signés simulés ;
4. configurer les variables non sensibles dans un Preview Vercel ;
5. confirmer que le Preview compile et que la route webhook répond en HTTPS ;
6. conserver `KADRYZA_PAYMENT_ENABLED=false` ;
7. conserver Financial E2E à OFF.

## Après fermeture du MFA/AAL2

1. Finaliser le marchand LIVE Samiah.
2. Émettre une clé LIVE limitée au marchand et aux scopes nécessaires.
3. Créer le webhook marchand vers l'URL canonique.
4. Stocker le secret webhook et la clé LIVE dans Vercel Production.
5. Envoyer un webhook de connectivité signé si Kadryza le permet ; vérifier
   qu'il est audité sans produire `paid`.
6. Confirmer que Kadryza retourne au moins un opérateur éligible sur le Hosted
   Checkout. Samiah ne décide pas lequel.
7. Vérifier que Financial E2E est toujours OFF.
8. Faire le go/no-go technique et métier.
9. Activer `KADRYZA_PAYMENT_ENABLED=true` uniquement pendant la fenêtre
   contrôlée.

## Déploiement Supabase/Vercel

1. Auditer types, contraintes et RLS avec les requêtes de l'audit.
2. Appliquer la migration sur un clone ou staging Supabase.
3. Tester les RPC avec service-role et confirmer leur refus pour
   `anon`/`authenticated`.
4. Sauvegarder la production et documenter le rollback.
5. Appliquer manuellement la migration production pendant la fenêtre validée.
6. Déployer avec le feature flag à `false`.
7. Vérifier `/commander`, le cash et la page de statut.
8. Vérifier le webhook HTTPS avec un événement non financier signé.
9. Lever le feature flag après validation conjointe Samiah/Kadryza.

## Premier paiement LIVE contrôlé

- [ ] MFA/AAL2 fermé ;
- [ ] marchand LIVE actif et vérifié ;
- [ ] clé LIVE et secret webhook installés sans exposition client ;
- [ ] migration appliquée et sauvegarde restaurable ;
- [ ] Preview et build Vercel verts ;
- [ ] webhook de connectivité signé reçu ;
- [ ] Hosted Checkout affiche uniquement les opérateurs prêts selon Kadryza ;
- [ ] Financial E2E explicitement autorisé pour la fenêtre, sinon paiement OFF ;
- [ ] montant minimal et observabilité décidés ;
- [ ] procédure de stop : `KADRYZA_PAYMENT_ENABLED=false`.

Exécution :

1. Créer une commande de faible montant via « Payer avec Kadryza ».
2. Vérifier le total serveur, la référence, l'intent et l'environnement LIVE.
3. Ouvrir le `checkout_url` officiel.
4. Laisser Kadryza afficher les opérateurs disponibles.
5. Choisir l'opérateur et saisir le numéro uniquement chez Kadryza.
6. Ne confirmer par aucun bouton ou retour Samiah.
7. Attendre le webhook signé `payment_session.succeeded` / `SUCCESS`.
8. Vérifier l'unique événement durable, `payment_status=paid`, la date de
   confirmation et le vidage du panier après lecture serveur.

En cas de `UNDER_REVIEW`, expiration, divergence ou absence de webhook : couper
le feature flag, ne pas repayer et rapprocher avec Kadryza. `UNDER_REVIEW` peut
ensuite devenir `paid` uniquement via un nouveau webhook signé `SUCCESS`.
