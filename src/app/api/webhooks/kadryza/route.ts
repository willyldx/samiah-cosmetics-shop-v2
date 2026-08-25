import { NextResponse } from "next/server";

import {
  evaluatePaymentSessionEvent,
  getKadryzaEventId,
  getPayloadSha256,
  parseKadryzaWebhook,
  resolveHostedCheckoutSession,
  verifyKadryzaSignature,
  type PaymentOrderSnapshot,
} from "@/lib/kadryza/webhook";
import {
  getKadryzaHostedCheckout,
  KadryzaUnavailableError,
} from "@/lib/kadryza/client";
import { getKadryzaEnvironmentFromApiKey } from "@/lib/kadryza/environment";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > 256 * 1024) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }
  const signature = request.headers.get("x-kadryza-signature");
  const secret = process.env.KADRYZA_WEBHOOK_SECRET;

  if (!secret || !verifyKadryzaSignature(rawBody, signature, secret)) {
    return NextResponse.json(
      { error: "invalid_signature" },
      { status: 401 },
    );
  }

  let event;
  try {
    event = parseKadryzaWebhook(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const eventIdHeader = request.headers.get("x-kadryza-event-id");
  if (eventIdHeader && event.event_id && eventIdHeader !== event.event_id) {
    return NextResponse.json({ error: "event_id_mismatch" }, { status: 400 });
  }

  let expectedEnvironment;
  try {
    expectedEnvironment = getKadryzaEnvironmentFromApiKey(
      process.env.KADRYZA_API_KEY ?? "",
    );
  } catch {
    console.error("kadryza_webhook_configuration_invalid");
    return NextResponse.json({ error: "temporary_failure" }, { status: 503 });
  }

  const supabase = getSupabaseServerClient();
  let order: PaymentOrderSnapshot | null = null;

  if (event.event.startsWith("payment_session.")) {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "order_number,total,kadryza_session_id,kadryza_checkout_intent_id,kadryza_reference,kadryza_operator,kadryza_environment,payment_expires_at,payment_status",
      )
      .eq("order_number", event.data.reference)
      .maybeSingle();

    if (error) {
      console.error("kadryza_webhook_order_read_failed", { code: error.code });
      return NextResponse.json({ error: "temporary_failure" }, { status: 503 });
    }
    order = data;
  }

  let decision;
  if (
    order &&
    event.event.startsWith("payment_session.") &&
    (!order.kadryza_session_id || !order.kadryza_operator)
  ) {
    if (!order.kadryza_checkout_intent_id) {
      decision = { kind: "rejected" as const, reason: "checkout_intent_missing" };
    } else {
      try {
        const checkout = await getKadryzaHostedCheckout(
          order.kadryza_checkout_intent_id,
        );
        const resolution = resolveHostedCheckoutSession(event, order, checkout);
        if (resolution.kind === "resolved") {
          order = resolution.order;
          decision = evaluatePaymentSessionEvent(
            event,
            order,
            expectedEnvironment,
          );
        } else {
          decision = resolution;
        }
      } catch (error) {
        console.error("kadryza_webhook_checkout_resolution_failed", {
          statusCode:
            error instanceof KadryzaUnavailableError
              ? error.statusCode
              : undefined,
        });
        return NextResponse.json({ error: "temporary_failure" }, { status: 503 });
      }
    }
  } else {
    decision = evaluatePaymentSessionEvent(
      event,
      order,
      expectedEnvironment,
    );
  }
  if (
    decision.kind === "accepted" &&
    expectedEnvironment === "test" &&
    request.headers.get("x-kadryza-test") !== "true"
  ) {
    decision = { kind: "rejected", reason: "missing_test_header" };
  }

  const eventId = getKadryzaEventId(event, eventIdHeader);
  const { data: result, error: rpcError } = await supabase.rpc(
    "process_kadryza_webhook_event",
    {
      p_event_id: eventId,
      p_event_type: event.event,
      p_session_id: event.data.id || null,
      p_checkout_intent_id: order?.kadryza_checkout_intent_id ?? null,
      p_reference: event.data.reference || null,
      p_amount: Number.isFinite(event.data.amount) ? event.data.amount : null,
      p_currency: event.data.currency || null,
      p_operator: event.data.operator || null,
      p_environment: event.data.environment || null,
      p_data_status: event.data.status || null,
      p_ticket: event.data.ticket ?? null,
      p_expires_at: event.data.expires_at ?? null,
      p_completed_at: event.data.completed_at ?? null,
      p_payload_sha256: getPayloadSha256(rawBody),
      p_decision: decision.kind,
      p_reason: "reason" in decision ? decision.reason : null,
      p_payment_status:
        decision.kind === "accepted" ? decision.paymentStatus : null,
    },
  );

  if (rpcError) {
    console.error("kadryza_webhook_process_failed", {
      code: rpcError.code,
      eventId,
    });
    return NextResponse.json({ error: "temporary_failure" }, { status: 503 });
  }

  return NextResponse.json({
    received: true,
    duplicate: result === "duplicate",
  });
}
