import test from "node:test";
import assert from "node:assert/strict";

import {
  createKadryzaPaymentSession,
  KadryzaUnavailableError,
} from "../src/lib/kadryza/client.ts";

const sessionResponse = {
  id: "2ea621b3-2f6d-4688-83f1-65b8ed5fc9dc",
  reference: "SC260728-ABCDEF12",
  ticket: "KDRZ-8F3K2",
  amount: 5_000,
  currency: "XAF",
  operator: "AIRTEL",
  status: "AWAITING_PAYMENT",
  environment: "live",
  assigned_collection_number: "074000001",
  expires_at: "2026-07-28T12:40:00Z",
  created_at: "2026-07-28T12:30:00Z",
  checkout_url:
    "https://dashboard.kadryza.app/pay/payment-sessions/2ea621b3-2f6d-4688-83f1-65b8ed5fc9dc",
};

test("crée une Payment Session finale sans envoyer l'environnement", async () => {
  process.env.KADRYZA_API_URL = "https://api.kadryza.app";
  process.env.KADRYZA_API_KEY = "kadryza_live_example";
  let sentBody: Record<string, unknown> | undefined;

  const session = await createKadryzaPaymentSession(
    {
      reference: sessionResponse.reference,
      amount: 5_000,
      customerPhone: "+23566000000",
      description: "Commande Samiah",
    },
    async (_url, init) => {
      sentBody = JSON.parse(String(init?.body));
      return new Response(JSON.stringify(sessionResponse), { status: 201 });
    },
  );

  assert.equal(session.checkout_url, sessionResponse.checkout_url);
  assert.equal(sentBody?.reference, sessionResponse.reference);
  assert.equal(sentBody?.currency, "XAF");
  assert.equal(sentBody?.operator, "AIRTEL");
  assert.equal(sentBody?.customer_phone, "+23566000000");
  assert.equal("environment" in (sentBody ?? {}), false);
  assert.equal("merchant_id" in (sentBody ?? {}), false);
  assert.equal("is_test" in (sentBody ?? {}), false);
});

test("refuse une réponse d'un environnement différent", async () => {
  process.env.KADRYZA_API_URL = "https://api.kadryza.app";
  process.env.KADRYZA_API_KEY = "kadryza_live_example";

  await assert.rejects(
    createKadryzaPaymentSession(
      {
        reference: sessionResponse.reference,
        amount: 5_000,
        customerPhone: "+23566000000",
        description: "Commande",
      },
      async () =>
        new Response(
          JSON.stringify({ ...sessionResponse, environment: "test" }),
          { status: 201 },
        ),
    ),
    (error: unknown) =>
      error instanceof KadryzaUnavailableError &&
      error.retrySafety === "reconciliation_required",
  );
});

test("classe un timeout et un conflit comme résultats à rapprocher", async () => {
  process.env.KADRYZA_API_URL = "https://api.kadryza.app";
  process.env.KADRYZA_API_KEY = "kadryza_live_example";

  await assert.rejects(
    createKadryzaPaymentSession(
      {
        reference: sessionResponse.reference,
        amount: 5_000,
        customerPhone: "+23566000000",
        description: "Commande",
      },
      async () => {
        throw new Error("timeout");
      },
    ),
    (error: unknown) =>
      error instanceof KadryzaUnavailableError &&
      error.retrySafety === "reconciliation_required",
  );

  await assert.rejects(
    createKadryzaPaymentSession(
      {
        reference: sessionResponse.reference,
        amount: 5_000,
        customerPhone: "+23566000000",
        description: "Commande",
      },
      async () => new Response("conflict", { status: 409 }),
    ),
    (error: unknown) =>
      error instanceof KadryzaUnavailableError &&
      error.retrySafety === "reconciliation_required",
  );
});
