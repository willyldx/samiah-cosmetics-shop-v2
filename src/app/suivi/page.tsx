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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl lg:text-4xl font-serif font-light text-charcoal mb-4">
            Suivre ma commande
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
            Entrez votre numéro pour consulter vos suivis
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
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
                className="w-full px-6 py-5 border border-gray-200 focus:border-charcoal outline-none transition-colors text-charcoal font-light placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !phone.trim()}
              className="bg-charcoal text-white px-10 py-5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors disabled:opacity-50 min-w-[160px]"
            >
              {loading ? "Recherche..." : "Rechercher"}
            </button>
          </form>
        </div>

        {/* Résultats simulés */}
        {searched && !loading && (
          <div className="text-center py-16 border border-gray-100">
            <h3 className="text-xl font-serif font-light text-charcoal mb-4">Aucune commande active</h3>
            <p className="text-gray-400 font-light text-sm mb-8">
              Vérifiez le numéro saisi ou explorez notre collection.
            </p>
            <Link
              href="/produits"
              className="inline-block border border-gray-200 text-charcoal px-8 py-4 text-[10px] tracking-[0.2em] uppercase font-medium hover:border-charcoal transition-colors"
            >
              Découvrir la collection
            </Link>
          </div>
        )}

        {/* Info supplémentaire */}
        <div className="mt-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
            Besoin d'assistance ?
          </p>
          <a
            href="https://wa.me/23566000000"
            target="_blank"
            rel="noopener noreferrer"
            className="text-charcoal text-[10px] uppercase tracking-[0.2em] border-b border-charcoal pb-1 hover:text-gold hover:border-gold transition-colors"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  );
}
