<template>
  <div class="min-h-screen bg-gray-50">
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

    <div v-else class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
              <span class="w-8 h-8 bg-charcoal text-white rounded-full flex items-center justify-center text-sm">1</span>
              Identification
            </h2>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Numero de Telephone (WhatsApp) <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <span class="p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 font-bold flex items-center">+235</span>
                <input
                  v-model="form.phone"
                  @blur="checkUser"
                  type="tel"
                  placeholder="66 XX XX XX"
                  class="flex-1 px-4 py-3 border-2 rounded-xl outline-none transition-all font-bold tracking-wide"
                  :class="userExists ? 'border-green-500 bg-green-50 text-green-700' : (errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-gold')"
                />
              </div>
              
              <div v-if="isLoadingUser" class="text-gray-400 text-xs mt-2 flex items-center gap-1">
                <span class="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                Recherche du compte...
              </div>
              
              <p v-if="userExists" class="text-green-600 text-sm mt-2 flex items-center gap-1 font-medium animate-pulse">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                Bon retour parmi nous, {{ form.name }} !
              </p>
              <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm transition-all duration-500" :class="{ 'opacity-50 pointer-events-none': isLoadingUser }">
            <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
              <span class="w-8 h-8 bg-charcoal text-white rounded-full flex items-center justify-center text-sm">2</span>
              Vos coordonnees
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom complet <span class="text-red-500">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="John Doe"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
                  :class="{ 'border-red-500': errors.name }"
                />
                <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Ville <span class="text-red-500">*</span></label>
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
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Quartier / Adresse <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.address"
                    type="text"
                    placeholder="Ex: Moursal, pres de..."
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
                    :class="{ 'border-red-500': errors.address }"
                  />
                  <p v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
              <span class="w-8 h-8 bg-charcoal text-white rounded-full flex items-center justify-center text-sm">3</span>
              Paiement Securise
            </h2>
            
            <div class="grid sm:grid-cols-2 gap-3 mb-6">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md"
                :class="form.paymentMethod === method.value 
                  ? 'border-gold bg-gold/5' 
                  : 'border-gray-200 hover:border-gray-300'"
              >
                <input v-model="form.paymentMethod" type="radio" :value="method.value" class="sr-only" />
                <span class="text-2xl">{{ method.icon }}</span>
                <span class="font-medium text-charcoal">{{ method.label }}</span>
                <span v-if="form.paymentMethod === method.value" class="absolute top-2 right-2 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </span>
              </label>
            </div>

            <div v-if="['airtel_money', 'moov_money'].includes(form.paymentMethod)" class="bg-gray-50 border border-gray-200 rounded-xl p-5 animate-fade-in-up">
              <h3 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                Comment payer par {{ form.paymentMethod === 'airtel_money' ? 'Airtel Money' : 'Moov Money' }} ?
              </h3>
              <ol class="list-decimal list-inside text-sm text-gray-600 space-y-2 mb-4">
                <li>Ouvrez votre application telephone.</li>
                <li>Envoyez le montant de <strong class="text-charcoal">{{ formatPrice(subtotal) }}</strong> au numero ci-dessous.</li>
                <li>Une fois envoye, vous recevrez un SMS avec un <strong>ID de transaction</strong>.</li>
                <li>Entrez cet ID dans la case ci-dessous pour valider.</li>
              </ol>
              
              <div class="flex items-center justify-between bg-white p-3 rounded-lg border border-dashed border-gray-300 mb-4">
                <span class="text-gray-500 text-sm">Numero {{ form.paymentMethod === 'airtel_money' ? 'Airtel' : 'Moov' }} :</span>
                
                <div class="flex items-center gap-3">
                  <span class="font-mono font-bold text-lg text-charcoal select-all">
                    {{ form.paymentMethod === 'airtel_money' ? '62 75 21 05' : '90 53 86 43' }}
                  </span>
                  
                  <button 
                    type="button"
                    @click="copyToClipboard(form.paymentMethod === 'airtel_money' ? '62 75 21 05' : '90 53 86 43')"
                    class="px-3 py-1.5 rounded-md text-xs font-bold transition-all border flex items-center gap-1.5"
                    :class="copied ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'"
                  >
                    <span v-if="copied">✓ Copié</span>
                    <span v-else>
                       <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                       Copier
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-charcoal mb-1.5">ID DE TRANSACTION (Recu par SMS)</label>
                <input 
                  v-model="form.transactionRef" 
                  type="text" 
                  placeholder="Ex: TX-19384020" 
                  class="w-full px-4 py-3 border-2 border-charcoal rounded-xl focus:ring-2 focus:ring-gold/50 outline-none font-mono uppercase"
                  :class="{ 'border-red-500': errors.transactionRef }"
                />
                <p v-if="errors.transactionRef" class="text-red-500 text-sm mt-1">{{ errors.transactionRef }}</p>
              </div>
            </div>

            <p v-if="errors.paymentMethod" class="text-red-500 text-sm mt-2">{{ errors.paymentMethod }}</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
              <span class="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm">4</span>
              Notes (optionnel)
            </h2>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Instructions speciales pour la livraison..."
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 class="text-lg font-bold text-charcoal mb-4">Recapitulatif</h2>
            
            <div class="space-y-3 mb-4">
              <div v-for="item in items" :key="item.product.id" class="flex gap-3">
                <img :src="item.product.image || 'https://via.placeholder.com/100'" :alt="item.product.title" class="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-sm text-charcoal line-clamp-1">{{ item.product.title }}</h4>
                  <p class="text-gray-500 text-sm">Qte: {{ item.quantity }}</p>
                  <p class="text-gold font-semibold text-sm">{{ formatPrice(item.product.price * item.quantity) }}</p>
                </div>
              </div>
            </div>

            <hr class="my-4 border-gray-100" />

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

            <button
              @click="submitOrder"
              :disabled="isSubmitting"
              class="w-full bg-charcoal text-white py-4 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              Confirmer la commande
            </button>
            
            <div class="mt-4 flex justify-center gap-2 text-gray-400">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
               <span class="text-xs">Paiement securise et donnees cryptees</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <WhatsAppFloat />

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isProcessing" class="fixed inset-0 bg-charcoal/90 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-sm">
        
        <div class="relative w-24 h-24 mb-8">
          <div class="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-gold rounded-full border-t-transparent animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
        </div>

        <h3 class="text-2xl font-bold text-white mb-2 text-center animate-pulse">
          {{ processingStep }}
        </h3>
        <p class="text-white/60 text-sm text-center">Ne fermez pas cette fenetre...</p>

      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
// IMPORTS
const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const router = useRouter()
const { items, subtotal, isEmpty, formatPrice, clearCart } = useCart()
const { createOrder } = useOrders()

useHead({ title: 'Commander - Samiah Cosmetics' })

// DONNÉES LOCALES
const cities = ["N'Djamena", 'Moundou', 'Sarh', 'Abeche', 'Kelo', 'Koumra', 'Pala', 'Am Timan', 'Bongor', 'Mongo', 'Doba', 'Ati', 'Lai', 'Oum Hadjer', 'Bitkine', 'Massaguet', 'Dourbali', 'Massakory', 'Ngama', 'Bokoro']

const paymentMethods = [
  { value: 'cash', label: 'Cash a la livraison', icon: '💵' },
  { value: 'airtel_money', label: 'Airtel Money', icon: '📱' },
  { value: 'moov_money', label: 'Moov Money', icon: '📱' },
  { value: 'western_union', label: 'Western Union', icon: '🏦' },
  { value: 'express_union', label: 'Express Union', icon: '🏦' },
  { value: 'moneygram', label: 'MoneyGram', icon: '🏦' },
]

// Labels pour le message WhatsApp (sans accents)
const paymentLabelsWhatsApp: Record<string, string> = {
  cash: 'Cash a la livraison',
  airtel_money: 'Airtel Money',
  moov_money: 'Moov Money',
  western_union: 'Western Union',
  express_union: 'Express Union',
  moneygram: 'MoneyGram',
}

// ÉTAT DU FORMULAIRE
const form = reactive({
  name: '',
  phone: '',
  city: '',
  address: '',
  paymentMethod: 'cash',
  transactionRef: '', 
  notes: '',
})

const errors = reactive({
  name: '',
  phone: '',
  city: '',
  address: '',
  paymentMethod: '',
  transactionRef: '',
})

// ÉTAT DE CHARGEMENT & OVERLAY
const isSubmitting = ref(false)
const isLoadingUser = ref(false)
const userExists = ref(false)
const isProcessing = ref(false)
const processingStep = ref('Connexion securisee...')

// === FONCTIONNALITÉ COPIE RAPIDE ===
const copied = ref(false)

const copyToClipboard = (text: string) => {
  const cleanText = text.replace(/\s/g, '') // Enlève les espaces
  navigator.clipboard.writeText(cleanText)
  copied.value = true
  
  // Vibration pour feedback tactile (si supporté par le téléphone)
  if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(50)
  }
  
  setTimeout(() => copied.value = false, 2000)
}
// ===================================

// FONCTION INTELLIGENTE : VÉRIFIER SI LE CLIENT EXISTE DÉJÀ
const checkUser = async () => {
  const cleanPhone = form.phone.replace(/\s/g, '')
  if (cleanPhone.length < 8) return 

  isLoadingUser.value = true
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('phone', cleanPhone)
      .single()

    if (data) {
      userExists.value = true
      form.name = data.full_name
      form.city = data.city
      form.address = data.address
    } else {
      userExists.value = false
    }
  } catch (e) {
    console.log('Nouveau client ou erreur lookup')
  } finally {
    isLoadingUser.value = false
  }
}

// VALIDATION DU FORMULAIRE
const validate = () => {
  let isValid = true
  
  Object.keys(errors).forEach(key => errors[key as keyof typeof errors] = '')
  
  if (!form.name.trim()) { errors.name = 'Le nom est requis'; isValid = false }
  
  if (!form.phone.trim()) { errors.phone = 'Le telephone est requis'; isValid = false }
  else if (form.phone.replace(/\s/g, '').length < 8) { errors.phone = 'Numero invalide'; isValid = false }
  
  if (!form.city) { errors.city = 'La ville est requise'; isValid = false }
  if (!form.address.trim()) { errors.address = 'L\'adresse est requise'; isValid = false }
  if (!form.paymentMethod) { errors.paymentMethod = 'Mode de paiement requis'; isValid = false }

  if (['airtel_money', 'moov_money'].includes(form.paymentMethod)) {
    if (!form.transactionRef.trim()) {
      errors.transactionRef = 'Veuillez entrer l\'ID de la transaction recu par SMS'
      isValid = false
    }
  }
  
  return isValid
}

// Generer le message WhatsApp PROPRE (sans emojis Unicode)
const generateWhatsAppMessage = (orderNumber: string) => {
  const formatPriceSimple = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  // Construction du message ligne par ligne (ASCII only)
  const lines: string[] = []
  
  lines.push('=============================')
  lines.push('   NOUVELLE COMMANDE')
  lines.push('=============================')
  lines.push('')
  lines.push('Numero: ' + orderNumber)
  lines.push('')
  lines.push('--- INFORMATIONS CLIENT ---')
  lines.push('Nom: ' + form.name)
  lines.push('Tel: ' + form.phone)
  lines.push('Ville: ' + form.city)
  lines.push('Adresse: ' + form.address)
  lines.push('')
  lines.push('--- PRODUITS COMMANDES ---')
  
  items.value.forEach(item => {
    const itemTotal = item.product.price * item.quantity
    lines.push('- ' + item.product.title + ' x' + item.quantity + ' = ' + formatPriceSimple(itemTotal))
  })
  
  lines.push('')
  lines.push('--- RECAPITULATIF ---')
  lines.push('Sous-total: ' + formatPriceSimple(subtotal.value))
  lines.push('Livraison: A confirmer')
  lines.push('Mode de paiement: ' + paymentLabelsWhatsApp[form.paymentMethod])
  
  if (form.transactionRef) {
    lines.push('Ref. Transaction: ' + form.transactionRef)
  }
  
  if (form.notes) {
    lines.push('')
    lines.push('Notes: ' + form.notes)
  }
  
  lines.push('')
  lines.push('=============================')
  lines.push('Merci de confirmer ma commande!')
  lines.push('=============================')

  return lines.join('\n')
}

// SOUMISSION DE LA COMMANDE
const submitOrder = async () => {
  // 1. Validation de base
  if (!validate()) return
  
  // 2. On lance l'ecran de cinema
  isSubmitting.value = true
  isProcessing.value = true
  
  try {
    const cleanPhone = form.phone.replace(/\s/g, '')

    // Effet visuel : Connexion
    processingStep.value = "Connexion securisee..."
    await new Promise(r => setTimeout(r, 800))

    // ÉTAPE A : Sauvegarder le client (En arriere-plan)
    await supabase.from('clients').upsert({
      phone: cleanPhone,
      full_name: form.name,
      city: form.city,
      address: form.address,
      updated_at: new Date()
    })

    // Effet visuel : Envoi
    processingStep.value = "Envoi de votre commande..."

    // ÉTAPE B : Creer la commande
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
      transaction_ref: form.transactionRef, 
      notes: form.notes,
      status: ['airtel_money', 'moov_money'].includes(form.paymentMethod) ? 'pending_validation' : 'pending'
    })
    
    if (error || !order) throw new Error('Erreur creation commande')

    // Effet visuel : Verification finale
    processingStep.value = "Verification de la transaction..."
    await new Promise(r => setTimeout(r, 1200))

    // Effet visuel : Succes
    processingStep.value = "Commande validee avec succes!"
    await new Promise(r => setTimeout(r, 800))

    // ÉTAPE C : Generer le message WhatsApp propre
    const whatsappMessage = generateWhatsAppMessage(order.order_number)
    const whatsappUrl = 'https://wa.me/' + config.public.whatsappNumber + '?text=' + encodeURIComponent(whatsappMessage)

    // ÉTAPE D : Nettoyage et Redirection
    clearCart()
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank')
    
    // Rediriger vers la page de recu
    router.push('/commande/recu?id=' + order.id)
    
  } catch (e) {
    console.error(e)
    isProcessing.value = false
    isSubmitting.value = false
    alert('Une erreur est survenue lors de la commande. Veuillez verifier votre connexion et reessayer.')
  }
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
