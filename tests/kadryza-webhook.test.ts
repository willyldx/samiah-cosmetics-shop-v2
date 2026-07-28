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

test("n'accepte SUCCESS que pour une commande entièrement concordante", () => {
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
      evaluatePaymentSessionEvent(mismatched, order, "live").kind,
      "rejected",
    );
  }
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

test("UNDER_REVIEW reste distinct et EXPIRED expire sans payer", () => {
  assert.deepEqual(
    evaluatePaymentSessionEvent(
      event("payment_session.under_review", "UNDER_REVIEW"),
      order,
      "live",
    ),
    { kind: "accepted", paymentStatus: "under_review" },
  );
  assert.deepEqual(
    evaluatePaymentSessionEvent(
      event("payment_session.expired", "EXPIRED"),
      order,
      "live",
    ),
    { kind: "accepted", paymentStatus: "expired" },
  );
});

test("ignore proprement un événement inconnu", () => {
  assert.deepEqual(
    evaluatePaymentSessionEvent(event("future.event", "ANY"), null, "live"),
    { kind: "ignored", reason: "unknown_event" },
  );
});
