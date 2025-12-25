<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    
    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <div class="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500">Chargement de votre reçu...</p>
    </div>

    <div v-else-if="order" class="max-w-xl mx-auto">
      
      <div id="receipt-capture" class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 relative">
        
        <div class="bg-charcoal text-white p-6 text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-2 bg-gold"></div>
          
          <div class="mb-4 inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full text-white shadow-lg animate-bounce">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 class="text-xl font-bold mb-3">Commande reçue avec succès ! ✅</h1>
          
          <p class="text-white/90 text-sm leading-relaxed px-4">
            Merci pour votre commande.<br>
            Nous allons traiter votre demande et vous contacterons très bientôt pour la validation et la livraison.
          </p>
        </div>

        <div class="p-8">
          <div class="text-center mb-8 border-b border-gray-100 pb-8">
            <p class="text-gray-500 text-sm uppercase tracking-wider mb-1">Numéro de commande</p>
            <p class="text-3xl font-mono font-bold text-charcoal">{{ order.order_number }}</p>
            <p class="text-sm text-gray-400 mt-2">{{ formatDate(order.created_at) }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div>
              <p class="text-gray-500 mb-1">Client</p>
              <p class="font-bold text-charcoal">{{ order.client_name }}</p>
              <p class="text-gray-600">{{ order.client_phone }}</p>
            </div>
            <div class="text-right">
              <p class="text-gray-500 mb-1">Livraison</p>
              <p class="font-medium text-gray-800">{{ order.client_city }}</p>
              <p class="text-gray-600">{{ order.client_address }}</p>
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <div v-for="item in order.order_items" :key="item.id" class="flex justify-between items-center mb-3 last:mb-0">
              <div class="flex items-center gap-3">
                <span class="text-gray-400 text-xs font-mono">x{{ item.quantity }}</span>
                <span class="text-charcoal font-medium text-sm">{{ item.products?.title || 'Produit' }}</span>
              </div>
              <span class="text-charcoal font-bold text-sm">{{ formatPrice(item.unit_price * item.quantity) }}</span>
            </div>
            
            <div class="border-t border-gray-200 my-3"></div>
            
            <div class="flex justify-between items-center text-lg font-bold text-charcoal">
              <span>Total</span>
              <span>{{ formatPrice(order.total_amount) }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-gray-500 bg-white border border-gray-100 rounded-lg p-3">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" :class="order.payment_status === 'paid' ? 'bg-green-500' : 'bg-orange-500'"></span>
              {{ formatPaymentMethod(order.payment_method) }}
            </span>
            <span v-if="order.transaction_ref" class="font-mono">Ref: {{ order.transaction_ref }}</span>
          </div>
        </div>

        <div class="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
          Ce document tient lieu de preuve de commande.
        </div>
      </div>

      <div class="space-y-3">
        <button 
          @click="downloadReceipt"
          :disabled="isGenerating"
          class="w-full bg-charcoal text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          <span v-if="isGenerating" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          {{ isGenerating ? 'Génération de l\'image...' : 'Télécharger le reçu' }}
        </button>

        <NuxtLink to="/produits" class="block w-full bg-white text-charcoal border border-gray-200 py-4 rounded-xl font-bold text-center hover:bg-gray-50 transition-all">
          Retour à la boutique
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import html2canvas from 'html2canvas'

const route = useRoute()
const supabase = useSupabaseClient()
const loading = ref(true)
const order = ref(null)
const isGenerating = ref(false)

useHead({ title: 'Reçu de commande - Samiah Cosmetics' })

// Récupérer la commande via l'ID dans l'URL
onMounted(async () => {
  const orderId = route.query.id
  
  if (!orderId) {
    loading.value = false
    return
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        products (title)
      )
    `)
    .eq('id', orderId)
    .single()

  if (data) {
    order.value = data
  }
  loading.value = false
})

// Fonction de formatage prix
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

// Formatage date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

// Formatage méthode paiement
const formatPaymentMethod = (method) => {
  const labels = {
    cash: 'Paiement à la livraison',
    airtel_money: 'Airtel Money',
    moov_money: 'Moov Money',
    western_union: 'Western Union',
    express_union: 'Express Union',
    moneygram: 'MoneyGram'
  }
  return labels[method] || method
}

// === LOGIQUE DE TÉLÉCHARGEMENT ===
const downloadReceipt = async () => {
  const element = document.getElementById('receipt-capture')
  if (!element) return

  isGenerating.value = true

  try {
    // 1. Capture du DOM en canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Meilleure qualité (Retina)
      useCORS: true, // Pour charger les images externes si besoin
      backgroundColor: '#ffffff', // Fond blanc forcé
      logging: false
    })

    // 2. Conversion en lien de téléchargement
    const image = canvas.toDataURL("image/jpeg", 0.9)
    const link = document.createElement('a')
    link.href = image
    link.download = `Recu-Commande-${order.value.order_number}.jpg`
    
    // 3. Déclenchement
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

  } catch (error) {
    console.error('Erreur génération reçu:', error)
    alert('Impossible de générer l\'image. Veuillez faire une capture d\'écran manuelle.')
  } finally {
    isGenerating.value = false
  }
}
</script>
