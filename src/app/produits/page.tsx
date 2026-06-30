"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

export default function ProduitsPage() {
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [sortBy, setSortBy] = useState("default");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["tous"]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("active", true)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Erreur de chargement des produits:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const cats = new Set<string>();
      products.forEach(p => {
        if (p.category) cats.add(p.category);
      });
      setCategories(["tous", ...Array.from(cats).sort()]);
    }
  }, [products]);

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

  // Helper to determine if a product is new (within 7 days)
  const isNewProduct = (dateStr: string) => {
    if (!dateStr) return false;
    const created = Date.parse(dateStr);
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return (Date.now() - created) <= sevenDays;
  };

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

        <div className="flex flex-wrap gap-3 mb-16 border-b border-sand/10 pb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 text-[9px] uppercase tracking-[0.2em] font-semibold rounded-full border transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-transparent text-charcoal/60 border-sand hover:text-charcoal hover:border-charcoal/40"
              }`}
            >
              {cat === "tous" ? "Toutes les catégories" : cat}
            </button>
          ))}
        </div>

        {/* Count & Status */}
        <div className="mb-8 flex justify-between items-center text-[10px] uppercase tracking-widest text-charcoal/45">
          <span>{loading ? "Chargement..." : `${sortedProducts.length} produits trouvés`}</span>
        </div>

        {/* Loading State Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="animate-pulse flex flex-col space-y-4">
                <div className="aspect-[4/5] bg-sand/30 rounded-sm w-full" />
                <div className="h-4 bg-sand/30 rounded-sm w-2/3 mx-auto" />
                <div className="h-3 bg-sand/30 rounded-sm w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-24 border border-sand/40 rounded-sm">
            <p className="text-lg font-serif font-light text-charcoal mb-2">Aucun produit trouvé</p>
            <p className="text-xs text-charcoal/40 font-light">Essayez de sélectionner une autre catégorie.</p>
          </div>
        ) : (
          /* Grille Produits */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map(product => (
              <div key={product.id} className="animate-fade-in">
                <ProductCard product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                  isNew: isNewProduct(product.created_at)
                }} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
