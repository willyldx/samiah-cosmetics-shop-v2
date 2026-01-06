<template>
  <div class="bg-white dark:bg-charcoal">
    <HeroSection />

    <section class="py-16 lg:py-24 bg-white dark:bg-charcoal">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-end justify-between mb-10">
          <div>
            <span class="text-gold font-medium text-sm uppercase tracking-wider">Catalogue</span>
            <h2 class="text-3xl lg:text-4xl font-bold text-charcoal dark:text-white mt-2">
              Nos produits
            </h2>
          </div>
          <NuxtLink 
            to="/produits"
            class="hidden sm:flex items-center gap-2 text-charcoal dark:text-white font-medium hover:text-gold transition-colors group"
          >
            Voir tout
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </NuxtLink>
        </div>

        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          <div v-for="i in 8" :key="i" class="animate-pulse">
            <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else-if="featuredProducts.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @click="goToProduct(product)"
            @add-to-cart="addToCart"
          />
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">Aucun produit disponible pour le moment.</p>
        </div>

        <div class="mt-8 text-center sm:hidden">
          <NuxtLink 
            to="/produits"
            class="inline-flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-full font-medium"
          >
            Voir tous les produits
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-charcoal">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-gold font-medium text-sm uppercase tracking-wider">Pourquoi nous choisir</span>
          <h2 class="text-2xl lg:text-3xl font-bold text-charcoal dark:text-white mt-2">Une expérience unique</h2>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-soft hover:shadow-strong dark:shadow-none dark:border dark:border-gray-700 transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-gold/20 dark:hover:border-gold/30">
            <div class="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-charcoal dark:text-white text-lg mb-3 group-hover:text-gold transition-colors">Conseils personnalisés</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Une analyse complète de vos cheveux et une routine sur mesure adaptée à vos besoins.</p>
          </div>

          <div class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-soft hover:shadow-strong dark:shadow-none dark:border dark:border-gray-700 transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-gold/20 dark:hover:border-gold/30">
            <div class="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
              </svg>
            </div>
            <h3 class="font-bold text-charcoal dark:text-white text-lg mb-3 group-hover:text-gold transition-colors">Livraison au Tchad</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Disponible dans les grandes villes : N'Djamena, Moundou, Sarh et bien d'autres.</p>
          </div>

          <div class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-soft hover:shadow-strong dark:shadow-none dark:border dark:border-gray-700 transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-gold/20 dark:hover:border-gold/30">
            <div class="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-charcoal dark:text-white text-lg mb-3 group-hover:text-gold transition-colors">Produits de qualité</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Des soins sélectionnés pour les cheveux afro et crépus, testés et approuvés.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section témoignages WhatsApp dynamique -->
    <WhatsAppReviews />

    <section class="py-20 lg:py-28 bg-gradient-to-br from-charcoal via-gray-900 to-charcoal text-white relative overflow-hidden">
      <!-- Background decorations -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/10 rounded-full blur-[80px]"></div>
      </div>
      
      <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
        <span class="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-4">Prête à commencer ?</span>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          Transformez vos cheveux <br class="hidden sm:block" />
          <span class="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">dès aujourd'hui</span>
        </h2>
        <p class="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Réservez votre consultation capillaire personnalisée et découvrez 
          les soins parfaitement adaptés à vos besoins.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a
            :href="whatsappConsultationLink"
            target="_blank"
            rel="noopener"
            class="group relative inline-flex items-center gap-3 bg-gold text-charcoal px-8 py-4 rounded-full font-bold transition-all duration-500 hover:shadow-2xl hover:shadow-gold/30 hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            <svg class="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
            </svg>
            <span class="relative z-10">Réserver une consultation</span>
            <span class="absolute inset-0 bg-white/20 -translate-x-full skew-x-[-15deg] group-hover:translate-x-full transition-transform duration-700"></span>
          </a>
          <NuxtLink
            to="/produits"
            class="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold transition-all duration-500 hover:bg-white/20 hover:-translate-y-1 border border-white/10 hover:border-white/30"
          >
            Voir les produits
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <WhatsAppFloat />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

// ==========================================
// SEO OPTIMISÉ POUR GOOGLE
// ==========================================
useSeoMeta({
  // Titre principal (ce qui apparaît sur Google)
  title: 'Samiah Cosmetics Tchad — Soins Capillaires & Consultation',
  
  // Description (le texte sous le titre sur Google)
  description: 'Boutique de soins capillaires au Tchad. Diagnostic gratuit, produits naturels pour cheveux crépus et frisés. Livraison à N\'Djamena, Moundou, Sarh.',
  
  // Mots-clés
  keywords: 'samiah cosmetics, soins capillaires tchad, cheveux crépus n\'djamena, produits cheveux afro, coiffeuse tchad, routine capillaire',
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  ogType: 'website',
  ogSiteName: 'Samiah Cosmetics Tchad',
  ogTitle: 'Samiah Cosmetics Tchad — Soins Capillaires & Consultation',
  ogDescription: 'Boutique de soins capillaires au Tchad. Diagnostic gratuit, produits naturels pour cheveux crépus et frisés.',
  ogImage: 'https://samiahcosmetics.shop/icon-512.png',
  ogUrl: 'https://samiahcosmetics.shop',
  ogLocale: 'fr_TD',
  
  // Twitter
  twitterCard: 'summary_large_image',
  twitterTitle: 'Samiah Cosmetics Tchad — Soins Capillaires',
  twitterDescription: 'Boutique de soins capillaires au Tchad. Diagnostic gratuit, produits naturels pour cheveux crépus.',
  twitterImage: 'https://samiahcosmetics.shop/icon-512.png',
})

// URL canonique (dit à Google quelle est l'URL officielle)
useHead({
  link: [
    { rel: 'canonical', href: 'https://samiahcosmetics.shop' }
  ]
})

const config = useRuntimeConfig()
const { products, loading, fetchProducts } = useProducts()
const { addItem } = useCart()

// Fetch data
await fetchProducts()

// Featured products (8 premiers)
const featuredProducts = computed(() => products.value.slice(0, 8))

// WhatsApp link
const whatsappConsultationLink = computed(() => {
  const msg = encodeURIComponent('Bonjour Samiah Cosmetics, je souhaite réserver une consultation capillaire (10.000F).')
  return `https://wa.me/${config.public.whatsappNumber}?text=${msg}`
})

// Actions
const goToProduct = (product: Product) => {
  navigateTo(`/produits/${product.id}`)
}

const addToCart = (product: Product) => {
  addItem(product, 1)
}
</script>
