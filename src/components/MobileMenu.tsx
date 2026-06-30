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
        className="fixed inset-0 bg-cream z-[150] flex flex-col animate-in fade-in slide-in-from-top duration-300"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand/30">
          <Link href="/" onClick={onClose} className="relative w-32 h-8">
            <Image 
              src="/logo.png" 
              alt="Samiah Cosmetics Logo" 
              fill
              className="object-contain"
            />
          </Link>
          <button onClick={onClose} className="p-2 text-charcoal hover:text-gold transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-12 px-8 flex flex-col justify-center">
          <nav className="flex flex-col space-y-8 items-center text-center">
            {["Accueil", "Boutique", "À Propos", "Suivi"].map((item, index) => {
              const paths = ["/", "/produits", "/a-propos", "/suivi"];
              return (
                <Link 
                  key={item}
                  href={paths[index]} 
                  onClick={onClose}
                  className="text-2xl font-serif text-charcoal hover:text-gold transition-colors tracking-wide"
                >
                  {item}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-8 bg-sand/20 border-t border-sand/30">
          <div className="space-y-6">
            <a 
              href="https://wa.me/23562752105" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-charcoal text-white text-center py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors duration-300"
            >
              Contact WhatsApp
            </a>
            <div className="flex justify-center space-x-6 text-[9px] uppercase tracking-widest text-charcoal/40">
              <a href="#" className="hover:text-gold transition-colors duration-300">Instagram</a>
              <a href="#" className="hover:text-gold transition-colors duration-300">Facebook</a>
              <a href="#" className="hover:text-gold transition-colors duration-300">TikTok</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
