import test from "node:test";
import assert from "node:assert/strict";

import {
  shouldClearCartForPaymentStatus,
  shouldPollPaymentStatus,
} from "../src/lib/checkout/payment-status.ts";
import type { PaymentStatus } from "../src/lib/checkout/types.ts";

const STATUSES: PaymentStatus[] = [
  "pending_payment",
  "session_creating",
  "awaiting_payment",
  "under_review",
  "paid",
  "expired",
  "session_failed",
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
