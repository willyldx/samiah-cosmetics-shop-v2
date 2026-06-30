"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProduitsPage() {
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [sortBy, setSortBy] = useState("default");

  const products = [
    {
      id: "1",
      title: "Huile de Chebe Authentique",
      price: 15000,
      category: "Soins Capillaires",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      isNew: true
    },
    {
      id: "2",
      title: "Sérum Visage Éclat",
      price: 12500,
      category: "Soins Visage",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80"
    },
    {
      id: "3",
      title: "Beurre de Karité Pur",
      price: 8000,
      category: "Soins Corps",
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80"
    },
    {
      id: "4",
      title: "Masque Capillaire Intense",
      price: 18000,
      category: "Soins Capillaires",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
      isNew: true
    },
    {
      id: "5",
      title: "Crème Visage Hydratante",
      price: 14500,
      category: "Soins Visage",
      image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&q=80"
    },
    {
      id: "6",
      title: "Shampoing Fortifiant Chebe",
      price: 9500,
      category: "Soins Capillaires",
      image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80"
    },
    {
      id: "7",
      title: "Gommage Corps Éclat",
      price: 11000,
      category: "Soins Corps",
      image: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?w=800&q=80"
    },
    {
      id: "8",
      title: "Lait Hydratant Précieux",
      price: 13500,
      category: "Soins Corps",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80"
    }
  ];

  const categories = [
    { id: "tous", label: "Toutes les catégories" },
    { id: "Soins Capillaires", label: "Soins Capillaires" },
    { id: "Soins Visage", label: "Soins Visage" },
    { id: "Soins Corps", label: "Soins Corps" }
  ];

  // Filtering
  const filteredProducts = products.filter(product => {
    if (selectedCategory === "tous") return true;
    return product.category === selectedCategory;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "alpha") return a.title.localeCompare(b.title);
    return 0; // Default
  });

  return (
    <div className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Catalogue */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8 mb-16 border-b border-sand/40 pb-10">
          <div className="space-y-4">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold">La Boutique</span>
            <h1 className="text-4xl lg:text-5xl font-serif font-light text-charcoal">La Collection Samiah</h1>
            <p className="text-sm font-light text-charcoal/50">Explorez notre sélection méticuleuse d'essentiels botaniques.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto items-start sm:items-center">
            {/* Sorting dropdown */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[9px] uppercase tracking-widest text-charcoal/40 font-medium">Trier par:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-b border-sand text-charcoal text-[10px] uppercase tracking-[0.2em] py-2 outline-none cursor-pointer focus:border-gold transition-colors flex-1 sm:flex-none"
              >
                <option value="default">Par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="alpha">Ordre alphabétique</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-3 mb-16 border-b border-sand/10 pb-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 text-[9px] uppercase tracking-[0.2em] font-semibold rounded-full border transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-transparent text-charcoal/60 border-sand hover:text-charcoal hover:border-charcoal/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="mb-8 flex justify-between items-center text-[10px] uppercase tracking-widest text-charcoal/45">
          <span>{sortedProducts.length} produits trouvés</span>
        </div>

        {/* Grille Produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map(product => (
            <div key={product.id} className="animate-fade-in">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
