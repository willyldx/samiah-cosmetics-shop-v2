import Image from "next/image";
import Link from "next/link";
import { Sparkles, Shield, Heart } from "lucide-react";

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-cream pt-32 pb-24">
      {/* Hero */}
      <section className="border-b border-sand/30 pt-16 pb-24 text-center px-6">
        <span className="inline-flex items-center gap-4 text-[9px] uppercase tracking-[0.25em] text-gold mb-8 font-semibold">
          <span className="w-8 h-px bg-sand"></span>
          Notre Histoire
          <span className="w-8 h-px bg-sand"></span>
        </span>
        <h1 className="text-4xl lg:text-6xl font-serif text-charcoal mb-8 font-light">
          Samiah<span className="text-gold">'</span>Cosmetics
        </h1>
        <p className="text-base text-charcoal/60 font-light max-w-xl mx-auto leading-relaxed">
          La beauté naturelle, révélée par des soins authentiques et un accompagnement personnalisé de chaque instant.
        </p>
      </section>

      {/* Qui sommes-nous */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-8">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold">Origines</span>
            <h2 className="text-3xl font-serif font-light text-charcoal leading-snug">
              Une marque née de la passion <br />
              <span className="italic text-gold">et de l'authenticité.</span>
            </h2>
            <div className="space-y-6 text-charcoal/60 font-light text-sm leading-relaxed">
              <p>
                <strong className="text-charcoal font-medium">Samiah'Cosmetics</strong> est une maison spécialisée dans la formulation et la commercialisation de soins cosmétiques naturels d'exception pour le corps, le visage et les cheveux.
              </p>
              <p>
                Nous développons des élixirs ciblés pour répondre aux besoins des peaux et cheveux exigeants : secs, abîmés, crépus, cassants ou sensibles.
              </p>
              <p>
                Notre marque allie précieux savoir-faire artisanal, ingrédients sauvages de la flore africaine et accompagnement sur-mesure pour vous aider à cultiver votre beauté originelle.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-6 relative group">
            <div className="absolute -inset-3 border border-gold/25 transform rotate-3 rounded-sm group-hover:rotate-4 transition-transform duration-1000 ease-out" />
            <div className="aspect-[4/5] bg-white relative overflow-hidden rounded-sm shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                alt="Soins naturels Samiah Cosmetics"
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            {/* Stats badge */}
            <div className="absolute -bottom-6 -left-6 bg-white py-5 px-7 border border-sand/40 text-center shadow-lg rounded-sm">
              <p className="text-2xl font-serif text-charcoal mb-0.5">500+</p>
              <p className="text-[8px] uppercase tracking-[0.2em] text-gold font-semibold">Clientes Satisfaites</p>
            </div>
          </div>

        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-28 bg-sand/15 border-t border-b border-sand/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold block mb-3">Philosophie</span>
            <h2 className="text-3xl font-serif font-light text-charcoal">
              Ce qui nous définit
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="luxury-card p-10 text-center rounded-sm">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-5 h-5 text-gold" strokeWidth={1.2} />
              </div>
              <h3 className="text-xs font-semibold text-charcoal mb-4 uppercase tracking-widest">Naturel</h3>
              <p className="text-charcoal/50 font-light text-xs leading-relaxed max-w-xs mx-auto">
                Des formulations pures basées sur des extraits botaniques sauvages sélectionnés pour leur efficacité biologique.
              </p>
            </div>
            
            <div className="luxury-card p-10 text-center rounded-sm">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-5 h-5 text-gold" strokeWidth={1.2} />
              </div>
              <h3 className="text-xs font-semibold text-charcoal mb-4 uppercase tracking-widest">Passion</h3>
              <p className="text-charcoal/50 font-light text-xs leading-relaxed max-w-xs mx-auto">
                Une équipe dévouée qui met tout son amour et son expertise dans la confection de chaque élixir de soin.
              </p>
            </div>
            
            <div className="luxury-card p-10 text-center rounded-sm">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-5 h-5 text-gold" strokeWidth={1.2} />
              </div>
              <h3 className="text-xs font-semibold text-charcoal mb-4 uppercase tracking-widest">Accompagnement</h3>
              <p className="text-charcoal/50 font-light text-xs leading-relaxed max-w-xs mx-auto">
                Un suivi sur-mesure et des diagnostics personnalisés pour instaurer un rituel de soin véritablement adapté.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-white text-center px-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-serif font-light text-charcoal">
            Prête à révéler votre beauté naturelle ?
          </h2>
          <p className="text-charcoal/55 font-light text-sm max-w-lg mx-auto leading-relaxed">
            Contactez notre experte pour un diagnostic personnalisé ou explorez notre sélection d'essentiels.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <a
              href="https://wa.me/23562752105"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-charcoal text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-gold transition-colors duration-500 rounded-sm shadow-md"
            >
              Nous contacter
            </a>
            
            <Link
              href="/produits"
              className="w-full sm:w-auto px-10 py-5 bg-transparent border border-sand text-charcoal text-[10px] tracking-[0.2em] uppercase font-semibold hover:border-charcoal hover:bg-charcoal/5 transition-all duration-500 rounded-sm"
            >
              Voir la collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
