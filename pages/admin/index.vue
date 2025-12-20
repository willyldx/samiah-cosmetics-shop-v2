<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />

    <!-- Produits vedettes -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Header -->
        <div class="flex items-end justify-between mb-10">
          <div>
            <span class="text-gold font-medium text-sm uppercase tracking-wider">Catalogue</span>
            <h2 class="text-3xl lg:text-4xl font-bold text-charcoal mt-2">
              Nos produits
            </h2>
          </div>
          <NuxtLink 
            to="/produits"
            class="hidden sm:flex items-center gap-2 text-charcoal font-medium hover:text-gold transition-colors group"
          >
            Voir tout
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </NuxtLink>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          <div v-for="i in 8" :key="i" class="animate-pulse">
            <div class="aspect-square bg-gray-200 rounded-2xl mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <!-- Produits -->
        <div v-else-if="featuredProducts.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @click="goToProduct(product)"
            @add-to-cart="addToCart"
          />
        </div>

        <!-- Aucun produit -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500">Aucun produit disponible pour le moment.</p>
        </div>

        <!-- CTA Mobile -->
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

    <!-- Section Avantages -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Conseils personnalises -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-charcoal mb-2">Conseils personnalises</h3>
            <p class="text-gray-600 text-sm">Une analyse complete de vos cheveux et une routine sur mesure.</p>
          </div>

          <!-- Livraison -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
              </svg>
            </div>
            <h3 class="font-bold text-charcoal mb-2">Livraison au Tchad</h3>
            <p class="text-gray-600 text-sm">Disponible dans les grandes villes : N'Djamena, Moundou, Sarh...</p>
          </div>

          <!-- Qualite -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-charcoal mb-2">Produits de qualite</h3>
            <p class="text-gray-600 text-sm">Des soins selectionnes pour les cheveux afro et crepus.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Temoignages -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-gold font-medium text-sm uppercase tracking-wider">Temoignages</span>
          <h2 class="text-3xl lg:text-4xl font-bold text-charcoal mt-2">
            Ce que disent nos clientes
          </h2>
        </div>

        <!-- Loading -->
        <div v-if="testimonialsLoading" class="grid md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="animate-pulse bg-gray-100 rounded-2xl h-48"></div>
        </div>

        <!-- Temoignages -->
        <div v-else-if="testimonials.length" class="grid md:grid-cols-3 gap-6">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                <span class="text-gold font-bold">
                  {{ getInitial(testimonial.client_name) }}
                </span>
              </div>
              <div>
                <h4 class="font-semibold text-charcoal">{{ testimonial.client_name }}</h4>
                <p class="text-sm text-gray-500">{{ testimonial.city || 'Tchad' }}</p>
              </div>
            </div>
            <div v-if="testimonial.rating" class="text-gold mb-2">
              {{ getStars(testimonial.rating) }}
            </div>
            <p class="text-gray-600 text-sm line-clamp-3">
              "{{ testimonial.message }}"
            </p>
          </div>
        </div>

        <!-- Vide -->
        <div v-else class="text-center text-gray-500 py-12">
          Les temoignages arrivent bientot...
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-16 lg:py-24 bg-charcoal text-white">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold mb-4">
          Prete a transformer vos cheveux ?
        </h2>
        <p class="text-white/70 max-w-xl mx-auto mb-8">
          Reservez votre consultation capillaire personnalisee et decouvrez 
          les soins adaptes a vos besoins.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a
            :href="whatsappConsultationLink"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 bg-gold text-charcoal px-8 py-4 rounded-full font-bold hover:bg-yellow-400 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
            </svg>
            Reserver une consultation - 10 000 F
          </a>
          <NuxtLink
            to="/produits"
            class="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-colors"
          >
            Voir les produits
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Bouton WhatsApp flottant -->
    <WhatsAppFloat />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

useHead({
  title: 'Samiah Cosmetics - Consultation capillaire et produits au Tchad',
  meta: [
    { name: 'description', content: 'Consultation capillaire en ligne et produits cosmetiques au Tchad. Reservez via WhatsApp.' }
  ]
})

const config = useRuntimeConfig()
const { products, loading, fetchProducts } = useProducts()
const { testimonials, loading: testimonialsLoading, fetchTestimonials } = useTestimonials()
const { addItem } = useCart()

// Fetch data
await fetchProducts()
await fetchTestimonials(6)

// Featured products (8 premiers)
const featuredProducts = computed(() => products.value.slice(0, 8))

// WhatsApp link
const whatsappConsultationLink = computed(() => {
  const msg = encodeURIComponent('Bonjour Samiah Cosmetics, je souhaite reserver une consultation capillaire (10.000F).')
  return `https://wa.me/${config.public.whatsappNumber}?text=${msg}`
})

// Helpers
const getInitial = (name: string | null) => {
  return name ? name.charAt(0).toUpperCase() : '?'
}

const getStars = (rating: number) => {
  const full = Math.floor(rating)
  const empty = 5 - full
  return '★'.repeat(full) + '☆'.repeat(empty)
}

// Actions
const goToProduct = (product: Product) => {
  navigateTo(`/produits/${product.id}`)
}

const addToCart = (product: Product) => {
  addItem(product, 1)
}
</script>
