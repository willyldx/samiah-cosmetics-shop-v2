import { createHash, createHmac, timingSafeEqual } from "node:crypto";

import { KADRYZA_CURRENCY } from "../checkout/config.ts";
import type { KadryzaHostedCheckoutView } from "./client.ts";
import type { KadryzaEnvironment } from "./environment.ts";

const PAYMENT_SESSION_EVENTS = new Set([
  "payment_session.succeeded",
  "payment_session.under_review",
  "payment_session.expired",
]);

export interface KadryzaWebhookData {
  id: string;
  reference: string;
  ticket?: string;
  amount: number;
  currency: string;
  operator: string;
  status: string;
  environment: string;
  expires_at?: string;
  completed_at?: string;
}

export interface KadryzaWebhookEvent {
  event_id?: string;
  event: string;
  data: KadryzaWebhookData;
  timestamp?: string;
}

export interface PaymentOrderSnapshot {
  order_number: string;
  total: number;
  kadryza_session_id: string | null;
  kadryza_checkout_intent_id: string | null;
  kadryza_reference: string | null;
  kadryza_operator: string | null;
  kadryza_environment: string | null;
  payment_expires_at: string | null;
  payment_status: string;
}

export type WebhookDecision =
  | { kind: "ignored"; reason: "unknown_event" }
  | { kind: "rejected"; reason: string }
  | {
      kind: "accepted";
      paymentStatus: "paid" | "under_review" | "expired";
    };

export type HostedCheckoutResolution =
  | { kind: "resolved"; order: PaymentOrderSnapshot }
  | { kind: "rejected"; reason: string };

export function verifyKadryzaSignature(
  rawBody: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature || !signature.startsWith("sha256=") || !secret) {
    return false;
  }

  const expected = `sha256=${createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex")}`;
  const actualBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function parseKadryzaWebhook(rawBody: string): KadryzaWebhookEvent {
  let value: unknown;
  try {
    value = JSON.parse(rawBody);
  } catch {
    throw new Error("invalid_json");
  }

  if (!value || typeof value !== "object") {
    throw new Error("invalid_payload");
  }

  const event = value as Record<string, unknown>;
  const data = event.data as Record<string, unknown> | undefined;
  if (typeof event.event !== "string" || !data) {
    throw new Error("invalid_payload");
  }

  const parsed: KadryzaWebhookEvent = {
    event: event.event,
    data: {
      id: typeof data.id === "string" ? data.id : "",
      reference: typeof data.reference === "string" ? data.reference : "",
      ticket: typeof data.ticket === "string" ? data.ticket : undefined,
      amount: typeof data.amount === "number" ? data.amount : Number.NaN,
      currency: typeof data.currency === "string" ? data.currency : "",
      operator: typeof data.operator === "string" ? data.operator : "",
      status: typeof data.status === "string" ? data.status : "",
      environment:
        typeof data.environment === "string" ? data.environment : "",
      expires_at:
        typeof data.expires_at === "string" ? data.expires_at : undefined,
      completed_at:
        typeof data.completed_at === "string" ? data.completed_at : undefined,
    },
    timestamp:
      typeof event.timestamp === "string" ? event.timestamp : undefined,
    event_id:
      typeof event.event_id === "string" && event.event_id
        ? event.event_id
        : undefined,
  };

  return parsed;
}

export function getKadryzaEventId(
  event: KadryzaWebhookEvent,
  eventIdHeader?: string | null,
): string {
  if (event.event_id) {
    return event.event_id;
  }
  if (eventIdHeader) {
    return eventIdHeader;
  }

  // Compatibilité avec d'anciennes livraisons sans event_id.
  const source = `${event.event}:${event.data.id}:${event.data.status}`;
  return `derived_${createHash("sha256").update(source).digest("hex")}`;
}

export function getPayloadSha256(rawBody: string): string {
  return createHash("sha256").update(rawBody).digest("hex");
}

export function resolveHostedCheckoutSession(
  event: KadryzaWebhookEvent,
  order: PaymentOrderSnapshot,
  checkout: KadryzaHostedCheckoutView,
): HostedCheckoutResolution {
  const session = checkout.payment_session;
  const checks: Array<[boolean, string]> = [
    [checkout.status === "SELECTED", "checkout_not_selected"],
    [checkout.id === order.kadryza_checkout_intent_id, "checkout_intent_mismatch"],
    [checkout.reference === order.order_number, "checkout_reference_mismatch"],
    [checkout.reference === order.kadryza_reference, "checkout_stored_reference_mismatch"],
    [checkout.amount === order.total, "checkout_amount_mismatch"],
    [checkout.currency === KADRYZA_CURRENCY, "checkout_currency_mismatch"],
    [checkout.environment === order.kadryza_environment, "checkout_environment_mismatch"],
    [Boolean(session), "checkout_session_missing"],
    [session?.id === event.data.id, "checkout_session_mismatch"],
    [session?.reference === event.data.reference, "checkout_session_reference_mismatch"],
    [session?.amount === event.data.amount, "checkout_session_amount_mismatch"],
    [session?.currency === event.data.currency, "checkout_session_currency_mismatch"],
    [session?.operator === event.data.operator, "checkout_session_operator_mismatch"],
    [session?.status === event.data.status, "checkout_session_status_mismatch"],
    [session?.environment === event.data.environment, "checkout_session_environment_mismatch"],
  ];
  const failedCheck = checks.find(([valid]) => !valid);
  if (failedCheck || !session) {
    return {
      kind: "rejected",
      reason: failedCheck?.[1] ?? "checkout_session_missing",
    };
  }

  return {
    kind: "resolved",
    order: {
      ...order,
      kadryza_session_id: session.id,
      kadryza_operator: session.operator,
    },
  };
}

export function evaluatePaymentSessionEvent(
  event: KadryzaWebhookEvent,
  order: PaymentOrderSnapshot | null,
  expectedEnvironment: KadryzaEnvironment,
): WebhookDecision {
  if (!PAYMENT_SESSION_EVENTS.has(event.event)) {
    return { kind: "ignored", reason: "unknown_event" };
  }

  if (!order) {
    return { kind: "rejected", reason: "order_not_found" };
  }

  const checks: Array<[boolean, string]> = [
    [event.data.reference === order.order_number, "reference_mismatch"],
    [
      event.data.reference === order.kadryza_reference,
      "kadryza_reference_mismatch",
    ],
    [event.data.id === order.kadryza_session_id, "session_mismatch"],
    [event.data.amount === order.total, "amount_mismatch"],
    [Boolean(event.data.ticket), "ticket_missing"],
    [Boolean(event.data.expires_at), "expiration_missing"],
    [
      Boolean(
        event.data.expires_at &&
          order.payment_expires_at &&
          Date.parse(event.data.expires_at) ===
            Date.parse(order.payment_expires_at),
      ),
      "expiration_mismatch",
    ],
    [event.data.currency === KADRYZA_CURRENCY, "currency_mismatch"],
    [
      /^[A-Z][A-Z0-9_]{1,31}$/.test(event.data.operator),
      "operator_invalid",
    ],
    [
      event.data.operator === order.kadryza_operator,
      "stored_operator_mismatch",
    ],
    [event.data.environment === expectedEnvironment, "environment_mismatch"],
    [
      event.data.environment === order.kadryza_environment,
      "stored_environment_mismatch",
    ],
  ];

  const failedCheck = checks.find(([valid]) => !valid);
  if (failedCheck) {
    return { kind: "rejected", reason: failedCheck[1] };
  }

  if (event.event === "payment_session.succeeded") {
    if (event.data.status !== "SUCCESS") {
      return { kind: "rejected", reason: "success_status_mismatch" };
    }
    return ["awaiting_payment", "under_review"].includes(order.payment_status)
      ? { kind: "accepted", paymentStatus: "paid" }
      : { kind: "rejected", reason: "order_payment_state_mismatch" };
  }

  if (event.event === "payment_session.under_review") {
    if (event.data.status !== "UNDER_REVIEW") {
      return { kind: "rejected", reason: "review_status_mismatch" };
    }
    return order.payment_status === "awaiting_payment"
      ? { kind: "accepted", paymentStatus: "under_review" }
      : { kind: "rejected", reason: "order_payment_state_mismatch" };
  }

  if (event.data.status !== "EXPIRED") {
    return { kind: "rejected", reason: "expired_status_mismatch" };
  }
  return ["awaiting_payment", "under_review"].includes(order.payment_status)
    ? { kind: "accepted", paymentStatus: "expired" }
    : { kind: "rejected", reason: "order_payment_state_mismatch" };
}
