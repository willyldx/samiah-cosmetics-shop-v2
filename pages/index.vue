<template>
  <div class="bg-white font-sans">
    <HeroSection />

    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col items-center text-center mb-16">
          <span class="text-[10px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-4 flex items-center gap-4">
            <span class="w-8 h-px bg-gray-200"></span>
            La Collection
            <span class="w-8 h-px bg-gray-200"></span>
          </span>
          <h2 class="text-3xl lg:text-4xl font-serif font-light text-charcoal">
            Nos produits phares
          </h2>
        </div>

        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          <SkeletonLoader v-for="i in 8" :key="i" type="product-card" />
        </div>

        <div v-else-if="featuredProducts.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @click="goToProduct(product)"
            @add-to-cart="addToCart"
          />
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-400 font-light text-sm">Aucun produit disponible pour le moment.</p>
        </div>

        <div class="mt-20 text-center">
          <NuxtLink 
            to="/produits"
            class="inline-block border-b border-charcoal pb-1 text-[10px] font-medium tracking-[0.2em] uppercase text-charcoal hover:text-gold hover:border-gold transition-colors duration-300"
          >
            Découvrir tout le catalogue
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-24 bg-gray-50 border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-20">
          <h2 class="text-3xl lg:text-4xl font-serif font-light text-charcoal">L'Excellence Samiah</h2>
        </div>
        
        <div class="grid md:grid-cols-3 gap-12 lg:gap-16">
          <div class="text-center group flex flex-col items-center">
            <span class="w-12 h-px bg-gold mb-8 opacity-50 group-hover:w-16 transition-all duration-300"></span>
            <h3 class="font-serif text-charcoal text-xl mb-4 group-hover:text-gold transition-colors">Sur mesure</h3>
            <p class="text-gray-500 font-light leading-relaxed text-sm">
              Une analyse complète de vos cheveux et une routine sur mesure adaptée à vos besoins spécifiques.
            </p>
          </div>

          <div class="text-center group flex flex-col items-center">
            <span class="w-12 h-px bg-gold mb-8 opacity-50 group-hover:w-16 transition-all duration-300"></span>
            <h3 class="font-serif text-charcoal text-xl mb-4 group-hover:text-gold transition-colors">Accessibilité</h3>
            <p class="text-gray-500 font-light leading-relaxed text-sm">
              Livraison rapide et sécurisée disponible dans les grandes villes du Tchad : N'Djamena, Moundou, Sarh.
            </p>
          </div>

          <div class="text-center group flex flex-col items-center">
            <span class="w-12 h-px bg-gold mb-8 opacity-50 group-hover:w-16 transition-all duration-300"></span>
            <h3 class="font-serif text-charcoal text-xl mb-4 group-hover:text-gold transition-colors">Exigence</h3>
            <p class="text-gray-500 font-light leading-relaxed text-sm">
              Des soins rigoureusement sélectionnés pour les cheveux texturés, testés et approuvés pour leur efficacité.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section témoignages WhatsApp dynamique -->
    <WhatsAppReviews />

    <section class="py-32 bg-white relative">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <span class="inline-flex items-center gap-4 text-[10px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-8">
          <span class="w-6 h-px bg-gold"></span>
          Commencez l'expérience
          <span class="w-6 h-px bg-gold"></span>
        </span>
        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-charcoal mb-8 leading-tight">
          Votre routine commence <br/>
          <i class="text-gold font-serif">aujourd'hui</i>
        </h2>
        <p class="text-gray-500 text-lg font-light mb-12 max-w-xl mx-auto">
          Réservez votre consultation capillaire personnalisée et découvrez 
          les soins parfaitement adaptés à votre nature.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            :href="whatsappConsultationLink"
            target="_blank"
            rel="noopener"
            class="w-full sm:w-auto px-10 py-4 bg-charcoal text-white text-[10px] font-medium tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-300 text-center"
          >
            Réserver
          </a>
          <NuxtLink
            to="/produits"
            class="w-full sm:w-auto px-10 py-4 bg-transparent border border-gray-200 text-charcoal text-[10px] font-medium tracking-[0.2em] uppercase hover:border-charcoal transition-colors duration-300 text-center"
          >
            Explorer
          </NuxtLink>
        </div>
      </div>
    </section>
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
