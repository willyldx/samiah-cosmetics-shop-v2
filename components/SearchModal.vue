<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Modal -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-4"
    >
      <div 
        v-if="isOpen"
        class="fixed top-4 left-4 right-4 md:top-24 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
        <!-- Input -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Rechercher un produit..."
            class="flex-1 bg-transparent outline-none text-charcoal placeholder:text-gray-400"
            @keydown.escape="$emit('close')"
          />
          <button
            v-if="query"
            @click="query = ''"
            class="p-1 hover:bg-gray-100 rounded-full"
          >
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <kbd class="hidden md:inline-flex items-center px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded">
            ESC
          </kbd>
        </div>

        <!-- Résultats -->
        <div class="max-h-80 overflow-y-auto">
          <!-- Loading -->
          <div v-if="loading" class="p-8 text-center text-gray-500">
            <div class="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Recherche...
          </div>

          <!-- Aucun résultat -->
          <div v-else-if="query && results.length === 0" class="p-8 text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Aucun produit trouvé pour "{{ query }}"</p>
          </div>

          <!-- Résultats -->
          <div v-else-if="results.length > 0" class="py-2">
            <NuxtLink
              v-for="product in results"
              :key="product.id"
              :to="`/produits/${product.id}`"
              class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
              @click="$emit('close')"
            >
              <img
                :src="getImageUrl(product.image)"
                :alt="product.title"
                class="w-12 h-12 rounded-lg object-cover bg-gray-100"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-charcoal truncate">{{ product.title }}</h4>
                <p class="text-sm text-gray-500">{{ product.category }}</p>
              </div>
              <span class="text-gold font-bold">{{ formatPrice(product.price) }}</span>
            </NuxtLink>
          </div>

          <!-- État initial -->
          <div v-else class="p-6 text-center text-gray-400 text-sm">
            Tapez pour rechercher un produit
          </div>
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

const { products, fetchProducts, getOptimizedImageUrl } = useProducts()

const query = ref('')
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

// Focus sur l'input à l'ouverture
watch(() => props.isOpen, async (open) => {
  if (open) {
    await nextTick()
    inputRef.value?.focus()
    if (products.value.length === 0) {
      await fetchProducts()
    }
  } else {
    query.value = ''
  }
})

// Recherche avec debounce
const results = computed(() => {
  if (!query.value.trim()) return []
  
  const q = query.value.toLowerCase()
  return products.value
    .filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.short_description?.toLowerCase().includes(q)
    )
    .slice(0, 6)
})

const getImageUrl = (url: string | null) => {
  return url ? getOptimizedImageUrl(url, 100) : '/images/placeholder.png'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' F'
}

// Raccourci clavier Cmd/Ctrl + K
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      if (!props.isOpen) {
        // Ouvrir via parent
      }
    }
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>
