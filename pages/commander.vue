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
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 class="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
              <span class="w-8 h-8 bg-charcoal text-white rounded-full flex items-center justify-center text-sm">1</span>
              Identification
            </h2>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Numéro de Téléphone (WhatsApp) <span class="text-red-500">*</span>
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
              Vos coordonnées
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom complet <span class="text-red-500">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Ex: Fatima Ibrahim"
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
                    <option value="">Sélectionnez une ville</option>
                    <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                  </select>
                  <p v-if="errors.city" class="text-red-500 text-sm mt-1">{{ errors.city }}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Quartier / Adresse <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.address"
                    type="text"
                    placeholder="Ex: Moursal, près de..."
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
              Paiement Sécurisé
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
                📲 Comment payer par {{ form.paymentMethod === 'airtel_money' ? 'Airtel Money' : 'Moov Money' }} ?
              </h3>
              <ol class="list-decimal list-inside text-sm text-gray-600 space-y-2 mb-4">
                <li>Ouvrez votre application téléphone.</li>
                <li>Envoyez le montant de <strong class="text-charcoal">{{ formatPrice(subtotal) }}</strong> au numéro ci-dessous.</li>
                <li>Une fois envoyé, vous recevrez un SMS avec un <strong>ID de transaction</strong>.</li>
                <li>Entrez cet ID dans la case ci-dessous pour valider.</li>
              </ol>
              
              <div class="flex items-center justify-between bg-white p-3 rounded-lg border border-dashed border-gray-300 mb-4">
                <span class="text-gray-500 text-sm">Numéro {{ form.paymentMethod === 'airtel_money' ? 'Airtel' : 'Moov' }} :</span>
                <span class="font-mono font-bold text-lg select-all">
                  {{ form.paymentMethod === 'airtel_money' ? '62 75 21 05' : '90 53 86 43' }}
                </span>
              </div>

              <div>
                <label class="block text-sm font-bold text-charcoal mb-1.5">ID DE TRANSACTION (Reçu par SMS)</label>
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
              placeholder="Instructions spéciales pour la livraison..."
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 class="text-lg font-bold text-charcoal mb-4">Récapitulatif</h2>
            
            <div class="space-y-3 mb-4">
              <div v-for="item in items" :key="item.product.id" class="flex gap-3">
                <img :src="item.product.image || 'https://via.placeholder.com/100'" :alt="item.product.title" class="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-sm text-charcoal line-clamp-1">{{ item.product.title }}</h4>
                  <p class="text-gray-500 text-sm">Qté: {{ item.quantity }}</p>
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
                <span class="text-gold font-medium">À confirmer</span>
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
              <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <template v-else>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Confirmer la commande
              </template>
            </button>
            
            <div class="mt-4 flex justify-center gap-2 text-gray-400">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
               <span class="text-xs">Paiement sécurisé et données cryptées</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <WhatsAppFloat />
  </div>
</template>

<script setup lang="ts">
// IMPORTS
const supabase = useSupabaseClient() // Pour la gestion client
const config = useRuntimeConfig()
const router = useRouter()
const { items, subtotal, isEmpty, formatPrice, clearCart } = useCart()
const { createOrder } = useOrders()

useHead({ title: 'Commander - Samiah Cosmetics' })

// DONNÉES LOCALES
const cities = ["N'Djamena", 'Moundou', 'Sarh', 'Abeche', 'Kelo', 'Koumra', 'Pala', 'Am Timan', 'Bongor', 'Mongo', 'Doba', 'Ati', 'Lai', 'Oum Hadjer', 'Bitkine', 'Massaguet', 'Dourbali', 'Massakory', 'Ngama', 'Bokoro']

const paymentMethods = [
  { value: 'cash', label: 'Cash à la livraison', icon: '💵' },
  { value: 'airtel_money', label: 'Airtel Money', icon: '📱' },
  { value: 'moov_money', label: 'Moov Money', icon: '📱' },
  { value: 'western_union', label: 'Western Union', icon: '🏦' },
  { value: 'express_union', label: 'Express Union', icon: '🏦' },
  { value: 'moneygram', label: 'MoneyGram', icon: '🏦' },
]

// ÉTAT DU FORMULAIRE
const form = reactive({
  name: '',
  phone: '',
  city: '',
  address: '',
  paymentMethod: 'cash',
  transactionRef: '', // Nouveau champ
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

// ÉTAT IDENTIFICATION
const isSubmitting = ref(false)
const isLoadingUser = ref(false)
const userExists = ref(false)

// ------------------------------------------------------------------
// 1. FONCTION INTELLIGENTE : VÉRIFIER SI LE CLIENT EXISTE DÉJÀ
// ------------------------------------------------------------------
const checkUser = async () => {
  // On nettoie le numéro (enlève les espaces)
  const cleanPhone = form.phone.replace(/\s/g, '')
  if (cleanPhone.length < 8) return 

  isLoadingUser.value = true
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('phone', cleanPhone) // On cherche le numéro
      .single()

    if (data) {
      // BINGO ! On remplit le formulaire tout seul
      userExists.value = true
      form.name = data.full_name
      form.city = data.city
      form.address = data.address
      // On garde le numéro tel quel
    } else {
      userExists.value = false
    }
  } catch (e) {
    // Pas grave si erreur, c'est juste un bonus
    console.log('Nouveau client ou erreur lookup')
  } finally {
    isLoadingUser.value = false
  }
}

// ------------------------------------------------------------------
// VALIDATION DU FORMULAIRE
// ------------------------------------------------------------------
const validate = () => {
  let isValid = true
  
  // Reset erreurs
  Object.keys(errors).forEach(key => errors[key as keyof typeof errors] = '')
  
  if (!form.name.trim()) { errors.name = 'Le nom est requis'; isValid = false }
  
  // Validation Tel simple
  if (!form.phone.trim()) { errors.phone = 'Le téléphone est requis'; isValid = false }
  else if (form.phone.replace(/\s/g, '').length < 8) { errors.phone = 'Numéro invalide'; isValid = false }
  
  if (!form.city) { errors.city = 'La ville est requise'; isValid = false }
  if (!form.address.trim()) { errors.address = 'L\'adresse est requise'; isValid = false }
  if (!form.paymentMethod) { errors.paymentMethod = 'Mode de paiement requis'; isValid = false }

  // Validation ID Transaction pour Mobile Money
  if (['airtel_money', 'moov_money'].includes(form.paymentMethod)) {
    if (!form.transactionRef.trim()) {
      errors.transactionRef = 'Veuillez entrer l\'ID de la transaction reçu par SMS'
      isValid = false
    }
  }
  
  return isValid
}

// ------------------------------------------------------------------
// 2. SOUMISSION DE LA COMMANDE
// ------------------------------------------------------------------
const submitOrder = async () => {
  if (!validate()) return
  isSubmitting.value = true
  
  try {
    const cleanPhone = form.phone.replace(/\s/g, '')

    // ÉTAPE A : Sauvegarder/Mettre à jour le client (Construction de la base de données)
    // On utilise "upsert" : si le tel existe on met à jour, sinon on crée
    await supabase.from('clients').upsert({
      phone: cleanPhone,
      full_name: form.name,
      city: form.city,
      address: form.address,
      updated_at: new Date() // Si tu as ce champ, sinon enlève-le
    })

    // ÉTAPE B : Créer la commande
    const { order, error } = await createOrder({
      client_name: form.name,
      client_phone: form.phone, // On garde le format affiché pour la lecture
      client_city: form.city,
      client_address: form.address,
      items: items.value.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      payment_method: form.paymentMethod,
      // On passe l'ID de transaction dans les notes si la structure DB n'est pas encore à jour, 
      // ou idéalement dans un champ 'transaction_ref' si tu l'as ajouté en SQL
      transaction_ref: form.transactionRef, 
      notes: form.notes,
      status: ['airtel_money', 'moov_money'].includes(form.paymentMethod) ? 'pending_validation' : 'pending'
    })
    
    if (error || !order) throw new Error('Erreur création commande')

    // ÉTAPE C : Succès ! On vide le panier
    clearCart()
    
    // ÉTAPE D : Redirection vers le Ticket (Reçu) au lieu de WhatsApp
    // C'est beaucoup plus pro. Le client pourra télécharger son reçu là-bas.
    router.push('/commande/recu?id=' + order.id)
    
  } catch (e) {
    console.error(e)
    alert('Une erreur est survenue. Vérifiez votre connexion.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Petite animation pour l'apparition des éléments */
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
