<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-charcoal">Parametres du site</h1>
        <p class="text-gray-500">Personnalisez l'apparence de votre boutique</p>
      </div>
      <button
        @click="saveSettings"
        :disabled="isSaving"
        class="inline-flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50"
      >
        <svg v-if="isSaving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </div>

    <!-- Success/Error Messages -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
        <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span class="text-green-800 font-medium">{{ successMessage }}</span>
      </div>
    </Transition>

    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-charcoal border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-6">
      <!-- Formulaire -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Section Badge & Titre -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
            <span class="w-8 h-8 bg-gold/20 text-gold rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </span>
            Textes du Hero
          </h2>

          <div class="space-y-4">
            <!-- Badge -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Badge (en haut)</label>
              <input
                v-model="form.badge_text"
                type="text"
                placeholder="Ex: Consultation capillaire en ligne"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
              />
            </div>

            <!-- Titre ligne 1 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Titre - Ligne 1</label>
              <input
                v-model="form.title_line1"
                type="text"
                placeholder="Ex: La nature"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-2xl font-serif"
              />
            </div>

            <!-- Titre ligne 2 + highlight -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Titre - Ligne 2</label>
                <input
                  v-model="form.title_line2"
                  type="text"
                  placeholder="Ex: a la"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-2xl font-serif"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Mot en or (souligne)</label>
                <input
                  v-model="form.title_highlight"
                  type="text"
                  placeholder="Ex: rescousse"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-2xl font-serif text-gold"
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                v-model="form.description"
                rows="4"
                placeholder="Decrivez votre activite..."
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none"
              ></textarea>
              <p class="text-xs text-gray-400 mt-1">{{ form.description.length }} / 300 caracteres recommandes</p>
            </div>
          </div>
        </div>

        <!-- Section Image -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
            <span class="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </span>
            Image principale
          </h2>

          <div class="space-y-4">
            <!-- Upload zone -->
            <div
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="handleDrop"
              class="border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
              :class="isDragging ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gray-300'"
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />
              
              <div v-if="isUploading" class="flex flex-col items-center">
                <div class="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                <p class="text-gray-600">Telechargement en cours...</p>
              </div>
              
              <div v-else class="flex flex-col items-center">
                <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p class="text-gray-600 mb-1">Glissez une image ici ou cliquez</p>
                <p class="text-xs text-gray-400">PNG, JPG jusqu'a 5MB</p>
              </div>
            </div>

            <!-- URL manuelle -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Ou entrez une URL d'image</label>
              <input
                v-model="form.image_url"
                type="url"
                placeholder="https://..."
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Section Stats & Prix -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
            <span class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </span>
            Statistiques & Prix
          </h2>

          <div class="grid sm:grid-cols-3 gap-4">
            <!-- Prix consultation -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Prix consultation (FCFA)</label>
              <input
                v-model.number="form.consultation_price"
                type="number"
                min="0"
                step="500"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
              />
            </div>

            <!-- Nombre de clientes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Clientes satisfaites</label>
              <input
                v-model="form.stats_clients"
                type="text"
                placeholder="Ex: 500+"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
              />
            </div>

            <!-- Note -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Note (sur 5)</label>
              <input
                v-model.number="form.rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
              />
            </div>
          </div>

          <!-- Toggles -->
          <div class="mt-6 pt-6 border-t border-gray-100 space-y-4">
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-gray-700">Afficher le bouton "Reserver"</span>
              <div class="relative">
                <input v-model="form.show_consultation_btn" type="checkbox" class="sr-only" />
                <div class="w-11 h-6 rounded-full transition-colors" :class="form.show_consultation_btn ? 'bg-gold' : 'bg-gray-200'"></div>
                <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" :class="{ 'translate-x-5': form.show_consultation_btn }"></div>
              </div>
            </label>

            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-gray-700">Afficher le bouton "Voir les produits"</span>
              <div class="relative">
                <input v-model="form.show_products_btn" type="checkbox" class="sr-only" />
                <div class="w-11 h-6 rounded-full transition-colors" :class="form.show_products_btn ? 'bg-gold' : 'bg-gray-200'"></div>
                <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" :class="{ 'translate-x-5': form.show_products_btn }"></div>
              </div>
            </label>
          </div>
        </div>

        <!-- Reset -->
        <div class="flex justify-end">
          <button
            @click="resetToDefaults"
            class="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Reinitialiser aux valeurs par defaut
          </button>
        </div>
      </div>

      <!-- Preview -->
      <div class="lg:col-span-1">
        <div class="sticky top-24">
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Apercu</h3>
          
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <!-- Mini Hero Preview -->
            <div class="relative aspect-[4/5] bg-amber-50">
              <img
                :src="form.image_url || 'https://via.placeholder.com/400x500?text=Image'"
                alt="Preview"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent"></div>
              
              <!-- Overlay content -->
              <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div class="inline-flex items-center gap-1.5 bg-charcoal/80 rounded-full px-2 py-1 text-xs mb-2">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {{ form.badge_text || 'Badge' }}
                </div>
                
                <h4 class="text-lg font-serif font-bold leading-tight">
                  {{ form.title_line1 || 'Titre' }}<br/>
                  {{ form.title_line2 }} <span class="text-gold">{{ form.title_highlight }}</span>
                </h4>
                
                <p class="text-xs text-white/80 mt-2 line-clamp-2">
                  {{ form.description || 'Description...' }}
                </p>
              </div>
            </div>

            <!-- Stats preview -->
            <div class="p-4 border-t border-gray-100">
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-gold">★★★★★</span>
                  <span class="font-bold">{{ form.rating }}</span>
                </div>
                <div class="text-gray-600">
                  <span class="font-bold text-charcoal">{{ form.stats_clients }}</span> clientes
                </div>
              </div>
              <div class="mt-2 text-center">
                <span class="text-xs text-gray-500">Consultation:</span>
                <span class="font-bold text-charcoal ml-1">{{ formatPrice(form.consultation_price) }}</span>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="mt-6 p-4 bg-blue-50 rounded-xl">
            <h4 class="font-bold text-blue-800 text-sm mb-2">💡 Conseils</h4>
            <ul class="text-xs text-blue-700 space-y-1">
              <li>• Image: 800x1000px minimum</li>
              <li>• Titre court et impactant</li>
              <li>• Description 150-250 caracteres</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

useHead({
  title: 'Parametres - Admin Samiah',
})

const { heroSettings, fetchHeroSettings, updateHeroSettings, uploadHeroImage, DEFAULT_HERO_SETTINGS, formatPrice } = useSettings()

// State
const isLoading = ref(true)
const isSaving = ref(false)
const isUploading = ref(false)
const isDragging = ref(false)
const successMessage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// Form (copie locale editable)
const form = reactive({
  badge_text: '',
  title_line1: '',
  title_line2: '',
  title_highlight: '',
  description: '',
  image_url: '',
  consultation_price: 10000,
  stats_clients: '500+',
  rating: 5.0,
  show_consultation_btn: true,
  show_products_btn: true,
})

// Load settings
onMounted(async () => {
  await fetchHeroSettings()
  
  // Copier dans le form
  Object.assign(form, heroSettings.value)
  
  isLoading.value = false
})

// Save settings
const saveSettings = async () => {
  isSaving.value = true
  successMessage.value = ''
  
  const success = await updateHeroSettings({ ...form })
  
  if (success) {
    successMessage.value = 'Parametres enregistres avec succes!'
    setTimeout(() => successMessage.value = '', 3000)
  } else {
    alert('Erreur lors de l\'enregistrement')
  }
  
  isSaving.value = false
}

// Reset to defaults
const resetToDefaults = async () => {
  if (!confirm('Reinitialiser tous les parametres aux valeurs par defaut?')) return
  
  Object.assign(form, DEFAULT_HERO_SETTINGS)
  await saveSettings()
}

// File upload
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) await uploadFile(file)
}

const handleDrop = async (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) await uploadFile(file)
}

const uploadFile = async (file: File) => {
  // Valider le type
  if (!file.type.startsWith('image/')) {
    alert('Veuillez selectionner une image')
    return
  }
  
  // Valider la taille (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('L\'image ne doit pas depasser 5MB')
    return
  }
  
  isUploading.value = true
  
  const url = await uploadHeroImage(file)
  
  if (url) {
    form.image_url = url
  } else {
    alert('Erreur lors du telechargement')
  }
  
  isUploading.value = false
}
</script>
