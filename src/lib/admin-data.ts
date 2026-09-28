import { supabase } from "./supabase";

export interface AdminOrder {
  id: string;
  order_number: string;
  created_at: string;
  client_name: string;
  client_phone: string;
  client_city: string;
  client_address: string;
  items: Array<{
    productId: string;
    product_title?: string;
    product_price?: number;
    quantity: number;
    price?: number;
  }>;
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_method: "cash" | "kadryza";
  payment_status: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string;
}

export interface AdminProduct {
  id: string;
  title: string;
  price: number;
  category: string;
  active: boolean;
  image?: string;
  image_url?: string;
  description?: string;
  short_description?: string;
  created_at?: string;
}

export interface AdminStats {
  ordersCount: number;
  monthOrdersCount: number;
  totalRevenue: number;
  activeProductsCount: number;
  supabaseStatus: "connected" | "legacy_key_error" | "error" | "offline";
  supabaseErrorMessage?: string;
}

// Pas de fausses commandes mocks : la base de données réelle fait foi !
export const FALLBACK_ORDERS: AdminOrder[] = [];

export const FALLBACK_PRODUCTS: AdminProduct[] = [];

export async function fetchAdminData(): Promise<{
  orders: AdminOrder[];
  products: AdminProduct[];
  stats: AdminStats;
}> {
  let orders: AdminOrder[] = [];
  let products: AdminProduct[] = [];
  let supabaseStatus: AdminStats["supabaseStatus"] = "connected";
  let errorMessage: string | undefined;

  // 1. Chargement des produits réels depuis Supabase
  try {
    const { data: prodData, error: prodErr } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (prodErr) {
      if (prodErr.message?.includes("Legacy API keys are disabled")) {
        supabaseStatus = "legacy_key_error";
        errorMessage =
          "Les anciennes clés Supabase (anon/service_role) sont désactivées. Veuillez générer les nouvelles clés API Publishable/Secret dans le dashboard Supabase.";
      } else {
        supabaseStatus = "error";
        errorMessage = prodErr.message;
      }
      products = [];
    } else {
      products = prodData || [];
    }
  } catch (err: any) {
    supabaseStatus = "error";
    errorMessage = err?.message || "Erreur de connexion Supabase";
    products = [];
  }

  // 2. Chargement des commandes réelles depuis Supabase (zéro mock !)
  try {
    const { data: orderData, error: ordErr } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordErr) {
      if (ordErr.message?.includes("Legacy API keys are disabled")) {
        supabaseStatus = "legacy_key_error";
        errorMessage =
          "Les anciennes clés Supabase (anon/service_role) sont désactivées. Veuillez générer les nouvelles clés API Publishable/Secret dans le dashboard Supabase.";
      }
      orders = [];
    } else {
      orders = orderData || [];
    }
  } catch {
    orders = [];
  }

  // Calcul des métriques réelles
  const ordersCount = orders.length;
  const now = new Date();
  const monthOrdersCount = orders.filter((o) => {
    const d = new Date(o.created_at);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const activeProductsCount = products.filter((p) => p.active).length;

  return {
    orders,
    products,
    stats: {
      ordersCount,
      monthOrdersCount,
      totalRevenue,
      activeProductsCount,
      supabaseStatus,
      supabaseErrorMessage: errorMessage,
    },
  };
}

export async function createAdminProduct(
  newProd: Partial<AdminProduct>
): Promise<{ success: boolean; error?: string; isRlsError?: boolean; product?: AdminProduct }> {
  try {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProd),
    });

    const json = await res.json();
    if (!res.ok || json.error) {
      return {
        success: false,
        error: json.error || "Impossible de créer le produit",
        isRlsError: Boolean(json.isRlsError),
      };
    }

    return { success: true, product: json.product };
  } catch (err: any) {
    return { success: false, error: err?.message || "Erreur réseau" };
  }
}

export async function updateAdminProduct(
  updated: Partial<AdminProduct> & { id: string }
): Promise<{ success: boolean; error?: string; isRlsError?: boolean }> {
  try {
    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    const json = await res.json();
    if (!res.ok || json.error) {
      return {
        success: false,
        error: json.error || "Impossible de mettre à jour le produit",
        isRlsError: Boolean(json.isRlsError),
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Erreur réseau" };
  }
}

export async function deleteAdminProduct(
  productId: string
): Promise<{ success: boolean; error?: string; isRlsError?: boolean }> {
  try {
    const res = await fetch(`/api/admin/products?id=${encodeURIComponent(productId)}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!res.ok || json.error) {
      return {
        success: false,
        error: json.error || "Impossible de supprimer le produit",
        isRlsError: Boolean(json.isRlsError),
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Erreur réseau" };
  }
}

export async function updateAdminOrder(
  orderId: string,
  updates: Partial<AdminOrder>
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: orderId,
        status: updates.status,
        notes: updates.notes,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      return { success: false, error: data.error || "Erreur lors de la mise à jour de la commande" };
    }

    return { success: true };
  } catch (err: any) {
    console.warn("Erreur réseau /api/admin/orders:", err);
    return { success: false, error: err?.message || "Erreur réseau" };
  }
}
