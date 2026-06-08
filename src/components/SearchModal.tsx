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
    <div className="fixed inset-0 z-[200] flex flex-col md:items-center md:pt-16">
      <div 
        className="fixed inset-0 bg-white/95 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative z-[201] w-full md:max-w-3xl bg-white border-b md:border border-gray-200 shadow-sm flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-4 px-6 py-6 border-b border-gray-100">
          <Search className="w-5 h-5 text-charcoal" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="flex-1 bg-transparent outline-none text-lg font-light text-charcoal placeholder:text-gray-300"
          />
          {query ? (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-charcoal transition-colors">
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          ) : (
            <kbd className="hidden md:inline-block px-2 py-1 text-[9px] font-mono tracking-widest text-gray-400 border border-gray-200 uppercase">
              ESC
            </kbd>
          )}
          <button onClick={onClose} className="md:hidden text-gray-400">
            Fermer
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!query ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm font-light mb-6">Saisissez un terme de recherche...</p>
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg font-serif text-charcoal mb-2">Aucun résultat pour "{query}"</p>
              <p className="text-xs text-gray-400 font-light">Essayez avec un autre mot-clé.</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
            Catalogue complet
          </span>
          <Link 
            href="/produits" 
            onClick={onClose}
            className="text-[10px] uppercase tracking-widest text-charcoal border-b border-transparent hover:border-charcoal transition-colors pb-0.5"
          >
            Explorer la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
