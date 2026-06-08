import Image from "next/image";
import Link from "next/link";

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero */}
      <section className="border-b border-gray-100 pt-16 pb-24 text-center px-4">
        <span className="inline-flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-charcoal mb-8">
          <span className="w-8 h-px bg-gray-200"></span>
          Notre Histoire
          <span className="w-8 h-px bg-gray-200"></span>
        </span>
        <h1 className="text-4xl lg:text-6xl font-serif font-light text-charcoal mb-8">
          Samiah<span className="text-gold">'</span>Cosmetics
        </h1>
        <p className="text-lg text-gray-400 font-light max-w-xl mx-auto">
          La beauté naturelle, révélée par des soins authentiques et un accompagnement personnalisé.
        </p>
      </section>

      {/* Qui sommes-nous */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-2xl font-serif font-light text-charcoal mb-8">
              Une marque née de la passion
            </h2>
            <div className="space-y-6 text-gray-500 font-light text-sm leading-loose">
              <p>
                <strong className="text-charcoal font-medium">Samiah'Cosmetics</strong> est une marque spécialisée dans la formulation 
                et la commercialisation de produits cosmétiques naturels pour le corps, 
                le visage et les cheveux.
              </p>
              <p>
                Nous développons des soins ciblés pour différents types de peaux et de cheveux : 
                secs, abîmés, crépus, cassants ou sensibles.
              </p>
              <p>
                Notre marque allie savoir-faire artisanal, ingrédients naturels 
                et accompagnement personnalisé, avec également un volet formation pour transmettre 
                les bases de la cosmétique.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] bg-gray-50 filter grayscale relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                alt="Soins naturels Samiah Cosmetics"
                fill
                className="object-cover opacity-80"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            {/* Stats badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 border border-gray-200 text-center shadow-sm">
              <p className="text-3xl font-serif text-charcoal mb-1">500+</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400">Clientes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-32 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[10px] tracking-[0.2em] uppercase text-charcoal">
              Ce qui nous définit
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-sm font-serif text-charcoal mb-4 uppercase tracking-widest">Naturel</h3>
              <p className="text-gray-500 font-light text-xs leading-relaxed max-w-xs mx-auto">
                Des formulations à base d'ingrédients naturels, soigneusement sélectionnés pour leur efficacité et leur douceur.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-serif text-charcoal mb-4 uppercase tracking-widest">Passion</h3>
              <p className="text-gray-500 font-light text-xs leading-relaxed max-w-xs mx-auto">
                Une équipe passionnée qui met tout son cœur dans chaque produit et chaque conseil personnalisé.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-serif text-charcoal mb-4 uppercase tracking-widest">Accompagnement</h3>
              <p className="text-gray-500 font-light text-xs leading-relaxed max-w-xs mx-auto">
                Un suivi sur mesure pour vous aider à comprendre vos besoins et adopter la routine idéale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white border-t border-gray-100 text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif font-light text-charcoal mb-8">
            Prête à révéler votre beauté naturelle ?
          </h2>
          <p className="text-gray-400 font-light text-sm mb-12">
            Contactez-nous pour une consultation personnalisée ou découvrez notre sélection.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="https://wa.me/23566000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-charcoal text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-gold transition-colors"
            >
              Nous contacter
            </a>
            
            <Link
              href="/produits"
              className="w-full sm:w-auto px-10 py-5 bg-transparent border border-gray-200 text-charcoal text-[10px] tracking-[0.2em] uppercase font-medium hover:border-charcoal transition-colors"
            >
              Voir les produits
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
