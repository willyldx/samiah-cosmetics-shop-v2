<template>
  <div class="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gold/10 dark:bg-gold/20 rounded-2xl mb-6">
          <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 class="text-3xl md:text-4xl font-serif font-bold text-charcoal dark:text-white mb-4">
          Conditions Générales de Vente
        </h1>
        <div class="w-20 h-1 bg-gold mx-auto rounded-full"></div>
        <p class="mt-4 text-gray-500 dark:text-gray-400">Dernière mise à jour : {{ new Date().toLocaleDateString('fr-FR') }}</p>
      </div>

      <!-- Table des matières -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-none dark:border dark:border-gray-700 p-6 mb-8">
        <h2 class="font-bold text-charcoal dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Sommaire
        </h2>
        <nav class="grid md:grid-cols-2 gap-2">
          <a v-for="(section, index) in sections" :key="index" 
             :href="`#section-${index + 1}`"
             class="text-sm text-gray-600 dark:text-gray-400 hover:text-gold dark:hover:text-gold transition-colors flex items-center gap-2 py-1">
            <span class="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
            {{ section.title }}
          </a>
        </nav>
      </div>

      <!-- Contenu -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-none dark:border dark:border-gray-700 p-8 md:p-12 space-y-8">
        
        <section v-for="(section, index) in sections" :key="index" :id="`section-${index + 1}`" class="scroll-mt-8">
          <div class="flex items-start gap-4 mb-4">
            <span class="flex-shrink-0 w-10 h-10 bg-gold/10 dark:bg-gold/20 rounded-xl flex items-center justify-center text-gold font-bold">
              {{ index + 1 }}
            </span>
            <h2 class="text-xl font-bold text-charcoal dark:text-white pt-1.5">{{ section.title }}</h2>
          </div>
          <div class="pl-14 text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p v-html="section.content"></p>
            <ul v-if="section.list" class="list-disc pl-5 space-y-1">
              <li v-for="(item, i) in section.list" :key="i" v-html="item"></li>
            </ul>
          </div>
        </section>

      </div>

      <!-- Contact -->
      <div class="mt-8 text-center">
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Une question sur nos conditions ?</p>
        <a 
          href="https://wa.me/23562752105"
          target="_blank"
          class="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-all hover:scale-105"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          Contactez-nous
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'CGV — Samiah Cosmetics',
  meta: [
    { name: 'description', content: 'Conditions Générales de Vente de Samiah Cosmetics Tchad.' },
    { name: 'robots', content: 'noindex' }
  ]
})

const sections = [
  {
    title: 'Objet',
    content: 'Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits cosmétiques et services de consultation capillaire effectuées par <strong class="text-charcoal dark:text-white">Samiah Cosmetics</strong> via son site internet. Toute commande implique l\'adhésion sans réserve du client aux présentes conditions.'
  },
  {
    title: 'Produits et Services',
    content: 'Les produits proposés sont ceux qui figurent sur le site, dans la limite des stocks disponibles. Samiah Cosmetics apporte le plus grand soin à la description et à la présentation des produits (photos, composition). Toutefois, les photographies n\'ont pas de valeur contractuelle.'
  },
  {
    title: 'Prix',
    content: 'Les prix sont indiqués en <strong class="text-charcoal dark:text-white">Francs CFA (XAF)</strong>. Samiah Cosmetics se réserve le droit de modifier ses prix à tout moment, mais le produit sera facturé sur la base du tarif en vigueur au moment de la validation de la commande. Les frais de livraison ne sont pas inclus dans le prix affiché.'
  },
  {
    title: 'Commande et Paiement',
    content: 'La validation de la commande entraîne l\'acceptation des présentes CGV.<br><strong class="text-charcoal dark:text-white">Moyens de paiement acceptés :</strong>',
    list: ['Paiement à la livraison (Cash)', 'Airtel Money', 'Moov Money']
  },
  {
    title: 'Livraison',
    content: 'Les livraisons sont effectuées principalement à N\'Djamena et dans les grandes villes du Tchad (Moundou, Sarh, Abéché, etc.).',
    list: ['<strong class="text-charcoal dark:text-white">N\'Djamena :</strong> Livraison sous 24h à 48h.', '<strong class="text-charcoal dark:text-white">Provinces :</strong> Expédition via les agences de transport partenaires.']
  },
  {
    title: 'Retours et Réclamations',
    content: 'Pour des raisons d\'hygiène liées aux produits cosmétiques, les retours ne sont acceptés que si le produit est scellé, non utilisé et dans son emballage d\'origine, dans un délai de <strong class="text-charcoal dark:text-white">48h</strong> après réception. En cas de produit défectueux, contactez-nous via WhatsApp.'
  },
  {
    title: 'Service Client',
    content: 'Pour toute question, notre service client est disponible :',
    list: ['<strong class="text-charcoal dark:text-white">WhatsApp / Tél :</strong> +235 62 75 21 05', '<strong class="text-charcoal dark:text-white">Email :</strong> contact@samiahcosmetics.shop']
  }
]
</script>
