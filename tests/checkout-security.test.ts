import test from "node:test";
import assert from "node:assert/strict";

import {
  createOrderNumber,
  hashStatusAccessToken,
  isSameOriginRequest,
  statusAccessTokenMatches,
} from "../src/lib/checkout/security.ts";

test("génère une référence de commande stable au format Samiah", () => {
  const reference = createOrderNumber(new Date("2026-07-28T12:00:00Z"));
  assert.match(reference, /^SC260728-[A-F0-9]{8}$/);
});

test("compare le jeton de statut sans stocker sa valeur brute", () => {
  const token = "550e8400-e29b-41d4-a716-446655440000";
  const hash = hashStatusAccessToken(token);
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(statusAccessTokenMatches(token, hash), true);
  assert.equal(statusAccessTokenMatches(`${token}x`, hash), false);
});

test("refuse une création de commande cross-origin", () => {
  assert.equal(
    isSameOriginRequest(
      new Request("https://samiah.example/api/orders", {
        headers: { Origin: "https://samiah.example" },
      }),
    ),
    true,
  );
  assert.equal(
    isSameOriginRequest(
      new Request("https://samiah.example/api/orders", {
        headers: { Origin: "https://attacker.example" },
      }),
    ),
    false,
  );
  assert.equal(
    isSameOriginRequest(new Request("https://samiah.example/api/orders")),
    false,
  );
});

test("accepte le domaine public transmis par le proxy Vercel", () => {
  const request = new Request("https://internal.vercel.app/api/orders", {
    headers: {
      origin: "https://samiahcosmetics.shop",
      "x-forwarded-host": "samiahcosmetics.shop",
      "x-forwarded-proto": "https",
    },
  });

  assert.equal(isSameOriginRequest(request), true);
});

test("accepte le Host public exact quand Vercel omet les forwarded headers", () => {
  const request = new Request("https://internal.vercel.app/api/orders", {
    headers: {
      host: "samiahcosmetics.shop",
      origin: "https://samiahcosmetics.shop",
    },
  });

  assert.equal(isSameOriginRequest(request), true);
});
