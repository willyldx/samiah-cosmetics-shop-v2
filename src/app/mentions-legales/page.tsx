"use client";

import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold">Légal</span>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-charcoal">
            Mentions Légales
          </h1>
          <div className="w-16 h-[1px] bg-gold mx-auto" />
        </div>

        {/* Content */}
        <div className="bg-white border border-sand/40 rounded-sm p-8 md:p-12 space-y-10 shadow-[0_4px_25px_rgba(26,26,26,0.02)] text-charcoal">
          
          {/* Éditeur */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-charcoal border-b border-sand/30 pb-2">
              Éditeur du site
            </h2>
            <div className="text-sm text-charcoal/60 font-light leading-relaxed space-y-4">
              <p>
                Le site <strong>www.samiahcosmetics.shop</strong> est édité par l'entreprise <strong>Samiah Cosmetics</strong>.
              </p>
              <div className="bg-cream/30 border border-sand/20 rounded-sm p-5 space-y-2 text-xs">
                <p><strong>Siège social :</strong> N'Djamena, Tchad</p>
                <p><strong>Téléphone :</strong> +235 62 75 21 05</p>
                <p><strong>Directrice :</strong> Raissa Yann Samiah</p>
              </div>
            </div>
          </div>

          {/* Hébergement */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-charcoal border-b border-sand/30 pb-2">
              Hébergement
            </h2>
            <div className="text-sm text-charcoal/60 font-light leading-relaxed">
              <p>Le site est hébergé par <strong>SPX Inc.</strong></p>
              <p className="text-xs text-charcoal/40 mt-1">440 N Barranca Ave #4133, Covina, CA 91723, USA.</p>
            </div>
          </div>

          {/* Propriété intellectuelle */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-charcoal border-b border-sand/30 pb-2">
              Propriété Intellectuelle
            </h2>
            <div className="text-sm text-charcoal/60 font-light leading-relaxed">
              <p>
                L'ensemble de ce site relève de la législation sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
            </div>
          </div>

        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-charcoal/50 hover:text-gold transition-colors duration-300 font-semibold"
          >
            ← Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}
