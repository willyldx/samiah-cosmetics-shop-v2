import type { PaymentStatus } from "./types.ts";

const POLLING_TERMINAL_STATUSES = new Set<PaymentStatus>([
  "paid",
  "expired",
  "checkout_failed",
  "reconciliation_required",
]);

export function shouldPollPaymentStatus(status: PaymentStatus): boolean {
  // UNDER_REVIEW n'est pas terminal : un webhook SUCCESS peut encore payer.
  return !POLLING_TERMINAL_STATUSES.has(status);
}

export function shouldClearCartForPaymentStatus(
  status: PaymentStatus,
): boolean {
  return status === "paid";
}

export function shouldCheckHostedCheckoutExpiration(
  paymentMethod: string,
  status: PaymentStatus,
  paymentSessionId: string | null,
): boolean {
  return (
    paymentMethod === "kadryza" &&
    status === "awaiting_payment" &&
    paymentSessionId === null
  );
}

export function shouldRecoverHostedCheckoutCreation(
  paymentMethod: string,
  status: PaymentStatus,
): boolean {
  return paymentMethod === "kadryza" && status === "checkout_creating";
}
