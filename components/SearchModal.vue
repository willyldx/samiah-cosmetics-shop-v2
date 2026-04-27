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
        class="fixed inset-0 bg-white/95 backdrop-blur-sm z-[200]"
        @click="$emit('close')"
      />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-400 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-if="isOpen"
        class="fixed top-0 left-0 right-0 md:top-12 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl 
               bg-white z-[201] overflow-hidden border-b md:border border-gray-200 shadow-sm"
        @keydown="handleKeydown"
      >
        <!-- Search Header -->
        <div class="relative flex items-center gap-4 px-6 py-6 border-b border-gray-100 bg-white">
          <div class="text-charcoal flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Rechercher un produit..."
            class="flex-1 bg-transparent outline-none text-lg font-light text-charcoal placeholder:text-gray-300"
            @keydown.escape="$emit('close')"
          />
          
          <button
            v-if="query"
            @click="query = ''"
            class="p-2 text-gray-400 hover:text-charcoal transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div v-else class="hidden md:flex items-center gap-1">
            <kbd class="px-2 py-1 text-[9px] font-mono tracking-widest text-gray-400 border border-gray-200">ESC</kbd>
          </div>
        </div>

        <div class="max-h-[60vh] overflow-y-auto scrollbar-thin">
          
          <div v-if="loading" class="py-16 text-center text-gray-400">
            <div class="w-8 h-8 border border-gray-200 border-t-charcoal rounded-full animate-spin mx-auto mb-4" />
            <span class="text-[10px] uppercase tracking-[0.2em] font-medium">Recherche...</span>
          </div>

          <div v-else-if="query && results.length === 0" class="py-16 text-center">
            <p class="text-lg font-serif text-charcoal mb-2">Aucun résultat pour "{{ query }}"</p>
            <p class="text-xs text-gray-400 font-light">Essayez avec un autre mot-clé.</p>
          </div>

          <div v-else-if="results.length > 0" class="py-2">
            <div class="px-6 py-4 flex items-center justify-between border-b border-gray-50">
              <span class="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em]">Suggérés</span>
              <span class="text-[10px] text-gray-400 font-light">{{ results.length }} résultat{{ results.length > 1 ? 's' : '' }}</span>
            </div>
            
            <NuxtLink
              v-for="(product, index) in results"
              :key="product.id"
              :to="`/produits/${product.id}`"
              class="group flex items-center gap-6 px-6 py-4 border-b border-gray-50 last:border-0 transition-colors cursor-pointer"
              :class="selectedIndex === index ? 'bg-gray-50' : 'hover:bg-gray-50'"
              @click="$emit('close')"
              @mouseenter="selectedIndex = index"
            >
              <div class="relative w-16 h-20 overflow-hidden bg-gray-100">
                <img
                  :src="getImageUrl(product.image)"
                  :alt="product.title"
                  class="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">{{ product.category }}</p>
                <h4 class="font-serif text-lg text-charcoal truncate">
                  {{ product.title }}
                </h4>
              </div>

              <div class="text-right flex flex-col items-end">
                <span class="text-sm font-light text-charcoal">{{ formatPrice(product.price) }}</span>
                <span class="text-[10px] uppercase tracking-widest text-charcoal opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                  Découvrir
                </span>
              </div>
            </NuxtLink>
          </div>

          <div v-else class="py-16 text-center">
            <p class="text-gray-400 text-sm font-light mb-6">Saisissez un terme de recherche...</p>
            <div class="flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest text-gray-400">
              <span class="flex items-center gap-1"><kbd class="border border-gray-200 px-1.5 py-0.5">↑</kbd><kbd class="border border-gray-200 px-1.5 py-0.5">↓</kbd> naviguer</span>
              <span class="flex items-center gap-1"><kbd class="border border-gray-200 px-1.5 py-0.5">↵</kbd> sélectionner</span>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
          <span class="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
            Catalogue complet
          </span>
          <NuxtLink 
            to="/produits" 
            @click="$emit('close')"
            class="text-[10px] uppercase tracking-widest text-charcoal border-b border-transparent hover:border-charcoal transition-colors pb-0.5"
          >
            Explorer la boutique
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const { products, fetchProducts, getOptimizedImageUrl } = useProducts()

const query = ref('')
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const selectedIndex = ref(0)

// Reset selected index when results change
watch(() => query.value, () => {
  selectedIndex.value = 0
})

watch(() => props.isOpen, async (open) => {
  if (open) {
    await nextTick()
    inputRef.value?.focus()
    selectedIndex.value = 0
    if (products.value.length === 0) {
      loading.value = true
      await fetchProducts()
      loading.value = false
    }
  } else {
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

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (results.value.length > 0) {
        selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      if (results.value[selectedIndex.value]) {
        router.push(`/produits/${results.value[selectedIndex.value].id}`)
        emit('close')
      }
      break
  }
}

const getImageUrl = (url: string | null) => {
  return url ? getOptimizedImageUrl(url, 100) : '/images/placeholder.png'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}
</script>

