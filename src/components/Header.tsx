"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount, isCartOpen, setIsCartOpen } = useCart();

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-cream/80 backdrop-blur-md border-b border-sand py-4 shadow-[0_4px_30px_rgba(26,26,26,0.02)]" 
            : "bg-transparent border-b border-transparent py-7"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative w-36 h-10 transition-transform duration-300 hover:scale-[1.02]">
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
              {["Accueil", "Boutique", "À Propos", "Suivi"].map((item, index) => {
                const paths = ["/", "/produits", "/a-propos", "/suivi"];
                return (
                  <Link 
                    key={item}
                    href={paths[index]} 
                    className="text-[10px] uppercase tracking-[0.25em] font-medium text-charcoal/60 hover:text-charcoal transition-all relative py-1.5 group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-gold group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out" />
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setIsSearchOpen(true)} 
                aria-label="Rechercher" 
                className="text-charcoal/70 hover:text-gold transition-colors duration-300 p-1"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              
              <button 
                onClick={() => setIsCartOpen(true)} 
                aria-label="Panier" 
                className="relative text-charcoal/70 hover:text-gold transition-colors duration-300 p-1 group"
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                <span className="absolute -top-1.5 -right-2 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-gold text-white text-[8px] font-bold group-hover:scale-115 transition-transform duration-300">
                  {itemCount}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-charcoal/70 hover:text-charcoal transition-colors duration-300 p-1"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" strokeWidth={1.5} />
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
