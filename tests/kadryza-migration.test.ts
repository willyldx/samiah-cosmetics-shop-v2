import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync(
  new URL(
    "../supabase/migrations/202607280001_samiah_kadryza_live_integration_1a.sql",
    import.meta.url,
  ),
  "utf8",
);

test("la migration autorise exactement under_review vers paid ou expired", () => {
  assert.match(
    migration,
    /p_payment_status = 'paid'[\s\S]*?payment_status in \('awaiting_payment', 'under_review'\)/,
  );
  assert.match(
    migration,
    /p_payment_status = 'under_review'[\s\S]*?payment_status = 'awaiting_payment'/,
  );
  assert.match(
    migration,
    /p_payment_status = 'expired'[\s\S]*?payment_status in \('awaiting_payment', 'under_review'\)/,
  );
});

test("la migration lie dynamiquement intent, session et opérateur", () => {
  assert.match(migration, /kadryza_checkout_intent_id text/);
  assert.match(
    migration,
    /target_order\.kadryza_checkout_intent_id <> p_checkout_intent_id/,
  );
  assert.match(migration, /kadryza_session_id = p_session_id/);
  assert.match(migration, /kadryza_operator = p_operator/);
  assert.doesNotMatch(migration, /p_operator not in \('AIRTEL', 'MOOV'\)/);
});

test("seule l'horloge serveur expire un intent sans Payment Session", () => {
  assert.match(migration, /function public\.expire_kadryza_hosted_checkout/);
  assert.match(
    migration,
    /kadryza_session_id is null[\s\S]*?payment_expires_at <= now\(\)/,
  );
  assert.match(
    migration,
    /grant execute on function public\.expire_kadryza_hosted_checkout\(uuid\)[\s\S]*?to service_role/,
  );
});

test("une création interrompue devient retryable après un lease serveur", () => {
  assert.match(
    migration,
    /function public\.recover_stale_kadryza_checkout_creation/,
  );
  assert.match(
    migration,
    /kadryza_checkout_attempted_at <= now\(\) - interval '2 minutes'/,
  );
  assert.match(migration, /payment_failure_reason = 'stale_checkout_creation'/);
});

test("les commandes ne restent pas lisibles ou insérables par anon", () => {
  assert.match(migration, /drop policy if exists allow_all_insert/);
  assert.match(migration, /drop policy if exists allow_all_select/);
  assert.match(
    migration,
    /create policy "Authenticated can select orders"[\s\S]*?to authenticated/,
  );
});

test("la migration préserve le statut historique annulee", () => {
  assert.match(migration, /'cancelled',\s*'annulee'/);
});

test("le replay est dédupliqué durablement avant toute transition", () => {
  const deduplication = migration.indexOf("on conflict (event_id) do nothing");
  const duplicateReturn = migration.indexOf("return 'duplicate'");
  const firstTransition = migration.indexOf(
    "if p_payment_status = 'paid' then",
  );

  assert.match(migration, /event_id text primary key/);
  assert.ok(deduplication > 0);
  assert.ok(duplicateReturn > deduplication);
  assert.ok(firstTransition > duplicateReturn);
});
