"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Share2 } from "lucide-react";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Simulation d'un produit
  const product = {
    id: params.id,
    title: "Huile de Chebe Authentique",
    price: 15000,
    category: "Soins Capillaires",
    description: "Une huile précieuse formulée avec de la poudre de Chebe authentique du Tchad. Conçue pour fortifier, hydrater en profondeur et stimuler la croissance des cheveux secs et cassants.",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80"
    ],
    cities: ["N'Djamena", "Moundou"],
    isNew: true
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb épuré */}
        <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-12">
          <Link href="/" className="hover:text-charcoal transition-colors">Accueil</Link>
          <span className="w-4 h-[1px] bg-gray-200"></span>
          <Link href="/produits" className="hover:text-charcoal transition-colors">Collection</Link>
          <span className="w-4 h-[1px] bg-gray-200"></span>
          <span className="text-charcoal truncate">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Image gallery */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="aspect-[4/5] bg-gray-50 relative group overflow-hidden border border-gray-100">
              <Image
                src={product.images[currentImageIndex]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {product.isNew && (
                <span className="absolute top-6 left-6 bg-white text-charcoal text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-2 shadow-sm border border-gray-100">
                  Nouveau
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-24 relative overflow-hidden transition-all duration-300 border ${
                    currentImageIndex === index ? 'border-charcoal opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${index}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:py-8 space-y-10">
            
            <div className="space-y-4">
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">{product.category}</p>
              <h1 className="text-4xl lg:text-5xl font-serif font-light text-charcoal leading-tight">
                {product.title}
              </h1>
              <div className="text-xl font-light text-gray-500 pt-2">
                {formatPrice(product.price)}
              </div>
            </div>

            <div className="prose prose-sm text-gray-500 font-light leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="space-y-8 pt-8 border-t border-gray-100">
              {/* Disponibilité */}
              <div className="space-y-4">
                <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Disponibilité</h3>
                <div className="flex flex-wrap gap-3">
                  {product.cities.map(city => (
                    <span key={city} className="border border-gray-200 text-charcoal text-[10px] uppercase tracking-[0.2em] px-4 py-2">
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-14 text-gray-400 hover:text-charcoal transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-charcoal font-light text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-14 text-gray-400 hover:text-charcoal transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Add Button */}
                <button className="flex-1 bg-charcoal text-white text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors duration-300">
                  Ajouter au panier
                </button>
              </div>
            </div>

            {/* Share */}
            <div className="pt-8 flex items-center gap-4">
              <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Partager</span>
              <span className="w-8 h-[1px] bg-gray-200"></span>
              <button className="text-gray-400 hover:text-charcoal transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
