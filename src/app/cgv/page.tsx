"use client";

import Link from "next/link";

export default function CGVPage() {
  const sections = [
    {
      title: "1. Objet",
      content: "Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits cosmétiques et services de consultation capillaire effectuées par <strong>Samiah Cosmetics</strong> via son site internet. Toute commande implique l'adhésion sans réserve du client aux présentes conditions."
    },
    {
      title: "2. Produits et Services",
      content: "Les produits proposés sont ceux qui figurent sur le site, dans la limite des stocks disponibles. Samiah Cosmetics apporte le plus grand soin à la description et à la présentation des produits (photos, composition). Toutefois, les photographies n'ont pas de valeur contractuelle."
    },
    {
      title: "3. Prix",
      content: "Les prix sont indiqués en <strong>Francs CFA (XAF)</strong>. Samiah Cosmetics se réserve le droit de modifier ses prix à tout moment, mais le produit sera facturé sur la base du tarif en vigueur au moment de la validation de la commande. Les frais de livraison ne sont pas inclus dans le prix affiché."
    },
    {
      title: "4. Commande et Paiement",
      content: "La validation de la commande entraîne l'acceptation des présentes CGV.<br><strong>Moyens de paiement acceptés :</strong>",
      list: ["Paiement à la livraison (Cash)", "Airtel Money", "Moov Money"]
    },
    {
      title: "5. Livraison",
      content: "Les livraisons sont effectuées principalement à N'Djamena et dans les grandes villes du Tchad (Moundou, Sarh, Abéché, etc.).",
      list: [
        "<strong>N'Djamena :</strong> Livraison sous 24h à 48h.",
        "<strong>Provinces :</strong> Expédition via les agences de transport partenaires."
      ]
    },
    {
      title: "6. Retours et Réclamations",
      content: "Pour des raisons d'hygiène liées aux produits cosmétiques, les retours ne sont acceptés que si le produit est scellé, non utilisé et dans son emballage d'origine, dans un délai de <strong>48h</strong> après réception. En cas de produit défectueux, contactez-nous via WhatsApp."
    },
    {
      title: "7. Service Client",
      content: "Pour toute question, notre service client est disponible :",
      list: [
        "<strong>WhatsApp / Tél :</strong> +235 62 75 21 05",
        "<strong>Email :</strong> contact@samiahcosmetics.shop"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold">Légal</span>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-charcoal">
            Conditions Générales de Vente
          </h1>
          <div className="w-16 h-[1px] bg-gold mx-auto" />
          <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-medium">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white border border-sand/40 rounded-sm p-8 md:p-12 space-y-12 shadow-[0_4px_25px_rgba(26,26,26,0.02)]">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-charcoal border-b border-sand/30 pb-2">
                {section.title}
              </h2>
              <div className="text-sm text-charcoal/60 font-light leading-relaxed space-y-3">
                <p dangerouslySetInnerHTML={{ __html: section.content }} />
                {section.list && (
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    {section.list.map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
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
