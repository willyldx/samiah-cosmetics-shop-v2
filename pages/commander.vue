<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="border-b border-gray-100 pt-24 pb-8">
      <div class="max-w-5xl mx-auto px-4 text-center">
        <h1 class="text-3xl lg:text-4xl font-serif font-light text-charcoal tracking-wide mb-4">Finaliser la commande</h1>
        <NuxtLink to="/produits" class="inline-flex items-center text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-charcoal transition-colors">
          <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"></path>
          </svg>
          Retour à la collection
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="isEmpty" class="max-w-5xl mx-auto px-4 py-32 text-center">
      <p class="text-gray-400 font-light mb-8">Votre panier est vide. Découvrez notre collection pour commencer.</p>
      <NuxtLink to="/produits" class="inline-flex items-center justify-center px-8 py-4 border border-gray-200 text-charcoal text-[10px] uppercase tracking-[0.2em] font-medium hover:border-charcoal transition-colors">
        Découvrir la collection
      </NuxtLink>
    </div>

    <!-- Checkout Form -->
    <div v-else class="max-w-7xl mx-auto px-4 py-12 lg:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        <!-- Left Column: Form -->
        <div class="lg:col-span-7 space-y-16">
          
          <!-- Section 1: Identification -->
          <section>
            <h2 class="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-8 flex items-center">
              <span class="w-8 border-t border-gray-200 mr-4"></span>
              01. Identification
            </h2>
            
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Numéro WhatsApp <span class="text-red-400">*</span>
              </label>
              <div class="flex">
                <span class="px-4 py-3 bg-gray-50 border border-r-0 border-gray-200 text-gray-500 text-sm flex items-center">+235</span>
                <input
                  v-model="form.phone"
                  @blur="checkUser"
                  type="tel"
                  placeholder="66 00 00 00"
                  class="w-full px-4 py-3 border border-gray-200 outline-none transition-colors text-charcoal focus:border-charcoal font-light"
                  :class="userExists ? 'border-charcoal bg-gray-50' : (errors.phone ? 'border-red-400' : 'bg-white')"
                />
              </div>
              
              <div v-if="isLoadingUser" class="text-gray-400 text-[10px] tracking-widest uppercase mt-3 animate-pulse">
                Recherche...
              </div>
              
              <p v-if="userExists" class="text-charcoal text-[10px] tracking-widest uppercase mt-3">
                Ravi de vous revoir, {{ form.name }}
              </p>
              <p v-if="errors.phone" class="text-red-400 text-[10px] tracking-widest uppercase mt-2">{{ errors.phone }}</p>
            </div>
          </section>

          <!-- Section 2: Coordonnées -->
          <section :class="{ 'opacity-50 pointer-events-none grayscale': isLoadingUser }">
            <h2 class="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-8 flex items-center">
              <span class="w-8 border-t border-gray-200 mr-4"></span>
              02. Livraison
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Nom complet <span class="text-red-400">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Votre nom"
                  class="w-full px-4 py-3 border border-gray-200 bg-white focus:border-charcoal outline-none transition-colors text-charcoal font-light"
                  :class="{ 'border-red-400': errors.name }"
                />
                <p v-if="errors.name" class="text-red-400 text-[10px] tracking-widest uppercase mt-2">{{ errors.name }}</p>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Ville <span class="text-red-400">*</span></label>
                  <select
                    v-model="form.city"
                    class="w-full px-4 py-3 border border-gray-200 focus:border-charcoal outline-none transition-colors bg-white text-charcoal font-light appearance-none"
                    :class="{ 'border-red-400': errors.city }"
                  >
                    <option value="" disabled>Sélectionner</option>
                    <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                  </select>
                  <p v-if="errors.city" class="text-red-400 text-[10px] tracking-widest uppercase mt-2">{{ errors.city }}</p>
                </div>
                
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Quartier / Adresse <span class="text-red-400">*</span></label>
                  <input
                    v-model="form.address"
                    type="text"
                    placeholder="Précisions de livraison"
                    class="w-full px-4 py-3 border border-gray-200 bg-white focus:border-charcoal outline-none transition-colors text-charcoal font-light"
                    :class="{ 'border-red-400': errors.address }"
                  />
                  <p v-if="errors.address" class="text-red-400 text-[10px] tracking-widest uppercase mt-2">{{ errors.address }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 3: Paiement -->
          <section>
            <h2 class="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-8 flex items-center">
              <span class="w-8 border-t border-gray-200 mr-4"></span>
              03. Paiement
            </h2>
            
            <div class="grid sm:grid-cols-2 gap-4 mb-8">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="relative p-4 border cursor-pointer transition-colors"
                :class="form.paymentMethod === method.value 
                  ? 'border-charcoal' 
                  : 'border-gray-200 hover:border-gray-400'"
              >
                <input v-model="form.paymentMethod" type="radio" :value="method.value" class="sr-only" />
                <span class="block text-[10px] uppercase tracking-widest" :class="form.paymentMethod === method.value ? 'text-charcoal font-medium' : 'text-gray-500'">
                  {{ method.label }}
                </span>
                <span v-if="form.paymentMethod === method.value" class="absolute top-4 right-4 w-1.5 h-1.5 bg-charcoal"></span>
              </label>
            </div>

            <div v-if="['airtel_money', 'moov_money'].includes(form.paymentMethod)" class="p-6 border border-gray-200 bg-gray-50 space-y-6">
              <h3 class="text-xs uppercase tracking-widest text-charcoal font-medium">Instructions</h3>
              
              <div class="space-y-4 text-sm font-light text-gray-500">
                <p>1. Transférez le montant de <span class="text-charcoal font-medium">{{ formatPrice(subtotal) }}</span> au numéro ci-dessous.</p>
                
                <div class="flex items-center justify-between p-4 bg-white border border-gray-200">
                  <span class="text-charcoal tracking-widest font-mono text-lg">
                    {{ form.paymentMethod === 'airtel_money' ? '62 75 21 05' : '90 53 86 43' }}
                  </span>
                  <button 
                    type="button"
                    @click="copyToClipboard(form.paymentMethod === 'airtel_money' ? '62 75 21 05' : '90 53 86 43')"
                    class="text-[10px] uppercase tracking-widest transition-colors"
                    :class="copied ? 'text-green-600' : 'text-gray-400 hover:text-charcoal'"
                  >
                    {{ copied ? 'Copié' : 'Copier' }}
                  </button>
                </div>

                <p>2. Saisissez l'ID de transaction reçu par SMS :</p>
                
                <div>
                  <input 
                    v-model="form.transactionRef" 
                    type="text" 
                    placeholder="Ex: TX-19384020" 
                    class="w-full px-4 py-3 border border-gray-200 bg-white focus:border-charcoal outline-none text-charcoal font-mono uppercase text-sm tracking-wider"
                    :class="{ 'border-red-400': errors.transactionRef }"
                  />
                  <p v-if="errors.transactionRef" class="text-red-400 text-[10px] tracking-widest uppercase mt-2">{{ errors.transactionRef }}</p>
                </div>
              </div>
            </div>

            <p v-if="errors.paymentMethod" class="text-red-400 text-[10px] tracking-widest uppercase mt-2">{{ errors.paymentMethod }}</p>
          </section>

          <!-- Section 4: Notes -->
          <section>
            <h2 class="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-8 flex items-center">
              <span class="w-8 border-t border-gray-200 mr-4"></span>
              04. Notes
            </h2>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Instructions particulières..."
              class="w-full px-4 py-3 border border-gray-200 bg-white focus:border-charcoal outline-none transition-colors resize-none font-light text-charcoal"
            ></textarea>
          </section>
        </div>

        <!-- Right Column: Summary -->
        <div class="lg:col-span-5">
          <div class="border border-gray-200 p-8 sticky top-24 bg-gray-50/50">
            <h2 class="text-xs uppercase tracking-[0.2em] text-charcoal font-medium mb-8">Récapitulatif</h2>
            
            <div class="space-y-6 mb-8">
              <div v-for="item in items" :key="item.product.id" class="flex gap-4 items-center">
                <div class="w-16 h-20 bg-gray-100 flex-shrink-0">
                  <img :src="item.product.image || 'https://via.placeholder.com/100'" :alt="item.product.title" class="w-full h-full object-cover grayscale opacity-80" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-serif text-charcoal text-sm line-clamp-1 mb-1">{{ item.product.title }}</h4>
                  <p class="text-[10px] tracking-widest text-gray-400 uppercase">Qté: {{ item.quantity }}</p>
                </div>
                <div class="text-sm font-light text-gray-500">
                  {{ formatPrice(item.product.price * item.quantity) }}
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6 space-y-4 mb-6">
              <div class="flex justify-between items-center text-sm font-light text-gray-500">
                <span>Sous-total</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm font-light text-gray-500">
                <span>Livraison</span>
                <span class="text-[10px] tracking-widest uppercase">Calculée ultérieurement</span>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6 flex justify-between items-center mb-8">
              <span class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal">Total estimé</span>
              <span class="text-xl font-light text-charcoal">{{ formatPrice(subtotal) }}</span>
            </div>

            <button
              @click="submitOrder"
              :disabled="isSubmitting"
              class="w-full bg-charcoal text-white py-5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors duration-300 disabled:opacity-50"
            >
              Confirmer l'achat
            </button>
            
            <p class="mt-6 text-center text-[10px] uppercase tracking-widest text-gray-400">
              Paiement sécurisé
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Processing Overlay -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isProcessing" class="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-4">
        
        <div class="w-12 h-12 border border-gray-200 border-t-charcoal rounded-full animate-spin mb-8"></div>

        <h3 class="text-xs uppercase tracking-[0.2em] text-charcoal font-medium mb-4 animate-pulse">
          {{ processingStep }}
        </h3>
        <p class="text-[10px] uppercase tracking-widest text-gray-400">Veuillez patienter...</p>

      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const router = useRouter()
const { items, subtotal, isEmpty, formatPrice, clearCart } = useCart()
const { createOrder } = useOrders()
// 1. AJOUT DU TOAST
const toast = useToast()

useHead({ title: 'Commander - Samiah Cosmetics' })

const cities = ["N'Djamena", 'Moundou', 'Sarh', 'Abéché', 'Kélo', 'Koumra', 'Pala', 'Am Timan', 'Bongor', 'Mongo', 'Doba', 'Ati', 'Laï', 'Oum Hadjer', 'Bitkine', 'Massaguet', 'Dourbali', 'Massakory', 'Ngama', 'Bokoro']

const paymentMethods = [
  { value: 'cash', label: 'Cash à la livraison', icon: '💵' },
  { value: 'airtel_money', label: 'Airtel Money', icon: '📱' },
  { value: 'moov_money', label: 'Moov Money', icon: '📱' },
  { value: 'western_union', label: 'Western Union', icon: '🏦' },
  { value: 'express_union', label: 'Express Union', icon: '🏦' },
  { value: 'moneygram', label: 'MoneyGram', icon: '🏦' },
]

const paymentLabelsWhatsApp: Record<string, string> = {
  cash: 'Cash à la livraison',
  airtel_money: 'Airtel Money',
  moov_money: 'Moov Money',
  western_union: 'Western Union',
  express_union: 'Express Union',
  moneygram: 'MoneyGram',
}

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

const isSubmitting = ref(false)
const isLoadingUser = ref(false)
const userExists = ref(false)
const isProcessing = ref(false)
const processingStep = ref('Connexion sécurisée...')
const copied = ref(false)

const copyToClipboard = (text: string) => {
  const cleanText = text.replace(/\s/g, '')
  navigator.clipboard.writeText(cleanText)
  copied.value = true
  
  if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(50)
  }
  
  setTimeout(() => copied.value = false, 2000)
}

const checkUser = async () => {
  const cleanPhone = form.phone.replace(/\s/g, '')
  if (cleanPhone.length < 8) return 

  isLoadingUser.value = true
  
  try {
    const { data } = await supabase
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
    console.log('Nouveau client')
  } finally {
    isLoadingUser.value = false
  }
}

const validate = () => {
  let isValid = true
  
  Object.keys(errors).forEach(key => errors[key as keyof typeof errors] = '')
  
  if (!form.name.trim()) { errors.name = 'Le nom est requis'; isValid = false }
  if (!form.phone.trim()) { errors.phone = 'Le téléphone est requis'; isValid = false }
  else if (form.phone.replace(/\s/g, '').length < 8) { errors.phone = 'Numéro invalide'; isValid = false }
  if (!form.city) { errors.city = 'La ville est requise'; isValid = false }
  if (!form.address.trim()) { errors.address = 'L\'adresse est requise'; isValid = false }
  if (!form.paymentMethod) { errors.paymentMethod = 'Mode de paiement requis'; isValid = false }

  if (['airtel_money', 'moov_money'].includes(form.paymentMethod)) {
    if (!form.transactionRef.trim()) {
      errors.transactionRef = 'Veuillez entrer l\'ID de la transaction reçu par SMS'
      isValid = false
    }
  }
  
  return isValid
}

const submitOrder = async () => {
  // 2. ERREUR VALIDATION
  if (!validate()) {
    toast.error("Veuillez corriger les erreurs avant de continuer")
    return
  }
  
  isSubmitting.value = true
  isProcessing.value = true
  
  try {
    const cleanPhone = form.phone.replace(/\s/g, '')

    processingStep.value = "Connexion sécurisée..."
    await new Promise(r => setTimeout(r, 800))

    await supabase.from('clients').upsert({
      phone: cleanPhone,
      full_name: form.name,
      city: form.city,
      address: form.address,
      updated_at: new Date()
    })

    processingStep.value = "Envoi de votre commande..."

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
      status: 'en_attente'
    })
    
    if (error || !order) throw new Error('Erreur création commande')

    processingStep.value = "Vérification de la transaction..."
    await new Promise(r => setTimeout(r, 1200))

    processingStep.value = "Commande validée avec succès!"
    await new Promise(r => setTimeout(r, 800))

    // 3. SUCCES AVANT REDIRECTION
    toast.success("Commande validée ! Redirection...")

    clearCart()
    router.push('/commande/recu?id=' + order.id)
    
  } catch (e) {
    console.error(e)
    isProcessing.value = false
    isSubmitting.value = false
    // 4. ERREUR SERVEUR
    toast.error("Erreur de connexion. Veuillez réessayer.")
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
