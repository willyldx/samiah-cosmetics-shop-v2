<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-serif font-light text-charcoal mb-1">Paramètres du site</h1>
        <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400">Configuration et apparence de la boutique</p>
      </div>
      <button
        @click="saveSettings"
        :disabled="isSaving"
        class="bg-charcoal text-white px-6 py-2.5 text-[10px] uppercase tracking-widest font-medium hover:bg-charcoal/90 transition-colors border border-charcoal disabled:opacity-50 flex items-center gap-2"
      >
        <span v-if="isSaving" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </div>

    <!-- Success Message -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="successMessage" class="mb-6 p-4 bg-gray-50 border border-gray-200 flex items-center gap-3">
        <svg class="w-4 h-4 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="text-sm font-medium text-charcoal">{{ successMessage }}</span>
      </div>
    </Transition>

    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-gray-200 border-t-charcoal rounded-full animate-spin"></div>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-8">
      <!-- Formulaire -->
      <div class="lg:col-span-2 space-y-8">
        
        <!-- Section Textes du Hero -->
        <div class="bg-white border border-gray-200 p-8">
          <h2 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal mb-6 border-b border-gray-100 pb-3">
            Textes de l'en-tête (Hero)
          </h2>

          <div class="space-y-6">
            <!-- Badge -->
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Badge (en haut)</label>
              <input
                v-model="form.badge_text"
                type="text"
                placeholder="Ex: Consultation capillaire en ligne"
                class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors"
              />
            </div>

            <!-- Titre ligne 1 -->
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Titre - Ligne 1</label>
              <input
                v-model="form.title_line1"
                type="text"
                placeholder="Ex: La nature"
                class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-lg font-serif text-charcoal outline-none transition-colors"
              />
            </div>

            <!-- Titre ligne 2 + highlight -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Titre - Ligne 2</label>
                <input
                  v-model="form.title_line2"
                  type="text"
                  placeholder="Ex: à la"
                  class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-lg font-serif text-charcoal outline-none transition-colors"
                />
              </div>
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Mot souligné</label>
                <input
                  v-model="form.title_highlight"
                  type="text"
                  placeholder="Ex: rescousse"
                  class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-lg font-serif text-charcoal outline-none transition-colors"
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Description</label>
              <textarea
                v-model="form.description"
                rows="4"
                placeholder="Décrivez votre activité..."
                class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors resize-none"
              ></textarea>
              <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-2">{{ form.description.length }} / 300 caractères recommandés</p>
            </div>
          </div>
        </div>

        <!-- Section Image -->
        <div class="bg-white border border-gray-200 p-8">
          <h2 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal mb-6 border-b border-gray-100 pb-3">
            Image principale
          </h2>

          <div class="space-y-6">
            <!-- Upload zone -->
            <div
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="handleDrop"
              class="border border-dashed p-10 text-center transition-all cursor-pointer"
              :class="isDragging ? 'border-charcoal bg-gray-50' : 'border-gray-300 hover:border-gray-400'"
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
                <div class="w-8 h-8 border-2 border-gray-200 border-t-charcoal rounded-full animate-spin mb-4"></div>
                <p class="text-[10px] uppercase tracking-widest text-gray-500">Téléchargement...</p>
              </div>
              
              <div v-else class="flex flex-col items-center">
                <svg class="w-8 h-8 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-sm font-light text-gray-500 mb-2">
                  <span class="text-charcoal font-medium border-b border-charcoal">Cliquez</span> ou glissez une image
                </p>
                <p class="text-[9px] uppercase tracking-widest text-gray-400">PNG, JPG (Max 5MB)</p>
              </div>
            </div>

            <!-- URL manuelle -->
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Ou importer depuis une URL</label>
              <input
                v-model="form.image_url"
                type="url"
                placeholder="https://..."
                class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Section Stats & Prix -->
        <div class="bg-white border border-gray-200 p-8">
          <h2 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal mb-6 border-b border-gray-100 pb-3">
            Statistiques & Prix
          </h2>

          <div class="grid sm:grid-cols-3 gap-6">
            <!-- Prix consultation -->
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Prix consultation (FCFA)</label>
              <input
                v-model.number="form.consultation_price"
                type="number"
                min="0"
                step="500"
                class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none font-serif transition-colors"
              />
            </div>

            <!-- Nombre de clientes -->
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Clientes satisfaites</label>
              <input
                v-model="form.stats_clients"
                type="text"
                placeholder="Ex: 500+"
                class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors"
              />
            </div>

            <!-- Note -->
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Note globale (sur 5)</label>
              <input
                v-model.number="form.rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors"
              />
            </div>
          </div>

          <!-- Toggles -->
          <div class="mt-8 pt-8 border-t border-gray-100 space-y-6">
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-sm font-light text-charcoal">Afficher le bouton "Réserver"</span>
              <div class="relative">
                <input v-model="form.show_consultation_btn" type="checkbox" class="sr-only" />
                <div class="w-10 h-5 transition-colors" :class="form.show_consultation_btn ? 'bg-charcoal' : 'bg-gray-200'"></div>
                <div class="absolute left-1 top-1 w-3 h-3 bg-white transition-transform" :class="{ 'translate-x-5': form.show_consultation_btn }"></div>
              </div>
            </label>

            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-sm font-light text-charcoal">Afficher le bouton "Voir les produits"</span>
              <div class="relative">
                <input v-model="form.show_products_btn" type="checkbox" class="sr-only" />
                <div class="w-10 h-5 transition-colors" :class="form.show_products_btn ? 'bg-charcoal' : 'bg-gray-200'"></div>
                <div class="absolute left-1 top-1 w-3 h-3 bg-white transition-transform" :class="{ 'translate-x-5': form.show_products_btn }"></div>
              </div>
            </label>
          </div>
        </div>

        <!-- Reset -->
        <div class="flex justify-end">
          <button
            @click="resetToDefaults"
            class="text-[10px] uppercase tracking-widest text-gray-400 hover:text-charcoal transition-colors flex items-center gap-2"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Réinitialiser aux valeurs par défaut
          </button>
        </div>
      </div>

      <!-- Preview -->
      <div class="lg:col-span-1">
        <div class="sticky top-24">
          <h3 class="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal mb-6 border-b border-gray-100 pb-3">Aperçu Visuel</h3>
          
          <div class="bg-white border border-gray-200 overflow-hidden shadow-2xl">
            <!-- Mini Hero Preview -->
            <div class="relative aspect-[4/5] bg-gray-50">
              <img
                :src="form.image_url || 'https://via.placeholder.com/400x500?text=Image'"
                alt="Preview"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-charcoal/30 backdrop-blur-[1px]"></div>
              
              <!-- Overlay content -->
              <div class="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 mb-4 w-max">
                  <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  <span class="text-[8px] uppercase tracking-widest">{{ form.badge_text || 'Badge' }}</span>
                </div>
                
                <h4 class="text-2xl font-serif font-light leading-tight mb-3">
                  {{ form.title_line1 || 'Titre' }}<br/>
                  <span class="italic font-light">{{ form.title_line2 }}</span> 
                  <span class="font-medium underline decoration-1 underline-offset-4">{{ form.title_highlight }}</span>
                </h4>
                
                <p class="text-[10px] uppercase tracking-widest text-white/80 leading-relaxed line-clamp-3">
                  {{ form.description || 'Description...' }}
                </p>
              </div>
            </div>

            <!-- Stats preview -->
            <div class="p-6 bg-white border-t border-gray-100">
              <div class="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
                <div class="flex items-center gap-1.5 text-charcoal text-[10px] tracking-widest">
                  ★ {{ form.rating }}
                </div>
                <div class="text-[10px] uppercase tracking-widest text-gray-500">
                  <span class="font-medium text-charcoal">{{ form.stats_clients }}</span> clientes
                </div>
              </div>
              <div class="text-center">
                <span class="text-[9px] uppercase tracking-widest text-gray-400 block mb-1">Prix Consultation</span>
                <span class="font-serif text-sm text-charcoal">{{ formatPrice(form.consultation_price) }}</span>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="mt-8 border border-gray-200 p-6 bg-gray-50">
            <h4 class="text-[10px] uppercase tracking-widest font-medium text-charcoal mb-4">Recommandations</h4>
            <ul class="text-xs font-light text-gray-500 space-y-3">
              <li class="flex gap-2">
                <span class="text-charcoal opacity-50">—</span> 
                Format d'image portrait (ex: 800x1000px)
              </li>
              <li class="flex gap-2">
                <span class="text-charcoal opacity-50">—</span> 
                Utiliser une photographie haute définition
              </li>
              <li class="flex gap-2">
                <span class="text-charcoal opacity-50">—</span> 
                Limiter la description à 200 caractères
              </li>
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
  title: 'Paramètres - Admin Samiah',
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
    successMessage.value = 'Mise à jour effectuée avec succès.'
    setTimeout(() => successMessage.value = '', 3000)
  } else {
    alert('Erreur lors de l\'enregistrement')
  }
  
  isSaving.value = false
}

// Reset to defaults
const resetToDefaults = async () => {
  if (!confirm('Réinitialiser tous les paramètres aux valeurs par défaut ?')) return
  
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
    alert('Veuillez sélectionner une image')
    return
  }
  
  // Valider la taille (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('L\'image ne doit pas dépasser 5MB')
    return
  }
  
  isUploading.value = true
  
  const url = await uploadHeroImage(file)
  
  if (url) {
    form.image_url = url
  } else {
    alert('Erreur lors du téléchargement')
  }
  
  isUploading.value = false
}
</script>
