"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Share2, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("description");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const { addItem } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", params.id)
          .single();
        
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error("Erreur de chargement du produit:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  useEffect(() => {
    if (!product) return;
    async function loadRelated() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("active", true)
          .eq("category", product.category)
          .neq("id", product.id)
          .limit(3);
        
        if (error) throw error;
        setRelatedProducts(data || []);
      } catch (err) {
        console.error("Erreur de chargement des produits associés:", err);
      }
    }
    loadRelated();
  }, [product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-charcoal/40 font-semibold">Préparation de vos rituels...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-sm px-6">
          <h2 className="text-2xl font-serif text-charcoal">Soin Introuvable</h2>
          <p className="text-charcoal/50 text-sm font-light leading-relaxed">Le produit demandé n'existe pas ou a été retiré de la collection.</p>
          <Link
            href="/produits"
            className="inline-block bg-charcoal text-white px-8 py-4.5 text-[9px] uppercase tracking-[0.25em] font-semibold hover:bg-gold hover:text-charcoal transition-all duration-500 rounded-sm shadow-md"
          >
            Explorer la boutique
          </Link>
        </div>
      </div>
    );
  }

  // Construct gallery
  const gallery: string[] = [];
  if (product.image) gallery.push(product.image);
  if (product.images) {
    if (Array.isArray(product.images)) {
      gallery.push(...product.images);
    } else {
      try {
        const parsed = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
        if (Array.isArray(parsed)) gallery.push(...parsed);
      } catch (e) {}
    }
  }
  const cleanGallery = [...new Set(gallery)];

  // Parse cities
  let deliveryCities: string[] = ["N'Djamena", "Moundou", "Sarh"];
  if (product.cities) {
    if (Array.isArray(product.cities)) {
      deliveryCities = product.cities;
    } else {
      try {
        const parsed = typeof product.cities === "string" ? JSON.parse(product.cities) : product.cities;
        if (Array.isArray(parsed)) deliveryCities = parsed;
      } catch (e) {}
    }
  }

  // Check if new
  const isNewProduct = (dateStr: string) => {
    if (!dateStr) return false;
    const created = Date.parse(dateStr);
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return (Date.now() - created) <= sevenDays;
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
          
          {/* Gallery - 6 cols */}
          <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-28">
            <div className="aspect-[4/5] bg-white relative group overflow-hidden border border-sand/40 rounded-sm">
              {cleanGallery.length > 0 && (
                <Image
                  src={cleanGallery[currentImageIndex]}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  priority
                />
              )}
              {isNewProduct(product.created_at) && (
                <span className="absolute top-6 left-6 bg-charcoal text-white text-[9px] font-semibold uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-xs">
                  Nouveau
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {cleanGallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {cleanGallery.map((img, index) => (
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
            )}
          </div>

          {/* Product info - 6 cols */}
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
                  <div className="mt-4 text-sm text-charcoal/60 font-light leading-relaxed animate-fade-in space-y-3">
                    <p>{product.description}</p>
                    {product.short_description && <p className="italic">{product.short_description}</p>}
                  </div>
                )}
              </div>

              {/* Ingrédients */}
              {product.ingredients && (
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
              )}

              {/* Application */}
              {product.application_tips && (
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
                      <p>{product.application_tips}</p>
                    </div>
                  )}
                </div>
              )}

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
                    <p>Expédition rapide sous 24/48h. Livraison à domicile disponible à N'Djamena, Moundou, Sarh et autres villes. Paiement sécurisé en espèces à la réception de votre colis.</p>
                  </div>
                )}
              </div>

            </div>

            <div className="space-y-8 pt-8 border-t border-sand/40">
              {/* Disponibilité */}
              <div className="space-y-4">
                <h3 className="text-[9px] text-charcoal/40 uppercase tracking-[0.25em] font-medium">Disponibilité immédiate</h3>
                <div className="flex flex-wrap gap-2.5">
                  {deliveryCities.map(city => (
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
                <button 
                  onClick={() => addItem(product, quantity)}
                  className="flex-1 bg-charcoal text-white text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-gold hover:text-charcoal transition-colors duration-500 rounded-xs shadow-lg shadow-charcoal/5 cursor-pointer"
                >
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
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-20 border-t border-sand/40">
            <h2 className="text-2xl font-serif font-light text-charcoal mb-12 text-center lg:text-left">
              Vous aimerez aussi...
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map(prod => (
                <ProductCard key={prod.id} product={{
                  id: prod.id,
                  title: prod.title,
                  price: prod.price,
                  image: prod.image,
                  category: prod.category,
                  isNew: isNewProduct(prod.created_at)
                }} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
