import { NextResponse } from "next/server";

import { isKadryzaEnabled } from "@/lib/checkout/config";
import {
  isSameOriginRequest,
  statusAccessTokenMatches,
} from "@/lib/checkout/security";
import {
  createKadryzaPaymentSession,
  KadryzaUnavailableError,
} from "@/lib/kadryza/client";
import { getKadryzaEnvironmentFromApiKey } from "@/lib/kadryza/environment";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ orderNumber: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Origine refusée." }, { status: 403 });
  }

  if (!isKadryzaEnabled()) {
    return NextResponse.json(
      { error: "Le paiement Mobile Money n'est pas ouvert." },
      { status: 503 },
    );
  }

  const { orderNumber } = await context.params;
  let token: unknown;
  try {
    token = (await request.json()).token;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (typeof token !== "string" || token.length > 128) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const { data: order, error: readError } = await supabase
    .from("orders")
    .select(
      "id,order_number,total,payment_customer_phone,payment_method,payment_status,status_access_token_hash,kadryza_session_id,kadryza_environment",
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (
    readError ||
    !order ||
    typeof order.status_access_token_hash !== "string" ||
    !statusAccessTokenMatches(token, order.status_access_token_hash)
  ) {
    return NextResponse.json(
      { error: "Commande introuvable." },
      { status: 404 },
    );
  }

  if (order.payment_method !== "kadryza" || order.kadryza_session_id) {
    return NextResponse.json(
      { error: "Cette commande ne peut pas recréer de session." },
      { status: 409 },
    );
  }

  let configuredEnvironment;
  try {
    configuredEnvironment = getKadryzaEnvironmentFromApiKey(
      process.env.KADRYZA_API_KEY ?? "",
    );
  } catch {
    return NextResponse.json(
      { error: "Configuration Kadryza invalide." },
      { status: 503 },
    );
  }
  if (configuredEnvironment !== order.kadryza_environment) {
    return NextResponse.json(
      {
        error:
          "L'environnement Kadryza a changé. Une vérification manuelle est requise.",
      },
      { status: 409 },
    );
  }

  const { data: claimed, error: claimError } = await supabase.rpc(
    "claim_kadryza_payment_retry",
    { p_order_id: order.id },
  );
  if (claimError) {
    console.error("kadryza_retry_claim_failed", { code: claimError.code });
    return NextResponse.json(
      { error: "Nouvelle tentative temporairement indisponible." },
      { status: 503 },
    );
  }
  if (!claimed) {
    return NextResponse.json(
      { error: "Une tentative est déjà en cours ou requiert une vérification." },
      { status: 409 },
    );
  }

  try {
    const session = await createKadryzaPaymentSession({
      reference: order.order_number,
      amount: order.total,
      customerPhone: order.payment_customer_phone,
      description: `Commande Samiah ${order.order_number}`,
    });
    const { data: persistedSession, error: updateError } = await supabase
      .from("orders")
      .update({
        kadryza_session_id: session.id,
        kadryza_ticket: session.ticket,
        kadryza_collection_number: session.assigned_collection_number,
        kadryza_checkout_url: session.checkout_url ?? null,
        payment_status: "awaiting_payment",
        payment_expires_at: session.expires_at,
        payment_failure_reason: null,
      })
      .eq("id", order.id)
      .eq("payment_status", "session_creating")
      .select("id")
      .maybeSingle();

    if (updateError || !persistedSession) {
      console.error("kadryza_retry_persist_failed", {
        code: updateError?.code ?? "no_row_updated",
      });
      await supabase
        .from("orders")
        .update({
          payment_status: "reconciliation_required",
          payment_failure_reason: "session_persist_failed",
        })
        .eq("id", order.id);
      return NextResponse.json(
        { error: "La session créée doit être rapprochée manuellement." },
        { status: 503 },
      );
    }

    return NextResponse.json({
      status: "awaiting_payment",
      checkoutUrl: session.checkout_url ?? null,
    });
  } catch (error) {
    const retrySafety =
      error instanceof KadryzaUnavailableError
        ? error.retrySafety
        : "reconciliation_required";
    const paymentStatus =
      retrySafety === "safe"
        ? "session_failed"
        : "reconciliation_required";

    await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        payment_failure_reason:
          paymentStatus === "session_failed"
            ? "provider_unavailable"
            : "ambiguous_provider_result",
      })
      .eq("id", order.id)
      .eq("payment_status", "session_creating");

    return NextResponse.json(
      {
        error:
          error instanceof KadryzaUnavailableError
            ? error.message
            : "Kadryza est temporairement indisponible.",
        status: paymentStatus,
      },
      { status: 503 },
    );
  }
}
