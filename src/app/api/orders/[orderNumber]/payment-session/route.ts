import { NextResponse } from "next/server";

import { isKadryzaEnabled } from "@/lib/checkout/config";
import {
  isSameOriginRequest,
  statusAccessTokenMatches,
} from "@/lib/checkout/security";
import {
  createKadryzaHostedCheckout,
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
      "id,order_number,total,payment_method,payment_status,status_access_token_hash,kadryza_checkout_intent_id,kadryza_environment",
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

  if (
    order.payment_method !== "kadryza" ||
    order.kadryza_checkout_intent_id
  ) {
    return NextResponse.json(
      { error: "Cette commande ne peut pas recréer de Hosted Checkout." },
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
    "claim_kadryza_checkout_retry",
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
    const checkout = await createKadryzaHostedCheckout({
      reference: order.order_number,
      amount: order.total,
      description: `Commande Samiah ${order.order_number}`,
    });
    const { data: persistedCheckout, error: updateError } = await supabase
      .from("orders")
      .update({
        kadryza_checkout_intent_id: checkout.id,
        kadryza_checkout_url: checkout.checkout_url,
        payment_status:
          checkout.status === "EXPIRED" ? "expired" : "awaiting_payment",
        payment_expires_at: checkout.expires_at,
        payment_failure_reason: null,
      })
      .eq("id", order.id)
      .eq("payment_status", "checkout_creating")
      .select("id")
      .maybeSingle();

    if (updateError || !persistedCheckout) {
      console.error("kadryza_checkout_retry_persist_failed", {
        code: updateError?.code ?? "no_row_updated",
      });
      await supabase
        .from("orders")
        .update({
          payment_status: "reconciliation_required",
          payment_failure_reason: "checkout_persist_failed",
        })
        .eq("id", order.id);
      return NextResponse.json(
        { error: "Le Hosted Checkout créé doit être rapproché manuellement." },
        { status: 503 },
      );
    }

    return NextResponse.json({
      status:
        checkout.status === "EXPIRED" ? "expired" : "awaiting_payment",
      checkoutUrl: checkout.checkout_url,
    });
  } catch (error) {
    const retrySafety =
      error instanceof KadryzaUnavailableError
        ? error.retrySafety
        : "reconciliation_required";
    const paymentStatus =
      retrySafety === "safe"
        ? "checkout_failed"
        : "reconciliation_required";

    await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        payment_failure_reason:
          paymentStatus === "checkout_failed"
            ? "provider_unavailable"
            : "ambiguous_provider_result",
      })
      .eq("id", order.id)
      .eq("payment_status", "checkout_creating");

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
