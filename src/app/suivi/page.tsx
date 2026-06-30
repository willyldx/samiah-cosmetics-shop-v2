"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SuiviPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(false);
    setOrders([]);
    setExpandedOrder(null);

    const cleanPhone = phone.replace(/\s+/g, "");

    try {
      // Find orders matching phone
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`client_phone.eq.${phone},client_phone.eq.${cleanPhone},client_phone.ilike.%${cleanPhone}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      setSearched(true);
    } catch (err) {
      console.error("Erreur de recherche:", err);
      alert("Impossible d'effectuer la recherche. Veuillez vérifier votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; classes: string }> = {
      pending: { text: "En attente", classes: "bg-amber-50 text-amber-700 border-amber-200" },
      processing: { text: "Préparation", classes: "bg-blue-50 text-blue-700 border-blue-200" },
      shipped: { text: "En cours de livraison", classes: "bg-indigo-50 text-indigo-700 border-indigo-200" },
      delivered: { text: "Livrée", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      cancelled: { text: "Annulée", classes: "bg-rose-50 text-rose-700 border-rose-200" },
    };
    return labels[status] || { text: status, classes: "bg-gray-50 text-gray-700 border-gray-200" };
  };

  const toggleOrderExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-cream pt-32 pb-24">
      {/* Header */}
      <div className="border-b border-sand/30 pt-16 pb-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold block mb-3">Service Client</span>
          <h1 className="text-3xl lg:text-4xl font-serif font-light text-charcoal mb-4">
            Suivre ma commande
          </h1>
          <p className="text-[9px] uppercase tracking-[0.2em] text-charcoal/40 font-medium">
            Entrez votre numéro WhatsApp pour consulter vos suivis de livraison
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Formulaire de recherche */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Numéro WhatsApp (ex: 66 00 00 00)"
                required
                className="w-full px-6 py-5 border border-sand focus:border-gold outline-none bg-white transition-colors text-charcoal font-light placeholder-charcoal/30 text-sm rounded-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !phone.trim()}
              className="bg-charcoal text-white px-10 py-5 text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-gold hover:text-charcoal transition-colors duration-300 disabled:opacity-50 min-w-[160px] rounded-sm"
            >
              {loading ? "Recherche..." : "Rechercher"}
            </button>
          </form>
        </div>

        {/* Résultats simulés */}
        {searched && !loading && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white border border-sand/40 rounded-sm p-6 shadow-sm">
                <h3 className="text-xl font-serif font-light text-charcoal mb-4">Aucune commande active</h3>
                <p className="text-charcoal/50 font-light text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                  Nous n'avons trouvé aucune commande récente liée à ce numéro WhatsApp. Vérifiez la saisie ou contactez-nous.
                </p>
                <Link
                  href="/produits"
                  className="inline-block border border-sand text-charcoal px-8 py-4 text-[9px] tracking-[0.2em] uppercase font-semibold hover:border-charcoal hover:bg-charcoal/5 transition-all duration-300 rounded-sm"
                >
                  Découvrir la collection
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusInfo = getStatusLabel(order.status);
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <div 
                      key={order.id} 
                      className="bg-white border border-sand/40 rounded-sm shadow-sm overflow-hidden transition-all duration-300"
                    >
                      {/* Top Summary */}
                      <div 
                        onClick={() => toggleOrderExpand(order.id)}
                        className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-sand/5"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-serif font-semibold text-charcoal text-base">{order.order_number}</span>
                            <span className={`text-[8px] uppercase tracking-widest font-semibold px-2 py-0.5 border rounded-xs ${statusInfo.classes}`}>
                              {statusInfo.text}
                            </span>
                          </div>
                          <p className="text-xs text-charcoal/40 font-light">Commandé le {formatDate(order.created_at)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-sand/20 pt-4 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <p className="text-[8px] uppercase tracking-widest text-charcoal/40">Total</p>
                            <p className="text-base font-serif font-semibold text-charcoal">{formatPrice(order.total)}</p>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
                        </div>
                      </div>

                      {/* Detail block */}
                      {isExpanded && (
                        <div className="border-t border-sand/30 p-6 bg-sand/5 animate-fade-in space-y-6">
                          <div>
                            <h4 className="text-[9px] uppercase tracking-[0.2em] font-semibold text-gold mb-3">Détails de Livraison</h4>
                            <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                              <strong>Client:</strong> {order.client_name} <br />
                              <strong>Adresse:</strong> {order.client_address}, {order.client_city} <br />
                              <strong>WhatsApp:</strong> {order.client_phone}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-[9px] uppercase tracking-[0.2em] font-semibold text-gold mb-3">Articles Commandés</h4>
                            <div className="space-y-3">
                              {order.items && Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                  <span className="text-charcoal/70 font-light">{item.product_title} <span className="text-charcoal/40 font-medium">x{item.quantity}</span></span>
                                  <span className="text-charcoal/90 font-medium">{formatPrice(item.subtotal)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-sand/30 pt-4 space-y-2 text-xs">
                            <div className="flex justify-between text-charcoal/50 font-light">
                              <span>Sous-total</span>
                              <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-charcoal/50 font-light">
                              <span>Frais de livraison</span>
                              <span>{formatPrice(order.shipping_fee)}</span>
                            </div>
                            <div className="flex justify-between font-medium text-charcoal pt-2 border-t border-sand/20">
                              <span className="text-[9px] uppercase tracking-widest font-semibold">Total</span>
                              <span>{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Info supplémentaire */}
        <div className="mt-24 text-center space-y-4">
          <p className="text-[9px] uppercase tracking-[0.2em] text-charcoal/40 font-semibold">
            Besoin d'assistance ?
          </p>
          <a
            href="https://wa.me/23562752105"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-charcoal text-[10px] uppercase tracking-[0.2em] font-semibold border-b border-charcoal/20 pb-1 hover:text-gold hover:border-gold hover:border-gold/30 transition-all duration-300"
          >
            Discuter avec une conseillère
          </a>
        </div>
      </div>
    </div>
  );
}
