"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Search, 
  Check, 
  X, 
  ExternalLink,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { fetchAdminData, AdminProduct } from "@/lib/admin-data";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminData();
      setProducts(data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleProductActive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, active: !p.active } : p))
    );
  };

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-charcoal tracking-tight">Catalogue Produits</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez la visibilité et les prix des soins botaniques Samiah</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
          <Link
            href="/produits"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-charcoal text-white hover:bg-charcoal/90 transition-colors shadow-2xs"
          >
            Voir la boutique
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-gray-200/80 rounded-xl shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un produit, une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? "bg-charcoal text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat === "all" ? "Toutes les catégories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-[11px] uppercase tracking-wider font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-3.5">Produit</th>
                <th className="px-6 py-3.5">Catégorie</th>
                <th className="px-6 py-3.5">Prix Boutique</th>
                <th className="px-6 py-3.5">Disponibilité</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-light">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sand/20 flex items-center justify-center text-charcoal border border-sand/30 flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal text-sm">{product.title}</p>
                        <p className="text-[11px] text-gray-400 font-mono">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-charcoal">
                    {product.price.toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="px-6 py-4">
                    {product.active ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3 h-3" />
                        Actif en ligne
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                        <X className="w-3 h-3" />
                        Désactivé
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleProductActive(product.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        product.active
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {product.active ? "Désactiver" : "Activer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
