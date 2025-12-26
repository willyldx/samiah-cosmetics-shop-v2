<template>
  <article
    class="group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
    @click="$emit('click', product)"
  >
    <!-- Badge Nouveau (priorité 1) -->
    <div
      v-if="isNew"
      class="absolute top-3 left-3 z-10 bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse-soft"
    >
      Nouveau
    </div>

    <!-- Badge En vedette (priorité 2 - affiché si pas nouveau) -->
    <div
      v-else-if="product.featured"
      class="absolute top-3 left-3 z-10 bg-charcoal text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1"
    >
      <svg class="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      En vedette
    </div>

    <!-- Image Container -->
    <div class="relative aspect-square overflow-hidden bg-gray-50">
      <!-- Image Principale -->
      <img
        :src="primaryImage"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      <!-- Image Secondaire (au hover) -->
      <img
        v-if="secondaryImage"
        :src="secondaryImage"
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

// Computed
const isNew = computed(() => {
  if (!props.product.created_at) return false
  const created = Date.parse(props.product.created_at)
  const fortyEightHours = 48 * 60 * 60 * 1000 // 48 heures
  return (Date.now() - created) <= fortyEightHours
})

const primaryImage = computed(() => {
  return props.product.image || props.product.images?.[0] || '/images/placeholder.svg'
})

const secondaryImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    if (props.product.image) {
      return props.product.images[0]
    }
    return props.product.images[1] || null
  }
  return null
})

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('fr-FR').format(props.product.price) + ' FCFA'
})
</script>
