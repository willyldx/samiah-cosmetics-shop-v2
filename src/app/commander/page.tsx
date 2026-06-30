"use client";

import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="space-y-4 mb-16 text-center lg:text-left">
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold">Finaliser</span>
          <h1 className="text-4xl lg:text-5xl font-serif font-light text-charcoal">Votre Commande</h1>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Formulaire */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 animate-fade-in-up">
            <div className="bg-white p-8 md:p-12 border border-sand/40 rounded-sm shadow-[0_4px_25px_rgba(26,26,26,0.02)]">
              <h2 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-gold mb-8 pb-4 border-b border-sand/30">
                1. Vos coordonnées
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-charcoal font-semibold mb-2">Nom complet *</label>
                  <input type="text" className="w-full border border-sand px-4 py-3.5 bg-cream/30 focus:bg-white focus:border-gold outline-none transition-all font-light text-sm rounded-sm" placeholder="Ex: Adoum Mahamat" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-charcoal font-semibold mb-2">Numéro WhatsApp *</label>
                  <input type="tel" className="w-full border border-sand px-4 py-3.5 bg-cream/30 focus:bg-white focus:border-gold outline-none transition-all font-light text-sm rounded-sm" placeholder="Ex: 66 00 00 00" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[9px] uppercase tracking-widest text-charcoal font-semibold mb-2">Quartier / Ville *</label>
                  <input type="text" className="w-full border border-sand px-4 py-3.5 bg-cream/30 focus:bg-white focus:border-gold outline-none transition-all font-light text-sm rounded-sm" placeholder="Ex: N'Djamena, Quartier..." />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 border border-sand/40 rounded-sm shadow-[0_4px_25px_rgba(26,26,26,0.02)]">
              <h2 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-gold mb-8 pb-4 border-b border-sand/30">
                2. Paiement
              </h2>
              <div className="border border-gold p-6 text-center bg-sand/10 rounded-sm">
                <p className="text-charcoal font-semibold text-xs uppercase tracking-widest mb-1.5">Paiement à la livraison</p>
                <p className="text-charcoal/50 font-light text-xs">Vous paierez en espèces lors de la réception de votre commande.</p>
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white p-6 md:p-8 border border-sand/40 rounded-sm shadow-[0_4px_25px_rgba(26,26,26,0.02)]">
              <h2 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-gold mb-6 pb-4 border-b border-sand/30">
                Récapitulatif
              </h2>
              
              <div className="space-y-6 mb-8">
                {/* Exemple d'article */}
                <div className="flex gap-4">
                  <div className="w-16 h-20 bg-cream relative border border-sand/30 rounded-xs overflow-hidden flex-shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                      alt="Produit"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-charcoal font-serif text-sm font-medium">Huile de Chebe</h3>
                    <p className="text-charcoal/40 text-[9px] uppercase tracking-widest mt-1">Qté: 1</p>
                    <p className="text-charcoal/80 font-medium text-sm mt-1.5">15 000 FCFA</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-sand/30 pt-6 space-y-4 mb-8">
                <div className="flex justify-between text-xs text-charcoal/50 font-light">
                  <span>Sous-total</span>
                  <span className="font-medium text-charcoal/80">15 000 FCFA</span>
                </div>
                <div className="flex justify-between text-xs text-charcoal/50 font-light">
                  <span>Livraison</span>
                  <span className="italic">Calculée à l'étape suivante</span>
                </div>
                <div className="flex justify-between items-end text-charcoal pt-4 border-t border-sand/30">
                  <span className="text-[9px] uppercase tracking-widest font-semibold pb-1">Total estimé</span>
                  <span className="text-2xl font-serif text-charcoal/90">15 000 FCFA</span>
                </div>
              </div>

              <button className="w-full bg-charcoal text-white py-5 text-[9px] uppercase tracking-[0.25em] font-semibold hover:bg-gold hover:text-charcoal transition-all duration-500 rounded-sm shadow-lg shadow-charcoal/5">
                Confirmer la commande
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-[8px] uppercase tracking-widest text-charcoal/40 font-semibold">
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
