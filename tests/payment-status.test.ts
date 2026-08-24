import test from "node:test";
import assert from "node:assert/strict";

import {
  shouldClearCartForPaymentStatus,
  shouldCheckHostedCheckoutExpiration,
  shouldRecoverHostedCheckoutCreation,
  shouldPollPaymentStatus,
} from "../src/lib/checkout/payment-status.ts";
import type { PaymentStatus } from "../src/lib/checkout/types.ts";

const STATUSES: PaymentStatus[] = [
  "pending_payment",
  "checkout_creating",
  "awaiting_payment",
  "under_review",
  "paid",
  "expired",
  "checkout_failed",
  "reconciliation_required",
];

test("le panier n'est vidé que lorsque le serveur retourne paid", () => {
  for (const status of STATUSES) {
    assert.equal(
      shouldClearCartForPaymentStatus(status),
      status === "paid",
      status,
    );
  }
});

test("under_review continue le polling afin d'observer un SUCCESS ultérieur", () => {
  assert.equal(shouldPollPaymentStatus("under_review"), true);
  assert.equal(shouldPollPaymentStatus("paid"), false);
  assert.equal(shouldPollPaymentStatus("expired"), false);
});

test("seul un Hosted Checkout en attente sans session vérifie son expiration", () => {
  assert.equal(
    shouldCheckHostedCheckoutExpiration(
      "kadryza",
      "awaiting_payment",
      null,
    ),
    true,
  );
  assert.equal(
    shouldCheckHostedCheckoutExpiration(
      "kadryza",
      "awaiting_payment",
      "session-1",
    ),
    false,
  );
  assert.equal(
    shouldCheckHostedCheckoutExpiration("kadryza", "paid", null),
    false,
  );
  assert.equal(
    shouldCheckHostedCheckoutExpiration("cash", "awaiting_payment", null),
    false,
  );
});

test("une création Hosted Checkout interrompue reste récupérable côté serveur", () => {
  assert.equal(
    shouldRecoverHostedCheckoutCreation("kadryza", "checkout_creating"),
    true,
  );
  assert.equal(
    shouldRecoverHostedCheckoutCreation("kadryza", "awaiting_payment"),
    false,
  );
  assert.equal(
    shouldRecoverHostedCheckoutCreation("cash", "checkout_creating"),
    false,
  );
});
