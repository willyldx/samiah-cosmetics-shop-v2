<template>
  <div class="min-h-screen bg-white pt-24 pb-16">
    <!-- Loading state -->
    <div v-if="pending" class="max-w-7xl mx-auto px-4">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div class="aspect-square bg-gray-50 animate-pulse"></div>
        <div class="space-y-6 lg:py-12">
          <div class="h-4 bg-gray-100 w-1/4 animate-pulse"></div>
          <div class="h-12 bg-gray-100 w-3/4 animate-pulse"></div>
          <div class="h-6 bg-gray-100 w-1/3 animate-pulse"></div>
          <div class="h-32 bg-gray-50 animate-pulse mt-8"></div>
        </div>
      </div>
    </div>

    <!-- Product not found -->
    <div v-else-if="!product" class="max-w-7xl mx-auto px-4 py-32 text-center">
      <h1 class="text-3xl font-serif font-light text-charcoal mb-4">Produit introuvable</h1>
      <p class="text-gray-400 font-light mb-8">Ce produit n'existe pas ou a été retiré de la collection.</p>
      <NuxtLink to="/produits" class="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-gray-200 text-charcoal text-[10px] font-medium tracking-[0.2em] uppercase hover:border-charcoal transition-colors duration-300">
        Retour à la collection
      </NuxtLink>
    </div>

    <!-- Product detail -->
    <div v-else class="max-w-7xl mx-auto px-4">
      <!-- Breadcrumb épuré -->
      <nav class="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-12">
        <NuxtLink to="/" class="hover:text-charcoal transition-colors">Accueil</NuxtLink>
        <span class="w-4 h-[1px] bg-gray-200"></span>
        <NuxtLink to="/produits" class="hover:text-charcoal transition-colors">Collection</NuxtLink>
        <span class="w-4 h-[1px] bg-gray-200"></span>
        <span class="text-charcoal truncate">{{ product.title }}</span>
      </nav>

      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        <!-- Image gallery -->
        <div class="space-y-4 sticky top-24">
          <div class="aspect-[4/5] bg-gray-50 relative group overflow-hidden">
            <img
              :src="currentImage"
              :alt="product.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <!-- Badge Nouveau -->
            <span
              v-if="isNew"
              class="absolute top-6 left-6 bg-white text-charcoal text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-2 shadow-sm"
            >
              Nouveau
            </span>
          </div>

          <!-- Thumbnails -->
          <div v-if="gallery.length > 1" class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button
              v-for="(img, index) in gallery"
              :key="index"
              type="button"
              @click="currentImageIndex = index"
              class="flex-shrink-0 w-24 h-24 relative overflow-hidden transition-all duration-300"
              :class="currentImageIndex === index ? 'opacity-100 ring-1 ring-charcoal ring-offset-2' : 'opacity-60 hover:opacity-100'"
            >
              <img
                :src="img"
                :alt="`${product.title} - vue ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Product info -->
        <div class="lg:py-8 space-y-10">
          
          <div class="space-y-4">
            <!-- Category -->
            <p v-if="product.category" class="text-gray-400 text-[10px] uppercase tracking-[0.2em]">{{ product.category }}</p>
            
            <!-- Title -->
            <h1 class="text-4xl lg:text-5xl font-serif font-light text-charcoal leading-tight">
              {{ product.title }}
            </h1>
            
            <!-- Price -->
            <div class="text-xl font-light text-gray-500 pt-2">
              {{ formatPrice(product.price) }}
            </div>
          </div>

          <!-- Description -->
          <div v-if="product.short_description" class="prose prose-sm text-gray-500 font-light leading-relaxed">
            <p>{{ product.short_description }}</p>
          </div>

          <div class="space-y-8 pt-8 border-t border-gray-100">
            <!-- Cities -->
            <div v-if="product.cities && product.cities.length" class="space-y-4">
              <h3 class="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Disponibilité</h3>
              <div class="flex flex-wrap gap-3">
                <span
                  v-for="city in product.cities"
                  :key="city"
                  class="border border-gray-200 text-charcoal text-[10px] uppercase tracking-[0.2em] px-4 py-2"
                >
                  {{ city }}
                </span>
              </div>
            </div>

            <!-- Add to cart Actions -->
            <div class="space-y-4">
              <div class="flex gap-4">
                <!-- Quantity -->
                <div class="flex items-center border border-gray-200">
                  <button
                    type="button"
                    @click="decreaseQuantity"
                    class="w-12 h-12 text-gray-400 hover:text-charcoal transition-colors flex items-center justify-center disabled:opacity-30"
                    :disabled="quantity <= 1"
                    aria-label="Diminuer la quantité"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 12H4"/></svg>
                  </button>
                  <span class="w-8 text-center text-charcoal font-light text-sm">{{ quantity }}</span>
                  <button
                    type="button"
                    @click="quantity++"
                    class="w-12 h-12 text-gray-400 hover:text-charcoal transition-colors flex items-center justify-center"
                    aria-label="Augmenter la quantité"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/></svg>
                  </button>
                </div>

                <!-- Add Button -->
                <button
                  type="button"
                  @click="handleAddToCart"
                  class="flex-1 bg-charcoal text-white text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-3"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>

          <!-- Share -->
          <div class="pt-8 flex items-center gap-4">
            <span class="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Partager</span>
            <span class="w-8 h-[1px] bg-gray-200"></span>
            <button
              type="button"
              @click="shareProduct"
              class="text-gray-400 hover:text-charcoal transition-colors"
              aria-label="Partager ce produit"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { fetchProduct } = useProducts()
const { addItem } = useCart()
const productId = route.params.id as string
const quantity = ref(1)
const currentImageIndex = ref(0)
const { data: product, pending } = await useAsyncData(
  `product-${productId}`,
  () => fetchProduct(productId)
)
useHead({
  title: computed(() => product.value ? `${product.value.title} - Samiah Cosmetics` : 'Produit - Samiah Cosmetics'),
  meta: [
    { name: 'description', content: computed(() => product.value?.short_description || 'Produit Samiah Cosmetics') }
  ]
})
const gallery = computed(() => {
  if (!product.value) return []
  const images: string[] = []
  if (product.value.image) images.push(product.value.image)
  if (product.value.images && product.value.images.length) {
    product.value.images.forEach((img: string) => {
      if (!images.includes(img)) images.push(img)
    })
  }
  return images.length > 0 ? images : ['/images/placeholder.svg']
})
const currentImage = computed(() => {
  return gallery.value[currentImageIndex.value] || '/images/placeholder.svg'
})
const isNew = computed(() => {
  if (!product.value?.created_at) return false
  const created = Date.parse(product.value.created_at)
  const twoDays = 2 * 24 * 60 * 60 * 1000
  return (Date.now() - created) <= twoDays
})
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--
}
const handleAddToCart = () => {
  if (product.value) {
    addItem(product.value, quantity.value)
    quantity.value = 1
  }
}
const shareProduct = async () => {
  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({
        title: product.value?.title,
        text: product.value?.short_description || '',
        url
      })
    } catch (e) {
      console.log('Share cancelled')
    }
  } else {
    await navigator.clipboard.writeText(url)
    alert('Lien copié !')
  }
}
</script>
