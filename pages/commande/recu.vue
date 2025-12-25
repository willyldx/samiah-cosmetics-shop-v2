<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    
    <div v-if="loading" class="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div class="w-12 h-12 border-4 border-charcoal border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 font-medium">Chargement de votre recu...</p>
    </div>

    <div v-else-if="!order" class="max-w-md mx-auto text-center py-12">
      <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </div>
      <h2 class="text-xl font-bold text-gray-800">Commande introuvable</h2>
      <p class="text-gray-500 mb-6">Nous ne parvenons pas a recuperer les details.</p>
      <NuxtLink to="/" class="text-charcoal underline font-bold">Retour a l'accueil</NuxtLink>
    </div>

    <div v-else class="max-w-md mx-auto animate-fade-in">
      
      <div class="text-center mb-6">
        <h1 class="text-xl font-bold text-charcoal">
          Merci {{ clientFirstName }} !
        </h1>
        <p class="text-gray-500 text-sm">Voici votre recapitulatif.</p>
      </div>

      <div ref="receiptRef" class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 relative mb-6">
        
        <div class="bg-charcoal text-white p-6 text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-2 bg-gold"></div>
          
          <div class="relative z-10">
            <div class="mb-3 inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full text-white shadow-lg animate-bounce">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>

            <h2 class="text-lg font-bold mb-2">Commande recue avec succes !</h2>
            <p class="text-white/90 text-xs leading-relaxed px-2 mb-4">
              Merci pour votre commande. Nous allons traiter votre demande et vous contacterons tres bientot pour la validation et la livraison.
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
                <div class="text-xs text-gray-400">Qte: {{ item.quantity }}</div>
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
              <span class="text-gold font-medium">{{ order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : 'A confirmer' }}</span>
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
          {{ isGenerating ? 'Generation...' : 'Telecharger le Recu' }}
        </button>

        <NuxtLink to="/produits" class="w-full bg-gold text-charcoal py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-gold-400 transition-all active:scale-95">
          Continuer mes achats
        </NuxtLink>

        <NuxtLink to="/" class="block w-full text-center py-3 text-gray-500 font-medium hover:text-charcoal transition-colors">
          Retour a l'accueil
        </NuxtLink>
      </div>

      <!-- Lien discret pour contacter en cas de probleme -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-400 mb-2">Un probleme avec votre commande ?</p>
        <a 
          :href="'https://wa.me/' + config.public.whatsappNumber" 
          target="_blank"
          class="text-sm text-gray-500 hover:text-green-600 transition-colors inline-flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          Contactez-nous sur WhatsApp
        </a>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'

const route = useRoute()
const supabase = useSupabaseClient()
const config = useRuntimeConfig()

const order = ref<any>(null)
const receiptRef = ref(null)
const isGenerating = ref(false)
const loading = ref(true)

// --- FORMATAGE ---
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

const clientFirstName = computed(() => {
  if (!order.value?.client_name) return 'Client'
  return order.value.client_name.split(' ')[0]
})

const orderDate = computed(() => {
  if (!order.value?.created_at) return ''
  return new Date(order.value.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
})

const formatPaymentMethod = (method: string) => {
  const labels: Record<string, string> = {
    cash: 'Paiement a la livraison',
    airtel_money: 'Airtel Money',
    moov_money: 'Moov Money',
    western_union: 'Western Union',
    express_union: 'Express Union',
    moneygram: 'MoneyGram'
  }
  return labels[method] || method
}

// --- CHARGEMENT DES DONNEES ---
onMounted(async () => {
  const orderId = route.query.id as string
  
  if (!orderId) {
    console.error('Pas d\'ID de commande dans l\'URL')
    loading.value = false
    return
  }

  try {
    // Requete simple - les items sont deja dans la colonne JSONB 'items'
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      throw error
    }
    
    if (!data) {
      console.error('Aucune donnee retournee')
      throw new Error('Commande introuvable')
    }

    // Les items sont deja dans data.items (JSONB)
    order.value = data
    
    console.log('Commande chargee:', order.value)

  } catch (e) {
    console.error('Erreur chargement commande:', e)
    order.value = null
  } finally {
    loading.value = false
  }
})

// --- TELECHARGEMENT ---
const downloadReceipt = async () => {
  if (!receiptRef.value) return
  isGenerating.value = true

  try {
    await new Promise(r => setTimeout(r, 200))

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
    console.error('Erreur telechargement:', error)
    alert("Erreur lors du telechargement. Essayez une capture d'ecran.")
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
