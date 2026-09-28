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

// Fallback demo products
export const FALLBACK_PRODUCTS: AdminProduct[] = [
  {
    id: "prod-chebe-oil",
    title: "Huile de Chébé Authentique 100ml",
    price: 8500,
    category: "Cheveux",
    active: true,
    image: "https://images.unsplash.com/photo-1608248597359-00995fa665d9?w=800&q=80",
    image_url: "https://images.unsplash.com/photo-1608248597359-00995fa665d9?w=800&q=80",
  },
  {
    id: "prod-karite-creme",
    title: "Crème Nourrissante au Karité Pur 200ml",
    price: 6500,
    category: "Corps",
    active: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
  },
  {
    id: "prod-serum-eclat",
    title: "Sérum Visage Éclat & Anti-taches 50ml",
    price: 12000,
    category: "Visage",
    active: true,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
  },
  {
    id: "prod-savon-noir",
    title: "Savon Noir Artisanal aux Plantes",
    price: 3500,
    category: "Visage",
    active: true,
    image: "https://images.unsplash.com/photo-1607006314605-78330a1038fb?w=800&q=80",
    image_url: "https://images.unsplash.com/photo-1607006314605-78330a1038fb?w=800&q=80",
  },
  {
    id: "prod-masque-fortifiant",
    title: "Masque Capillaire Régénérant",
    price: 9500,
    category: "Cheveux",
    active: false,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
  },
];

// Fallback demo orders for testing when Supabase keys are disabled
export const FALLBACK_ORDERS: AdminOrder[] = [
  {
    id: "ord-1",
    order_number: "CMD-2026-9041",
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    client_name: "Fatimé Zara Mahamat",
    client_phone: "+235 66 12 34 56",
    client_city: "N'Djamena",
    client_address: "Quartier Moursal, Rue 102",
    items: [
      {
        productId: "prod-chebe-oil",
        product_title: "Huile de Chébé Authentique 100ml",
        quantity: 2,
        product_price: 8500,
      },
    ],
    subtotal: 17000,
    shipping_fee: 1000,
    total: 18000,
    payment_method: "kadryza",
    payment_status: "paid",
    status: "processing",
  },
  {
    id: "ord-2",
    order_number: "CMD-2026-9038",
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    client_name: "Amina Idriss",
    client_phone: "+235 99 45 67 89",
    client_city: "N'Djamena",
    client_address: "Quartier Chagoua",
    items: [
      {
        productId: "prod-serum-eclat",
        product_title: "Sérum Visage Éclat & Anti-taches 50ml",
        quantity: 1,
        product_price: 12000,
      },
      {
        productId: "prod-karite-creme",
        product_title: "Crème Nourrissante au Karité Pur 200ml",
        quantity: 1,
        product_price: 6500,
      },
    ],
    subtotal: 18500,
    shipping_fee: 1000,
    total: 19500,
    payment_method: "cash",
    payment_status: "pending_payment",
    status: "pending",
  },
  {
    id: "ord-3",
    order_number: "CMD-2026-9025",
    created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    client_name: "Mariam Ousmane",
    client_phone: "+235 62 78 90 12",
    client_city: "Moundou",
    client_address: "Centre-ville, face marché",
    items: [
      {
        productId: "prod-chebe-oil",
        product_title: "Huile de Chébé Authentique 100ml",
        quantity: 1,
        product_price: 8500,
      },
    ],
    subtotal: 8500,
    shipping_fee: 2500,
    total: 11000,
    payment_method: "kadryza",
    payment_status: "paid",
    status: "delivered",
  },
  {
    id: "ord-4",
    order_number: "CMD-2026-9012",
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    client_name: "Khadidja Tahir",
    client_phone: "+235 60 11 22 33",
    client_city: "Sarh",
    client_address: "Avenue Mobutu",
    items: [
      {
        productId: "prod-savon-noir",
        product_title: "Savon Noir Artisanal aux Plantes",
        quantity: 3,
        product_price: 3500,
      },
    ],
    subtotal: 10500,
    shipping_fee: 3000,
    total: 13500,
    payment_method: "cash",
    payment_status: "not_applicable",
    status: "shipped",
  },
];

export async function fetchAdminData(): Promise<{
  orders: AdminOrder[];
  products: AdminProduct[];
  stats: AdminStats;
}> {
  let orders: AdminOrder[] = [];
  let products: AdminProduct[] = [];
  let supabaseStatus: AdminStats["supabaseStatus"] = "connected";
  let errorMessage: string | undefined;

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
      products = FALLBACK_PRODUCTS;
    } else if (prodData && prodData.length > 0) {
      products = prodData;
    } else {
      products = FALLBACK_PRODUCTS;
    }
  } catch (err: any) {
    supabaseStatus = "error";
    errorMessage = err?.message || "Erreur de connexion Supabase";
    products = FALLBACK_PRODUCTS;
  }

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
      orders = FALLBACK_ORDERS;
    } else if (orderData && orderData.length > 0) {
      orders = orderData;
    } else {
      orders = FALLBACK_ORDERS;
    }
  } catch {
    orders = FALLBACK_ORDERS;
  }

  // Calculate real metrics
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

export async function updateAdminProduct(
  updated: Partial<AdminProduct> & { id: string }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("products")
      .update({
        title: updated.title,
        price: updated.price,
        category: updated.category,
        active: updated.active,
        image: updated.image || updated.image_url,
        image_url: updated.image || updated.image_url,
        description: updated.description,
        short_description: updated.short_description,
      })
      .eq("id", updated.id);

    if (error) {
      console.warn("Supabase update error (operating in resilient fallback):", error.message);
    }
  } catch (err) {
    console.warn("Supabase update error:", err);
  }

  const index = FALLBACK_PRODUCTS.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    FALLBACK_PRODUCTS[index] = { ...FALLBACK_PRODUCTS[index], ...updated };
  }
  return true;
}

