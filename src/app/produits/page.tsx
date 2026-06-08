import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function ProduitsPage() {
  // Placeholder data for design purposes
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
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
    },
    {
      id: "3",
      title: "Beurre de Karité Pur",
      price: 8000,
      category: "Soins Corps",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Catalogue */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-serif font-light text-charcoal mb-4">La Collection</h1>
            <p className="text-sm font-light text-gray-400">Découvrez nos essentiels beauté naturels.</p>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto">
            <select className="bg-transparent border-b border-gray-200 text-charcoal text-[10px] uppercase tracking-[0.2em] py-2 outline-none cursor-pointer focus:border-charcoal transition-colors">
              <option value="tous">Toutes les catégories</option>
              <option value="cheveux">Soins Capillaires</option>
              <option value="visage">Soins Visage</option>
              <option value="corps">Soins Corps</option>
            </select>
          </div>
        </div>

        {/* Grille Produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
}
