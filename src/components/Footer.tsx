import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24">
          
          {/* Marque */}
          <div className="md:col-span-1 space-y-8">
            <Link href="/">
              <h2 className="text-2xl font-serif text-charcoal">
                Samiah<span className="text-gold-light">'</span>Cosmetics
              </h2>
            </Link>
            <p className="text-gray-400 font-light text-sm leading-relaxed max-w-sm">
              Révélez votre beauté naturelle grâce à notre gamme de soins artisanaux, conçus pour le corps, le visage et les cheveux.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal mb-6">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/produits" className="inline-block text-[11px] uppercase tracking-widest text-gray-400 hover:text-charcoal border-b border-transparent hover:border-gray-200 transition-colors pb-0.5">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="inline-block text-[11px] uppercase tracking-widest text-gray-400 hover:text-charcoal border-b border-transparent hover:border-gray-200 transition-colors pb-0.5">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/suivi" className="inline-block text-[11px] uppercase tracking-widest text-gray-400 hover:text-charcoal border-b border-transparent hover:border-gray-200 transition-colors pb-0.5">
                  Suivi de commande
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="text-[11px] uppercase tracking-widest text-gray-400">
                N'Djamena, Tchad
              </li>
              <li>
                <a href="tel:+23566000000" className="inline-block text-[11px] uppercase tracking-widest text-gray-400 hover:text-charcoal border-b border-transparent hover:border-gray-200 transition-colors pb-0.5">
                  +235 66 00 00 00
                </a>
              </li>
              <li>
                <a href="mailto:contact@samiahcosmetics.com" className="inline-block text-[11px] uppercase tracking-widest text-gray-400 hover:text-charcoal border-b border-transparent hover:border-gray-200 transition-colors pb-0.5">
                  contact@samiahcosmetics.com
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal mb-6">Réseaux Sociaux</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="inline-block text-[11px] uppercase tracking-widest text-gray-400 hover:text-charcoal border-b border-transparent hover:border-gray-200 transition-colors pb-0.5">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="inline-block text-[11px] uppercase tracking-widest text-gray-400 hover:text-charcoal border-b border-transparent hover:border-gray-200 transition-colors pb-0.5">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="inline-block text-[11px] uppercase tracking-widest text-gray-400 hover:text-charcoal border-b border-transparent hover:border-gray-200 transition-colors pb-0.5">
                  TikTok
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-24 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">
            © {new Date().getFullYear()} Samiah Cosmetics. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-charcoal transition-colors">
              Mentions Légales
            </Link>
            <Link href="/cgu" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-charcoal transition-colors">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
