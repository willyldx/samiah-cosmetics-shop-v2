<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <NuxtLink to="/produits" class="inline-flex items-center gap-2 text-gray-500 hover:text-charcoal transition-colors mb-4">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Continuer mes achats
        </NuxtLink>
        <h1 class="text-2xl lg:text-3xl font-bold text-charcoal">Finaliser ma commande</h1>
      </div>
    </div>

    <!-- Panier vide -->
    <div v-if="isEmpty" class="max-w-7xl mx-auto px-4 py-16 text-center">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
      </div>
      <h2 class="text-xl font-bold text-charcoal mb-2">Votre panier est vide</h2>
      <p class="text-gray-500 mb-6">Ajoutez des produits pour passer commande</p>
      <NuxtLink to="/produits" class="inline-flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-full font-medium">
        Voir les produits
      </NuxtLink>
    </div>

    <!-- Formulaire de commande -->
    <div v-else class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Formulaire (2/3) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Informations personnelles -->
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
              <span class="w-8 h-8 bg-charcoal text-white rounded-full flex items-center justify-center text-sm">1</span>
              Vos informations
            </h2>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom complet <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Ex: Fatima Ibrahim"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
                  :class="{ 'border-red-500': errors.name }"
                />
                <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Telephone <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="Ex: 66 00 00 00"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
                  :class="{ 'border-red-500': errors.phone }"
                />
                <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
              </div>
            </div>
          </div>

          <!-- Adresse de livraison -->
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
              <span class="w-8 h-8 bg-charcoal text-white rounded-full flex items-center justify-center text-sm">2</span>
              Adresse de livraison
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Ville <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.city"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all bg-white"
                  :class="{ 'border-red-500': errors.city }"
                >
                  <option value="">Selectionnez une ville</option>
                  <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                </select>
                <p v-if="errors.city" class="text-red-500 text-sm mt-1">{{ errors.city }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Quartier / Adresse complete <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.address"
                  type="text"
                  placeholder="Ex: Moursal, pres de la station Total"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
                  :class="{ 'border-red-500': errors.address }"
                />
                <p v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</p>
              </div>

              <!-- Info livraison -->
              <div class="bg-gold/10 border border-gold/20 rounded-xl p-4">
                <div class="flex gap-3">
                  <svg class="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="text-sm">
                    <p class="font-medium text-charcoal">Frais de livraison</p>
                    <p class="text-gray-600 mt-1">
                      Les frais de livraison seront confirmes par WhatsApp selon votre quartier 
                      <span class="text-charcoal">(generalement entre 500 et 2 000 FCFA a N'Djamena)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mode de paiement -->
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
              <span class="w-8 h-8 bg-charcoal text-white rounded-full flex items-center justify-center text-sm">3</span>
              Mode de paiement
            </h2>
            
            <div class="grid sm:grid-cols-2 gap-3">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                :class="form.paymentMethod === method.value 
                  ? 'border-gold bg-gold/5' 
                  : 'border-gray-200 hover:border-gray-300'"
              >
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  :value="method.value"
                  class="sr-only"
                />
                <span class="text-2xl">{{ method.icon }}</span>
                <span class="font-medium text-charcoal">{{ method.label }}</span>
                <span
                  v-if="form.paymentMethod === method.value"
                  class="absolute top-2 right-2 w-5 h-5 bg-gold rounded-full flex items-center justify-center"
                >
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
              </label>
            </div>
            <p v-if="errors.paymentMethod" class="text-red-500 text-sm mt-2">{{ errors.paymentMethod }}</p>
          </div>

          <!-- Notes -->
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
              <span class="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm">4</span>
              Notes (optionnel)
            </h2>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Instructions speciales pour la livraison, questions..."
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Recapitulatif (1/3) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 class="text-lg font-bold text-charcoal mb-4">Recapitulatif</h2>
            
            <!-- Items -->
            <div class="space-y-3 mb-4">
              <div
                v-for="item in items"
                :key="item.product.id"
                class="flex gap-3"
              >
                <img
                  :src="item.product.image || 'https://via.placeholder.com/100'"
                  :alt="item.product.title"
                  class="w-16 h-16 rounded-lg object-cover bg-gray-100"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-sm text-charcoal line-clamp-1">{{ item.product.title }}</h4>
                  <p class="text-gray-500 text-sm">Qte: {{ item.quantity }}</p>
                  <p class="text-gold font-semibold text-sm">{{ formatPrice(item.product.price * item.quantity) }}</p>
                </div>
              </div>
            </div>

            <hr class="my-4 border-gray-100" />

            <!-- Totaux -->
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Sous-total</span>
                <span class="font-medium">{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Livraison</span>
                <span class="text-gold font-medium">A confirmer</span>
              </div>
            </div>

            <hr class="my-4 border-gray-100" />

            <div class="flex justify-between items-center mb-6">
              <span class="font-bold text-charcoal">Total</span>
              <span class="text-xl font-bold text-charcoal">{{ formatPrice(subtotal) }}</span>
            </div>

            <!-- Bouton Commander -->
            <button
              @click="submitOrder"
              :disabled="isSubmitting"
              class="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <template v-else>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                </svg>
                Commander via WhatsApp
              </template>
            </button>

            <p class="text-xs text-gray-500 text-center mt-3">
              Vous serez redirige vers WhatsApp pour confirmer votre commande
            </p>
          </div>
        </div>
      </div>
    </div>

    <WhatsAppFloat />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Commander - Samiah Cosmetics',
})

const config = useRuntimeConfig()
const router = useRouter()
const { items, subtotal, isEmpty, formatPrice, clearCart } = useCart()
const { createOrder } = useOrders()

// Villes du Tchad
const cities = [
  "N'Djamena",
  'Moundou',
  'Sarh',
  'Abeche',
  'Kelo',
  'Koumra',
  'Pala',
  'Am Timan',
  'Bongor',
  'Mongo',
  'Doba',
  'Ati',
  'Lai',
  'Oum Hadjer',
  'Bitkine',
  'Massaguet',
  'Dourbali',
  'Massakory',
  'Ngama',
  'Bokoro'
]

// Modes de paiement
const paymentMethods = [
  { value: 'cash', label: 'Cash a la livraison', icon: '💵' },
  { value: 'airtel_money', label: 'Airtel Money', icon: '📱' },
  { value: 'moov_money', label: 'Moov Money', icon: '📱' },
  { value: 'western_union', label: 'Western Union', icon: '🏦' },
  { value: 'express_union', label: 'Express Union', icon: '🏦' },
  { value: 'moneygram', label: 'MoneyGram', icon: '🏦' },
]

const paymentLabels: Record<string, string> = {
  cash: 'Cash a la livraison',
  airtel_money: 'Airtel Money',
  moov_money: 'Moov Money',
  western_union: 'Western Union',
  express_union: 'Express Union',
  moneygram: 'MoneyGram',
}

// Formulaire
const form = reactive({
  name: '',
  phone: '',
  city: '',
  address: '',
  paymentMethod: 'cash',
  notes: '',
})

const errors = reactive({
  name: '',
  phone: '',
  city: '',
  address: '',
  paymentMethod: '',
})

const isSubmitting = ref(false)

// Validation
const validate = () => {
  let isValid = true
  
  errors.name = ''
  errors.phone = ''
  errors.city = ''
  errors.address = ''
  errors.paymentMethod = ''
  
  if (!form.name.trim()) {
    errors.name = 'Le nom est requis'
    isValid = false
  }
  
  if (!form.phone.trim()) {
    errors.phone = 'Le telephone est requis'
    isValid = false
  } else if (!/^[0-9\s+()-]{8,}$/.test(form.phone)) {
    errors.phone = 'Numero de telephone invalide'
    isValid = false
  }
  
  if (!form.city) {
    errors.city = 'La ville est requise'
    isValid = false
  }
  
  if (!form.address.trim()) {
    errors.address = 'L\'adresse est requise'
    isValid = false
  }
  
  if (!form.paymentMethod) {
    errors.paymentMethod = 'Selectionnez un mode de paiement'
    isValid = false
  }
  
  return isValid
}

// Soumettre la commande
const submitOrder = async () => {
  if (!validate()) return
  
  isSubmitting.value = true
  
  try {
    // Creer la commande dans Supabase
    const { order, error } = await createOrder({
      client_name: form.name,
      client_phone: form.phone,
      client_city: form.city,
      client_address: form.address,
      items: items.value.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      payment_method: form.paymentMethod,
      notes: form.notes || undefined,
    })
    
    if (error || !order) {
      alert('Erreur lors de la creation de la commande. Veuillez reessayer.')
      return
    }
    
    // Generer le message WhatsApp (sans emojis unicode problematiques)
    const message = generateWhatsAppMessage(order)
    
    // Ouvrir WhatsApp vers le numero de la boutique
    const whatsappUrl = 'https://wa.me/' + config.public.whatsappNumber + '?text=' + message
    window.open(whatsappUrl, '_blank')
    
    // Vider le panier
    clearCart()
    
    // Rediriger vers la page de confirmation
    router.push('/commande/' + order.id)
    
  } catch (e) {
    console.error(e)
    alert('Une erreur est survenue. Veuillez reessayer.')
  } finally {
    isSubmitting.value = false
  }
}

// Generer le message WhatsApp - FORMAT PROPRE SANS EMOJIS UNICODE
const generateWhatsAppMessage = (order: any) => {
  const lines = []
  
  lines.push('=============================')
  lines.push('   NOUVELLE COMMANDE')
  lines.push('=============================')
  lines.push('')
  lines.push('Numero: ' + order.order_number)
  lines.push('')
  lines.push('--- INFORMATIONS CLIENT ---')
  lines.push('Nom: ' + order.client_name)
  lines.push('Tel: ' + order.client_phone)
  lines.push('Ville: ' + order.client_city)
  lines.push('Adresse: ' + order.client_address)
  lines.push('')
  lines.push('--- PRODUITS COMMANDES ---')
  
  order.items.forEach((item: any) => {
    lines.push('- ' + item.product_title + ' x' + item.quantity + ' = ' + formatPrice(item.subtotal))
  })
  
  lines.push('')
  lines.push('--- RECAPITULATIF ---')
  lines.push('Sous-total: ' + formatPrice(order.subtotal))
  lines.push('Livraison: A confirmer')
  lines.push('Mode de paiement: ' + paymentLabels[order.payment_method])
  
  if (order.notes) {
    lines.push('')
    lines.push('--- NOTES ---')
    lines.push(order.notes)
  }
  
  lines.push('')
  lines.push('=============================')
  lines.push('Merci de confirmer ma commande!')
  lines.push('=============================')
  
  return encodeURIComponent(lines.join('\n'))
}
</script>
