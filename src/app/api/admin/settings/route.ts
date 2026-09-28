import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { SHIPPING_FEES } from "@/lib/checkout/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Variables Supabase manquantes.");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// In-memory fallback if Supabase RLS is not yet relaxed
let inMemoryShippingFees: Record<string, number> = {
  ...SHIPPING_FEES,
};

// GET current settings (shipping fees)
export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("id", "shipping")
      .maybeSingle();

    if (!error && data?.value && typeof data.value === "object") {
      inMemoryShippingFees = {
        ...inMemoryShippingFees,
        ...(data.value as Record<string, number>),
      };
    }

    return NextResponse.json({
      shippingFees: inMemoryShippingFees,
      source: data?.value ? "supabase" : "default",
    });
  } catch (err: any) {
    return NextResponse.json({
      shippingFees: inMemoryShippingFees,
      source: "fallback",
    });
  }
}

// POST / PUT update settings (shipping fees)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newFees = body.shippingFees;

    if (!newFees || typeof newFees !== "object") {
      return NextResponse.json(
        { error: "Le barème des frais de livraison est requis." },
        { status: 400 }
      );
    }

    // Update in-memory copy immediately so checkout reflects it right away
    inMemoryShippingFees = {
      ...inMemoryShippingFees,
      ...newFees,
    };

    const supabase = getAdminClient();
    const { error } = await supabase
      .from("settings")
      .upsert({
        id: "shipping",
        value: inMemoryShippingFees,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn("Supabase settings upsert error:", error);
      return NextResponse.json(
        {
          success: true,
          shippingFees: inMemoryShippingFees,
          warning:
            error.code === "42501"
              ? "Enregistré en mémoire serveur. Pour persister définitivement dans Supabase, désactivez le RLS sur la table settings (ALTER TABLE settings DISABLE ROW LEVEL SECURITY;)."
              : error.message,
          isRlsError: error.code === "42501",
        },
        { status: 200 }
      );
    }

    revalidatePath("/commander");
    revalidatePath("/admin/parametres");

    return NextResponse.json({
      success: true,
      shippingFees: inMemoryShippingFees,
      persistedToSupabase: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
