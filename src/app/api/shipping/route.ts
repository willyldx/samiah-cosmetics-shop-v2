import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SHIPPING_FEES } from "@/lib/checkout/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      const supabase = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("id", "shipping")
        .maybeSingle();

      if (data?.value && typeof data.value === "object") {
        return NextResponse.json({
          shippingFees: {
            ...SHIPPING_FEES,
            ...(data.value as Record<string, number>),
          },
        });
      }
    }
  } catch (err) {
    console.warn("Could not read dynamic shipping settings, using defaults:", err);
  }

  return NextResponse.json({ shippingFees: SHIPPING_FEES });
}
