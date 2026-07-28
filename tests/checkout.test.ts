import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateTrustedOrder,
  CheckoutValidationError,
  parseCheckoutInput,
} from "../src/lib/checkout/validation.ts";

const baseInput = {
  checkoutToken: "550e8400-e29b-41d4-a716-446655440000",
  customer: {
    name: "Amina Mahamat",
    phone: "66 00 00 00",
    paymentPhone: "99 00 00 00",
    city: "N'Djamena",
    address: "Quartier Moursal",
  },
  items: [{ productId: "product-1", quantity: 2 }],
  paymentMethod: "kadryza",
};

test("recalcule les prix et la livraison depuis les produits fiables", () => {
  const input = parseCheckoutInput({
    ...baseInput,
    items: [
      {
        productId: "product-1",
        quantity: 2,
        price: 1,
        subtotal: 2,
      },
    ],
    total: 2,
  });
  const result = calculateTrustedOrder(input, [
    { id: "product-1", title: "Huile de Chebe", price: 7_500, active: true },
  ]);

  assert.equal(result.subtotal, 15_000);
  assert.equal(result.shippingFee, 1_000);
  assert.equal(result.total, 16_000);
  assert.equal(result.items[0].product_price, 7_500);
});

test("applique la livraison gratuite au seuil serveur", () => {
  const input = parseCheckoutInput(baseInput);
  const result = calculateTrustedOrder(input, [
    { id: "product-1", title: "Soin", price: 10_000, active: true },
  ]);

  assert.equal(result.subtotal, 20_000);
  assert.equal(result.shippingFee, 0);
  assert.equal(result.total, 20_000);
});

test("refuse les quantités falsifiées et les doublons", () => {
  assert.throws(
    () =>
      parseCheckoutInput({
        ...baseInput,
        items: [{ productId: "product-1", quantity: 0 }],
      }),
    CheckoutValidationError,
  );
  assert.throws(
    () =>
      parseCheckoutInput({
        ...baseInput,
        items: [
          { productId: "product-1", quantity: 1 },
          { productId: "product-1", quantity: 1 },
        ],
      }),
    /double/,
  );
});

test("exige le numéro du payeur pour Kadryza mais pas pour le cash", () => {
  assert.throws(
    () =>
      parseCheckoutInput({
        ...baseInput,
        customer: { ...baseInput.customer, paymentPhone: "" },
      }),
    /téléphone/,
  );
  assert.doesNotThrow(() =>
    parseCheckoutInput({
      ...baseInput,
      paymentMethod: "cash",
      customer: { ...baseInput.customer, paymentPhone: "" },
    }),
  );
});

test("refuse un produit absent ou inactif", () => {
  const input = parseCheckoutInput(baseInput);
  assert.throws(() => calculateTrustedOrder(input, []), /indisponible/);
  assert.throws(
    () =>
      calculateTrustedOrder(input, [
        { id: "product-1", title: "Soin", price: 1_000, active: false },
      ]),
    /indisponible/,
  );
});

test("préserve le calcul serveur du flux cash", () => {
  const input = parseCheckoutInput({ ...baseInput, paymentMethod: "cash" });
  const result = calculateTrustedOrder(input, [
    { id: "product-1", title: "Soin", price: 5_000, active: true },
  ]);

  assert.equal(input.paymentMethod, "cash");
  assert.deepEqual(
    {
      subtotal: result.subtotal,
      shippingFee: result.shippingFee,
      total: result.total,
    },
    { subtotal: 10_000, shippingFee: 1_000, total: 11_000 },
  );
});
