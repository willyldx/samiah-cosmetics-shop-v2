"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-white z-[150] flex flex-col animate-in slide-in-from-top duration-300"
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
          <Link href="/" onClick={onClose} className="relative w-32 h-8">
            <Image 
              src="/logo.png" 
              alt="Samiah Cosmetics Logo" 
              fill
              className="object-contain"
            />
          </Link>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-charcoal transition-colors">
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-6">
          <nav className="flex flex-col space-y-6">
            <Link 
              href="/" 
              onClick={onClose}
              className="text-2xl font-serif text-charcoal hover:text-gold transition-colors"
            >
              Accueil
            </Link>
            <div className="h-px bg-gray-100 w-12" />
            
            <Link 
              href="/produits" 
              onClick={onClose}
              className="text-2xl font-serif text-charcoal hover:text-gold transition-colors flex items-center justify-between"
            >
              Boutique
            </Link>
            <div className="h-px bg-gray-100 w-12" />
            
            <Link 
              href="/a-propos" 
              onClick={onClose}
              className="text-2xl font-serif text-charcoal hover:text-gold transition-colors"
            >
              À Propos
            </Link>
            <div className="h-px bg-gray-100 w-12" />
            
            <Link 
              href="/suivi" 
              onClick={onClose}
              className="text-2xl font-serif text-charcoal hover:text-gold transition-colors"
            >
              Suivi de Commande
            </Link>
          </nav>
        </div>

        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
          <div className="space-y-4">
            <a 
              href="https://wa.me/23566000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full border border-charcoal text-charcoal text-center py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-charcoal hover:text-white transition-colors"
            >
              Contact WhatsApp
            </a>
            <div className="flex justify-center space-x-6 pt-4 text-[10px] uppercase tracking-widest text-gray-400">
              <a href="#" className="hover:text-charcoal transition-colors">Instagram</a>
              <a href="#" className="hover:text-charcoal transition-colors">Facebook</a>
              <a href="#" className="hover:text-charcoal transition-colors">TikTok</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
