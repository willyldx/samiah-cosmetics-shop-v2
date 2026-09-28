"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  ChevronRight,
  Package,
  MessageCircle,
  RefreshCw,
  Save,
  FileText,
  Send
} from "lucide-react";
import { fetchAdminData, updateAdminOrder, AdminOrder } from "@/lib/admin-data";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [currentNotes, setCurrentNotes] = useState("");
  const [savingOrder, setSavingOrder] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminData();
      setOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSelectOrder = (order: AdminOrder) => {
    setSelectedOrder(order);
    setCurrentNotes(order.notes || "");
    setSaveSuccess(false);
  };

  const handleStatusChange = (newStatus: AdminOrder["status"]) => {
    if (!selectedOrder) return;
    setSelectedOrder({ ...selectedOrder, status: newStatus });
  };

  const handleSaveOrderChanges = async () => {
    if (!selectedOrder) return;
    setSavingOrder(true);
    try {
      await updateAdminOrder(selectedOrder.id, {
        status: selectedOrder.status,
        notes: currentNotes,
      });

      // Update in local list
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, status: selectedOrder.status, notes: currentNotes }
            : o
        )
      );

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingOrder(false);
    }
  };

  const generateWhatsAppUrl = () => {
    if (!selectedOrder) return "#";
    const cleanPhone = selectedOrder.client_phone.replace(/[^0-9]/g, "");
    const statusLabels: Record<string, string> = {
      pending: "reçue et en attente de traitement",
      processing: "en cours de préparation",
      shipped: "expédiée et en cours de livraison vers votre adresse",
      delivered: "livrée avec succès",
      cancelled: "annulée",
    };
    const statusText = statusLabels[selectedOrder.status] || selectedOrder.status;
    let msg = `Bonjour ${selectedOrder.client_name}, concernant votre commande Samiah Cosmetics n° ${selectedOrder.order_number} : elle est actuellement ${statusText}.`;
    if (currentNotes) {
      msg += `\n\nMessage de la boutique : ${currentNotes}`;
    }
    msg += `\n\nMerci de votre confiance !`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client_phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client_city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-charcoal tracking-tight">Commandes</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez, traitez et communiquez sur les commandes clientes</p>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-gray-200/80 rounded-xl shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par N° commande, client, téléphone, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {[
            { id: "all", label: "Toutes" },
            { id: "pending", label: "En attente" },
            { id: "processing", label: "En préparation" },
            { id: "shipped", label: "Expédiée" },
            { id: "delivered", label: "Livrée" },
            { id: "cancelled", label: "Annulée" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? "bg-charcoal text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={selectedOrder ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/80 border-b border-gray-100 text-[11px] uppercase tracking-wider font-semibold text-gray-500">
                  <tr>
                    <th className="px-5 py-3.5">N° Commande</th>
                    <th className="px-5 py-3.5">Client</th>
                    <th className="px-5 py-3.5">Montant</th>
                    <th className="px-5 py-3.5">Paiement</th>
                    <th className="px-5 py-3.5">Statut</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-light">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        Aucune commande ne correspond à vos critères.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isSelected = selectedOrder?.id === order.id;
                      return (
                        <tr
                          key={order.id}
                          onClick={() => handleSelectOrder(order)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? "bg-amber-50/50" : "hover:bg-gray-50/50"
                          }`}
                        >
                          <td className="px-5 py-4 font-mono font-medium text-charcoal text-xs">
                            {order.order_number}
                            <span className="block text-[10px] text-gray-400 font-sans mt-0.5">
                              {new Date(order.created_at).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {order.notes && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-gold font-sans mt-1 bg-sand/20 px-1.5 py-0.5 rounded">
                                <FileText className="w-3 h-3" />
                                Note présente
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-charcoal text-xs sm:text-sm">{order.client_name}</p>
                            <p className="text-xs text-gray-400">{order.client_city}</p>
                          </td>
                          <td className="px-5 py-4 font-medium text-charcoal text-xs sm:text-sm whitespace-nowrap">
                            {order.total.toLocaleString("fr-FR")} FCFA
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                              order.payment_method === "kadryza"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}>
                              {order.payment_method === "kadryza" ? "Kadryza" : "Cash"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button className="text-gray-400 hover:text-charcoal p-1">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Details Drawer / Card with Status, Notes, and WhatsApp */}
        {selectedOrder && (
          <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-xl shadow-2xs p-5 sm:p-6 space-y-6 self-start sticky top-20 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold">Détails commande</span>
                <h3 className="text-lg font-mono font-bold text-charcoal">{selectedOrder.order_number}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-charcoal text-xs font-semibold px-2 py-1 bg-gray-100 rounded"
              >
                Fermer
              </button>
            </div>

            {saveSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Statut et mot enregistrés avec succès !</span>
              </div>
            )}

            {/* Client Info */}
            <div className="space-y-3 bg-gray-50/70 p-4 rounded-lg border border-gray-100 text-xs">
              <p className="font-semibold text-charcoal text-sm">{selectedOrder.client_name}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{selectedOrder.client_phone}</span>
                <a
                  href={`https://wa.me/${selectedOrder.client_phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Discuter
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{selectedOrder.client_city} — {selectedOrder.client_address}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Articles commandés</p>
              <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-1">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-gold" />
                      <div>
                        <p className="font-medium text-charcoal">{item.product_title || item.productId}</p>
                        <p className="text-gray-400">Qté : {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-charcoal">
                      {((item.product_price || item.price || 0) * item.quantity).toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{selectedOrder.subtotal.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison</span>
                <span>{selectedOrder.shipping_fee.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between font-bold text-charcoal text-sm pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-gold">{selectedOrder.total.toLocaleString("fr-FR")} FCFA</span>
              </div>
            </div>

            {/* Status change actions */}
            <div className="pt-2 space-y-4 border-t border-gray-100">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">
                  Statut de la commande
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as AdminOrder["status"])
                  }
                  className="w-full text-xs font-medium p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gold"
                >
                  <option value="pending">En attente (Nouvelle commande)</option>
                  <option value="processing">En préparation (Colis en cours)</option>
                  <option value="shipped">Expédiée (Remise au livreur)</option>
                  <option value="delivered">Livrée avec succès</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              {/* Note / Mot sur la commande */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">
                  Mot / Note sur la commande
                </label>
                <textarea
                  rows={3}
                  value={currentNotes}
                  onChange={(e) => setCurrentNotes(e.target.value)}
                  placeholder="Écrivez un mot sur cette commande (ex: colis remis au livreur Moussa, rappel à 16h, quartier confirmé...)"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gold leading-relaxed"
                />
              </div>

              {/* Actions buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveOrderChanges}
                  disabled={savingOrder}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-charcoal text-white hover:bg-charcoal/90 text-xs font-medium transition-colors shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5 text-gold" />
                  {savingOrder ? "Enregistrement en cours..." : "Enregistrer la commande"}
                </button>

                {/* WhatsApp button with prefilled custom word/note */}
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-medium transition-colors shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Envoyer ce mot au client sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
