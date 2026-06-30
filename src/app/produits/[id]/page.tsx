"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Share2, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("description");

  // Simulation d'un produit
  const product = {
    id: params.id,
    title: "Huile de Chebe Authentique",
    price: 15000,
    category: "Soins Capillaires",
    description: "Une huile précieuse formulée avec de la poudre de Chebe authentique du Tchad. Conçue pour fortifier, hydrater en profondeur et stimuler la croissance des cheveux secs, frisés et crépus. Sa formule riche en nutriments scelle l'hydratation et prévient la casse.",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80"
    ],
    cities: ["N'Djamena", "Moundou", "Sarh"],
    isNew: true,
    ingredients: "Poudre de Chebe authentique du Tchad, Huile d'Argan biologique, Huile de Ricin pressée à froid, Beurre de Karité brut, Vitamine E.",
    application: "Appliquer quelques gouttes sur cheveux humides ou secs, en insistant sur les longueurs et les pointes. Masser délicatement le cuir chevelu. Utiliser 2 à 3 fois par semaine dans votre rituel de soin.",
    shipping: "Expédition rapide sous 24/48h. Livraison à domicile disponible à N'Djamena, Moundou et Sarh. Paiement sécurisé en espèces à la livraison."
  };

  // Related products
  const relatedProducts = [
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
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80"
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Breadcrumb épuré */}
        <nav className="flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-charcoal/40 mb-16">
          <Link href="/" className="hover:text-gold transition-colors duration-300">Accueil</Link>
          <span className="w-3 h-[1px] bg-sand"></span>
          <Link href="/produits" className="hover:text-gold transition-colors duration-300">Boutique</Link>
          <span className="w-3 h-[1px] bg-sand"></span>
          <span className="text-charcoal/80 truncate">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Gallery - 5 cols */}
          <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-28">
            <div className="aspect-[4/5] bg-white relative group overflow-hidden border border-sand/40 rounded-sm">
              <Image
                src={product.images[currentImageIndex]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                priority
              />
              {product.isNew && (
                <span className="absolute top-6 left-6 bg-charcoal text-white text-[9px] font-semibold uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-xs">
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
                  className={`flex-shrink-0 w-20 h-24 relative overflow-hidden transition-all duration-300 border rounded-xs ${
                    currentImageIndex === index 
                      ? 'border-gold opacity-100' 
                      : 'border-sand/40 opacity-55 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${index}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info - 7 cols */}
          <div className="lg:col-span-6 space-y-10">
            
            <div className="space-y-4">
              <span className="text-gold text-[9px] uppercase tracking-[0.25em] font-semibold">{product.category}</span>
              <h1 className="text-4xl lg:text-5xl font-serif text-charcoal leading-tight font-light">
                {product.title}
              </h1>
              <div className="text-2xl font-serif font-light text-charcoal/80 pt-2">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-sand/40 divide-y divide-sand/40">
              
              {/* Description */}
              <div className="py-5">
                <button 
                  onClick={() => toggleSection("description")}
                  className="w-full flex justify-between items-center text-left text-xs uppercase tracking-widest text-charcoal font-semibold py-1 focus:outline-none"
                >
                  <span>Description & Bienfaits</span>
                  {openSection === "description" ? <ChevronUp className="w-4 h-4 text-charcoal/50" /> : <ChevronDown className="w-4 h-4 text-charcoal/50" />}
                </button>
                {openSection === "description" && (
                  <div className="mt-4 text-sm text-charcoal/60 font-light leading-relaxed animate-fade-in">
                    <p>{product.description}</p>
                  </div>
                )}
              </div>

              {/* Ingrédients */}
              <div className="py-5">
                <button 
                  onClick={() => toggleSection("ingredients")}
                  className="w-full flex justify-between items-center text-left text-xs uppercase tracking-widest text-charcoal font-semibold py-1 focus:outline-none"
                >
                  <span>Ingrédients Naturels</span>
                  {openSection === "ingredients" ? <ChevronUp className="w-4 h-4 text-charcoal/50" /> : <ChevronDown className="w-4 h-4 text-charcoal/50" />}
                </button>
                {openSection === "ingredients" && (
                  <div className="mt-4 text-sm text-charcoal/60 font-light leading-relaxed animate-fade-in">
                    <p>{product.ingredients}</p>
                  </div>
                )}
              </div>

              {/* Application */}
              <div className="py-5">
                <button 
                  onClick={() => toggleSection("application")}
                  className="w-full flex justify-between items-center text-left text-xs uppercase tracking-widest text-charcoal font-semibold py-1 focus:outline-none"
                >
                  <span>Conseils d'Application</span>
                  {openSection === "application" ? <ChevronUp className="w-4 h-4 text-charcoal/50" /> : <ChevronDown className="w-4 h-4 text-charcoal/50" />}
                </button>
                {openSection === "application" && (
                  <div className="mt-4 text-sm text-charcoal/60 font-light leading-relaxed animate-fade-in">
                    <p>{product.application}</p>
                  </div>
                )}
              </div>

              {/* Livraison */}
              <div className="py-5">
                <button 
                  onClick={() => toggleSection("shipping")}
                  className="w-full flex justify-between items-center text-left text-xs uppercase tracking-widest text-charcoal font-semibold py-1 focus:outline-none"
                >
                  <span>Livraison & Paiement</span>
                  {openSection === "shipping" ? <ChevronUp className="w-4 h-4 text-charcoal/50" /> : <ChevronDown className="w-4 h-4 text-charcoal/50" />}
                </button>
                {openSection === "shipping" && (
                  <div className="mt-4 text-sm text-charcoal/60 font-light leading-relaxed animate-fade-in">
                    <p>{product.shipping}</p>
                  </div>
                )}
              </div>

            </div>

            <div className="space-y-8 pt-8 border-t border-sand/40">
              {/* Disponibilité */}
              <div className="space-y-4">
                <h3 className="text-[9px] text-charcoal/40 uppercase tracking-[0.25em] font-medium">Disponibilité immédiate</h3>
                <div className="flex flex-wrap gap-2.5">
                  {product.cities.map(city => (
                    <span key={city} className="border border-sand text-charcoal/70 text-[9px] uppercase tracking-[0.2em] px-4 py-2 font-medium bg-white">
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-sand bg-white rounded-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-14 text-charcoal/40 hover:text-charcoal transition-colors flex items-center justify-center font-light text-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-charcoal font-light text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-14 text-charcoal/40 hover:text-charcoal transition-colors flex items-center justify-center font-light text-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add Button */}
                <button className="flex-1 bg-charcoal text-white text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-gold hover:text-charcoal transition-colors duration-500 rounded-xs shadow-lg shadow-charcoal/5">
                  Ajouter au panier
                </button>
              </div>
            </div>

            {/* Share */}
            <div className="pt-8 flex items-center gap-4">
              <span className="text-[9px] text-charcoal/40 uppercase tracking-[0.25em] font-medium">Partager</span>
              <span className="w-8 h-[1px] bg-sand"></span>
              <button className="text-charcoal/50 hover:text-gold transition-colors duration-300">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Cross selling */}
        <div className="mt-32 pt-20 border-t border-sand/40">
          <h2 className="text-2xl font-serif font-light text-charcoal mb-12 text-center lg:text-left">
            Vous aimerez aussi...
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
