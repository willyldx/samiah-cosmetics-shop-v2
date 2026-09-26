import test from "node:test";
import assert from "node:assert/strict";

import {
  createKadryzaHostedCheckout,
  getKadryzaHostedCheckout,
  KadryzaUnavailableError,
} from "../src/lib/kadryza/client.ts";

const intentResponse = {
  id: "2ea621b3-2f6d-4688-83f1-65b8ed5fc9dc",
  reference: "SC260824-ABCDEF12",
  amount: 5_000,
  currency: "XAF",
  environment: "live",
  status: "OPEN",
  expires_at: "2026-08-24T12:40:00Z",
  created_at: "2026-08-24T12:25:00Z",
  checkout_url:
    "https://dashboard.kadryza.app/pay/checkout/2ea621b3-2f6d-4688-83f1-65b8ed5fc9dc",
};

const selectedView = {
  id: intentResponse.id,
  reference: intentResponse.reference,
  amount: intentResponse.amount,
  currency: "XAF",
  environment: "live",
  status: "SELECTED",
  operator_availability: "NOT_APPLICABLE",
  expires_at: intentResponse.expires_at,
  eligible_operators: [],
  payment_session: {
    id: "session-1",
    reference: intentResponse.reference,
    ticket: "KDRZ-8F3K2",
    amount: intentResponse.amount,
    currency: "XAF",
    operator: "MOOV",
    status: "AWAITING_PAYMENT",
    environment: "live",
    assigned_collection_number: "099000001",
    expires_at: intentResponse.expires_at,
    instructions: "Suivez les instructions Kadryza.",
  },
};

test("crée un Hosted Checkout sans choisir opérateur ni numéro payeur", async () => {
  process.env.KADRYZA_API_URL = "https://api.kadryza.app";
  process.env.KADRYZA_API_KEY = "kadryza_live_example";
  let sentUrl = "";
  let sentBody: Record<string, unknown> | undefined;

  const intent = await createKadryzaHostedCheckout(
    {
      reference: intentResponse.reference,
      amount: 5_000,
      description: "Commande Samiah",
    },
    async (url, init) => {
      sentUrl = String(url);
      sentBody = JSON.parse(String(init?.body));
      return new Response(JSON.stringify(intentResponse), { status: 201 });
    },
  );

  assert.equal(sentUrl, "https://api.kadryza.app/v1/hosted-checkouts");
  assert.equal(intent.checkout_url, intentResponse.checkout_url);
  assert.equal(sentBody?.reference, intentResponse.reference);
  assert.equal(sentBody?.currency, "XAF");
  assert.equal("operator" in (sentBody ?? {}), false);
  assert.equal("customer_phone" in (sentBody ?? {}), false);
  assert.equal("environment" in (sentBody ?? {}), false);
  assert.equal("merchant_id" in (sentBody ?? {}), false);
  assert.equal("is_test" in (sentBody ?? {}), false);
});

test("accepte la page de paiement sur checkout.kadryza.com (domaine actuel)", async () => {
  process.env.KADRYZA_API_URL = "https://api.kadryza.app";
  process.env.KADRYZA_API_KEY = "kadryza_live_example";
  const checkoutUrl = `https://checkout.kadryza.com/pay/checkout/${intentResponse.id}`;

  const intent = await createKadryzaHostedCheckout(
    {
      reference: intentResponse.reference,
      amount: 5_000,
      description: "Commande Samiah",
    },
    async () =>
      new Response(JSON.stringify({ ...intentResponse, checkout_url: checkoutUrl }), {
        status: 201,
      }),
  );

  assert.equal(intent.checkout_url, checkoutUrl);
});

test("refuse une page de paiement hors des domaines Kadryza", async () => {
  process.env.KADRYZA_API_URL = "https://api.kadryza.app";
  process.env.KADRYZA_API_KEY = "kadryza_live_example";
  const input = {
    reference: intentResponse.reference,
    amount: 5_000,
    description: "Commande",
  };

  for (const checkoutUrl of [
    "https://checkout.kadryza.com.example.net/pay/checkout/x",
    "https://evilkadryza.com/pay/checkout/x",
    "https://kadryza.app.example.net/pay/checkout/x",
    "http://checkout.kadryza.com/pay/checkout/x",
  ]) {
    await assert.rejects(
      createKadryzaHostedCheckout(
        input,
        async () =>
          new Response(JSON.stringify({ ...intentResponse, checkout_url: checkoutUrl }), {
            status: 201,
          }),
      ),
      KadryzaUnavailableError,
      checkoutUrl,
    );
  }
});

test("lit la sélection dynamique sans calculer la readiness dans Samiah", async () => {
  process.env.KADRYZA_API_URL = "https://api.kadryza.app";
  process.env.KADRYZA_API_KEY = "kadryza_live_example";
  const view = await getKadryzaHostedCheckout(intentResponse.id, async () =>
    new Response(JSON.stringify(selectedView), { status: 200 }),
  );

  assert.equal(view.payment_session?.operator, "MOOV");
  assert.equal(view.payment_session?.id, "session-1");
});

test("lit une page de paiement annulée par le client", async () => {
  process.env.KADRYZA_API_URL = "https://api.kadryza.app";
  process.env.KADRYZA_API_KEY = "kadryza_live_example";
  const cancelledView = {
    ...selectedView,
    status: "CANCELLED",
    operator_availability: "NOT_APPLICABLE",
    payment_session: undefined,
  };
  const view = await getKadryzaHostedCheckout(intentResponse.id, async () =>
    new Response(JSON.stringify(cancelledView), { status: 200 }),
  );

  assert.equal(view.status, "CANCELLED");
  assert.equal(view.payment_session, undefined);
});

test("refuse une réponse d'un environnement différent", async () => {
  process.env.KADRYZA_API_URL = "https://api.kadryza.app";
  process.env.KADRYZA_API_KEY = "kadryza_live_example";

  await assert.rejects(
    createKadryzaHostedCheckout(
      {
        reference: intentResponse.reference,
        amount: 5_000,
        description: "Commande",
      },
      async () =>
        new Response(JSON.stringify({ ...intentResponse, environment: "test" }), {
          status: 201,
        }),
    ),
    (error: unknown) =>
      error instanceof KadryzaUnavailableError &&
      error.retrySafety === "reconciliation_required",
  );
});

test("classe un timeout idempotent comme retry sûr et un conflit comme rapprochement", async () => {
  process.env.KADRYZA_API_URL = "https://api.kadryza.app";
  process.env.KADRYZA_API_KEY = "kadryza_live_example";
  const input = {
    reference: intentResponse.reference,
    amount: 5_000,
    description: "Commande",
  };

  await assert.rejects(
    createKadryzaHostedCheckout(input, async () => {
      throw new Error("timeout");
    }),
    (error: unknown) =>
      error instanceof KadryzaUnavailableError && error.retrySafety === "safe",
  );

  await assert.rejects(
    createKadryzaHostedCheckout(
      input,
      async () => new Response("conflict", { status: 409 }),
    ),
    (error: unknown) =>
      error instanceof KadryzaUnavailableError &&
      error.retrySafety === "reconciliation_required",
  );
});

test("refuse une URL API qui pourrait exfiltrer la clé Kadryza", async () => {
  process.env.KADRYZA_API_URL = "https://example.com";
  process.env.KADRYZA_API_KEY = "kadryza_live_example";
  let called = false;

  await assert.rejects(
    createKadryzaHostedCheckout(
      {
        reference: intentResponse.reference,
        amount: 5_000,
        description: "Commande",
      },
      async () => {
        called = true;
        return new Response();
      },
    ),
    KadryzaUnavailableError,
  );
  assert.equal(called, false);
});
