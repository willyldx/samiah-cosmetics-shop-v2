"use client";

import { useState } from "react";
import { 
  Settings, 
  Database, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ShieldCheck,
  Phone
} from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-charcoal tracking-tight">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">Configuration générale et passerelles de la boutique Samiah</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Paramètres sauvegardés avec succès.</span>
        </div>
      )}

      {/* Supabase Diagnostics */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-charcoal">Base de données & API (Supabase)</h2>
            <p className="text-xs text-gray-500">Statut de liaison avec les tables products et orders</p>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/70 rounded-lg p-4 text-xs space-y-2 text-amber-900">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Clés API Legacy Supabase désactivées par Supabase</span>
          </div>
          <p className="font-light leading-relaxed">
            Pour rétablir la synchronisation en temps réel avec votre projet Supabase distant :
          </p>
          <ol className="list-decimal pl-5 space-y-1 font-light">
            <li>Connectez-vous sur votre console <strong className="font-medium">Supabase &gt; Project Settings &gt; API</strong>.</li>
            <li>Générez la nouvelle clé <strong className="font-medium">Publishable Key</strong> et la clé <strong className="font-medium">Secret Key (service_role)</strong>.</li>
            <li>Mettez à jour <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> et <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono">SUPABASE_SERVICE_ROLE_KEY</code> dans vos variables d'environnement.</li>
          </ol>
        </div>
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
