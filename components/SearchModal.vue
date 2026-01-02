<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-charcoal/60 backdrop-blur-md z-[60]"
        @click="$emit('close')"
      />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="opacity-0 scale-95 -translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-4"
    >
      <div 
        v-if="isOpen"
        class="fixed top-4 left-4 right-4 md:top-24 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl 
               bg-white rounded-3xl shadow-strong z-[70] overflow-hidden border border-gray-100"
      >
        <div class="relative flex items-center gap-4 px-6 py-5 border-b border-gray-100">
          <svg class="w-6 h-6 text-gold animate-pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Rechercher un produit, une catégorie..."
            class="flex-1 bg-transparent outline-none text-xl font-medium text-charcoal placeholder:text-gray-300"
            @keydown.escape="$emit('close')"
          />
          
          <button
            v-if="query"
            @click="query = ''"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-charcoal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div v-else class="hidden md:flex items-center gap-1">
            <kbd class="px-2 py-1 text-[10px] font-bold text-gray-400 bg-gray-100 rounded-lg border border-gray-200">ESC</kbd>
          </div>
        </div>

        <div class="max-h-[60vh] overflow-y-auto scrollbar-thin">
          
          <div v-if="loading" class="py-12 text-center text-gray-500">
            <div class="w-10 h-10 border-3 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-3" />
            <span class="animate-pulse">Recherche en cours...</span>
          </div>

          <div v-else-if="query && results.length === 0" class="py-12 text-center">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-charcoal font-medium">Aucun résultat pour "{{ query }}"</p>
            <p class="text-sm text-gray-400 mt-1">Essayez avec un autre mot-clé.</p>
          </div>

          <div v-else-if="results.length > 0" class="p-2 space-y-1">
            <p class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Produits suggérés</p>
            
            <NuxtLink
              v-for="(product, index) in results"
              :key="product.id"
              :to="`/produits/${product.id}`"
              class="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gold/5 cursor-pointer"
              :class="`animate-fade-in-up delay-[${index * 50}ms]`"
              @click="$emit('close')"
            >
              <div class="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 group-hover:border-gold/30 transition-colors">
                <img
                  :src="getImageUrl(product.image)"
                  :alt="product.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-charcoal group-hover:text-gold transition-colors truncate">
                  {{ product.title }}
                </h4>
                <p class="text-sm text-gray-500 truncate">{{ product.category }}</p>
              </div>

              <div class="text-right">
                <span class="block font-bold text-charcoal">{{ formatPrice(product.price) }}</span>
                <span class="text-xs text-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 inline-block">
                  Voir →
                </span>
              </div>
            </NuxtLink>
          </div>

          <div v-else class="py-12 text-center text-gray-400">
            <p class="text-sm">Commencez à taper pour rechercher...</p>
          </div>
        </div>
        
        <div class="h-1 w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// On garde la même logique JS, elle était bonne !
// J'ai juste ajouté une petite animation de délai dans le template pour le rendu
import type { Product } from '~/types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { products, fetchProducts, getOptimizedImageUrl } = useProducts()

const query = ref('')
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => props.isOpen, async (open) => {
  if (open) {
    await nextTick()
    inputRef.value?.focus()
    // Pré-charger les produits si vide pour que la recherche soit instantanée
    if (products.value.length === 0) {
      loading.value = true
      await fetchProducts()
      loading.value = false
    }
  } else {
    // Petit délai pour vider après la fermeture (animation)
    setTimeout(() => { query.value = '' }, 300)
  }
})

const results = computed(() => {
  if (!query.value.trim()) return []
  
  const q = query.value.toLowerCase()
  return products.value
    .filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
    .slice(0, 6)
})

const getImageUrl = (url: string | null) => {
  return url ? getOptimizedImageUrl(url, 100) : '/images/placeholder.png'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}
</script>
