import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-white overflow-hidden pt-24">
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Contenu Textuel */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3">
                <span className="w-10 h-[1px] bg-gold"></span>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400">
                  Consultation experte
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-charcoal leading-[1.1]">
                <span className="block font-light">La nature</span>
                <span className="block font-medium">à la</span>
                <span className="block text-gold-light italic">rescousse.</span>
              </h1>

              <p className="text-lg text-gray-500 font-light max-w-lg leading-relaxed">
                Expertise en cosmétiques naturels pour le corps, le visage et les cheveux. Nous allions soins ciblés, ingrédients naturels et accompagnement personnalisé pour sublimer votre beauté au quotidien.
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                <a
                  href="https://wa.me/23566000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-10 py-4 bg-charcoal text-white text-[10px] font-medium tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-300"
                >
                  Réserver
                </a>
                
                <Link
                  href="/produits"
                  className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-gray-200 text-charcoal text-[10px] font-medium tracking-[0.2em] uppercase hover:border-charcoal transition-colors duration-300"
                >
                  Voir la collection
                </Link>
              </div>
            </div>

            {/* Image Épurée */}
            <div className="relative w-full h-[600px] lg:h-[700px]">
              <Image
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                alt="Soins capillaires Samiah Cosmetics"
                fill
                className="object-cover rounded-sm"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi Nous Choisir - Textes originaux restaurés */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[10px] tracking-[0.2em] uppercase text-charcoal mb-4">
              Pourquoi nous choisir
            </h2>
            <p className="font-serif text-2xl lg:text-3xl text-charcoal">
              Une expérience unique pour vos cheveux
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold text-xl">✨</span>
              </div>
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-4">Conseils personnalisés</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">
                Une analyse complète de vos cheveux et une routine sur mesure adaptée à vos besoins.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold text-xl">🌍</span>
              </div>
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-4">Livraison au Tchad</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">
                Disponible dans les grandes villes : N'Djamena, Moundou, Sarh et bien d'autres.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold text-xl">🌿</span>
              </div>
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-4">Produits de qualité</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">
                Des soins sélectionnés pour les cheveux afro et crépus, testés et approuvés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Textes originaux restaurés */}
      <section className="py-24 bg-charcoal text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light mb-8 leading-tight">
            Transformez vos cheveux <br className="hidden sm:block" />
            <span className="text-gold-light italic">dès aujourd'hui</span>
          </h2>
          <p className="text-white/70 font-light text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Réservez votre consultation capillaire personnalisée et découvrez 
            les soins parfaitement adaptés à vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="https://wa.me/23563462615?text=Bonjour%20Samiah%20Cosmetics%2C%20je%20souhaite%20r%C3%A9server%20une%20consultation%20capillaire%20(10.000F)."
              target="_blank"
              rel="noopener"
              className="px-10 py-4 bg-gold text-charcoal text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-gold-light transition-colors"
            >
              Réserver une consultation
            </a>
            <Link
              href="/produits"
              className="px-10 py-4 bg-transparent border border-white/20 text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:border-white transition-colors"
            >
              Voir les produits
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
