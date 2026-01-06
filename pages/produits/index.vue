<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-charcoal">
    <!-- Header amélioré -->
    <div class="bg-gradient-to-br from-charcoal via-gray-900 to-charcoal text-white relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-0 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-[80px]"></div>
      </div>
      <div class="max-w-7xl mx-auto px-4 py-12 lg:py-16 relative z-10">
        <span class="text-gold font-medium text-sm uppercase tracking-wider">Catalogue</span>
        <h1 class="text-3xl lg:text-5xl font-serif font-bold mt-2">
          Nos <span class="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">Produits</span>
        </h1>
        <p class="text-white/70 mt-3 max-w-xl text-lg">
          Découvrez notre sélection de soins capillaires naturels pour sublimer vos cheveux
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Filtres modernisés -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-soft dark:shadow-none dark:border dark:border-gray-700 p-5 mb-8 border border-gray-100">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Recherche -->
          <div class="flex-1 min-w-[200px]">
            <div class="relative group">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Rechercher un produit..."
                class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:border-gold/50 focus:shadow-lg focus:shadow-gold/10 transition-all text-charcoal dark:text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <!-- Catégorie -->
          <select
            v-model="filters.category"
            class="px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-gold/50 transition-all cursor-pointer text-charcoal font-medium"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>

          <!-- Ville -->
          <select
            v-model="filters.city"
            class="px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-gold/50 transition-all cursor-pointer text-charcoal font-medium"
          >
            <option value="Toutes">Toutes les villes</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>

          <!-- Tri -->
          <select
            v-model="filters.sort"
            class="px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-gold/50 transition-all cursor-pointer text-charcoal font-medium"
          >
            <option value="newest">Plus récents</option>
            <option value="oldest">Plus anciens</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="title_asc">Nom A-Z</option>
          </select>
        </div>

        <!-- Résultats count -->
        <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span class="text-sm text-gray-500">
            <span class="font-bold text-charcoal">{{ filteredProducts.length }}</span> produit{{ filteredProducts.length > 1 ? 's' : '' }} trouvé{{ filteredProducts.length > 1 ? 's' : '' }}
          </span>
          <button 
            v-if="filters.search || filters.category !== 'Toutes' || filters.city !== 'Toutes'"
            @click="resetFilters"
            class="text-sm text-gold hover:text-yellow-600 font-medium flex items-center gap-1 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        <div v-for="i in 12" :key="i" class="animate-pulse">
          <div class="aspect-square bg-gray-200 rounded-3xl mb-4" />
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div class="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      <!-- Produits -->
      <div v-else-if="filteredProducts.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          show-add-to-cart
          @click="goToProduct(product)"
          @add-to-cart="addToCart"
        />
      </div>

      <!-- Aucun produit -->
      <div v-else class="text-center py-20">
        <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-charcoal mb-2">Aucun produit trouvé</h3>
        <p class="text-gray-500 mb-6">Essayez de modifier vos filtres de recherche</p>
        <button
          @click="resetFilters"
          class="inline-flex items-center gap-2 bg-gold text-charcoal px-6 py-3 rounded-full font-bold hover:bg-yellow-500 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Réinitialiser les filtres
        </button>
      </div>
    </div>

    <WhatsAppFloat />
  </div>
</template>

<script setup lang="ts">
import type { Product, SortOption } from '~/types'
import { CHAD_CITIES } from '~/types'

useHead({
  title: 'Produits — Samiah Cosmetics',
  meta: [
    { name: 'description', content: 'Découvrez notre sélection de produits cosmétiques et soins capillaires au Tchad.' }
  ]
})

const { products, loading, fetchProducts, filterProducts, categories } = useProducts()
const { addItem } = useCart()

const cities = CHAD_CITIES

const filters = reactive({
  search: '',
  category: 'Toutes',
  city: 'Toutes',
  sort: 'newest' as SortOption
})

// Fetch products
await fetchProducts()

// Filtered products
const filteredProducts = computed(() => {
  return filterProducts(products.value, {
    search: filters.search,
    category: filters.category === 'Toutes' ? null : filters.category,
    city: filters.city === 'Toutes' ? null : filters.city,
    sort: filters.sort
  })
})

// Actions
const goToProduct = (product: Product) => {
  navigateTo(`/produits/${product.id}`)
}

const addToCart = (product: Product) => {
  addItem(product, 1)
}

const resetFilters = () => {
  filters.search = ''
  filters.category = 'Toutes'
  filters.city = 'Toutes'
  filters.sort = 'newest'
}
</script>
