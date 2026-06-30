"use client";

import Link from "next/link";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

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
            Votre Panier ({itemCount})
          </h2>
          <button onClick={onClose} className="p-2 text-charcoal/45 hover:text-gold transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-12">
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
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex gap-4 border-b border-sand/30 pb-6 items-center">
                  <div className="w-16 h-20 bg-white relative border border-sand/30 rounded-xs overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <span className="text-[8px] font-semibold text-gold uppercase tracking-[0.2em]">{item.product.category}</span>
                    <h3 className="text-charcoal font-serif text-sm font-medium mt-0.5 truncate max-w-[180px]">{item.product.title}</h3>
                    <p className="text-charcoal/80 font-medium text-xs mt-1">{formatPrice(item.product.price)}</p>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center border border-sand w-24 bg-white mt-3 rounded-xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 text-charcoal/40 hover:text-charcoal transition-colors flex items-center justify-center font-light text-xs"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="flex-1 text-center text-charcoal font-light text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 text-charcoal/40 hover:text-charcoal transition-colors flex items-center justify-center font-light text-xs"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-charcoal/30 hover:text-red-500 transition-colors self-center"
                    aria-label="Retirer du panier"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-sand/30 p-6 bg-sand/15">
          <div className="flex justify-between items-center mb-4 text-charcoal">
            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-charcoal/40">Total Estimé</span>
            <span className="text-2xl font-serif">{formatPrice(subtotal)}</span>
          </div>
          <p className="text-[11px] text-charcoal/40 font-light mb-6">
            Les frais de livraison seront ajustés lors de la finalisation WhatsApp.
          </p>
          <Link
            href="/commander"
            onClick={onClose}
            className={`w-full block text-center bg-charcoal text-white px-8 py-4.5 text-[9px] uppercase tracking-[0.25em] font-semibold hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-md ${
              cartItems.length === 0 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Finaliser la commande
          </Link>
        </div>

      </div>
    </>
  );
}
