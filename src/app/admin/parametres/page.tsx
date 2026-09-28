"use client";

import { useEffect, useState } from "react";
import { 
  Settings, 
  Database, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ShieldCheck,
  Phone,
  RefreshCw
} from "lucide-react";
import { fetchAdminData, AdminStats } from "@/lib/admin-data";

export default function AdminSettingsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const loadDiagnostics = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminData();
      setStats(data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isConnected = stats?.supabaseStatus === "connected";

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-charcoal tracking-tight">Paramètres</h1>
          <p className="text-sm text-gray-500 mt-1">Configuration générale et état des passerelles Samiah</p>
        </div>
        <button
          onClick={loadDiagnostics}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Tester la connexion
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Paramètres sauvegardés avec succès.</span>
        </div>
      )}

      {/* Supabase Connection Status (Dynamic) */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isConnected ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-charcoal">Base de données & API (Supabase)</h2>
              <p className="text-xs text-gray-500">Synchronisation en direct avec la table produits et commandes</p>
            </div>
          </div>

          <div>
            {loading ? (
              <span className="text-xs text-gray-400">Vérification...</span>
            ) : isConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connecté (200 OK)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                Action requise
              </span>
            )}
          </div>
        </div>

        {isConnected ? (
          <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-4 text-xs space-y-2 text-emerald-900">
            <div className="flex items-center gap-2 font-semibold text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Vos clés Supabase sont valides et actives !</span>
            </div>
            <p className="font-light text-emerald-800 leading-relaxed">
              Le backoffice communique parfaitement avec votre projet Supabase. Vos produits et commandes réels sont synchronisés en direct.
            </p>
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-900 font-mono">
              <div>Projet : <span className="font-sans font-medium text-emerald-950">dzzblqlteirtzyegplgu.supabase.co</span></div>
              <div>Produits en ligne : <span className="font-sans font-medium text-emerald-950">{stats?.activeProductsCount ?? 0}</span></div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-4 text-xs space-y-2 text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Clés API Supabase à renouveler</span>
            </div>
            <p className="font-light leading-relaxed">
              Pour rétablir la synchronisation en temps réel avec votre projet Supabase distant :
            </p>
            <ol className="list-decimal pl-5 space-y-1 font-light">
              <li>Connectez-vous sur votre console <strong className="font-medium">Supabase &gt; Project Settings &gt; API</strong>.</li>
              <li>Réactivez les clés existantes ("Re-enable legacy API keys") ou copiez la nouvelle clé <strong className="font-medium">Publishable Key</strong>.</li>
              <li>Mettez à jour <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans vos variables d'environnement Vercel.</li>
            </ol>
          </div>
        )}
      </div>

      {/* Payment Gateway: Kadryza */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-charcoal">Passerelle Paiement (Kadryza Mobile Money)</h2>
            <p className="text-xs text-gray-500">Airtel Money & Moov Money Tchad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block mb-1">Passerelle Kadryza Hosted Checkout</span>
            <span className="font-medium text-charcoal">Intégration v1 (Prête)</span>
          </div>
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block mb-1">Moyens de paiement acceptés</span>
            <span className="font-medium text-charcoal">Paiement à la livraison (Cash) + Mobile Money</span>
          </div>
        </div>
      </div>

      {/* Shipping & Delivery settings */}
      <form onSubmit={handleSave} className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-charcoal">Tarifs de Livraison (FCFA)</h2>
            <p className="text-xs text-gray-500">Frais appliqués automatiquement lors du checkout</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-gray-600 font-medium mb-1.5">N'Djamena</label>
            <input
              type="number"
              defaultValue={1000}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1.5">Moundou</label>
            <input
              type="number"
              defaultValue={2500}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1.5">Sarh / Autres villes</label>
            <input
              type="number"
              defaultValue={3000}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-charcoal text-white hover:bg-charcoal/90 text-xs font-medium transition-colors"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>

      {/* Support & Contact */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-charcoal">
          <Phone className="w-4 h-4 text-gold" />
          <span>Assistance & Support Samiah</span>
        </div>
        <p className="text-xs text-gray-500 font-light">
          Pour toute demande technique ou mise à jour de la configuration de production, contactez l'assistance WhatsApp au <strong className="font-medium text-charcoal">+235 62 75 21 05</strong>.
        </p>
      </div>
    </div>
  );
}
