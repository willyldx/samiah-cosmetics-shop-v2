"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? "bg-white/95 backdrop-blur-sm border-gray-100 py-3" : "bg-white border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
          <Link href="/" className="flex-shrink-0 relative w-32 h-10">
            <Image 
              src="/logo.png" 
              alt="Samiah Cosmetics Logo" 
              fill
              className="object-contain"
              priority
            />
          </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              <Link href="/" className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-charcoal border-b border-transparent hover:border-charcoal transition-all pb-1">
                Accueil
              </Link>
              <Link href="/produits" className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-charcoal border-b border-transparent hover:border-charcoal transition-all pb-1">
                Boutique
              </Link>
              <Link href="/a-propos" className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-charcoal border-b border-transparent hover:border-charcoal transition-all pb-1">
                À Propos
              </Link>
              <Link href="/suivi" className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-charcoal border-b border-transparent hover:border-charcoal transition-all pb-1">
                Suivi
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-6">
              <button onClick={() => setIsSearchOpen(true)} aria-label="Rechercher" className="text-gray-400 hover:text-charcoal transition-colors">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button onClick={() => setIsCartOpen(true)} aria-label="Panier" className="relative text-gray-400 hover:text-charcoal transition-colors">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1.5 flex h-3.5 w-3.5 items-center justify-center bg-charcoal text-white text-[8px] font-bold">
                  0
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-gray-400 hover:text-charcoal transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals & Drawers */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
