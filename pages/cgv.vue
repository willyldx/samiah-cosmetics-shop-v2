<template>
  <div class="py-16 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
          Conditions Générales de Vente
        </h1>
        <div class="w-20 h-1 bg-gold mx-auto rounded-full"></div>
        <p class="mt-4 text-gray-500">Dernière mise à jour : {{ new Date().toLocaleDateString('fr-FR') }}</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">
        
        <section>
          <h2 class="text-xl font-bold text-charcoal mb-3">1. Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits cosmétiques et services de consultation capillaire effectuées par <strong>Samiah Cosmetics</strong> via son site internet. Toute commande implique l'adhésion sans réserve du client aux présentes conditions.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-charcoal mb-3">2. Produits et Services</h2>
          <p>
            Les produits proposés sont ceux qui figurent sur le site, dans la limite des stocks disponibles. Samiah Cosmetics apporte le plus grand soin à la description et à la présentation des produits (photos, composition). Toutefois, les photographies n'ont pas de valeur contractuelle.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-charcoal mb-3">3. Prix</h2>
          <p>
            Les prix sont indiqués en Francs CFA (XAF). Samiah Cosmetics se réserve le droit de modifier ses prix à tout moment, mais le produit sera facturé sur la base du tarif en vigueur au moment de la validation de la commande. Les frais de livraison ne sont pas inclus dans le prix affiché et sont calculés à la fin de la commande.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-charcoal mb-3">4. Commande et Paiement</h2>
          <p>
            La validation de la commande entraîne l'acceptation des présentes CGV.
            <br>
            <strong>Moyens de paiement acceptés :</strong>
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>Paiement à la livraison (Cash)</li>
            <li>Airtel Money</li>
            <li>Moov Money</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-charcoal mb-3">5. Livraison</h2>
          <p>
            Les livraisons sont effectuées principalement à N'Djamena et dans les grandes villes du Tchad (Moundou, Sarh, Abéché, etc.).
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li><strong>N'Djamena :</strong> Livraison sous 24h à 48h.</li>
            <li><strong>Provinces :</strong> Expédition via les agences de transport partenaires. Les délais varient selon la destination.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-charcoal mb-3">6. Retours et Réclamations</h2>
          <p>
            Pour des raisons d'hygiène liées aux produits cosmétiques, les retours ne sont acceptés que si le produit est scellé, non utilisé et dans son emballage d'origine, dans un délai de 48h après réception. En cas de produit défectueux ou d'erreur de commande de notre part, merci de nous contacter immédiatement via WhatsApp pour un échange.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-charcoal mb-3">7. Service Client</h2>
          <p>
            Pour toute question, notre service client est disponible :
          </p>
          <ul class="list-none mt-2">
            <li><strong>WhatsApp / Tél :</strong> +235 62 75 21 05</li>
            <li><strong>Email :</strong> contact@samiahcosmetics.shop</li>
          </ul>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'CGV - Samiah Cosmetics',
  meta: [
    { name: 'description', content: 'Conditions Générales de Vente de Samiah Cosmetics Tchad.' },
    { name: 'robots', content: 'noindex' } // On évite que Google indexe cette page juridique en priorité
  ]
})
</script>
