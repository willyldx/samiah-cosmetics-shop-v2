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
