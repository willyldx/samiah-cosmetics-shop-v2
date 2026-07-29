import type { PaymentStatus } from "./types.ts";

const POLLING_TERMINAL_STATUSES = new Set<PaymentStatus>([
  "paid",
  "expired",
  "session_failed",
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
