"use client";

import Link from "next/link";
import { X, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col md:items-center md:pt-24">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-cream/95 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Box */}
      <div className="relative z-[201] w-full md:max-w-3xl bg-white border-b md:border border-sand shadow-[0_10px_40px_rgba(26,26,26,0.06)] flex flex-col animate-in fade-in slide-in-from-top-4 duration-500 rounded-sm">
        
        {/* Input area */}
        <div className="flex items-center gap-4 px-6 py-6 border-b border-sand/40">
          <Search className="w-[18px] h-[18px] text-charcoal/40" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un soin, un ingrédient..."
            className="flex-1 bg-transparent outline-none text-base font-light text-charcoal placeholder:text-charcoal/30 w-full"
          />
          {query ? (
            <button onClick={() => setQuery("")} className="text-charcoal/40 hover:text-gold transition-colors">
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          ) : (
            <kbd className="hidden md:inline-block px-2.5 py-1 text-[8px] font-mono tracking-widest text-charcoal/40 border border-sand uppercase rounded-xs">
              ESC
            </kbd>
          )}
          <button onClick={onClose} className="md:hidden text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal">
            Fermer
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {!query ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-charcoal/40 text-xs font-light">Saisissez un terme de recherche...</p>
              <div className="flex justify-center gap-3 pt-2">
                {["Chebe", "Sérum", "Karité"].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-[9px] uppercase tracking-widest px-3.5 py-1.5 border border-sand hover:border-gold hover:text-gold text-charcoal/60 transition-colors rounded-full"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-2">
              <p className="text-lg font-serif font-light text-charcoal">Aucun résultat pour "{query}"</p>
              <p className="text-xs text-charcoal/40 font-light">Essayez avec un autre mot-clé ou catégorie.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4.5 bg-sand/10 border-t border-sand/40 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.2em] text-charcoal/40 font-semibold">
            Collection Botanique
          </span>
          <Link 
            href="/produits" 
            onClick={onClose}
            className="text-[9px] uppercase tracking-widest text-charcoal font-semibold border-b border-transparent hover:border-gold hover:text-gold transition-colors pb-0.5"
          >
            Explorer la boutique
          </Link>
        </div>

      </div>
    </div>
  );
}
