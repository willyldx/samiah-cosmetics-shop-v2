import {
  FREE_SHIPPING_THRESHOLD,
  MAX_CART_ITEMS,
  MAX_ITEM_QUANTITY,
  SHIPPING_FEES,
  type ShippingCity,
} from "./config.ts";
import type {
  CheckoutInput,
  ProductRecord,
  TrustedOrderTotals,
} from "./types.ts";

export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutValidationError";
  }
}

function requireText(value: unknown, label: string, maxLength: number): string {
  if (typeof value !== "string") {
    throw new CheckoutValidationError(`${label} est requis.`);
  }

  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) {
    throw new CheckoutValidationError(`${label} est invalide.`);
  }

  return normalized;
}

export function normalizeCustomerPhone(value: unknown): string {
  const raw = requireText(value, "Le numéro de téléphone", 30);
  const hasInternationalPrefix = raw.trim().startsWith("+");
  const digits = raw.replace(/\D/g, "");

  if (digits.length < 8 || digits.length > 15) {
    throw new CheckoutValidationError("Le numéro de téléphone est invalide.");
  }

  if (!hasInternationalPrefix && digits.length === 8) {
    return `+235${digits}`;
  }

  return `+${digits}`;
}

export function parseCheckoutInput(value: unknown): CheckoutInput {
  if (!value || typeof value !== "object") {
    throw new CheckoutValidationError("La requête de commande est invalide.");
  }

  const body = value as Record<string, unknown>;
  const checkoutToken = requireText(
    body.checkoutToken,
    "Le jeton de commande",
    128,
  );
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      checkoutToken,
    )
  ) {
    throw new CheckoutValidationError("Le jeton de commande est invalide.");
  }
  const customer = body.customer as Record<string, unknown> | undefined;
  if (!customer) {
    throw new CheckoutValidationError("Les coordonnées client sont requises.");
  }

  const city = requireText(customer.city, "La ville", 60);
  if (!(city in SHIPPING_FEES)) {
    throw new CheckoutValidationError("La ville de livraison est invalide.");
  }

  if (body.paymentMethod !== "cash" && body.paymentMethod !== "kadryza") {
    throw new CheckoutValidationError("Le mode de paiement est invalide.");
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new CheckoutValidationError("Le panier est vide.");
  }

  if (body.items.length > MAX_CART_ITEMS) {
    throw new CheckoutValidationError("Le panier contient trop de lignes.");
  }

  const productIds = new Set<string>();
  const items = body.items.map((rawItem) => {
    if (!rawItem || typeof rawItem !== "object") {
      throw new CheckoutValidationError("Une ligne du panier est invalide.");
    }

    const item = rawItem as Record<string, unknown>;
    const productId = requireText(item.productId, "L'identifiant produit", 100);
    if (
      !Number.isInteger(item.quantity) ||
      (item.quantity as number) < 1 ||
      (item.quantity as number) > MAX_ITEM_QUANTITY
    ) {
      throw new CheckoutValidationError(
        `La quantité de ${productId} doit être comprise entre 1 et ${MAX_ITEM_QUANTITY}.`,
      );
    }

    if (productIds.has(productId)) {
      throw new CheckoutValidationError(
        "Le panier contient un produit en double.",
      );
    }
    productIds.add(productId);

    return {
      productId,
      quantity: item.quantity as number,
    };
  });

  return {
    checkoutToken,
    customer: {
      name: requireText(customer.name, "Le nom", 120),
      phone: normalizeCustomerPhone(customer.phone),
      city: city as ShippingCity,
      address: requireText(customer.address, "L'adresse", 240),
    },
    items,
    paymentMethod: body.paymentMethod,
  };
}

export function calculateTrustedOrder(
  input: CheckoutInput,
  products: ProductRecord[],
): TrustedOrderTotals {
  const productsById = new Map(products.map((product) => [product.id, product]));

  const items = input.items.map((item) => {
    const product = productsById.get(item.productId);
    if (
      !product ||
      !product.active ||
      !Number.isSafeInteger(product.price) ||
      product.price < 0
    ) {
      throw new CheckoutValidationError(
        "Un produit du panier est indisponible ou invalide.",
      );
    }

    const subtotal = product.price * item.quantity;
    if (!Number.isSafeInteger(subtotal)) {
      throw new CheckoutValidationError("Le montant du panier est invalide.");
    }

    return {
      product_id: product.id,
      product_title: product.title,
      product_price: product.price,
      quantity: item.quantity,
      subtotal,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  if (!Number.isSafeInteger(subtotal)) {
    throw new CheckoutValidationError("Le montant du panier est invalide.");
  }

  const shippingFee =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEES[input.customer.city];
  const total = subtotal + shippingFee;

  return { items, subtotal, shippingFee, total };
}
