<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-charcoal">Paramètres du site</h1>
      <p class="text-gray-500">Personnalisez l'apparence de votre site</p>
    </div>

    <!-- Hero Section Settings -->
    <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 class="text-lg font-bold text-charcoal mb-6">Section Hero (Page d'accueil)</h2>
      
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Formulaire -->
        <div class="space-y-5">
          <!-- Sous-titre (badge) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Sous-titre (badge)
            </label>
            <input
              v-model="form.subtitle"
              type="text"
              placeholder="Ex: Consultation capillaire en ligne"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Description de votre service..."
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none"
            ></textarea>
          </div>

          <!-- Prix consultation -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Prix consultation (FCFA)
            </label>
            <input
              v-model.number="form.consultation_price"
              type="number"
              min="0"
              placeholder="10000"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
            />
          </div>

          <!-- Stats clients -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre de clientes (affiché)
            </label>
            <input
              v-model="form.stats_clients"
              type="text"
              placeholder="Ex: 500+"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
            />
          </div>

          <!-- Rating -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Note (sur 5)
            </label>
            <input
              v-model.number="form.rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              placeholder="5.0"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
            />
          </div>
        </div>

        <!-- Image -->
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Image Hero
            </label>
            
            <!-- Upload zone -->
            <div
              class="border-2 border-dashed rounded-xl p-6 text-center transition-colors"
              :class="isDragging ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gray-300'"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />
              
              <div v-if="uploading" class="flex flex-col items-center py-4">
                <div class="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-3"></div>
                <p class="text-gray-600 text-sm">Upload en cours...</p>
              </div>
              
              <div v-else class="flex flex-col items-center py-4">
                <button
                  type="button"
                  @click="($refs.fileInput as HTMLInputElement).click()"
                  class="text-gold font-medium hover:underline"
                >
                  Cliquez pour uploader une image
                </button>
                <p class="text-xs text-gray-400 mt-2">PNG, JPG jusqu'à 5MB</p>
              </div>
            </div>

            <!-- URL manuelle -->
            <div class="mt-4">
              <p class="text-sm text-gray-500 mb-2">Ou collez une URL :</p>
              <input
                v-model="form.image"
                type="url"
                placeholder="https://exemple.com/image.jpg"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm"
              />
            </div>
          </div>

          <!-- Aperçu image -->
          <div v-if="form.image" class="mt-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Aperçu :</p>
            <div class="aspect-[4/5] max-w-xs rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img
                :src="form.image"
                alt="Aperçu Hero"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton sauvegarder -->
      <div class="mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          @click="saveSettings"
          :disabled="saving"
          class="bg-charcoal text-white px-6 py-3 rounded-xl font-bold hover:bg-charcoal-800 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span v-if="saving" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>{{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}</span>
        </button>
      </div>
    </div>

    <!-- Message succès -->
    <div
      v-if="showSuccess"
      class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Paramètres enregistrés !
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

useHead({
  title: 'Paramètres — Admin Samiah',
})

const supabase = useSupabaseClient()

const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const isDragging = ref(false)
const showSuccess = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  subtitle: 'Consultation capillaire en ligne',
  description: 'Définition de votre profil capillaire, analyse des problèmes, correction des habitudes et mise en place d une routine personnalisée.',
  image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  consultation_price: 10000,
  stats_clients: '500+',
  rating: 5.0
})

// Charger les paramètres existants
const loadSettings = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('id', 'hero')
      .single()

    if (data && data.value) {
      Object.assign(form, data.value)
    }
  } catch (e) {
    console.error('Erreur chargement settings:', e)
  } finally {
    loading.value = false
  }
}

// Sauvegarder les paramètres
const saveSettings = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({
        id: 'hero',
        value: { ...form },
        updated_at: new Date().toISOString()
      })

    if (error) throw error

    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (e: any) {
    console.error('Erreur sauvegarde:', e)
    alert('Erreur: ' + e.message)
  } finally {
    saving.value = false
  }
}

// Upload image
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadImage(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    uploadImage(event.dataTransfer.files[0])
  }
}

const uploadImage = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Ce fichier n\'est pas une image')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('L\'image dépasse 5MB')
    return
  }

  uploading.value = true
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `hero-${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
      .from('products')
      .upload(fileName, file, { cacheControl: '3600', upsert: true })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    form.image = urlData.publicUrl
  } catch (e: any) {
    console.error('Erreur upload:', e)
    alert('Erreur: ' + e.message)
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

// Charger au montage
onMounted(() => {
  loadSettings()
})
</script>
