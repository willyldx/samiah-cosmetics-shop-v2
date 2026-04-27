<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink
        to="/admin/produits"
        class="p-2 border border-transparent hover:border-gray-200 text-gray-400 hover:text-charcoal transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-serif font-light text-charcoal mb-1">
          {{ isEdit ? 'Modifier le produit' : 'Nouveau produit' }}
        </h1>
        <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400">
          {{ isEdit ? 'Mise à jour du catalogue' : 'Ajout au catalogue' }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loadingProduct" class="bg-white border border-gray-200 p-8">
      <div class="animate-pulse space-y-4">
        <div class="h-8 bg-gray-50 w-1/3" />
        <div class="h-32 bg-gray-50" />
        <div class="h-10 bg-gray-50 w-1/4" />
      </div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid lg:grid-cols-3 gap-8">
        
        <!-- Main info (2/3) -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Basic info -->
          <div class="bg-white border border-gray-200 p-8">
            <h2 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal mb-6 border-b border-gray-100 pb-3">Informations générales</h2>
            
            <div class="space-y-6">
              <!-- Title -->
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  Titre du produit <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="Ex: Lait Corporel Éclaircissant"
                  class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors"
                  required
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  Description courte
                </label>
                <textarea
                  v-model="form.short_description"
                  rows="4"
                  placeholder="Décrivez les bienfaits du produit..."
                  class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors resize-none"
                />
              </div>

              <!-- Price & Category -->
              <div class="grid sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                    Prix (FCFA) <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    min="0"
                    placeholder="15000"
                    class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors font-serif"
                    required
                  />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                    Catégorie
                  </label>
                  <input
                    v-model="form.category"
                    type="text"
                    placeholder="Ex: Soin du corps"
                    list="categories"
                    class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors"
                  />
                  <datalist id="categories">
                    <option value="Soin du corps" />
                    <option value="Soin du visage" />
                    <option value="Soin capillaire" />
                    <option value="Parfum" />
                    <option value="Accessoire" />
                  </datalist>
                </div>
              </div>
            </div>
          </div>

          <!-- Image principale -->
          <div class="bg-white border border-gray-200 p-8">
            <h2 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal mb-6 border-b border-gray-100 pb-3">
              Image principale <span class="text-red-500">*</span>
            </h2>
            
            <!-- Upload area pour image principale -->
            <div
              v-if="!form.image"
              class="border border-dashed p-10 text-center transition-colors"
              :class="isDraggingMain ? 'border-charcoal bg-gray-50' : 'border-gray-300 hover:border-gray-400'"
              @dragover.prevent="isDraggingMain = true"
              @dragleave.prevent="isDraggingMain = false"
              @drop.prevent="handleDropMain"
            >
              <input
                ref="mainImageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleMainImageSelect"
              />
              
              <div v-if="uploadingMain" class="flex flex-col items-center">
                <div class="w-8 h-8 border-2 border-gray-200 border-t-charcoal rounded-full animate-spin mb-4" />
                <p class="text-[10px] uppercase tracking-widest text-gray-500">Téléchargement...</p>
              </div>
              
              <div v-else class="flex flex-col items-center">
                <svg class="w-8 h-8 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm font-light text-gray-500 mb-2">
                  Glissez une image ici ou
                  <button
                    type="button"
                    @click="($refs.mainImageInput as HTMLInputElement).click()"
                    class="text-charcoal font-medium border-b border-charcoal hover:text-gray-600 hover:border-gray-600 pb-0.5 transition-colors"
                  >
                    parcourez
                  </button>
                </p>
                <p class="text-[9px] uppercase tracking-widest text-gray-400">PNG, JPG (Max 5MB)</p>
              </div>
            </div>

            <!-- Image principale preview -->
            <div v-else class="relative">
              <div class="aspect-video bg-gray-50 border border-gray-100 max-w-md">
                <img :src="form.image" class="w-full h-full object-contain" />
              </div>
              <button
                type="button"
                @click="removeMainImage"
                class="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-charcoal hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                title="Supprimer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <!-- Ou URL manuelle -->
            <div class="mt-6 pt-6 border-t border-gray-100">
              <p class="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Ou importer depuis une URL</p>
              <div class="flex gap-2">
                <input
                  v-model="mainImageUrl"
                  type="url"
                  placeholder="https://exemple.com/image.jpg"
                  class="flex-1 px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors"
                />
                <button
                  type="button"
                  @click="addMainImageUrl"
                  :disabled="!mainImageUrl"
                  class="px-6 py-2.5 bg-charcoal text-white text-[10px] uppercase tracking-widest font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <!-- Images supplémentaires (optionnel) -->
          <div class="bg-white border border-gray-200 p-8">
            <h2 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal mb-2">Images additionnelles</h2>
            <p class="text-[10px] uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-100 pb-3">Optionnel - Galerie de produits</p>
            
            <!-- Upload area -->
            <div
              class="border border-dashed p-6 text-center transition-colors"
              :class="isDraggingExtra ? 'border-charcoal bg-gray-50' : 'border-gray-300 hover:border-gray-400'"
              @dragover.prevent="isDraggingExtra = true"
              @dragleave.prevent="isDraggingExtra = false"
              @drop.prevent="handleDropExtra"
            >
              <input
                ref="extraImagesInput"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="handleExtraImagesSelect"
              />
              
              <div v-if="uploadingExtra" class="flex flex-col items-center py-2">
                <div class="w-6 h-6 border-2 border-gray-200 border-t-charcoal rounded-full animate-spin mb-3" />
                <p class="text-[10px] uppercase tracking-widest text-gray-500">Téléchargement...</p>
              </div>
              
              <div v-else class="flex flex-col items-center py-2">
                <button
                  type="button"
                  @click="($refs.extraImagesInput as HTMLInputElement).click()"
                  class="text-[10px] uppercase tracking-widest text-charcoal border-b border-charcoal hover:text-gray-600 hover:border-gray-600 pb-0.5 transition-colors"
                >
                  Ajouter des images
                </button>
              </div>
            </div>

            <!-- Extra images preview -->
            <div v-if="form.images.length > 0" class="mt-6">
              <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                <div
                  v-for="(image, index) in form.images"
                  :key="image"
                  class="relative group aspect-square bg-gray-50 border border-gray-100"
                >
                  <img :src="image" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    @click="removeExtraImage(index)"
                    class="absolute inset-0 bg-white/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-500 hover:text-red-600"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cities -->
          <div class="bg-white border border-gray-200 p-8">
            <h2 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal mb-6 border-b border-gray-100 pb-3">Disponibilité Géographique</h2>
            
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-4">
                Villes de livraison possibles
              </label>
              <div class="flex flex-wrap gap-3">
                <label
                  v-for="city in availableCities"
                  :key="city"
                  class="inline-flex items-center gap-2 px-4 py-2 border cursor-pointer transition-colors"
                  :class="form.cities.includes(city) 
                    ? 'bg-charcoal border-charcoal text-white' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'"
                >
                  <input
                    type="checkbox"
                    :value="city"
                    v-model="form.cities"
                    class="sr-only"
                  />
                  <span class="text-xs tracking-wide font-light">{{ city }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar (1/3) -->
        <div class="space-y-8">
          
          <!-- Actions -->
          <div class="bg-white border border-gray-200 p-6">
            <div class="space-y-3">
              <button
                type="submit"
                :disabled="saving || !form.image"
                class="w-full bg-charcoal text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{{ isEdit ? 'Enregistrer' : 'Publier' }}</span>
              </button>
              <p v-if="!form.image" class="text-[9px] uppercase tracking-widest text-red-500 text-center">
                Image principale requise
              </p>
              
              <NuxtLink
                to="/admin/produits"
                class="w-full bg-white border border-gray-200 text-charcoal py-3 text-xs uppercase tracking-widest font-medium text-center block hover:border-charcoal transition-colors"
              >
                Annuler
              </NuxtLink>
            </div>
          </div>

          <!-- Status -->
          <div class="bg-white border border-gray-200 p-6">
            <h2 class="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal mb-4 border-b border-gray-100 pb-2">Visibilité</h2>
            
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-sm font-light text-charcoal">Produit actif</span>
              <div class="relative">
                <input
                  type="checkbox"
                  v-model="form.active"
                  class="sr-only peer"
                />
                <div class="w-10 h-5 bg-gray-200 peer-checked:bg-charcoal transition-colors" />
                <div class="absolute left-1 top-1 w-3 h-3 bg-white transition-transform peer-checked:translate-x-5" />
              </div>
            </label>

            <!-- Featured -->
            <label class="flex items-center justify-between cursor-pointer mt-6">
              <span class="text-sm font-light text-charcoal">Mettre en vedette</span>
              <div class="relative">
                <input
                  type="checkbox"
                  v-model="form.featured"
                  class="sr-only peer"
                />
                <div class="w-10 h-5 bg-gray-200 peer-checked:bg-charcoal transition-colors" />
                <div class="absolute left-1 top-1 w-3 h-3 bg-white transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>

          <!-- Preview card -->
          <div class="bg-white border border-gray-200 p-6">
            <h2 class="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal mb-4 border-b border-gray-100 pb-2">Aperçu</h2>
            <div class="border border-gray-100 bg-gray-50">
              <div class="aspect-square bg-white border-b border-gray-100 relative">
                <img
                  v-if="form.image"
                  :src="form.image"
                  alt="Aperçu"
                  class="w-full h-full object-contain"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div class="p-4 bg-white">
                <p class="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1.5">{{ form.category || 'Catégorie' }}</p>
                <p class="font-medium text-charcoal text-sm line-clamp-1 mb-2">
                  {{ form.title || 'Titre du produit' }}
                </p>
                <p class="font-serif text-charcoal text-sm">
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

const loadingProduct = ref(false)
const saving = ref(false)
const uploadingMain = ref(false)
const uploadingExtra = ref(false)
const isDraggingMain = ref(false)
const isDraggingExtra = ref(false)
const mainImageInput = ref<HTMLInputElement | null>(null)
const extraImagesInput = ref<HTMLInputElement | null>(null)
const mainImageUrl = ref('')
const availableCities = CHAD_CITIES

const form = reactive({
  title: '',
  short_description: '',
  price: 0,
  category: '',
  image: '', // Image principale (obligatoire)
  images: [] as string[], // Images supplémentaires (optionnel)
  cities: [] as string[],
  active: true,
  featured: false,
})

// ========== IMAGE PRINCIPALE ==========

const handleMainImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadMainImage(target.files[0])
  }
}

const handleDropMain = (event: DragEvent) => {
  isDraggingMain.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    uploadMainImage(event.dataTransfer.files[0])
  }
}

const uploadMainImage = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Ce fichier n\'est pas une image')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('L\'image dépasse 5MB')
    return
  }

  uploadingMain.value = true
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error } = await supabase.storage
      .from('products')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    form.image = urlData.publicUrl
  } catch (error: any) {
    console.error('Upload error:', error)
    alert('Erreur: ' + error.message)
  } finally {
    uploadingMain.value = false
    if (mainImageInput.value) mainImageInput.value.value = ''
  }
}

const addMainImageUrl = () => {
  if (mainImageUrl.value) {
    form.image = mainImageUrl.value
    mainImageUrl.value = ''
  }
}

const removeMainImage = () => {
  form.image = ''
}

// ========== IMAGES SUPPLEMENTAIRES ==========

const handleExtraImagesSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    uploadExtraImages(Array.from(target.files))
  }
}

const handleDropExtra = (event: DragEvent) => {
  isDraggingExtra.value = false
  if (event.dataTransfer?.files) {
    uploadExtraImages(Array.from(event.dataTransfer.files))
  }
}

const uploadExtraImages = async (files: File[]) => {
  const validFiles = files.filter(file => {
    if (!file.type.startsWith('image/')) return false
    if (file.size > 5 * 1024 * 1024) return false
    return true
  })

  if (validFiles.length === 0) return

  uploadingExtra.value = true
  try {
    for (const file of validFiles) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error } = await supabase.storage
        .from('products')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

      form.images.push(urlData.publicUrl)
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    alert('Erreur: ' + error.message)
  } finally {
    uploadingExtra.value = false
    if (extraImagesInput.value) extraImagesInput.value.value = ''
  }
}

const removeExtraImage = (index: number) => {
  form.images.splice(index, 1)
}

// ========== FETCH & SUBMIT ==========

const fetchProduct = async () => {
  if (!isEdit.value) return

  loadingProduct.value = true
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
      form.images = data.images || []
      form.cities = data.cities || []
      form.active = data.active ?? true
      form.featured = data.featured ?? false
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    alert('Produit introuvable')
    router.push('/admin/produits')
  } finally {
    loadingProduct.value = false
  }
}

const handleSubmit = async () => {
  if (!form.title.trim()) {
    alert('Le titre est requis')
    return
  }
  if (!form.price || form.price <= 0) {
    alert('Le prix doit être supérieur à 0')
    return
  }
  if (!form.image) {
    alert('L\'image principale est requise')
    return
  }

  saving.value = true
  try {
    const productData = {
      title: form.title.trim(),
      short_description: form.short_description.trim() || null,
      price: form.price,
      currency: 'XAF',
      category: form.category.trim() || null,
      image: form.image,
      images: form.images.length > 0 ? form.images : null,
      cities: form.cities.length > 0 ? form.cities : null,
      active: form.active,
      featured: form.featured,
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
  } catch (error: any) {
    console.error('Error saving product:', error)
    alert('Erreur: ' + error.message)
  } finally {
    saving.value = false
  }
}

const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'

onMounted(() => {
  if (isEdit.value) {
    fetchProduct()
  }
})
</script>
