<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-charcoal">Temoignages</h1>
        <p class="text-gray-500">Gerez les avis de vos clientes</p>
      </div>
      <button
        @click="openModal()"
        class="inline-flex items-center gap-2 bg-gold hover:bg-gold-400 text-charcoal px-4 py-2.5 rounded-xl font-medium transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un temoignage
      </button>
    </div>

    <!-- List -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-soft p-8">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 3" :key="i" class="h-24 bg-gray-100 rounded-xl" />
      </div>
    </div>

    <div v-else-if="testimonials.length === 0" class="bg-white rounded-2xl shadow-soft p-12 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <p class="text-gray-500 mb-4">Aucun temoignage pour le moment</p>
      <button
        @click="openModal()"
        class="inline-flex items-center gap-2 bg-gold text-charcoal px-4 py-2 rounded-xl font-medium"
      >
        Ajouter le premier temoignage
      </button>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="testimonial in testimonials"
        :key="testimonial.id"
        class="bg-white rounded-2xl shadow-soft p-6"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4 flex-1">
            <!-- Avatar ou Photo -->
            <div class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gold/20">
              <img 
                v-if="getPhotoUrl(testimonial)"
                :src="getPhotoUrl(testimonial)"
                :alt="testimonial.client_name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="text-gold font-bold text-xl">
                  {{ testimonial.client_name.charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
            
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <h3 class="font-bold text-charcoal">{{ testimonial.client_name }}</h3>
                <span v-if="testimonial.city" class="text-gray-400 text-sm">• {{ testimonial.city }}</span>
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="testimonial.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ testimonial.active ? 'Visible' : 'Masque' }}
                </span>
              </div>
              
              <!-- Rating -->
              <div v-if="testimonial.rating" class="text-gold text-sm mb-2">
                {{ '★'.repeat(testimonial.rating) }}{{ '☆'.repeat(5 - testimonial.rating) }}
              </div>
              
              <p class="text-gray-600">{{ testimonial.message }}</p>
              
              <!-- Photo preview -->
              <div v-if="getPhotoUrl(testimonial)" class="mt-3">
                <img 
                  :src="getPhotoUrl(testimonial)" 
                  :alt="'Photo de ' + testimonial.client_name"
                  class="h-20 w-auto rounded-lg object-cover border border-gray-200"
                />
              </div>
              
              <p class="text-xs text-gray-400 mt-2">
                Ajoute le {{ formatDate(testimonial.created_at) }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="toggleStatus(testimonial)"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              :title="testimonial.active ? 'Masquer' : 'Afficher'"
            >
              <svg v-if="testimonial.active" class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              @click="openModal(testimonial)"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Modifier"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(testimonial)"
              class="p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Supprimer"
            >
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          @click.self="closeModal"
        >
          <div class="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-bold text-charcoal mb-4">
              {{ editingTestimonial ? 'Modifier le temoignage' : 'Nouveau temoignage' }}
            </h3>

            <form @submit.prevent="saveTestimonial" class="space-y-4">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom de la cliente <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.client_name"
                  type="text"
                  placeholder="Ex: Fatima I."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                  required
                />
              </div>

              <!-- City -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Ville
                </label>
                <input
                  v-model="form.city"
                  type="text"
                  placeholder="Ex: N'Djamena"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                />
              </div>

              <!-- Rating -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Note
                </label>
                <div class="flex gap-2">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    @click="form.rating = star"
                    class="text-3xl transition-colors hover:scale-110 transform"
                    :class="star <= (form.rating || 0) ? 'text-gold' : 'text-gray-300 hover:text-gold/50'"
                  >
                    ★
                  </button>
                  <button
                    v-if="form.rating"
                    type="button"
                    @click="form.rating = null"
                    class="text-sm text-gray-400 hover:text-gray-600 ml-2"
                  >
                    Effacer
                  </button>
                </div>
              </div>

              <!-- Message -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Temoignage <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="form.message"
                  rows="4"
                  placeholder="Le temoignage de la cliente..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none"
                  required
                />
              </div>

              <!-- Photo Upload - DRAG & DROP -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Photo (optionnel)
                </label>
                
                <!-- Preview si image existe -->
                <div v-if="form.photo_url" class="mb-3 relative inline-block">
                  <img 
                    :src="form.photo_url" 
                    alt="Preview" 
                    class="h-32 w-auto rounded-xl object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    @click="removePhoto"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Drop zone -->
                <div
                  v-else
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                  @click="triggerFileInput"
                  class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
                  :class="isDragging ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileSelect"
                  />
                  
                  <div v-if="isUploading" class="flex flex-col items-center">
                    <div class="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-3"></div>
                    <p class="text-gray-600 text-sm">Telechargement...</p>
                  </div>
                  
                  <div v-else class="flex flex-col items-center">
                    <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p class="text-gray-600 text-sm mb-1">
                      <span class="text-gold font-medium">Cliquez</span> ou glissez une image
                    </p>
                    <p class="text-xs text-gray-400">PNG, JPG jusqu'a 5MB</p>
                  </div>
                </div>

                <!-- URL manuelle -->
                <div class="mt-3">
                  <p class="text-xs text-gray-400 mb-1">Ou collez une URL :</p>
                  <input
                    v-model="manualPhotoUrl"
                    type="url"
                    placeholder="https://exemple.com/photo.jpg"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                    @blur="applyManualUrl"
                  />
                </div>
              </div>

              <!-- Active -->
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="form.active"
                  class="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold"
                />
                <span class="text-gray-700">Afficher sur le site</span>
              </label>

              <!-- Actions -->
              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-2.5 bg-gray-100 text-charcoal rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex-1 px-4 py-2.5 bg-charcoal text-white rounded-xl font-medium hover:bg-charcoal-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          @click.self="testimonialToDelete = null"
        >
          <div class="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div class="text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-charcoal mb-2">Supprimer ce temoignage ?</h3>
              <p class="text-gray-500 text-sm mb-6">
                Le temoignage de "{{ testimonialToDelete.client_name }}" sera supprime.
              </p>
              <div class="flex gap-3">
                <button
                  @click="testimonialToDelete = null"
                  class="flex-1 px-4 py-2.5 bg-gray-100 text-charcoal rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  @click="deleteTestimonial"
                  :disabled="deleting"
                  class="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  {{ deleting ? 'Suppression...' : 'Supprimer' }}
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
import type { Testimonial } from '~/types'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

useHead({
  title: 'Temoignages — Admin Samiah',
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
    alert('Veuillez selectionner une image')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('L\'image ne doit pas depasser 5MB')
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
    alert('Erreur lors du telechargement: ' + error.message)
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
