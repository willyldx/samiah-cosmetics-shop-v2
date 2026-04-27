<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-serif font-light text-charcoal mb-1">Produits</h1>
        <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400">Catalogue et inventaire ({{ products.length }})</p>
      </div>
      <NuxtLink
        to="/admin/produits/nouveau"
        class="bg-charcoal text-white px-6 py-2.5 text-[10px] uppercase tracking-widest font-medium hover:bg-charcoal/90 transition-colors border border-charcoal"
      >
        Nouveau Produit
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-gray-200 p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="Rechercher par nom ou catégorie..."
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent text-sm text-charcoal focus:bg-white focus:border-gray-200 focus:outline-none focus:ring-0 transition-all font-light"
            />
          </div>
        </div>

        <select
          v-model="categoryFilter"
          class="px-4 py-2 bg-gray-50 border border-transparent text-sm text-charcoal focus:bg-white focus:border-gray-200 focus:outline-none focus:ring-0 transition-all font-light appearance-none"
        >
          <option value="">Toutes catégories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <select
          v-model="statusFilter"
          class="px-4 py-2 bg-gray-50 border border-transparent text-sm text-charcoal focus:bg-white focus:border-gray-200 focus:outline-none focus:ring-0 transition-all font-light appearance-none"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="bg-white border border-gray-100 p-4 animate-pulse">
        <div class="aspect-square bg-gray-50 mb-4" />
        <div class="h-3 bg-gray-100 w-3/4 mb-2" />
        <div class="h-3 bg-gray-100 w-1/2" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="bg-white border border-gray-200 p-16 text-center">
      <p class="text-sm font-light text-gray-400 mb-4">Aucun produit trouvé dans le catalogue.</p>
      <NuxtLink to="/admin/produits/nouveau" class="text-xs uppercase tracking-widest text-charcoal border-b border-charcoal pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors">
        Créer le premier produit
      </NuxtLink>
    </div>

    <!-- Products Grid -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white border border-gray-100 group relative hover:border-gray-300 transition-all"
      >
        <div class="relative aspect-[4/5] bg-gray-50 overflow-hidden">
          <img
            :src="product.image || '/images/placeholder.svg'"
            :alt="product.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div class="absolute top-3 left-3">
            <span
              class="px-2 py-1 text-[9px] uppercase tracking-widest bg-white border"
              :class="product.active ? 'border-gray-200 text-charcoal' : 'border-red-200 text-red-500'"
            >
              {{ product.active ? 'Actif' : 'Inactif' }}
            </span>
          </div>

          <div class="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
            <NuxtLink
              :to="`/admin/produits/${product.id}`"
              class="w-32 py-2 bg-white text-center text-[10px] uppercase tracking-widest text-charcoal hover:bg-gray-100 transition-colors"
            >
              Modifier
            </NuxtLink>
            <button
              @click="toggleStatus(product)"
              class="w-32 py-2 bg-white text-center text-[10px] uppercase tracking-widest text-charcoal hover:bg-gray-100 transition-colors"
            >
              {{ product.active ? 'Désactiver' : 'Activer' }}
            </button>
            <button
              @click="confirmDelete(product)"
              class="w-32 py-2 bg-red-600 text-center text-[10px] uppercase tracking-widest text-white hover:bg-red-700 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>

        <div class="p-4">
          <p class="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1.5 truncate">{{ product.category || 'Non catégorisé' }}</p>
          <h3 class="text-sm font-medium text-charcoal mb-2 line-clamp-1" :title="product.title">{{ product.title }}</h3>
          <p class="text-sm font-serif text-charcoal">{{ formatPrice(product.price) }}</p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
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
          class="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          @click.self="productToDelete = null"
        >
          <div class="bg-white border border-gray-200 max-w-sm w-full p-8 text-center shadow-2xl">
            <h3 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal mb-4">Confirmer la suppression</h3>
            <p class="text-sm text-gray-500 mb-8 font-light">
              Le produit "<span class="font-medium text-charcoal">{{ productToDelete.title }}</span>" sera définitivement supprimé.
            </p>
            <div class="flex gap-4">
              <button
                @click="productToDelete = null"
                class="flex-1 px-4 py-2.5 border border-gray-200 text-[10px] uppercase tracking-widest text-charcoal hover:border-charcoal hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                @click="deleteProduct"
                class="flex-1 px-4 py-2.5 bg-red-600 border border-red-600 text-[10px] uppercase tracking-widest text-white hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
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

const deleteProduct = async () => {
  const product = productToDelete.value
  if (!product) return

  try {
    if (product.image) {
      const imageName = product.image.split('/').pop()
      if (imageName) {
        await supabase.storage.from('products').remove([imageName])
      }
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    if (error) throw error

    products.value = products.value.filter(p => p.id !== product.id)
    productToDelete.value = null
    
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Erreur lors de la suppression')
  }
}

const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'

onMounted(() => {
  fetchProducts()
})
</script>
