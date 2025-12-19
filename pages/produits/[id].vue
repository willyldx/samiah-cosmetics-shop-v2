<template>
  <div class="min-h-screen bg-white">
    <!-- Loading -->
    <div v-if="pending" class="max-w-container mx-auto px-4 py-12">
      <div class="grid lg:grid-cols-2 gap-12">
        <div class="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
        <div class="space-y-4">
          <div class="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div class="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div class="h-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="max-w-container mx-auto px-4 py-24 text-center">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-charcoal mb-2">Produit introuvable</h1>
      <p class="text-gray-500 mb-6">Ce produit n'existe pas ou a été supprimé.</p>
      <NuxtLink to="/produits" class="bg-charcoal text-white px-6 py-3 rounded-full font-medium">
        Retour aux produits
      </NuxtLink>
    </div>

    <!-- Product Detail -->
    <div v-else class="max-w-container mx-auto px-4 py-8 lg:py-12">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <NuxtLink to="/" class="hover:text-charcoal">Accueil</NuxtLink>
        <span>/</span>
        <NuxtLink to="/produits" class="hover:text-charcoal">Produits</NuxtLink>
        <span>/</span>
        <span class="text-charcoal">{{ product.title }}</span>
      </nav>

      <div class="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <!-- Galerie -->
        <div class="space-y-4">
          <!-- Image principale -->
          <div class="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            <img
              :src="currentImage"
              :alt="product.title"
              class="w-full h-full object-contain cursor-zoom-in transition-transform hover:scale-105"
              @click="openLightbox"
            />
          </div>

          <!-- Thumbnails -->
          <div v-if="gallery.length > 1" class="flex gap-3 overflow-x-auto pb-2">
            <button
              v-for="(img, index) in gallery"
              :key="index"
              @click="currentImageIndex = index"
              class="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all"
              :class="currentImageIndex === index ? 'border-gold' : 'border-transparent hover:border-gray-300'"
            >
              <img
                :src="getOptimizedImageUrl(img, 150)"
                :alt="`${product.title} - image ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Infos -->
        <div class="lg:py-4">
          <!-- Badge nouveau -->
          <span
            v-if="isNewProduct(product)"
            class="inline-block bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded-full mb-4"
          >
            Nouveau
          </span>

          <!-- Catégorie -->
          <p class="text-gray-500 text-sm mb-2">{{ product.category }}</p>

          <!-- Titre -->
          <h1 class="text-3xl lg:text-4xl font-bold text-charcoal mb-4">
            {{ product.title }}
          </h1>

          <!-- Prix -->
          <div class="text-3xl font-bold text-gold mb-6">
            {{ formatPrice(product.price) }}
          </div>

          <!-- Description -->
          <p v-if="product.short_description" class="text-gray-600 leading-relaxed mb-6">
            {{ product.short_description }}
          </p>

          <!-- Villes -->
          <div v-if="product.cities?.length" class="mb-6">
            <h3 class="text-sm font-medium text-charcoal mb-2">Disponible à :</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="city in product.cities"
                :key="city"
                class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                📍 {{ city }}
              </span>
            </div>
          </div>

          <!-- Quantité -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-charcoal mb-2">Quantité :</h3>
            <div class="flex items-center gap-4">
              <button
                @click="quantity = Math.max(1, quantity - 1)"
                class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-charcoal transition-colors"
              >
                −
              </button>
              <span class="text-xl font-semibold w-8 text-center">{{ quantity }}</span>
              <button
                @click="quantity++"
                class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-charcoal transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3">
            <button
              @click="handleAddToCart"
              class="w-full bg-charcoal text-white py-4 rounded-full font-bold hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Ajouter au panier — {{ formatPrice(product.price * quantity) }}
            </button>

            <a
              :href="whatsappLink"
              target="_blank"
              rel="noopener"
              class="w-full bg-[#25D366] text-white py-4 rounded-full font-bold hover:bg-[#22c55e] transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              Commander via WhatsApp
            </a>
          </div>

          <!-- Partager -->
          <div class="mt-8 pt-6 border-t border-gray-100">
            <button
              @click="shareProduct"
              class="flex items-center gap-2 text-gray-600 hover:text-charcoal transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Partager ce produit
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
const { fetchProduct, fetchProductImages, buildGallery, isNewProduct, getOptimizedImageUrl } = useProducts()
const { addItem, formatPrice } = useCart()

const productId = route.params.id as string
const quantity = ref(1)
const currentImageIndex = ref(0)

// Fetch product
const { data: product, pending } = await useAsyncData(`product-${productId}`, () => fetchProduct(productId))

// Fetch extra images
const extraImages = ref<string[]>([])
if (product.value) {
  extraImages.value = await fetchProductImages(productId)
}

// SEO
useHead({
  title: computed(() => product.value ? `${product.value.title} — Samiah Cosmetics` : 'Produit — Samiah Cosmetics'),
  meta: [
    { name: 'description', content: computed(() => product.value?.short_description || 'Produit Samiah Cosmetics') }
  ]
})

// Gallery
const gallery = computed(() => {
  if (!product.value) return []
  return buildGallery(product.value, extraImages.value)
})

const currentImage = computed(() => {
  const img = gallery.value[currentImageIndex.value]
  return img ? getOptimizedImageUrl(img, 800) : '/images/placeholder.png'
})

// WhatsApp link
const whatsappLink = computed(() => {
  if (!product.value) return '#'
  const msg = encodeURIComponent(`Bonjour Samiah Cosmetics, je suis intéressé(e) par ${product.value.title} (${formatPrice(product.value.price)}).`)
  return `https://wa.me/${config.public.whatsappNumber}?text=${msg}`
})

// Actions
const handleAddToCart = () => {
  if (product.value) {
    addItem(product.value, quantity.value)
    quantity.value = 1
  }
}

const openLightbox = () => {
  // TODO: Implémenter lightbox
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
    } catch {}
  } else {
    await navigator.clipboard.writeText(url)
    alert('Lien copié !')
  }
}
</script>
