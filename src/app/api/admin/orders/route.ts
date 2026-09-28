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
    throw new Error("Variables Supabase manquantes.");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Machine à états : transitions autorisées
// Les statuts 'delivered' et 'cancelled' sont terminaux et irréversibles !
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [], // Verrouillé : pas de retour en arrière
  cancelled: [], // Verrouillé : pas de retour en arrière
};

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "L'identifiant de la commande est requis." },
        { status: 400 }
      );
    }

    // Protection syntaxique : vérifier si l'identifiant est bien un UUID valide
    const UUID_REGEX =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        {
          error:
            "Cette commande est un exemple factice (mock) qui n'existe pas dans la base de données réelle.",
        },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // 1. Récupérer la commande actuelle pour vérifier son état
    const { data: currentOrder, error: fetchErr } = await supabase
      .from("orders")
      .select("id, status, notes")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr) {
      console.warn("Erreur lecture commande:", fetchErr);
    }

    if (!currentOrder) {
      return NextResponse.json(
        { error: "Commande introuvable dans la base de données." },
        { status: 404 }
      );
    }

    if (status && status !== currentOrder.status) {
      const currentStatus = currentOrder.status;

      // Vérification : état terminal déjà atteint
      if (currentStatus === "delivered") {
        return NextResponse.json(
          {
            error:
              "Cette commande a déjà été livrée. Le statut est définitif et ne peut plus être modifié.",
          },
          { status: 400 }
        );
      }

      if (currentStatus === "cancelled") {
        return NextResponse.json(
          {
            error:
              "Cette commande a été annulée. Le statut est définitif et ne peut plus être modifié.",
          },
          { status: 400 }
        );
      }

      // Vérification : transition autorisée
      const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
      if (!allowedNext.includes(status)) {
        return NextResponse.json(
          {
            error: `Transition invalide : impossible de passer de "${currentStatus}" à "${status}". Le cycle de commande avance uniquement vers l'avant.`,
          },
          { status: 400 }
        );
      }
    }

    // Préparation de la mise à jour
    const updatePayload: Record<string, unknown> = {};
    if (status) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = notes;

    let updateRes = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", id);

    // Si la colonne 'notes' n'existe pas dans la table Supabase, réessayer sans 'notes'
    if (updateRes.error && updateRes.error.code === "42703") {
      delete updatePayload.notes;
      updateRes = await supabase
        .from("orders")
        .update(updatePayload)
        .eq("id", id);
    }

    if (updateRes.error) {
      return NextResponse.json(
        {
          success: false,
          error: updateRes.error.message,
          isRlsError: updateRes.error.code === "42501",
        },
        { status: 500 }
      );
    }

    revalidatePath("/admin/commandes");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      status: status || currentOrder?.status,
      notes: notes !== undefined ? notes : currentOrder?.notes,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
