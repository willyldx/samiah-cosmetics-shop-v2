"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { fetchAdminData, AdminOrder, AdminStats } from "@/lib/admin-data";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminData();
      setStats(data.stats);
      setOrders(data.orders);
    } catch (e) {
      console.error("Erreur chargement dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusBadge = (status: AdminOrder["status"]) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Livrée
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3" />
            Expédiée
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            En préparation
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            Annulée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-charcoal tracking-tight">Vue d'ensemble</h1>
          <p className="text-sm text-gray-500 mt-1">Tableau de bord de gestion de la boutique Samiah Cosmetics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-charcoal text-white hover:bg-charcoal/90 transition-colors shadow-2xs"
          >
            Boutique publique
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
          </Link>
        </div>
      </div>

      {/* Supabase API Key Diagnostic Alert Banner */}
      {stats?.supabaseStatus === "legacy_key_error" && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 sm:p-5 text-amber-900 shadow-2xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-amber-950">
                Action requise : Clés API Supabase à renouveler
              </p>
              <p className="text-amber-800 font-light text-xs sm:text-sm leading-relaxed">
                Supabase a désactivé les anciennes clés API legacy pour ce projet. Le backoffice fonctionne actuellement en mode résilient avec les données sécurisées de secours. Pour connecter vos données en direct, rendez-vous sur le <span className="font-medium">Tableau de bord Supabase &gt; Project Settings &gt; API</span> pour générer les nouvelles clés API Publishable / Secret.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Commandes */}
        <div className="bg-white p-6 border border-gray-200/80 rounded-xl shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Commandes (Mois)</span>
            <div className="w-9 h-9 rounded-lg bg-sand/20 flex items-center justify-center text-charcoal">
              <ShoppingCart className="w-4 h-4 text-gold" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-serif text-charcoal font-semibold">
              {loading ? "..." : stats?.monthOrdersCount ?? 0}
            </p>
            <span className="text-xs text-gray-400">
              ({stats?.ordersCount ?? 0} au total)
            </span>
          </div>
          <Link
            href="/admin/commandes"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold/80 mt-4 transition-colors"
          >
            Gérer les commandes
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Chiffre d'Affaires */}
        <div className="bg-white p-6 border border-gray-200/80 rounded-xl shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Chiffre d'Affaires</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-serif text-charcoal font-semibold">
              {loading ? "..." : (stats?.totalRevenue ?? 0).toLocaleString("fr-FR")}
            </p>
            <span className="text-sm font-sans font-medium text-gray-400">FCFA</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">Calculé sur les commandes confirmées</p>
        </div>

        {/* Produits Actifs */}
        <div className="bg-white p-6 border border-gray-200/80 rounded-xl shadow-2xs hover:shadow-xs transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Produits Actifs</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-serif text-charcoal font-semibold">
              {loading ? "..." : stats?.activeProductsCount ?? 0}
            </p>
            <span className="text-xs text-gray-400">en ligne</span>
          </div>
          <Link
            href="/admin/produits"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold/80 mt-4 transition-colors"
          >
            Voir le catalogue
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-medium text-charcoal">Dernières commandes</h2>
            <p className="text-xs text-gray-500 mt-0.5">Suivi en direct des commandes clientes</p>
          </div>
          <Link
            href="/admin/commandes"
            className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
          >
            Toutes les commandes
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/70 border-b border-gray-100 text-[11px] uppercase tracking-wider font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-3.5">N° Commande</th>
                <th className="px-6 py-3.5">Client & Contact</th>
                <th className="px-6 py-3.5">Ville</th>
                <th className="px-6 py-3.5">Montant</th>
                <th className="px-6 py-3.5">Paiement</th>
                <th className="px-6 py-3.5">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-light">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-charcoal text-xs">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-charcoal">{order.client_name}</p>
                    <p className="text-xs text-gray-400 font-sans">{order.client_phone}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-normal text-gray-600">
                    {order.client_city}
                  </td>
                  <td className="px-6 py-4 font-medium text-charcoal">
                    {order.total.toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${
                      order.payment_method === "kadryza"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {order.payment_method === "kadryza" ? "Mobile Money" : "Espèces"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
