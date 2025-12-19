<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-container mx-auto px-4 py-8 lg:py-12">
        <h1 class="text-3xl lg:text-4xl font-serif font-bold text-charcoal">
          Nos Produits
        </h1>
        <p class="text-gray-600 mt-2">
          Découvrez notre sélection de soins capillaires
        </p>
      </div>
    </div>

    <div class="max-w-container mx-auto px-4 py-8">
      <!-- Filtres -->
      <div class="bg-white rounded-2xl shadow-soft p-4 mb-8">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Recherche -->
          <div class="flex-1 min-w-[200px]">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Rechercher..."
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
              />
            </div>
          </div>

          <!-- Catégorie -->
          <select
            v-model="filters.category"
            class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>

          <!-- Ville -->
          <select
            v-model="filters.city"
            class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
          >
            <option value="Toutes">Toutes les villes</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>

          <!-- Tri -->
          <select
            v-model="filters.sort"
            class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
          >
            <option value="newest">Plus récents</option>
            <option value="oldest">Plus anciens</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="title_asc">Nom A-Z</option>
          </select>
        </div>

        <!-- Résultats count -->
        <div class="mt-4 text-sm text-gray-500">
          {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }} trouvé{{ filteredProducts.length > 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        <div v-for="i in 12" :key="i" class="animate-pulse">
          <div class="aspect-square bg-gray-200 rounded-2xl mb-4" />
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
      <div v-else class="text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-charcoal mb-2">Aucun produit trouvé</h3>
        <p class="text-gray-500 mb-4">Essayez de modifier vos filtres</p>
        <button
          @click="resetFilters"
          class="text-gold font-medium hover:underline"
        >
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
