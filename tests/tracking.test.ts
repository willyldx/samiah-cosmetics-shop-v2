import test from "node:test";
import assert from "node:assert/strict";

import { parseTrackingInput } from "../src/lib/checkout/tracking.ts";

test("le suivi exige la paire commande et téléphone exacts", () => {
  const input = parseTrackingInput({
    orderNumber: "sc260825-ab12cd34",
    phone: "66 00 00 00",
  });

  assert.equal(input.orderNumber, "SC260825-AB12CD34");
  assert.deepEqual(input.phoneCandidates, [
    "66 00 00 00",
    "66000000",
    "+23566000000",
  ]);
});

test("le suivi refuse un numéro de commande incomplet", () => {
  assert.throws(
    () => parseTrackingInput({ orderNumber: "SC260825", phone: "66000000" }),
    /commande est invalide/,
  );
});
