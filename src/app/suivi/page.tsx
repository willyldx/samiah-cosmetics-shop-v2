"use client";

import { useState } from "react";
import Link from "next/link";

export default function SuiviPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1000);
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
        )}

        {/* Info supplémentaire */}
        <div className="mt-24 text-center space-y-4">
          <p className="text-[9px] uppercase tracking-[0.2em] text-charcoal/40 font-semibold">
            Besoin d'assistance ?
          </p>
          <a
            href="https://wa.me/23566000000"
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
