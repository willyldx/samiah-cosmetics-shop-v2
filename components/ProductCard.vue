<template>
  <article
    class="group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
    @click="$emit('click', product)"
  >
    <!-- Badge Nouveau -->
    <div
      v-if="isNew"
      class="absolute top-3 left-3 z-10 bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse-soft"
    >
      Nouveau
    </div>

    <!-- Image Container -->
    <div class="relative aspect-square overflow-hidden bg-gray-50">
      <!-- Image Principale -->
      <img
        :src="optimizedImage"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      <!-- Image Secondaire (au hover) -->
      <img
        v-if="secondaryImage"
        :src="optimizedSecondaryImage"
        :alt="product.title"
        class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        loading="lazy"
      />

      <!-- Overlay au hover -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

      <!-- Bouton Voir produit -->
      <div 
        class="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
      >
        <span class="bg-white text-charcoal text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
          Voir le produit
        </span>
      </div>
    </div>

    <!-- Infos Produit -->
    <div class="p-4 space-y-2">
      <!-- Titre -->
      <h3 class="font-semibold text-charcoal line-clamp-2 leading-tight group-hover:text-gold transition-colors">
        {{ product.title }}
      </h3>

      <!-- Catégorie -->
      <p v-if="product.category" class="text-sm text-gray-500">
        {{ product.category }}
      </p>

      <!-- Description courte -->
      <p 
        v-if="product.short_description" 
        class="text-sm text-gray-400 line-clamp-2"
      >
        {{ product.short_description }}
      </p>

      <!-- Prix -->
      <div class="pt-2">
        <span class="text-lg font-bold text-gold">
          {{ formattedPrice }}
        </span>
      </div>
    </div>

    <!-- Bouton Ajouter au panier (mobile) -->
    <button
      v-if="showAddToCart"
      class="absolute bottom-4 right-4 w-10 h-10 bg-charcoal text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold hover:text-charcoal md:hidden"
      @click.stop="$emit('add-to-cart', product)"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps<{
  product: Product
  showAddToCart?: boolean
}>()

defineEmits<{
  click: [product: Product]
  'add-to-cart': [product: Product]
}>()

const { isNewProduct, getOptimizedImageUrl, buildGallery } = useProducts()

// Computed
const isNew = computed(() => isNewProduct(props.product))

const gallery = computed(() => buildGallery(props.product))

const primaryImage = computed(() => 
  gallery.value[0] || '/images/placeholder.png'
)

const secondaryImage = computed(() => 
  gallery.value[1] || null
)

const optimizedImage = computed(() => 
  getOptimizedImageUrl(primaryImage.value, 400)
)

const optimizedSecondaryImage = computed(() => 
  secondaryImage.value ? getOptimizedImageUrl(secondaryImage.value, 400) : null
)

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('fr-FR').format(props.product.price) + ' FCFA'
})
</script>
