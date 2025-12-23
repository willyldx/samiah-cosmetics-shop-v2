<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-md mx-auto">
      
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-charcoal">Merci {{ order?.client_name?.split(' ')[0] }} !</h1>
        <p class="text-gray-500">Votre commande a bien été reçue.</p>
      </div>

      <div ref="receiptRef" class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 relative mb-6">
        
        <div class="bg-charcoal text-white p-6 text-center relative overflow-hidden">
          <div class="relative z-10">
            <h2 class="text-xl font-bold tracking-widest uppercase mb-1">REÇU DE COMMANDE</h2>
            <p class="text-white/60 text-xs">{{ orderDate }}</p>
            <p class="text-gold font-mono font-bold mt-2 text-lg">#{{ order?.order_number || order?.id?.slice(0, 8) }}</p>
          </div>
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
        </div>

        <div class="p-6">
          <div class="border-b border-dashed border-gray-200 pb-4 mb-4">
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Client</p>
            <p class="font-bold text-charcoal">{{ order?.client_name }}</p>
            <p class="text-sm text-gray-500">{{ order?.client_phone }}</p>
            <p class="text-sm text-gray-500">{{ order?.client_city }}</p>
          </div>

          <div class="space-y-3 mb-6">
            <div v-for="item in order?.items" :key="item.product_title" class="flex justify-between items-start text-sm">
              <div class="flex-1">
                <span class="font-medium text-gray-800">{{ item.product_title }}</span>
                <div class="text-xs text-gray-400">Qté: {{ item.quantity }}</div>
              </div>
              <span class="font-medium text-charcoal">{{ formatPrice(item.subtotal) }}</span>
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Sous-total</span>
              <span>{{ formatPrice(order?.subtotal || 0) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Livraison</span>
              <span class="text-gold font-medium">À confirmer</span>
            </div>
            <div class="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
              <span class="font-bold text-charcoal">TOTAL</span>
              <span class="text-xl font-bold text-charcoal">{{ formatPrice(order?.total || 0) }}</span>
            </div>
          </div>

          <div class="mt-4 text-center">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              :class="order?.payment_method === 'cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              {{ formatPaymentMethod(order?.payment_method) }}
            </span>
          </div>
        </div>

        <div class="h-4 bg-gray-50 relative" style="background-image: radial-gradient(circle, transparent 70%, white 75%); background-size: 16px 16px; background-position: 0 -8px;"></div>
      </div>

      <div class="space-y-3">
        <button 
          @click="downloadReceipt" 
          :disabled="isGenerating"
          class="w-full bg-charcoal text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span v-if="isGenerating" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          {{ isGenerating ? 'Génération de l\'image...' : 'Télécharger le Reçu (Image)' }}
        </button>

        <NuxtLink to="/" class="block w-full text-center py-3 text-gray-500 font-medium hover:text-charcoal transition-colors">
          Retour à l'accueil
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'

const route = useRoute()
const supabase = useSupabaseClient()
const order = ref(null)
const receiptRef = ref(null) // Lien vers l'élément HTML
const isGenerating = ref(false)

// 1. Récupérer la commande
onMounted(async () => {
  const orderId = route.query.id
  if (!orderId) return navigateTo('/')

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !data) {
    alert("Commande introuvable")
    return navigateTo('/')
  }
  
  order.value = data
})

// 2. Formatage des données
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

const orderDate = computed(() => {
  if (!order.value) return ''
  return new Date(order.value.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
})

const formatPaymentMethod = (method) => {
  const labels = {
    cash: 'Paiement à la livraison',
    airtel_money: 'Airtel Money',
    moov_money: 'Moov Money',
    western_union: 'Western Union',
    moneygram: 'MoneyGram'
  }
  return labels[method] || method
}

// 3. LA MAGIE : Télécharger l'image
const downloadReceipt = async () => {
  if (!receiptRef.value) return
  isGenerating.value = true

  try {
    // On attend un tout petit peu que les polices soient chargées
    await new Promise(resolve => setTimeout(resolve, 100))

    // Capture de l'élément HTML
    const canvas = await html2canvas(receiptRef.value, {
      scale: 2, // Meilleure qualité (HD)
      backgroundColor: '#ffffff', // Force le fond blanc
      useCORS: true // Important si tu as des images externes (logos)
    })

    // Conversion en lien de téléchargement
    const image = canvas.toDataURL("image/png")
    const link = document.createElement('a')
    link.href = image
    link.download = `Recu-Samiah-${order.value.order_number || 'Commande'}.png`
    link.click()

  } catch (err) {
    console.error('Erreur génération image:', err)
    alert('Impossible de générer l\'image. Essayez de faire une capture d\'écran manuelle.')
  } finally {
    isGenerating.value = false
  }
}
</script>
