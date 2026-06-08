"use client";

import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50/30 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-light text-charcoal mb-12 text-center md:text-left">Finaliser la commande</h1>
        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Formulaire */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="bg-white p-6 md:p-10 border border-gray-100">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-8 pb-4 border-b border-gray-100">
                1. Vos coordonnées
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-charcoal mb-2">Nom complet *</label>
                  <input type="text" className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-charcoal transition-colors font-light text-sm" placeholder="Ex: Adoum Mahamat" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-charcoal mb-2">Numéro WhatsApp *</label>
                  <input type="tel" className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-charcoal transition-colors font-light text-sm" placeholder="Ex: 66 00 00 00" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-charcoal mb-2">Quartier / Ville *</label>
                  <input type="text" className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-charcoal transition-colors font-light text-sm" placeholder="Ex: N'Djamena, Quartier..." />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-10 border border-gray-100">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-8 pb-4 border-b border-gray-100">
                2. Paiement
              </h2>
              <div className="border border-charcoal p-6 text-center">
                <p className="text-charcoal font-medium text-sm mb-2">Paiement à la livraison</p>
                <p className="text-gray-400 font-light text-xs">Vous paierez en espèces lors de la réception de votre commande.</p>
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white p-6 md:p-8 border border-gray-100">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6 pb-4 border-b border-gray-100">
                Récapitulatif
              </h2>
              
              <div className="space-y-6 mb-8">
                {/* Exemple d'article */}
                <div className="flex gap-4">
                  <div className="w-16 h-20 bg-gray-50 relative border border-gray-100 flex-shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                      alt="Produit"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-charcoal font-serif text-sm">Huile de Chebe</h3>
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-1">Qté: 1</p>
                    <p className="text-charcoal font-medium text-sm mt-1">15 000 FCFA</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4 mb-8">
                <div className="flex justify-between text-sm text-gray-500 font-light">
                  <span>Sous-total</span>
                  <span>15 000 FCFA</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-light">
                  <span>Livraison</span>
                  <span>Calculée à l'étape suivante</span>
                </div>
                <div className="flex justify-between text-charcoal pt-4 border-t border-gray-100">
                  <span className="text-[10px] uppercase tracking-widest font-medium mt-1">Total estimé</span>
                  <span className="text-2xl font-serif">15 000 FCFA</span>
                </div>
              </div>

              <button className="w-full bg-charcoal text-white py-5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors">
                Confirmer la commande
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest text-gray-400">
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
