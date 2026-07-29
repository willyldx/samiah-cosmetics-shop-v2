import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import {
  evaluatePaymentSessionEvent,
  getKadryzaEventId,
  parseKadryzaWebhook,
  verifyKadryzaSignature,
  type KadryzaWebhookEvent,
} from "../src/lib/kadryza/webhook.ts";

const order = {
  order_number: "SC260728-ABCDEF12",
  total: 5_000,
  kadryza_session_id: "session-1",
  kadryza_reference: "SC260728-ABCDEF12",
  kadryza_operator: "AIRTEL",
  kadryza_environment: "live",
  payment_status: "awaiting_payment",
};

function event(
  eventName = "payment_session.succeeded",
  status = "SUCCESS",
): KadryzaWebhookEvent {
  return {
    event: eventName,
    data: {
      id: "session-1",
      reference: "SC260728-ABCDEF12",
      amount: 5_000,
      currency: "XAF",
      operator: "AIRTEL",
      environment: "live",
      status,
      completed_at: "2026-07-28T12:30:00Z",
    },
  };
}

test("vérifie le HMAC du body brut et refuse une signature altérée", () => {
  const raw = JSON.stringify(event());
  const secret = "whsec_example";
  const signature = `sha256=${createHmac("sha256", secret)
    .update(raw)
    .digest("hex")}`;

  assert.equal(verifyKadryzaSignature(raw, signature, secret), true);
  assert.equal(
    verifyKadryzaSignature(`${raw} `, signature, secret),
    false,
  );
  assert.equal(verifyKadryzaSignature(raw, "sha256=bad", secret), false);
});

test("parse le payload et produit un event_id stable pour les doublons", () => {
  const parsed = parseKadryzaWebhook(JSON.stringify(event()));
  const first = getKadryzaEventId(parsed);
  const duplicate = getKadryzaEventId(parsed);

  assert.match(first, /^derived_[a-f0-9]{64}$/);
  assert.equal(duplicate, first);
});

test("awaiting_payment accepte UNDER_REVIEW sans devenir paid", () => {
  assert.deepEqual(
    evaluatePaymentSessionEvent(
      event("payment_session.under_review", "UNDER_REVIEW"),
      order,
      "live",
    ),
    { kind: "accepted", paymentStatus: "under_review" },
  );
});

test("under_review accepte ensuite un SUCCESS signé et concordant", () => {
  const raw = JSON.stringify(event());
  const secret = "whsec_transition";
  const signature = `sha256=${createHmac("sha256", secret)
    .update(raw)
    .digest("hex")}`;

  assert.equal(verifyKadryzaSignature(raw, signature, secret), true);
  assert.deepEqual(
    evaluatePaymentSessionEvent(
      parseKadryzaWebhook(raw),
      { ...order, payment_status: "under_review" },
      "live",
    ),
    { kind: "accepted", paymentStatus: "paid" },
  );
});

test("n'accepte SUCCESS après revue que si tous les invariants concordent", () => {
  assert.deepEqual(evaluatePaymentSessionEvent(event(), order, "live"), {
    kind: "accepted",
    paymentStatus: "paid",
  });

  for (const [field, value] of [
    ["reference", "OTHER"],
    ["id", "other-session"],
    ["amount", 4_999],
    ["operator", "MOOV"],
  ] as const) {
    const mismatched = event();
    Object.assign(mismatched.data, { [field]: value });
    assert.equal(
      evaluatePaymentSessionEvent(
        mismatched,
        { ...order, payment_status: "under_review" },
        "live",
      ).kind,
      "rejected",
    );
  }

  assert.equal(
    evaluatePaymentSessionEvent(
      event(),
      { ...order, payment_status: "under_review" },
      "test",
    ).kind,
    "rejected",
  );
});

test("refuse l'environnement inattendu et un faux statut de succès", () => {
  assert.equal(
    evaluatePaymentSessionEvent(event(), order, "test").kind,
    "rejected",
  );
  assert.deepEqual(
    evaluatePaymentSessionEvent(
      event("payment_session.succeeded", "UNDER_REVIEW"),
      order,
      "live",
    ),
    { kind: "rejected", reason: "success_status_mismatch" },
  );
});

test("EXPIRED est accepté depuis un état cohérent non payé", () => {
  assert.deepEqual(
    evaluatePaymentSessionEvent(
      event("payment_session.expired", "EXPIRED"),
      order,
      "live",
    ),
    { kind: "accepted", paymentStatus: "expired" },
  );
  assert.deepEqual(
    evaluatePaymentSessionEvent(
      event("payment_session.expired", "EXPIRED"),
      { ...order, payment_status: "under_review" },
      "live",
    ),
    { kind: "accepted", paymentStatus: "expired" },
  );
});

test("paid et expired ne régressent vers aucun autre état", () => {
  for (const payment_status of ["paid", "expired"]) {
    for (const candidate of [
      event("payment_session.under_review", "UNDER_REVIEW"),
      event("payment_session.expired", "EXPIRED"),
      event(),
    ]) {
      assert.deepEqual(
        evaluatePaymentSessionEvent(
          candidate,
          { ...order, payment_status },
          "live",
        ),
        { kind: "rejected", reason: "order_payment_state_mismatch" },
      );
    }
  }
});

test("ignore proprement un événement inconnu", () => {
  assert.deepEqual(
    evaluatePaymentSessionEvent(event("future.event", "ANY"), null, "live"),
    { kind: "ignored", reason: "unknown_event" },
  );
});
