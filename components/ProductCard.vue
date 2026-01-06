<template>
  <article
    class="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-soft hover:shadow-strong dark:shadow-none dark:border dark:border-gray-700 transition-all duration-500 cursor-pointer transform hover:-translate-y-3"
    @click="$emit('click', product)"
  >
    <!-- Badge Nouveau (priorité 1) -->
    <div
      v-if="isNew"
      class="absolute top-4 left-4 z-10 bg-gradient-to-r from-gold to-yellow-500 text-charcoal text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-gold/30"
    >
      <span class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 bg-charcoal rounded-full animate-pulse"></span>
        Nouveau
      </span>
    </div>

    <!-- Badge En vedette (priorité 2 - affiché si pas nouveau) -->
    <div
      v-else-if="product.featured"
      class="absolute top-4 left-4 z-10 bg-charcoal text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
    >
      <svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      En vedette
    </div>

    <!-- Image Container -->
    <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <!-- Image Principale -->
      <img
        :src="primaryImage"
        :alt="product.title"
        class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      <!-- Image Secondaire (au hover) -->
      <img
        v-if="secondaryImage"
        :src="secondaryImage"
        :alt="product.title"
        class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-110"
        loading="lazy"
      />

      <!-- Overlay gradient au hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-charcoal/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <!-- Bouton Voir produit -->
      <div 
        class="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
      >
        <span class="flex items-center justify-center gap-2 bg-white text-charcoal text-sm font-bold px-4 py-3 rounded-xl shadow-lg w-full">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          Voir le produit
        </span>
      </div>
    </div>

    <!-- Infos Produit -->
    <div class="p-5 space-y-2">
      <!-- Catégorie -->
      <p v-if="product.category" class="text-xs font-medium text-gold uppercase tracking-wider">
        {{ product.category }}
      </p>

      <!-- Titre -->
      <h3 class="font-bold text-charcoal dark:text-white line-clamp-2 leading-snug group-hover:text-gold transition-colors duration-300">
        {{ product.title }}
      </h3>

      <!-- Description courte -->
      <p 
        v-if="product.short_description" 
        class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2"
      >
        {{ product.short_description }}
      </p>

      <!-- Prix -->
      <div class="pt-2 flex items-center justify-between">
        <span class="text-xl font-bold bg-gradient-to-r from-gold to-yellow-600 bg-clip-text text-transparent">
          {{ formattedPrice }}
        </span>
        
        <!-- Quick add button -->
        <button
          v-if="showAddToCart"
          class="w-10 h-10 bg-charcoal text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold hover:text-charcoal hover:scale-110 active:scale-95"
          @click.stop="$emit('add-to-cart', product)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
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
