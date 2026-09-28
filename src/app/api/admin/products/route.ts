import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Variables Supabase manquantes côté serveur.");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET all products
export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ products: data || [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST create product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const newProduct = {
      title: body.title,
      price: Number(body.price),
      category: body.category || "Général",
      active: body.active !== undefined ? Boolean(body.active) : true,
      image: body.image || body.image_url || null,
      images: body.images || null,
      description: body.description || null,
      short_description: body.short_description || null,
      currency: "XAF",
      cities: ["N'Djamena"],
    };

    const { data, error } = await supabase
      .from("products")
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          isRlsError: error.code === "42501",
        },
        { status: 400 }
      );
    }

    // Purge public pages cache
    revalidatePath("/");
    revalidatePath("/produits");

    return NextResponse.json({ success: true, product: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { error: "L'identifiant du produit (id) est requis." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) updates.title = body.title;
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.category !== undefined) updates.category = body.category;
    if (body.active !== undefined) updates.active = Boolean(body.active);
    if (body.image !== undefined || body.image_url !== undefined) {
      updates.image = body.image || body.image_url;
    }
    if (body.description !== undefined) updates.description = body.description;
    if (body.short_description !== undefined) {
      updates.short_description = body.short_description;
    }

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", body.id)
      .select();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          isRlsError: error.code === "42501",
        },
        { status: 400 }
      );
    }

    // Check if 0 rows were updated (silent RLS rejection)
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          error:
            "Aucune ligne mise à jour. La sécurité RLS de Supabase empêche la modification sans clé secrète.",
          isRlsError: true,
        },
        { status: 403 }
      );
    }

    // Purge public pages cache
    revalidatePath("/");
    revalidatePath("/produits");
    revalidatePath(`/produits/${body.id}`);

    return NextResponse.json({ success: true, product: data[0] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "L'identifiant du produit (id) est requis." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    const { error, count } = await supabase
      .from("products")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          isRlsError: error.code === "42501",
        },
        { status: 400 }
      );
    }

    // Purge public pages cache
    revalidatePath("/");
    revalidatePath("/produits");
    revalidatePath(`/produits/${id}`);

    return NextResponse.json({ success: true, deletedId: id, count });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
