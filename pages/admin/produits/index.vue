<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-charcoal">Produits</h1>
        <p class="text-gray-500">{{ products.length }} produit(s)</p>
      </div>
      <NuxtLink
        to="/admin/produits/nouveau"
        class="bg-charcoal text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-charcoal-800 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter
      </NuxtLink>
    </div>

    <div class="bg-white rounded-2xl shadow-soft p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="Rechercher un produit..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
            />
          </div>
        </div>

        <select
          v-model="categoryFilter"
          class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
        >
          <option value="">Toutes catégories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <select
          v-model="statusFilter"
          class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
        >
          <option value="">Tous</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="bg-white rounded-2xl p-4 animate-pulse">
        <div class="aspect-square bg-gray-200 rounded-xl mb-4" />
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div class="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="bg-white rounded-2xl shadow-soft p-12 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <p class="text-gray-500 mb-4">Aucun produit trouvé</p>
      <NuxtLink to="/admin/produits/nouveau" class="text-gold font-medium hover:underline">
        Ajouter un produit →
      </NuxtLink>
    </div>

    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded-2xl shadow-soft overflow-hidden group"
      >
        <div class="relative aspect-square bg-gray-100">
          <img
            :src="product.image || '/images/placeholder.svg'"
            :alt="product.title"
            class="w-full h-full object-cover"
          />
          
          <span
            class="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium"
            :class="product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
          >
            {{ product.active ? 'Actif' : 'Inactif' }}
          </span>

          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <NuxtLink
              :to="`/admin/produits/${product.id}`"
              class="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              title="Modifier"
            >
              <svg class="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </NuxtLink>
            <button
              @click="toggleStatus(product)"
              class="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              :title="product.active ? 'Désactiver' : 'Activer'"
            >
              <svg v-if="product.active" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <svg v-else class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              @click="confirmDelete(product)"
              class="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
              title="Supprimer"
            >
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-4">
          <p class="text-xs text-gray-400 mb-1">{{ product.category || 'Sans catégorie' }}</p>
          <h3 class="font-medium text-charcoal line-clamp-2 mb-2">{{ product.title }}</h3>
          <p class="text-gold font-bold">{{ formatPrice(product.price) }}</p>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="productToDelete"
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          @click.self="productToDelete = null"
        >
          <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-charcoal mb-2">Supprimer ce produit ?</h3>
              <p class="text-gray-500 mb-6">
                "{{ productToDelete.title }}" sera définitivement supprimé.
              </p>
              <div class="flex gap-3">
                <button
                  @click="productToDelete = null"
                  class="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  @click="deleteProduct"
                  class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

useHead({
  title: 'Produits — Admin Samiah',
})

const supabase = useSupabaseClient()

const loading = ref(true)
const products = ref<Product[]>([])
const search = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const productToDelete = ref<Product | null>(null)

// Categories
const categories = computed(() => {
  const cats = new Set<string>()
  products.value.forEach(p => {
    if (p.category) cats.add(p.category)
  })
  return Array.from(cats).sort()
})

// Filtered products
const filteredProducts = computed(() => {
  let result = products.value

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
  }

  if (categoryFilter.value) {
    result = result.filter(p => p.category === categoryFilter.value)
  }

  if (statusFilter.value) {
    const isActive = statusFilter.value === 'active'
    result = result.filter(p => p.active === isActive)
  }

  return result
})

// Fetch products
const fetchProducts = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    products.value = data || []
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

// Toggle status
const toggleStatus = async (product: Product) => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id)

    if (error) throw error
    product.active = !product.active
  } catch (error) {
    console.error('Error toggling status:', error)
    alert('Erreur lors de la mise à jour')
  }
}

// Delete product confirmation
const confirmDelete = (product: Product) => {
  productToDelete.value = product
}

// === C'EST ICI QUE LA MODIFICATION A ÉTÉ FAITE ===
const deleteProduct = async () => {
  const product = productToDelete.value
  if (!product) return

  try {
    // 1. SUPPRIMER L'IMAGE DU STORAGE (si elle existe)
    if (product.image) {
      const imageName = product.image.split('/').pop()
      // Note: On assume que le bucket s'appelle 'products'. Si c'est 'images', change-le ici.
      if (imageName) {
        await supabase.storage.from('products').remove([imageName])
      }
    }

    // 2. SUPPRIMER LE PRODUIT DE LA BASE DE DONNÉES
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    if (error) throw error

    // Mise à jour de l'affichage
    products.value = products.value.filter(p => p.id !== product.id)
    productToDelete.value = null
    
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Erreur lors de la suppression')
  }
}

// Helpers
const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' F'

onMounted(() => {
  fetchProducts()
})
</script>
