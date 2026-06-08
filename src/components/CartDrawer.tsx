"use client";

import Link from "next/link";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-[100] transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-[101] w-full sm:w-[400px] bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-sm font-serif text-charcoal uppercase tracking-[0.2em] flex items-center gap-3">
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
            Votre Panier (0)
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-charcoal transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
          {/* Empty State */}
          <div className="w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-300">
            <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <p className="text-charcoal font-serif text-xl mb-2">Votre panier est vide</p>
          <p className="text-gray-400 text-sm font-light mb-8 text-center max-w-[250px]">
            Découvrez nos collections et commencez votre routine beauté naturelle.
          </p>
          <Link
            href="/produits"
            onClick={onClose}
            className="border border-charcoal text-charcoal px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-charcoal hover:text-white transition-colors"
          >
            Découvrir nos soins
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
          <div className="flex justify-between items-center mb-6 text-charcoal">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500">Total</span>
            <span className="text-2xl font-serif">0 FCFA</span>
          </div>
          <p className="text-xs text-gray-400 font-light mb-6">
            Les frais de livraison seront calculés à l'étape suivante.
          </p>
          <Link
            href="/commander"
            onClick={onClose}
            className="w-full block text-center bg-charcoal text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors opacity-50 pointer-events-none"
          >
            Finaliser la commande
          </Link>
        </div>

      </div>
    </>
  );
}
