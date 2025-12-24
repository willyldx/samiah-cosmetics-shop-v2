<template>
  <div class="min-h-screen bg-white">
    <div v-if="pending" class="max-w-container mx-auto px-4 py-12">
      <div class="grid lg:grid-cols-2 gap-12">
        <div class="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div class="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div class="h-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    <div v-else-if="!product" class="max-w-container mx-auto px-4 py-24 text-center">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-charcoal mb-2">Produit introuvable</h1>
      <p class="text-gray-500 mb-6">Ce produit n'existe pas ou a été supprimé.</p>
      <NuxtLink to="/produits" class="bg-charcoal text-white px-6 py-3 rounded-full font-medium">
        Retour aux produits
      </NuxtLink>
    </div>

    <div v-else class="max-w-container mx-auto px-4 py-8 lg:py-12">
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <NuxtLink to="/" class="hover:text-charcoal">Accueil</NuxtLink>
        <span>/</span>
        <NuxtLink to="/produits" class="hover:text-charcoal">Produits</NuxtLink>
        <span>/</span>
        <span class="text-charcoal">{{ product.title }}</span>
      </nav>

      <div class="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div class="space-y-4">
          <div class="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            <img
              :src="currentImage"
              :alt="product.title"
              class="w-full h-full object-contain cursor-zoom-in transition-transform hover:scale-105"
            />
          </div>

          <div v-if="gallery.length > 1" class="flex gap-3 overflow-x-auto pb-2">
            <button
              v-for="(img, index) in gallery"
              :key="index"
              type="button"
              @click="currentImageIndex = index"
              class="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all"
              :class="currentImageIndex === index ? 'border-gold' : 'border-transparent hover:border-gray-300'"
            >
              <img
                :src="img"
                :alt="`${product.title} - image ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <div class="lg:py-4">
          <span
            v-if="isNew"
            class="inline-block bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded-full mb-4"
          >
            Nouveau
          </span>

          <p class="text-gray-500 text-sm mb-2">{{ product.category }}</p>

          <h1 class="text-3xl lg:text-4xl font-bold text-charcoal mb-4">
            {{ product.title }}
          </h1>

          <div class="text-3xl font-bold text-gold mb-6">
            {{ formatPrice(product.price) }}
          </div>

          <p v-if="product.short_description" class="text-gray-600 leading-relaxed mb-6">
            {{ product.short_description }}
          </p>

          <div v-if="product.cities && product.cities.length" class="mb-6">
            <h3 class="text-sm font-medium text-charcoal mb-2">Disponible à :</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="city in product.cities"
                :key="city"
                class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {{ city }}
              </span>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-sm font-medium text-charcoal mb-2">Quantité :</h3>
            <div class="flex items-center gap-4">
              <button
                type="button"
                @click="decreaseQuantity"
                class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-charcoal transition-colors"
              >
                -
              </button>
              <span class="text-xl font-semibold w-8 text-center">{{ quantity }}</span>
              <button
                type="button"
                @click="quantity++"
                class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-charcoal transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div class="space-y-3">
            <button
              type="button"
              @click="handleAddToCart"
              class="w-full bg-charcoal text-white py-4 rounded-full font-bold hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Ajouter au panier
            </button>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              @click="shareProduct"
              class="flex items-center gap-2 text-gray-600 hover:text-charcoal transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
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

// NOTE: J'ai retiré le bloc "whatsappLink" qui n'est plus utilisé

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
    alert('Lien copie !')
  }
}
</script>
