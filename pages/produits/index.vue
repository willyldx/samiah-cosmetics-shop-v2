<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="bg-gray-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-16 lg:py-24 text-center">
        <span class="inline-flex items-center gap-2 text-gold font-medium text-[10px] uppercase tracking-widest mb-4">
          <span class="w-6 h-px bg-gold"></span>
          Catalogue
          <span class="w-6 h-px bg-gold"></span>
        </span>
        <h1 class="text-3xl lg:text-5xl font-serif font-light text-charcoal">
          Nos Produits
        </h1>
        <p class="text-gray-500 font-light mt-4 max-w-xl mx-auto text-sm">
          Découvrez notre sélection de soins capillaires naturels pour sublimer vos cheveux
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Filtres -->
      <div class="mb-12">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Recherche -->
          <div class="flex-1 min-w-[200px]">
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Rechercher un produit..."
                class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-none focus:outline-none focus:bg-white focus:border-gray-200 transition-all text-sm text-charcoal placeholder:text-gray-400 font-light"
              />
            </div>
          </div>

          <!-- Catégorie -->
          <select
            v-model="filters.category"
            class="px-4 py-3 bg-gray-50 border border-transparent focus:outline-none focus:bg-white focus:border-gray-200 transition-all cursor-pointer text-sm text-charcoal font-light rounded-none min-w-[150px]"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>

          <!-- Ville -->
          <select
            v-model="filters.city"
            class="px-4 py-3 bg-gray-50 border border-transparent focus:outline-none focus:bg-white focus:border-gray-200 transition-all cursor-pointer text-sm text-charcoal font-light rounded-none min-w-[150px]"
          >
            <option value="Toutes">Toutes les villes</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>

          <!-- Tri -->
          <select
            v-model="filters.sort"
            class="px-4 py-3 bg-gray-50 border border-transparent focus:outline-none focus:bg-white focus:border-gray-200 transition-all cursor-pointer text-sm text-charcoal font-light rounded-none min-w-[150px]"
          >
            <option value="newest">Plus récents</option>
            <option value="oldest">Plus anciens</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="title_asc">Nom A-Z</option>
          </select>
        </div>

        <!-- Résultats count -->
        <div class="mt-4 flex items-center justify-between">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">
            <span class="text-charcoal">{{ filteredProducts.length }}</span> résultat{{ filteredProducts.length > 1 ? 's' : '' }}
          </span>
          <button 
            v-if="filters.search || filters.category !== 'Toutes' || filters.city !== 'Toutes'"
            @click="resetFilters"
            class="text-[10px] tracking-widest uppercase text-charcoal hover:text-gold transition-colors font-medium border-b border-transparent hover:border-gold pb-0.5"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        <SkeletonLoader v-for="i in 12" :key="i" type="product-card" />
      </div>

      <!-- Produits -->
      <div v-else-if="filteredProducts.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
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
      <div v-else class="text-center py-32 border border-gray-100">
        <p class="text-lg font-serif text-charcoal mb-4">Aucun produit trouvé</p>
        <p class="text-gray-500 font-light text-sm mb-8">Essayez de modifier vos filtres de recherche.</p>
        <button
          @click="resetFilters"
          class="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase bg-charcoal text-white px-8 py-3 hover:bg-gold transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>


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
