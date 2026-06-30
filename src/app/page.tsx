import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default async function Home() {
  let featuredProducts: any[] = [];
  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(4);
    featuredProducts = data || [];
  } catch (e) {
    console.error("Erreur de chargement des produits phares:", e);
  }

  const reviews = [
    {
      name: "Amina M.",
      city: "N'Djamena",
      comment: "Mes cheveux crépus revivent depuis que j'utilise l'Huile de Chebe. L'accompagnement personnalisé a fait toute la différence.",
      stars: 5
    },
    {
      name: "Fatime Z.",
      city: "Moundou",
      comment: "Les produits sont d'une pureté incroyable. Le Sérum Éclat a complètement unifié mon teint en quelques semaines.",
      stars: 5
    },
    {
      name: "Khadidja T.",
      city: "Sarh",
      comment: "Le beurre de karité est d'une douceur inégalée. La livraison est rapide et le service client par WhatsApp est excellent.",
      stars: 5
    }
  ];

  return (
    <div className="bg-cream">
      
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-24">
        {/* Decorative subtle background accents */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-gold/5 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-10 left-10 w-48 h-48 border border-sand/30 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Contenu Textuel */}
            <div className="lg:col-span-6 space-y-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-3">
                <span className="w-10 h-[1px] bg-gold"></span>
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold">
                  Rituel Capillaire d'Exception
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-charcoal leading-[1.05] tracking-tight">
                <span className="block font-light">La nature</span>
                <span className="block font-medium">à la</span>
                <span className="block text-gold italic">rescousse.</span>
              </h1>

              <p className="text-base text-charcoal/60 font-light max-w-lg leading-relaxed">
                Formulée avec de la poudre de Chebe authentique du Tchad et des huiles botaniques précieuses, notre collection apporte force, nutrition et éclat naturel à vos cheveux et votre peau.
              </p>

              <div className="flex flex-wrap gap-5 pt-2">
                <a
                  href="https://wa.me/23562752105?text=Bonjour%20Samiah%20Cosmetics%2C%20je%20souhaite%20r%C3%A9server%20une%20consultation%20capillaire%20(10.000F)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-10 py-5 bg-charcoal text-white text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-500 shadow-lg shadow-charcoal/5"
                >
                  Réserver une consultation
                </a>
                
                <Link
                  href="/produits"
                  className="inline-flex items-center justify-center px-10 py-5 bg-transparent border border-charcoal/10 text-charcoal text-[10px] font-semibold tracking-[0.2em] uppercase hover:border-charcoal hover:bg-charcoal/5 transition-all duration-500"
                >
                  Explorer la collection
                </Link>
              </div>
            </div>

            {/* Image Épurée avec double cadre */}
            <div className="lg:col-span-6 relative w-full h-[550px] lg:h-[680px] group animate-fade-in">
              <div className="absolute -inset-4 border border-gold/25 transform rotate-3 rounded-sm group-hover:rotate-6 transition-transform duration-1000 ease-out" />
              <div className="absolute -inset-4 border border-charcoal/5 transform -rotate-2 rounded-sm group-hover:-rotate-4 transition-transform duration-1000 ease-out" />
              <div className="relative w-full h-full overflow-hidden rounded-sm shadow-2xl shadow-charcoal/5">
                <Image
                  src="https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=1600&q=90"
                  alt="Soins capillaires Samiah Cosmetics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent" />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Section Botanique & Philosophie */}
      <section className="py-28 bg-sand/20 border-t border-b border-sand/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Image Banner */}
            <div className="lg:col-span-5 relative h-[500px] w-full rounded-sm overflow-hidden shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80" 
                alt="Botanique & Ingrédients naturels"
                fill
                className="object-cover"
              />
            </div>

            {/* Texte & Philosophie */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-gold"></span>
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold">Notre Philosophie</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-light leading-snug">
                La pureté de la flore tchadienne <br />
                <span className="italic text-gold">au service de votre beauté.</span>
              </h2>
              <p className="text-charcoal/60 font-light text-base leading-relaxed max-w-xl">
                Chaque produit est fabriqué à la main, en petites séries, afin de préserver l'intégrité biologique de nos ingrédients naturels soigneusement sourcés.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-8 pt-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-charcoal">Ingrédients Sauvages</h4>
                  <p className="text-xs text-charcoal/50 leading-relaxed font-light">Le Chebe de qualité supérieure, récolté de manière respectueuse et éco-responsable.</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-charcoal">Formule Pure</h4>
                  <p className="text-xs text-charcoal/50 leading-relaxed font-light">Garanti sans paraben, silicone ni parfum artificiel pour respecter votre cuir chevelu.</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-charcoal">Suivi Capillaire</h4>
                  <p className="text-xs text-charcoal/50 leading-relaxed font-light">Un diagnostic sur-mesure et un ajustement de votre routine via WhatsApp.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Nos Produits Phares */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold block mb-3">La Sélection</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-charcoal">Les Essentiels de la Collection</h2>
            </div>
            <Link 
              href="/produits"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-charcoal font-semibold border-b border-charcoal/10 hover:border-gold hover:text-gold transition-all duration-300 pb-1"
            >
              Découvrir toute la boutique <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                  isNew: product.created_at ? (Date.now() - Date.parse(product.created_at) <= 7 * 24 * 60 * 60 * 1000) : false
                }} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* Pourquoi Nous Choisir */}
      <section className="py-28 bg-sand/10 border-t border-b border-sand/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="text-center mb-20">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold block mb-3">Engagement</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-charcoal">
              Une expérience d'exception
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            
            <div className="luxury-card p-10 text-center rounded-sm">
              <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-6 h-6 text-gold" strokeWidth={1.2} />
              </div>
              <h3 className="text-xs font-semibold text-charcoal uppercase tracking-widest mb-4">Conseils personnalisés</h3>
              <p className="text-charcoal/50 font-light text-sm leading-relaxed">
                Une analyse complète de vos cheveux et une routine sur-mesure adaptée à vos besoins.
              </p>
            </div>

            <div className="luxury-card p-10 text-center rounded-sm">
              <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-6 h-6 text-gold" strokeWidth={1.2} />
              </div>
              <h3 className="text-xs font-semibold text-charcoal uppercase tracking-widest mb-4">Livraison au Tchad</h3>
              <p className="text-charcoal/50 font-light text-sm leading-relaxed">
                Disponible dans les grandes villes : N'Djamena, Moundou, Sarh et bien d'autres.
              </p>
            </div>

            <div className="luxury-card p-10 text-center rounded-sm">
              <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart className="w-6 h-6 text-gold" strokeWidth={1.2} />
              </div>
              <h3 className="text-xs font-semibold text-charcoal uppercase tracking-widest mb-4">Produits de qualité</h3>
              <p className="text-charcoal/50 font-light text-sm leading-relaxed">
                Des soins méticuleusement formulés pour les cheveux afro et crépus, testés et approuvés.
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="text-center mb-20">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold block mb-3">Témoignages</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-charcoal">
              Elles ont adopté le rituel Samiah
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div key={i} className="border border-sand/40 p-10 rounded-sm flex flex-col justify-between hover:border-gold transition-colors duration-500">
                <div className="space-y-4">
                  <div className="flex gap-1 text-gold text-sm">
                    {Array.from({ length: review.stars }).map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>
                  <p className="text-charcoal/70 font-light text-sm leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
                <div className="pt-8 border-t border-sand/30 mt-8">
                  <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider">{review.name}</h4>
                  <p className="text-[10px] uppercase text-charcoal/40 tracking-widest mt-1">{review.city}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-charcoal text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,var(--color-gold),transparent)] z-0" />
        <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light leading-snug">
            Révélez l'éclat de vos cheveux <br />
            <span className="text-gold-light italic font-normal">dès aujourd'hui.</span>
          </h2>
          <p className="text-white/60 font-light text-base max-w-xl mx-auto leading-relaxed">
            Réservez votre consultation capillaire personnalisée et découvrez une routine sur-mesure adaptée aux besoins spécifiques de vos cheveux.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <a
              href="https://wa.me/23562752105?text=Bonjour%20Samiah%20Cosmetics%2C%20je%20souhaite%20r%C3%A9server%20une%20consultation%20capillaire%20(10.000F)."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-gold text-charcoal text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-white hover:text-charcoal transition-all duration-500 shadow-xl shadow-gold/10"
            >
              Réserver une consultation (10.000F)
            </a>
            <Link
              href="/produits"
              className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/20 text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:border-white hover:bg-white/5 transition-all duration-500"
            >
              Voir la boutique
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
