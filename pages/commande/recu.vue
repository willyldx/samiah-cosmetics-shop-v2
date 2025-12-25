<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    
    <div v-if="loading" class="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div class="w-12 h-12 border-4 border-charcoal border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 font-medium">Génération de votre reçu...</p>
    </div>

    <div v-else-if="!order" class="max-w-md mx-auto text-center py-12">
      <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </div>
      <h2 class="text-xl font-bold text-gray-800">Commande introuvable</h2>
      <p class="text-gray-500 mb-6">Nous ne parvenons pas à récupérer les détails.</p>
      <NuxtLink to="/" class="text-charcoal underline font-bold">Retour à l'accueil</NuxtLink>
    </div>

    <div v-else class="max-w-md mx-auto animate-fade-in">
      
      <div class="text-center mb-6">
        <h1 class="text-xl font-bold text-charcoal">
          Merci {{ (order.client_name || 'Client').split(' ')[0] }} !
        </h1>
        <p class="text-gray-500 text-sm">Voici votre récapitulatif.</p>
      </div>

      <div ref="receiptRef" class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 relative mb-6">
        
        <div class="bg-charcoal text-white p-6 text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-2 bg-gold"></div>
          
          <div class="relative z-10">
            <div class="mb-3 inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full text-white shadow-lg animate-bounce">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>

            <h2 class="text-lg font-bold mb-2">Commande reçue avec succès ! ✅</h2>
            <p class="text-white/90 text-xs leading-relaxed px-2 mb-4">
              Merci pour votre commande. Nous allons traiter votre demande et vous contacterons très bientôt pour la validation et la livraison.
            </p>

            <div class="border-t border-white/10 pt-3 mt-2">
              <p class="text-gold font-mono font-bold text-lg">#{{ order.order_number }}</p>
              <p class="text-white/40 text-[10px]">{{ orderDate }}</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="border-b border-dashed border-gray-200 pb-4 mb-4">
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Client</p>
            <p class="font-bold text-charcoal">{{ order.client_name }}</p>
            <p class="text-sm text-gray-500">{{ order.client_phone }}</p>
            <p class="text-sm text-gray-500">{{ order.client_city }}</p>
          </div>

          <div class="space-y-3 mb-6">
            <div v-for="(item, index) in order.items" :key="index" class="flex justify-between items-start text-sm">
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
              <span>{{ formatPrice(order.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Livraison</span>
              <span class="text-gold font-medium">À confirmer</span>
            </div>
            <div class="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
              <span class="font-bold text-charcoal">TOTAL</span>
              <span class="text-xl font-bold text-charcoal">{{ formatPrice(order.total) }}</span>
            </div>
          </div>

          <div class="mt-4 text-center">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              :class="order.payment_method === 'cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              {{ formatPaymentMethod(order.payment_method) }}
            </span>
            <div v-if="order.transaction_ref" class="text-xs text-gray-400 mt-1 font-mono">
              Ref: {{ order.transaction_ref }}
            </div>
          </div>
        </div>

        <div class="h-4 bg-gray-50 relative" style="background-image: radial-gradient(circle, transparent 70%, white 75%); background-size: 16px 16px; background-position: 0 -8px;"></div>
      </div>

      <div class="space-y-3">
        <button 
          @click="downloadReceipt" 
          :disabled="isGenerating"
          class="w-full bg-charcoal text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95"
        >
          <span v-if="isGenerating" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          {{ isGenerating ? 'Génération...' : 'Télécharger le Reçu' }}
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
const router = useRouter()

const order = ref<any>(null)
const receiptRef = ref(null)
const isGenerating = ref(false)
const loading = ref(true)

// --- FORMATAGE ---
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

const orderDate = computed(() => {
  if (!order.value?.created_at) return ''
  return new Date(order.value.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
})

const formatPaymentMethod = (method: string) => {
  const labels: Record<string, string> = {
    cash: 'Paiement à la livraison',
    airtel_money: 'Airtel Money',
    moov_money: 'Moov Money',
    western_union: 'Western Union',
    express_union: 'Express Union',
    moneygram: 'MoneyGram'
  }
  return labels[method] || method
}

// --- CHARGEMENT DES DONNÉES ---
onMounted(async () => {
  const orderId = route.query.id
  
  if (!orderId) {
    loading.value = false
    return
  }

  try {
    // On récupère la commande ET les articles liés
    // ATTENTION : vérifie que ta table de jointure s'appelle bien 'order_items'
    // et qu'elle a une relation vers 'products'
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          unit_price,
          products (
            title
          )
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    if (!data) throw new Error('Commande introuvable')

    // Préparation des données pour l'affichage
    const formattedItems = (data.order_items || []).map((item: any) => ({
      product_title: item.products?.title || 'Produit',
      quantity: item.quantity,
      subtotal: item.quantity * item.unit_price
    }))

    // On stocke tout dans la variable order
    order.value = {
      ...data,
      items: formattedItems,
      // Si le total n'est pas dans la table orders, on le recalcule
      subtotal: data.total_amount || formattedItems.reduce((acc: number, i: any) => acc + i.subtotal, 0),
      total: data.total_amount || formattedItems.reduce((acc: number, i: any) => acc + i.subtotal, 0)
    }

  } catch (e) {
    console.error('Erreur:', e)
  } finally {
    // IMPORTANT : On enlève l'état de chargement à la fin
    loading.value = false
  }
})

// --- TÉLÉCHARGEMENT ---
const downloadReceipt = async () => {
  if (!receiptRef.value) return
  isGenerating.value = true

  try {
    await new Promise(r => setTimeout(r, 200)) // Petite pause pour la stabilité

    const canvas = await html2canvas(receiptRef.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })

    const image = canvas.toDataURL("image/jpeg", 0.9)
    const link = document.createElement('a')
    link.href = image
    link.download = `Recu-Samiah-${order.value.order_number}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

  } catch (error) {
    alert("Erreur lors du téléchargement. Essayez une capture d'écran.")
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
