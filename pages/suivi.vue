<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-2xl mx-auto px-4 py-8 lg:py-12 text-center">
        <div class="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h1 class="text-3xl lg:text-4xl font-bold text-charcoal">
          Suivre ma commande
        </h1>
        <p class="text-gray-600 mt-2">
          Entrez votre numéro de téléphone pour voir vos commandes
        </p>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-4 py-8">
      <!-- Formulaire de recherche -->
      <div class="bg-white rounded-2xl shadow-soft p-6 mb-8">
        <form @submit.prevent="searchOrders" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Numéro de téléphone
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <input
                v-model="phone"
                type="tel"
                placeholder="Ex: 66123456 ou +235 66 12 34 56"
                required
                class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
                :class="{ 'border-red-300 bg-red-50': error }"
              />
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Le numéro utilisé lors de votre commande
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading || !phone.trim()"
            class="w-full bg-charcoal text-white py-3.5 rounded-xl font-bold hover:bg-charcoal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            {{ loading ? 'Recherche...' : 'Rechercher' }}
          </button>
        </form>

        <!-- Message d'erreur -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
        </Transition>
      </div>

      <!-- Résultats -->
      <Transition
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="searched && !loading">
          <!-- Aucune commande -->
          <div v-if="orders.length === 0" class="bg-white rounded-2xl shadow-soft p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-charcoal mb-2">Aucune commande trouvée</h3>
            <p class="text-gray-500 text-sm mb-6">
              Vérifiez que vous avez entré le bon numéro de téléphone
            </p>
            <NuxtLink
              to="/produits"
              class="inline-flex items-center gap-2 bg-gold text-charcoal px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
            >
              Découvrir nos produits
            </NuxtLink>
          </div>

          <!-- Liste des commandes -->
          <div v-else class="space-y-4">
            <h2 class="text-lg font-semibold text-charcoal">
              {{ orders.length }} commande{{ orders.length > 1 ? 's' : '' }} trouvée{{ orders.length > 1 ? 's' : '' }}
            </h2>

            <div 
              v-for="order in orders" 
              :key="order.id"
              class="bg-white rounded-2xl shadow-soft overflow-hidden"
            >
              <!-- Header commande -->
              <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p class="font-bold text-charcoal">{{ order.order_number }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
                </div>
                <div 
                  class="px-3 py-1.5 rounded-full text-sm font-medium"
                  :class="getStatusClass(order.status)"
                >
                  {{ getStatusLabel(order.status) }}
                </div>
              </div>

              <!-- Timeline du statut -->
              <div class="p-4 bg-gray-50">
                <div class="flex items-center justify-between relative">
                  <!-- Ligne de progression -->
                  <div class="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 mx-8"></div>
                  <div 
                    class="absolute top-4 left-0 h-0.5 bg-gold mx-8 transition-all duration-500"
                    :style="{ width: getProgressWidth(order.status) }"
                  ></div>

                  <!-- Étapes -->
                  <div 
                    v-for="(step, index) in orderSteps" 
                    :key="step.value"
                    class="relative z-10 flex flex-col items-center"
                  >
                    <div 
                      class="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                      :class="isStepCompleted(order.status, step.value) 
                        ? 'bg-gold text-charcoal' 
                        : isStepCurrent(order.status, step.value)
                          ? 'bg-gold text-charcoal ring-4 ring-gold/30'
                          : 'bg-gray-200 text-gray-400'"
                    >
                      <svg v-if="isStepCompleted(order.status, step.value) && !isStepCurrent(order.status, step.value)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span v-else class="text-xs">{{ step.icon }}</span>
                    </div>
                    <span 
                      class="text-xs mt-2 text-center max-w-[60px] leading-tight"
                      :class="isStepCompleted(order.status, step.value) || isStepCurrent(order.status, step.value)
                        ? 'text-charcoal font-medium'
                        : 'text-gray-400'"
                    >
                      {{ step.label }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Détails commande -->
              <div class="p-4 space-y-3">
                <!-- Articles -->
                <div>
                  <p class="text-sm text-gray-500 mb-2">Articles commandés :</p>
                  <div class="space-y-1">
                    <div 
                      v-for="(item, index) in parseItems(order.items)" 
                      :key="index"
                      class="text-sm flex justify-between"
                    >
                      <span class="text-charcoal">{{ item.title }} × {{ item.quantity }}</span>
                      <span class="text-gray-500">{{ formatPrice(item.price * item.quantity) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Livraison -->
                <div class="pt-3 border-t border-gray-100">
                  <p class="text-sm text-gray-500">Livraison à :</p>
                  <p class="text-sm text-charcoal font-medium">
                    {{ order.client_address }}, {{ order.client_city }}
                  </p>
                </div>

                <!-- Total -->
                <div class="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span class="font-medium text-charcoal">Total</span>
                  <span class="font-bold text-lg text-gold">{{ formatPrice(order.total) }}</span>
                </div>

                <!-- Bouton WhatsApp si en attente -->
                <div v-if="order.status === 'en_attente'" class="pt-3">
                  <a
                    :href="getWhatsAppLink(order)"
                    target="_blank"
                    rel="noopener"
                    class="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                    Contacter pour confirmer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Info supplémentaire -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          Un problème avec votre commande ?
        </p>
        <a
          :href="`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, j\'ai une question concernant ma commande.')}`"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1 text-gold font-medium hover:underline mt-1"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          Contactez-nous sur WhatsApp
        </a>
      </div>
    </div>

    <WhatsAppFloat />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Suivre ma commande — Samiah Cosmetics',
  meta: [
    { name: 'description', content: 'Suivez l\'état de votre commande Samiah Cosmetics en entrant votre numéro de téléphone.' }
  ]
})

const config = useRuntimeConfig()
const supabase = useSupabaseClient()

const whatsappNumber = config.public.whatsappNumber || '23566000000'

const phone = ref('')
const loading = ref(false)
const searched = ref(false)
const error = ref('')
const orders = ref<any[]>([])

// Étapes de commande
const orderSteps = [
  { value: 'en_attente', label: 'En attente', icon: '⏳' },
  { value: 'confirmee', label: 'Confirmée', icon: '✓' },
  { value: 'en_preparation', label: 'Préparation', icon: '📦' },
  { value: 'en_livraison', label: 'Livraison', icon: '🚚' },
  { value: 'livree', label: 'Livrée', icon: '✨' },
]

const statusOrder = ['en_attente', 'confirmee', 'en_preparation', 'en_livraison', 'livree']

// Normaliser le numéro de téléphone
const normalizePhone = (phoneNumber: string): string => {
  // Enlever tous les caractères non numériques sauf +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '')
  
  // Si commence par +235, garder tel quel
  // Si commence par 235, ajouter +
  // Sinon ajouter +235
  if (cleaned.startsWith('+235')) {
    return cleaned
  } else if (cleaned.startsWith('235')) {
    return '+' + cleaned
  } else if (cleaned.startsWith('+')) {
    return cleaned
  } else {
    return '+235' + cleaned
  }
}

// Rechercher les commandes
const searchOrders = async () => {
  if (!phone.value.trim()) return

  loading.value = true
  searched.value = false
  error.value = ''
  orders.value = []

  try {
    const normalizedPhone = normalizePhone(phone.value)
    
    // Rechercher avec plusieurs formats possibles
    const phoneVariants = [
      normalizedPhone,
      normalizedPhone.replace('+235', ''),
      phone.value.replace(/\s/g, ''),
    ]

    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .or(phoneVariants.map(p => `client_phone.ilike.%${p.slice(-8)}%`).join(','))
      .neq('status', 'livree') // Exclure les commandes livrées
      .neq('status', 'annulee') // Exclure les commandes annulées
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError

    orders.value = data || []
  } catch (e: any) {
    console.error('Erreur recherche:', e)
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
    searched.value = true
  }
}

// Helpers
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'en_attente': '⏳ En attente',
    'confirmee': '✅ Confirmée',
    'en_preparation': '📦 En préparation',
    'en_livraison': '🚚 En livraison',
    'livree': '✨ Livrée',
    'annulee': '❌ Annulée',
    // Fallback pour anciens statuts anglais
    'pending': '⏳ En attente',
    'confirmed': '✅ Confirmée',
    'processing': '📦 En préparation',
    'shipped': '🚚 En livraison',
    'delivered': '✨ Livrée',
    'cancelled': '❌ Annulée',
  }
  return labels[status] || status
}

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    'en_attente': 'bg-yellow-100 text-yellow-700',
    'confirmee': 'bg-blue-100 text-blue-700',
    'en_preparation': 'bg-purple-100 text-purple-700',
    'en_livraison': 'bg-orange-100 text-orange-700',
    'livree': 'bg-green-100 text-green-700',
    'annulee': 'bg-red-100 text-red-700',
    // Fallback
    'pending': 'bg-yellow-100 text-yellow-700',
    'confirmed': 'bg-blue-100 text-blue-700',
    'processing': 'bg-purple-100 text-purple-700',
    'shipped': 'bg-orange-100 text-orange-700',
    'delivered': 'bg-green-100 text-green-700',
    'cancelled': 'bg-red-100 text-red-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const isStepCompleted = (currentStatus: string, stepValue: string): boolean => {
  const currentIndex = statusOrder.indexOf(currentStatus)
  const stepIndex = statusOrder.indexOf(stepValue)
  return currentIndex >= stepIndex && currentIndex !== -1
}

const isStepCurrent = (currentStatus: string, stepValue: string): boolean => {
  return currentStatus === stepValue
}

const getProgressWidth = (status: string): string => {
  const index = statusOrder.indexOf(status)
  if (index === -1) return '0%'
  const percentage = (index / (statusOrder.length - 1)) * 100
  return `calc(${percentage}% - 2rem)`
}

const parseItems = (items: any): any[] => {
  if (typeof items === 'string') {
    try {
      return JSON.parse(items)
    } catch {
      return []
    }
  }
  return items || []
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getWhatsAppLink = (order: any): string => {
  const message = `Bonjour, je souhaite confirmer ma commande ${order.order_number}.\n\nNom: ${order.client_name}\nTéléphone: ${order.client_phone}`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}
</script>
