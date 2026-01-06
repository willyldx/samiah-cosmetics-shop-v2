<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-charcoal">
    <!-- Loading state -->
    <div v-if="pending" class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid lg:grid-cols-2 gap-12">
        <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse"></div>
        <div class="space-y-4 py-8">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
          <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
          <div class="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
    <!-- Product not found -->
    <div v-else-if="!product" class="max-w-7xl mx-auto px-4 py-24 text-center">
      <div class="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
        <svg class="w-14 h-14 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-charcoal dark:text-white mb-3">Produit introuvable</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-8">Ce produit n'existe pas ou a été supprimé.</p>
      <NuxtLink to="/produits" class="inline-flex items-center gap-2 bg-charcoal text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all hover:-translate-y-1 hover:shadow-xl">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Retour aux produits
      </NuxtLink>
    </div>
    <!-- Product detail -->
    <div v-else class="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <!-- Breadcrumb amélioré -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <NuxtLink to="/" class="hover:text-charcoal dark:hover:text-white transition-colors">Accueil</NuxtLink>
        <svg class="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        <NuxtLink to="/produits" class="hover:text-charcoal dark:hover:text-white transition-colors">Produits</NuxtLink>
        <svg class="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        <span class="text-charcoal dark:text-white font-medium truncate max-w-[200px]">{{ product.title }}</span>
      </nav>
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <!-- Image gallery -->
        <div class="space-y-4">
          <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden group relative">
            <img
              :src="currentImage"
              :alt="product.title"
              class="w-full h-full object-contain cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
            />
            <!-- Badge Nouveau -->
            <span
              v-if="isNew"
              class="absolute top-4 left-4 bg-gradient-to-r from-gold to-yellow-500 text-charcoal text-sm font-bold px-4 py-2 rounded-full shadow-lg"
            >
              ✨ Nouveau
            </span>
          </div>
          <!-- Thumbnails -->
          <div v-if="gallery.length > 1" class="flex gap-3 overflow-x-auto pb-2">
            <button
              v-for="(img, index) in gallery"
              :key="index"
              type="button"
              @click="currentImageIndex = index"
              class="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105"
              :class="currentImageIndex === index ? 'border-gold shadow-lg shadow-gold/20' : 'border-transparent hover:border-gray-300'"
            >
              <img
                :src="img"
                :alt="`${product.title} - image ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
        <!-- Product info -->
        <div class="lg:py-4 space-y-6">
          <!-- Category -->
          <p class="text-gold font-medium text-sm uppercase tracking-wider">{{ product.category }}</p>
          <!-- Title -->
          <h1 class="text-3xl lg:text-4xl font-bold text-charcoal dark:text-white leading-tight">
            {{ product.title }}
          </h1>
          <!-- Price -->
          <div class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gold to-yellow-600 bg-clip-text text-transparent">
            {{ formatPrice(product.price) }}
          </div>
          <!-- Description -->
          <p v-if="product.short_description" class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            {{ product.short_description }}
          </p>
          <!-- Cities -->
          <div v-if="product.cities && product.cities.length" class="space-y-2">
            <h3 class="text-sm font-bold text-charcoal dark:text-white uppercase tracking-wider">Disponible à :</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="city in product.cities"
                :key="city"
                class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                {{ city }}
              </span>
            </div>
          </div>
          <!-- Quantity -->
          <div class="space-y-3">
            <h3 class="text-sm font-bold text-charcoal dark:text-white uppercase tracking-wider">Quantité :</h3>
            <div class="flex items-center gap-4">
              <button
                type="button"
                @click="decreaseQuantity"
                class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 text-charcoal dark:text-white flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-lg font-bold disabled:opacity-50"
                :disabled="quantity <= 1"
              >
                -
              </button>
              <span class="text-2xl font-bold w-12 text-center text-charcoal dark:text-white">{{ quantity }}</span>
              <button
                type="button"
                @click="quantity++"
                class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 text-charcoal dark:text-white flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>
          <!-- Add to cart button -->
          <div class="pt-4">
            <button
              type="button"
              @click="handleAddToCart"
              class="group relative w-full bg-charcoal text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-3 overflow-hidden hover:shadow-2xl hover:-translate-y-1"
            >
              <svg class="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span class="relative z-10">Ajouter au panier</span>
              <span class="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
            </button>
          </div>
          <!-- Share -->
          <div class="pt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              @click="shareProduct"
              class="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors group"
            >
              <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
              </div>
              <span class="font-medium">Partager ce produit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <WhatsAppFloat />
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
