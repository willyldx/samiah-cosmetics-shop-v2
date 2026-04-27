<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-serif font-light text-charcoal mb-1">Témoignages</h1>
        <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400">Gestion des avis clients</p>
      </div>
      <button
        @click="openModal()"
        class="bg-charcoal text-white px-6 py-2.5 text-[10px] uppercase tracking-widest font-medium hover:bg-charcoal/90 transition-colors border border-charcoal"
      >
        Nouveau Témoignage
      </button>
    </div>

    <!-- List -->
    <div v-if="loading" class="bg-white border border-gray-200 p-8">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 3" :key="i" class="h-24 bg-gray-50 border border-gray-100" />
      </div>
    </div>

    <div v-else-if="testimonials.length === 0" class="bg-white border border-gray-200 p-16 text-center">
      <p class="text-sm font-light text-gray-400 mb-4">Aucun témoignage pour le moment</p>
      <button
        @click="openModal()"
        class="text-xs uppercase tracking-widest text-charcoal border-b border-charcoal pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
      >
        Ajouter le premier témoignage
      </button>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="testimonial in testimonials"
        :key="testimonial.id"
        class="bg-white border border-gray-200 p-6 hover:border-charcoal transition-colors group"
      >
        <div class="flex items-start justify-between gap-6">
          <div class="flex items-start gap-6 flex-1">
            <!-- Avatar ou Photo -->
            <div class="w-16 h-16 bg-gray-50 border border-gray-100 flex-shrink-0 relative overflow-hidden">
              <img 
                v-if="getPhotoUrl(testimonial)"
                :src="getPhotoUrl(testimonial)"
                :alt="testimonial.client_name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="text-charcoal font-serif font-light text-xl">
                  {{ testimonial.client_name.charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
            
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 flex-wrap mb-2">
                <h3 class="font-medium text-sm text-charcoal">{{ testimonial.client_name }}</h3>
                <span v-if="testimonial.city" class="text-[10px] uppercase tracking-widest text-gray-400">• {{ testimonial.city }}</span>
                <span
                  class="px-2 py-0.5 text-[9px] uppercase tracking-widest border"
                  :class="testimonial.active ? 'border-gray-200 text-charcoal' : 'border-red-200 text-red-500'"
                >
                  {{ testimonial.active ? 'Visible' : 'Masqué' }}
                </span>
              </div>
              
              <!-- Rating -->
              <div v-if="testimonial.rating" class="text-charcoal text-xs mb-3 tracking-widest">
                {{ '★'.repeat(testimonial.rating) }}<span class="text-gray-300">{{ '★'.repeat(5 - testimonial.rating) }}</span>
              </div>
              
              <p class="text-sm text-gray-500 font-light leading-relaxed mb-4">"{{ testimonial.message }}"</p>
              
              <!-- Photo preview -->
              <div v-if="getPhotoUrl(testimonial)" class="mt-4">
                <img 
                  :src="getPhotoUrl(testimonial)" 
                  :alt="'Photo de ' + testimonial.client_name"
                  class="h-24 w-auto object-cover border border-gray-200"
                />
              </div>
              
              <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-4">
                Ajouté le {{ formatDate(testimonial.created_at) }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="toggleStatus(testimonial)"
              class="p-2 border border-transparent hover:border-gray-200 text-gray-400 hover:text-charcoal transition-colors"
              :title="testimonial.active ? 'Masquer' : 'Afficher'"
            >
              <svg v-if="testimonial.active" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              @click="openModal(testimonial)"
              class="p-2 border border-transparent hover:border-gray-200 text-gray-400 hover:text-charcoal transition-colors"
              title="Modifier"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(testimonial)"
              class="p-2 border border-transparent hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              title="Supprimer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
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
          v-if="showModal"
          class="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          @click.self="closeModal"
        >
          <div class="bg-white border border-gray-200 p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal mb-6 border-b border-gray-100 pb-3">
              {{ editingTestimonial ? 'Modifier le témoignage' : 'Nouveau témoignage' }}
            </h3>

            <form @submit.prevent="saveTestimonial" class="space-y-6">
              <!-- Name -->
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  Nom de la cliente <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.client_name"
                  type="text"
                  placeholder="Ex: Fatima I."
                  class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors"
                  required
                />
              </div>

              <!-- City -->
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  Ville
                </label>
                <input
                  v-model="form.city"
                  type="text"
                  placeholder="Ex: N'Djamena"
                  class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors"
                />
              </div>

              <!-- Rating -->
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  Note
                </label>
                <div class="flex gap-2">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    @click="form.rating = star"
                    class="text-2xl transition-colors hover:scale-110 transform"
                    :class="star <= (form.rating || 0) ? 'text-charcoal' : 'text-gray-200 hover:text-gray-400'"
                  >
                    ★
                  </button>
                  <button
                    v-if="form.rating"
                    type="button"
                    @click="form.rating = null"
                    class="text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-600 ml-4"
                  >
                    Effacer
                  </button>
                </div>
              </div>

              <!-- Message -->
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  Témoignage <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  placeholder="Le témoignage de la cliente..."
                  class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors resize-none"
                  required
                />
              </div>

              <!-- Photo Upload -->
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  Photo (optionnel)
                </label>
                
                <div v-if="form.photo_url" class="mb-4 relative inline-block">
                  <img 
                    :src="form.photo_url" 
                    alt="Preview" 
                    class="h-32 w-auto object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    @click="removePhoto"
                    class="absolute -top-2 -right-2 p-1.5 bg-white border border-gray-200 text-charcoal hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div
                  v-else
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                  @click="triggerFileInput"
                  class="border border-dashed p-6 text-center cursor-pointer transition-all"
                  :class="isDragging ? 'border-charcoal bg-gray-50' : 'border-gray-300 hover:border-gray-400'"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileSelect"
                  />
                  
                  <div v-if="isUploading" class="flex flex-col items-center">
                    <div class="w-8 h-8 border-2 border-gray-200 border-t-charcoal rounded-full animate-spin mb-3"></div>
                    <p class="text-[10px] uppercase tracking-widest text-gray-500">Téléchargement...</p>
                  </div>
                  
                  <div v-else class="flex flex-col items-center">
                    <svg class="w-6 h-6 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-sm font-light text-gray-500 mb-1">
                      <span class="text-charcoal font-medium border-b border-charcoal">Cliquez</span> ou glissez une image
                    </p>
                    <p class="text-[9px] uppercase tracking-widest text-gray-400">PNG, JPG (Max 5MB)</p>
                  </div>
                </div>

                <div class="mt-4">
                  <p class="text-[9px] uppercase tracking-widest text-gray-500 mb-2">Ou importer depuis une URL</p>
                  <input
                    v-model="manualPhotoUrl"
                    type="url"
                    placeholder="https://exemple.com/photo.jpg"
                    class="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors"
                    @blur="applyManualUrl"
                  />
                </div>
              </div>

              <!-- Active -->
              <label class="flex items-center justify-between cursor-pointer pt-4 border-t border-gray-100">
                <span class="text-sm font-light text-charcoal">Afficher sur le site</span>
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

              <!-- Actions -->
              <div class="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-3 border border-gray-200 text-charcoal text-[10px] uppercase tracking-widest font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex-1 px-4 py-3 bg-charcoal text-white text-[10px] uppercase tracking-widest font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete confirmation -->
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
          v-if="testimonialToDelete"
          class="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          @click.self="testimonialToDelete = null"
        >
          <div class="bg-white border border-gray-200 p-8 max-w-sm w-full text-center shadow-2xl">
            <h3 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal mb-4">Supprimer ce témoignage ?</h3>
            <p class="text-sm font-light text-gray-500 mb-8">
              Le témoignage de "<span class="font-medium text-charcoal">{{ testimonialToDelete.client_name }}</span>" sera définitivement supprimé.
            </p>
            <div class="flex gap-4">
              <button
                @click="testimonialToDelete = null"
                class="flex-1 px-4 py-2.5 border border-gray-200 text-[10px] uppercase tracking-widest text-charcoal hover:border-charcoal hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                @click="deleteTestimonial"
                :disabled="deleting"
                class="flex-1 px-4 py-2.5 bg-red-600 border border-red-600 text-[10px] uppercase tracking-widest text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {{ deleting ? 'Suppression...' : 'Supprimer' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Testimonial } from '~/types'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

useHead({
  title: 'Témoignages — Admin Samiah',
})

const supabase = useSupabaseClient()

const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const isUploading = ref(false)
const isDragging = ref(false)
const testimonials = ref<Testimonial[]>([])
const showModal = ref(false)
const editingTestimonial = ref<Testimonial | null>(null)
const testimonialToDelete = ref<Testimonial | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const manualPhotoUrl = ref('')

const form = reactive({
  client_name: '',
  city: '',
  rating: null as number | null,
  message: '',
  photo_url: '',
  active: true,
})

// Fetch testimonials
const fetchTestimonials = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    testimonials.value = data || []
  } catch (error) {
    console.error('Error fetching testimonials:', error)
  } finally {
    loading.value = false
  }
}

// Get photo URL helper
const getPhotoUrl = (testimonial: Testimonial): string | null => {
  if (testimonial.photo_url) return testimonial.photo_url
  if (testimonial.photos && testimonial.photos.length > 0) return testimonial.photos[0]
  return null
}

// Open modal
const openModal = (testimonial?: Testimonial) => {
  if (testimonial) {
    editingTestimonial.value = testimonial
    form.client_name = testimonial.client_name
    form.city = testimonial.city || ''
    form.rating = testimonial.rating
    form.message = testimonial.message
    form.photo_url = getPhotoUrl(testimonial) || ''
    form.active = testimonial.active
  } else {
    editingTestimonial.value = null
    form.client_name = ''
    form.city = ''
    form.rating = null
    form.message = ''
    form.photo_url = ''
    form.active = true
  }
  manualPhotoUrl.value = ''
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  editingTestimonial.value = null
}

// File input trigger
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Handle file select
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadPhoto(target.files[0])
  }
}

// Handle drag & drop
const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    uploadPhoto(event.dataTransfer.files[0])
  }
}

// Upload photo to Supabase Storage
const uploadPhoto = async (file: File) => {
  // Validation
  if (!file.type.startsWith('image/')) {
    alert('Veuillez sélectionner une image')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('L\'image ne doit pas dépasser 5MB')
    return
  }

  isUploading.value = true
  
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `testimonial-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(`testimonials/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(`testimonials/${fileName}`)

    form.photo_url = urlData.publicUrl
  } catch (error: any) {
    console.error('Upload error:', error)
    alert('Erreur lors du téléchargement: ' + error.message)
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

// Remove photo
const removePhoto = () => {
  form.photo_url = ''
}

// Apply manual URL
const applyManualUrl = () => {
  if (manualPhotoUrl.value && !form.photo_url) {
    form.photo_url = manualPhotoUrl.value
    manualPhotoUrl.value = ''
  }
}

// Save testimonial
const saveTestimonial = async () => {
  saving.value = true
  try {
    const data = {
      client_name: form.client_name.trim(),
      city: form.city.trim() || null,
      rating: form.rating,
      message: form.message.trim(),
      photo_url: form.photo_url || null,
      active: form.active,
    }

    if (editingTestimonial.value) {
      const { error } = await supabase
        .from('testimonials')
        .update(data)
        .eq('id', editingTestimonial.value.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('testimonials')
        .insert(data)

      if (error) throw error
    }

    await fetchTestimonials()
    closeModal()
  } catch (error) {
    console.error('Error saving testimonial:', error)
    alert('Erreur lors de l\'enregistrement')
  } finally {
    saving.value = false
  }
}

// Toggle status
const toggleStatus = async (testimonial: Testimonial) => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .update({ active: !testimonial.active })
      .eq('id', testimonial.id)

    if (error) throw error
    testimonial.active = !testimonial.active
  } catch (error) {
    console.error('Error toggling status:', error)
  }
}

// Delete testimonial
const confirmDelete = (testimonial: Testimonial) => {
  testimonialToDelete.value = testimonial
}

const deleteTestimonial = async () => {
  if (!testimonialToDelete.value) return

  deleting.value = true
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', testimonialToDelete.value.id)

    if (error) throw error

    testimonials.value = testimonials.value.filter(t => t.id !== testimonialToDelete.value!.id)
    testimonialToDelete.value = null
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    alert('Erreur lors de la suppression')
  } finally {
    deleting.value = false
  }
}

// Helpers
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// Init
onMounted(() => {
  fetchTestimonials()
})
</script>
