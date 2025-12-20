<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink
        to="/admin/produits"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-charcoal">
          {{ isEdit ? 'Modifier le produit' : 'Nouveau produit' }}
        </h1>
        <p class="text-gray-500">{{ isEdit ? 'Mettez à jour les informations' : 'Ajoutez un produit au catalogue' }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-soft p-8">
      <div class="animate-pulse space-y-4">
        <div class="h-10 bg-gray-200 rounded-xl w-3/4" />
        <div class="h-32 bg-gray-200 rounded-xl" />
        <div class="h-10 bg-gray-200 rounded-xl w-1/2" />
      </div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Main info (2/3) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic info -->
          <div class="bg-white rounded-2xl shadow-soft p-6">
            <h2 class="text-lg font-bold text-charcoal mb-4">Informations générales</h2>
            
            <div class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Titre du produit <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="Ex: Shampoing Hydratant 500ml"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                  :class="{ 'border-red-500': errors.title }"
                  required
                />
                <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Description courte
                </label>
                <textarea
                  v-model="form.short_description"
                  rows="3"
                  placeholder="Décrivez brièvement le produit..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none"
                />
              </div>

              <!-- Price & Category -->
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Prix (FCFA) <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    min="0"
                    placeholder="15000"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                    :class="{ 'border-red-500': errors.price }"
                    required
                  />
                  <p v-if="errors.price" class="text-red-500 text-sm mt-1">{{ errors.price }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Catégorie
                  </label>
                  <input
                    v-model="form.category"
                    type="text"
                    placeholder="Ex: Shampoing, Soin, Accessoire..."
                    list="categories"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                  />
                  <datalist id="categories">
                    <option value="Shampoing" />
                    <option value="Après-shampoing" />
                    <option value="Masque" />
                    <option value="Huile" />
                    <option value="Soin" />
                    <option value="Accessoire" />
                  </datalist>
                </div>
              </div>
            </div>
          </div>

          <!-- Image -->
          <div class="bg-white rounded-2xl shadow-soft p-6">
            <h2 class="text-lg font-bold text-charcoal mb-4">Image principale</h2>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                URL de l'image
              </label>
              <input
                v-model="form.image"
                type="url"
                placeholder="https://example.com/image.jpg ou URL Supabase"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
              />
              <p class="text-xs text-gray-400 mt-1">
                Utilisez une URL d'image publique ou uploadez dans Supabase Storage
              </p>
            </div>

            <!-- Preview -->
            <div v-if="form.image" class="mt-4">
              <p class="text-sm font-medium text-gray-700 mb-2">Aperçu</p>
              <div class="w-40 h-40 rounded-xl overflow-hidden bg-gray-100">
                <img
                  :src="form.image"
                  alt="Aperçu"
                  class="w-full h-full object-cover"
                  @error="imageError = true"
                />
              </div>
              <p v-if="imageError" class="text-red-500 text-sm mt-2">
                Impossible de charger l'image
              </p>
            </div>
          </div>

          <!-- Cities -->
          <div class="bg-white rounded-2xl shadow-soft p-6">
            <h2 class="text-lg font-bold text-charcoal mb-4">Disponibilité</h2>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Villes de livraison
              </label>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="city in availableCities"
                  :key="city"
                  class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors"
                  :class="form.cities.includes(city) 
                    ? 'bg-gold/10 border-gold text-charcoal' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'"
                >
                  <input
                    type="checkbox"
                    :value="city"
                    v-model="form.cities"
                    class="sr-only"
                  />
                  <svg
                    v-if="form.cities.includes(city)"
                    class="w-4 h-4 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-sm">{{ city }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar (1/3) -->
        <div class="space-y-6">
          <!-- Status -->
          <div class="bg-white rounded-2xl shadow-soft p-6">
            <h2 class="text-lg font-bold text-charcoal mb-4">Statut</h2>
            
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-gray-700">Produit actif</span>
              <div class="relative">
                <input
                  type="checkbox"
                  v-model="form.active"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gold transition-colors" />
                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
            <p class="text-sm text-gray-400 mt-2">
              {{ form.active ? 'Le produit est visible sur le site' : 'Le produit est masqué' }}
            </p>
          </div>

          <!-- Actions -->
          <div class="bg-white rounded-2xl shadow-soft p-6">
            <div class="space-y-3">
              <button
                type="submit"
                :disabled="saving"
                class="w-full bg-charcoal text-white py-3 rounded-xl font-bold hover:bg-charcoal-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span v-if="saving" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{{ isEdit ? 'Enregistrer' : 'Créer le produit' }}</span>
              </button>
              
              <NuxtLink
                to="/admin/produits"
                class="w-full bg-gray-100 text-charcoal py-3 rounded-xl font-medium text-center block hover:bg-gray-200 transition-colors"
              >
                Annuler
              </NuxtLink>
            </div>
          </div>

          <!-- Preview card -->
          <div class="bg-white rounded-2xl shadow-soft p-6">
            <h2 class="text-lg font-bold text-charcoal mb-4">Aperçu</h2>
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="aspect-square bg-gray-100">
                <img
                  v-if="form.image"
                  :src="form.image"
                  alt="Aperçu"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div class="p-3">
                <p class="text-xs text-gray-400">{{ form.category || 'Catégorie' }}</p>
                <p class="font-semibold text-charcoal text-sm line-clamp-1">
                  {{ form.title || 'Titre du produit' }}
                </p>
                <p class="text-gold font-bold text-sm mt-1">
                  {{ form.price ? formatPrice(form.price) : '0 FCFA' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { CHAD_CITIES } from '~/types'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()

const productId = route.params.id as string | undefined
const isEdit = computed(() => !!productId && productId !== 'nouveau')

useHead({
  title: computed(() => isEdit.value ? 'Modifier produit — Admin' : 'Nouveau produit — Admin'),
})

const loading = ref(false)
const saving = ref(false)
const imageError = ref(false)
const availableCities = CHAD_CITIES

const form = reactive({
  title: '',
  short_description: '',
  price: 0,
  category: '',
  image: '',
  cities: [] as string[],
  active: true,
})

const errors = reactive({
  title: '',
  price: '',
})

// Watch image URL to reset error
watch(() => form.image, () => {
  imageError.value = false
})

// Fetch product if editing
const fetchProduct = async () => {
  if (!isEdit.value) return

  loading.value = true
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (error) throw error

    if (data) {
      form.title = data.title || ''
      form.short_description = data.short_description || ''
      form.price = data.price || 0
      form.category = data.category || ''
      form.image = data.image || ''
      form.cities = data.cities || []
      form.active = data.active ?? true
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    alert('Produit introuvable')
    router.push('/admin/produits')
  } finally {
    loading.value = false
  }
}

// Validate form
const validate = () => {
  let valid = true
  errors.title = ''
  errors.price = ''

  if (!form.title.trim()) {
    errors.title = 'Le titre est requis'
    valid = false
  }

  if (!form.price || form.price <= 0) {
    errors.price = 'Le prix doit être supérieur à 0'
    valid = false
  }

  return valid
}

// Submit form
const handleSubmit = async () => {
  if (!validate()) return

  saving.value = true
  try {
    const productData = {
      title: form.title.trim(),
      short_description: form.short_description.trim() || null,
      price: form.price,
      currency: 'XAF',
      category: form.category.trim() || null,
      image: form.image.trim() || null,
      cities: form.cities.length > 0 ? form.cities : null,
      active: form.active,
    }

    if (isEdit.value) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('products')
        .insert(productData)

      if (error) throw error
    }

    router.push('/admin/produits')
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Erreur lors de l\'enregistrement')
  } finally {
    saving.value = false
  }
}

// Helpers
const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'

// Init
onMounted(() => {
  if (isEdit.value) {
    fetchProduct()
  }
})
</script>
