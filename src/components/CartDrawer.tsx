"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-charcoal/45 backdrop-blur-[3px] z-[100] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[101] w-full sm:w-[420px] bg-cream shadow-[0_0_50px_rgba(26,26,26,0.08)] flex flex-col border-l border-sand/30 animate-in slide-in-from-right duration-500 ease-out">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-sand/30 flex items-center justify-between">
          <h2 className="text-[10px] font-semibold text-charcoal uppercase tracking-[0.25em] flex items-center gap-3">
            <ShoppingBag className="w-4 h-4 text-gold" strokeWidth={1.5} />
            Votre Panier (0)
          </h2>
          <button onClick={onClose} className="p-2 text-charcoal/45 hover:text-gold transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
          {/* Empty State */}
          <div className="w-16 h-16 border border-sand rounded-full flex items-center justify-center mb-6 text-gold/60">
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <p className="text-charcoal font-serif text-xl mb-2">Votre panier est vide</p>
          <p className="text-charcoal/45 text-sm font-light mb-8 max-w-[260px] leading-relaxed">
            Prenez soin de vous en adoptant un rituel de soin naturel d'exception.
          </p>
          <Link
            href="/produits"
            onClick={onClose}
            className="bg-charcoal text-white px-8 py-4.5 text-[9px] uppercase tracking-[0.25em] font-semibold hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-md"
          >
            Explorer la boutique
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-sand/30 p-6 bg-sand/15">
          <div className="flex justify-between items-center mb-4 text-charcoal">
            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-charcoal/40">Total Estimé</span>
            <span className="text-2xl font-serif">0 FCFA</span>
          </div>
          <p className="text-[11px] text-charcoal/40 font-light mb-6">
            Les frais de livraison seront ajustés lors de la finalisation WhatsApp.
          </p>
          <Link
            href="/commander"
            onClick={onClose}
            className="w-full block text-center bg-charcoal text-white px-8 py-4.5 text-[9px] uppercase tracking-[0.25em] font-semibold hover:bg-gold hover:text-charcoal transition-all duration-300 opacity-55 pointer-events-none"
          >
            Finaliser la commande
          </Link>
        </div>

      </div>
    </>
  );
}
