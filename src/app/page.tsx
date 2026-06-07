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

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-charcoal leading-[1.1]">
                <span className="block mb-2">La nature</span>
                <span className="block italic text-gold">à la rescousse</span>
              </h1>

              <p className="text-lg text-gray-500 max-w-lg leading-relaxed font-light">
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
    </div>
  );
}
