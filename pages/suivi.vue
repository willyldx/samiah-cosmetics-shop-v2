<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="border-b border-gray-100 pt-24 pb-8">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <h1 class="text-3xl lg:text-4xl font-serif font-light text-charcoal mb-4">
          Suivre ma commande
        </h1>
        <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400">
          Entrez votre numéro pour consulter vos suivis
        </p>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-4 py-16">
      <!-- Formulaire de recherche -->
      <div class="mb-12">
        <form @submit.prevent="searchOrders" class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 relative">
            <input
              v-model="phone"
              type="tel"
              placeholder="Numéro WhatsApp (ex: 66 00 00 00)"
              required
              class="w-full px-4 py-4 border border-gray-200 focus:border-charcoal outline-none transition-colors text-charcoal font-light placeholder-gray-400"
              :class="{ 'border-red-400': error }"
            />
          </div>

          <button
            type="submit"
            :disabled="loading || !phone.trim()"
            class="bg-charcoal text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
          >
            {{ loading ? 'Recherche...' : 'Rechercher' }}
          </button>
        </form>

        <!-- Message d'erreur -->
        <Transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
        >
          <div v-if="error" class="mt-4 p-4 border border-red-200 text-red-500 text-[10px] uppercase tracking-widest text-center">
            {{ error }}
          </div>
        </Transition>
      </div>

      <!-- Résultats -->
      <Transition
        enter-active-class="transition-opacity duration-500"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div v-if="searched && !loading">
          <!-- Aucune commande -->
          <div v-if="orders.length === 0" class="text-center py-16 border border-gray-100">
            <h3 class="text-xl font-serif font-light text-charcoal mb-4">Aucune commande active</h3>
            <p class="text-gray-400 font-light text-sm mb-8">
              Vérifiez le numéro saisi ou explorez notre collection.
            </p>
            <NuxtLink
              to="/produits"
              class="inline-block border border-gray-200 text-charcoal px-8 py-4 text-[10px] tracking-[0.2em] uppercase font-medium hover:border-charcoal transition-colors"
            >
              Découvrir la collection
            </NuxtLink>
          </div>

          <!-- Liste des commandes -->
          <div v-else class="space-y-8">
            <h2 class="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">
              {{ orders.length }} commande{{ orders.length > 1 ? 's' : '' }} en cours
            </h2>

            <div 
              v-for="order in orders" 
              :key="order.id"
              class="border border-gray-200 bg-white"
            >
              <!-- Header commande -->
              <div class="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p class="font-serif text-2xl text-charcoal mb-1">{{ order.order_number }}</p>
                  <p class="text-[10px] text-gray-400 uppercase tracking-widest">{{ formatDate(order.created_at) }}</p>
                </div>
                <div 
                  class="px-4 py-2 text-[10px] uppercase tracking-[0.2em] border w-fit"
                  :class="getStatusClass(order.status)"
                >
                  {{ getStatusLabel(order.status) }}
                </div>
              </div>

              <!-- Timeline du statut -->
              <div class="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100">
                <div class="flex items-center justify-between relative">
                  <!-- Ligne de progression -->
                  <div class="absolute top-2 left-0 right-0 h-[1px] bg-gray-200 mx-4"></div>
                  <div 
                    class="absolute top-2 left-0 h-[1px] bg-charcoal mx-4 transition-all duration-1000"
                    :style="{ width: getProgressWidth(order.status) }"
                  ></div>

                  <!-- Étapes -->
                  <div 
                    v-for="(step, index) in orderSteps" 
                    :key="step.value"
                    class="relative z-10 flex flex-col items-center"
                  >
                    <div 
                      class="w-4 h-4 rounded-full border bg-white mb-3 transition-colors duration-500"
                      :class="isStepCompleted(order.status, step.value) 
                        ? 'border-charcoal' 
                        : isStepCurrent(order.status, step.value)
                          ? 'border-charcoal bg-charcoal'
                          : 'border-gray-200'"
                    >
                    </div>
                    <span 
                      class="text-[9px] uppercase tracking-widest text-center hidden md:block"
                      :class="isStepCompleted(order.status, step.value) || isStepCurrent(order.status, step.value)
                        ? 'text-charcoal'
                        : 'text-gray-300'"
                    >
                      {{ step.label }}
                    </span>
                  </div>
                </div>
                <p class="md:hidden text-center text-[10px] uppercase tracking-widest text-charcoal mt-6">
                  Étape : {{ getStatusLabel(order.status) }}
                </p>
              </div>

              <!-- Détails commande -->
              <div class="p-6 md:p-8 space-y-6">
                <!-- Articles -->
                <div>
                  <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">Articles</p>
                  <div class="space-y-3">
                    <div 
                      v-for="(item, index) in parseItems(order.items)" 
                      :key="index"
                      class="flex justify-between font-light text-sm"
                    >
                      <span class="text-charcoal">{{ item.title }} <span class="text-gray-400 text-xs ml-2">x{{ item.quantity }}</span></span>
                      <span class="text-gray-500">{{ formatPrice(item.price * item.quantity) }}</span>
                    </div>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <!-- Livraison -->
                  <div>
                    <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Livraison</p>
                    <p class="text-sm text-charcoal font-light">
                      {{ order.client_address }}, {{ order.client_city }}
                    </p>
                  </div>

                  <!-- Total -->
                  <div class="md:text-right">
                    <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Total</p>
                    <p class="font-serif text-2xl text-charcoal">{{ formatPrice(order.total) }}</p>
                  </div>
                </div>

                <!-- Bouton WhatsApp si en attente -->
                <div v-if="order.status === 'en_attente'" class="pt-6 border-t border-gray-100">
                  <a
                    :href="getWhatsAppLink(order)"
                    target="_blank"
                    rel="noopener"
                    class="block w-full text-center border border-charcoal text-charcoal py-4 text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-charcoal hover:text-white transition-colors"
                  >
                    Confirmer via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Info supplémentaire -->
      <div class="mt-16 text-center">
        <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
          Besoin d'assistance ?
        </p>
        <a
          :href="`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, j\'ai une question concernant ma commande.')}`"
          target="_blank"
          rel="noopener"
          class="text-charcoal text-[10px] uppercase tracking-[0.2em] border-b border-charcoal pb-1 hover:text-gold hover:border-gold transition-colors"
        >
          Contactez-nous
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Suivi - Samiah Cosmetics',
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

// Étapes de commande (Sans emojis)
const orderSteps = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'en_preparation', label: 'Préparation' },
  { value: 'en_livraison', label: 'Livraison' },
  { value: 'livree', label: 'Livrée' },
]

const statusOrder = ['en_attente', 'confirmee', 'en_preparation', 'en_livraison', 'livree']

const normalizePhone = (phoneNumber: string): string => {
  let cleaned = phoneNumber.replace(/[^\d+]/g, '')
  if (cleaned.startsWith('+235')) return cleaned
  if (cleaned.startsWith('235')) return '+' + cleaned
  if (cleaned.startsWith('+')) return cleaned
  return '+235' + cleaned
}

const searchOrders = async () => {
  if (!phone.value.trim()) return

  loading.value = true
  searched.value = false
  error.value = ''
  orders.value = []

  try {
    const normalizedPhone = normalizePhone(phone.value)
    
    const phoneVariants = [
      normalizedPhone,
      normalizedPhone.replace('+235', ''),
      phone.value.replace(/\s/g, ''),
    ]

    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .or(phoneVariants.map(p => `client_phone.ilike.%${p.slice(-8)}%`).join(','))
      .neq('status', 'livree') 
      .neq('status', 'annulee') 
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError

    orders.value = data || []
  } catch (e: any) {
    console.error('Erreur recherche:', e)
    error.value = 'Erreur lors de la recherche.'
  } finally {
    loading.value = false
    searched.value = true
  }
}

// Helpers
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'en_attente': 'En attente',
    'confirmee': 'Confirmée',
    'en_preparation': 'En préparation',
    'en_livraison': 'En livraison',
    'livree': 'Livrée',
    'annulee': 'Annulée',
    'pending': 'En attente',
    'confirmed': 'Confirmée',
    'processing': 'En préparation',
    'shipped': 'En livraison',
    'delivered': 'Livrée',
    'cancelled': 'Annulée',
  }
  return labels[status] || status
}

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    'en_attente': 'border-gray-300 text-gray-500 bg-white',
    'confirmee': 'border-charcoal text-charcoal bg-white',
    'en_preparation': 'border-charcoal text-white bg-charcoal',
    'en_livraison': 'border-charcoal text-white bg-charcoal',
    'livree': 'border-gold text-gold bg-white',
    'annulee': 'border-red-200 text-red-500 bg-white',
    // Fallback
    'pending': 'border-gray-300 text-gray-500 bg-white',
    'confirmed': 'border-charcoal text-charcoal bg-white',
    'processing': 'border-charcoal text-white bg-charcoal',
    'shipped': 'border-charcoal text-white bg-charcoal',
    'delivered': 'border-gold text-gold bg-white',
    'cancelled': 'border-red-200 text-red-500 bg-white',
  }
  return classes[status] || 'border-gray-200 text-gray-400 bg-white'
}

const isStepCompleted = (currentStatus: string, stepValue: string): boolean => {
  const currentIndex = statusOrder.indexOf(currentStatus)
  const stepIndex = statusOrder.indexOf(stepValue)
  return currentIndex > stepIndex && currentIndex !== -1
}

const isStepCurrent = (currentStatus: string, stepValue: string): boolean => {
  return currentStatus === stepValue
}

const getProgressWidth = (status: string): string => {
  const index = statusOrder.indexOf(status)
  if (index === -1) return '0%'
  const percentage = (index / (statusOrder.length - 1)) * 100
  return `calc(${percentage}% - 1rem)`
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
    year: 'numeric'
  })
}

const getWhatsAppLink = (order: any): string => {
  const message = `Bonjour, je confirme ma commande ${order.order_number}.\nNom: ${order.client_name}\nContact: ${order.client_phone}`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}
</script>
