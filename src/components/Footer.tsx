"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-sand/40 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Marque */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block relative w-36 h-10 transition-transform duration-300 hover:scale-[1.02]">
              <Image 
                src="/logo.png" 
                alt="Samiah Cosmetics Logo" 
                fill
                className="object-contain"
              />
            </Link>
            <p className="text-charcoal/50 font-light text-sm leading-relaxed max-w-sm">
              Révélez votre beauté naturelle grâce à notre gamme de soins artisanaux d'exception, conçus précieusement pour le corps, le visage et les cheveux.
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-charcoal/80 mb-6">Navigation</h3>
            <ul className="space-y-4">
              {["Boutique", "À propos", "Suivi"].map((item, index) => {
                const paths = ["/produits", "/a-propos", "/suivi"];
                return (
                  <li key={item}>
                    <Link href={paths[index]} className="inline-block text-[11px] uppercase tracking-[0.2em] text-charcoal/40 hover:text-gold transition-colors duration-300">
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-charcoal/80 mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="text-[11px] uppercase tracking-[0.2em] text-charcoal/45">
                N'Djamena, Tchad
              </li>
              <li>
                <a href="tel:+23566000000" className="inline-block text-[11px] uppercase tracking-[0.2em] text-charcoal/40 hover:text-gold transition-colors duration-300">
                  +235 66 00 00 00
                </a>
              </li>
              <li>
                <a href="mailto:contact@samiahcosmetics.com" className="inline-block text-[11px] uppercase tracking-[0.2em] text-charcoal/40 hover:text-gold transition-colors duration-300">
                  contact@samiahcosmetics.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Club */}
          <div className="lg:col-span-3">
            <h3 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-charcoal/80 mb-6">Le Club Samiah</h3>
            <p className="text-[11px] text-charcoal/50 leading-relaxed font-light mb-4">
              Inscrivez-vous pour recevoir nos rituels de soin exclusifs et avant-premières.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center border-b border-charcoal/20 focus-within:border-gold transition-colors duration-300 py-1.5">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="bg-transparent flex-1 outline-none text-xs font-light text-charcoal placeholder:text-charcoal/30 w-full"
                required
              />
              <button 
                type="submit" 
                className="text-[10px] uppercase tracking-widest text-charcoal hover:text-gold transition-colors duration-300 font-medium ml-2"
              >
                S'inscrire
              </button>
            </form>
          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-sand/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] uppercase tracking-widest text-charcoal/40 font-light">
            © {new Date().getFullYear()} Samiah Cosmetics. Créé avec passion.
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="text-[9px] uppercase tracking-widest text-charcoal/40 hover:text-gold transition-colors duration-300">
              Mentions Légales
            </Link>
            <Link href="/cgv" className="text-[9px] uppercase tracking-widest text-charcoal/40 hover:text-gold transition-colors duration-300">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
