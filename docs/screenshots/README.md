# Captures UX

- `checkout-cash.png` : checkout invité, paiement à la livraison sélectionné.
- `checkout-kadryza.png` : ancienne capture Airtel, à remplacer par le choix
  générique Kadryza avant validation visuelle finale.
- `payment-awaiting_payment.png` : attente et accès au checkout officiel.
- `payment-paid.png` : paiement confirmé exclusivement par webhook.
- `payment-under_review.png` : revue manuelle, jamais affichée comme payée.
- `payment-expired.png` : session expirée.
- `payment-session_failed.png` : ancienne capture d'échec, état désormais
  nommé `checkout_failed` dans le code.
- `payment-reconciliation_required.png` : résultat ambigu, reprise bloquée.

Les états ont été rendus localement avec les réponses de statut simulées. Aucun
appel à Kadryza, aucune Payment Session et aucun paiement n'ont été déclenchés.
