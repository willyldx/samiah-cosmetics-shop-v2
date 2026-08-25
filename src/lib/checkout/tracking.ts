import {
  CheckoutValidationError,
  normalizeCustomerPhone,
} from "./validation.ts";

export interface TrackingInput {
  orderNumber: string;
  phoneCandidates: string[];
}

export function parseTrackingInput(value: unknown): TrackingInput {
  if (!value || typeof value !== "object") {
    throw new CheckoutValidationError("La recherche est invalide.");
  }

  const input = value as Record<string, unknown>;
  if (typeof input.orderNumber !== "string") {
    throw new CheckoutValidationError("Le numéro de commande est requis.");
  }
  const orderNumber = input.orderNumber.trim().toUpperCase();
  if (!/^SC\d{6}-[A-Z0-9]{4,8}$/.test(orderNumber)) {
    throw new CheckoutValidationError("Le numéro de commande est invalide.");
  }
  if (typeof input.phone !== "string" || input.phone.length > 30) {
    throw new CheckoutValidationError("Le numéro WhatsApp est invalide.");
  }

  const rawPhone = input.phone.trim();
  const compactPhone = rawPhone.replace(/\s+/g, "");
  const normalizedPhone = normalizeCustomerPhone(rawPhone);
  return {
    orderNumber,
    phoneCandidates: [...new Set([rawPhone, compactPhone, normalizedPhone])],
  };
}
