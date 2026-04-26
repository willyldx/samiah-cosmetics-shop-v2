<template>
  <article
    class="group relative bg-white dark:bg-charcoal rounded-sm overflow-hidden transition-all duration-500 cursor-pointer"
    @click="$emit('click', product)"
  >
    <!-- Badge -->
    <div
      v-if="isNew"
      class="absolute top-4 left-4 z-10 bg-white text-charcoal dark:bg-charcoal dark:text-white border border-gray-100 dark:border-gray-800 text-[10px] uppercase tracking-widest font-medium px-3 py-1 shadow-sm"
    >
      Nouveau
    </div>
    <div
      v-else-if="product.featured"
      class="absolute top-4 left-4 z-10 bg-gold text-white text-[10px] uppercase tracking-widest font-medium px-3 py-1 shadow-sm"
    >
      En vedette
    </div>

    <!-- Image Container -->
    <div class="relative aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-gray-900">
      <!-- Image Principale -->
      <img
        :src="primaryImage"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      
      <!-- Image Secondaire (au hover) -->
      <img
        v-if="secondaryImage"
        :src="secondaryImage"
        :alt="product.title"
        class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        loading="lazy"
      />

      <!-- Bouton Voir produit discret -->
      <div 
        class="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-center"
      >
        <span class="bg-white/90 dark:bg-charcoal/90 backdrop-blur-sm text-charcoal dark:text-white text-xs uppercase tracking-widest font-medium px-6 py-3 shadow-sm hover:bg-charcoal hover:text-white dark:hover:bg-white dark:hover:text-charcoal transition-colors duration-300">
          Découvrir
        </span>
      </div>
    </div>

    <!-- Infos Produit -->
    <div class="pt-5 pb-2 text-center space-y-1">
      <!-- Catégorie -->
      <p v-if="product.category" class="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
        {{ product.category }}
      </p>

      <!-- Titre -->
      <h3 class="font-serif text-lg text-charcoal dark:text-white line-clamp-1 group-hover:text-gold transition-colors duration-300">
        {{ product.title }}
      </h3>

      <!-- Prix -->
      <div class="pt-1">
        <span class="text-sm font-light text-gray-600 dark:text-gray-300">
          {{ formattedPrice }}
        </span>
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
