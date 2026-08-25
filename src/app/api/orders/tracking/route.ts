import { NextResponse } from "next/server";

import { isSameOriginRequest } from "@/lib/checkout/security";
import {
  CheckoutValidationError,
} from "@/lib/checkout/validation";
import { parseTrackingInput } from "@/lib/checkout/tracking";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Origine refusée." }, { status: 403 });
  }

  let input;
  try {
    input = parseTrackingInput(await request.json());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof CheckoutValidationError
            ? error.message
            : "La recherche est invalide.",
      },
      { status: 400 },
    );
  }

  const { data, error } = await getSupabaseServerClient()
    .from("orders")
    .select(
      "id,order_number,created_at,client_name,client_city,client_address,items,subtotal,shipping_fee,total,status",
    )
    .eq("order_number", input.orderNumber)
    .in("client_phone", input.phoneCandidates)
    .limit(1);

  if (error) {
    console.error("order_tracking_read_failed", { code: error.code });
    return NextResponse.json(
      { error: "Le suivi est temporairement indisponible." },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { orders: data ?? [] },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
