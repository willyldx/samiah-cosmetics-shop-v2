import { NextResponse } from "next/server";

import { statusAccessTokenMatches } from "@/lib/checkout/security";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ orderNumber: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { orderNumber } = await context.params;
  const token = new URL(request.url).searchParams.get("token");

  if (!token || token.length > 128) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "order_number,total,payment_method,payment_status,kadryza_ticket,kadryza_operator,kadryza_environment,kadryza_collection_number,kadryza_checkout_url,payment_expires_at,payment_confirmed_at,payment_failure_reason,status_access_token_hash",
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) {
    console.error("payment_status_read_failed", { code: error.code });
    return NextResponse.json(
      { error: "Statut temporairement indisponible." },
      { status: 503 },
    );
  }

  if (
    !order ||
    typeof order.status_access_token_hash !== "string" ||
    !statusAccessTokenMatches(token, order.status_access_token_hash)
  ) {
    return NextResponse.json(
      { error: "Commande introuvable." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      orderNumber: order.order_number,
      total: order.total,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      ticket: order.kadryza_ticket,
      operator: order.kadryza_operator,
      environment: order.kadryza_environment,
      collectionNumber: order.kadryza_collection_number,
      checkoutUrl: order.kadryza_checkout_url,
      expiresAt: order.payment_expires_at,
      confirmedAt: order.payment_confirmed_at,
      retryAllowed: order.payment_status === "session_failed",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
