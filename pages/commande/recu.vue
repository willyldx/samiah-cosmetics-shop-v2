<template>
  <div class="min-h-screen bg-white py-16 px-4">
    
    <!-- Loading State -->
    <div v-if="loading" class="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div class="w-8 h-8 border border-gray-200 border-t-charcoal rounded-full animate-spin mb-4"></div>
      <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400">Génération du reçu...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="!order" class="max-w-md mx-auto text-center py-24 border border-gray-100">
      <h2 class="text-xl font-serif text-charcoal mb-4">Commande introuvable</h2>
      <p class="text-gray-400 font-light mb-8">Nous ne parvenons pas à récupérer les détails de cette commande.</p>
      <NuxtLink to="/" class="inline-block border border-charcoal text-charcoal px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-charcoal hover:text-white transition-colors">
        Retour à l'accueil
      </NuxtLink>
    </div>

    <!-- Receipt -->
    <div v-else class="max-w-2xl mx-auto">
      
      <div class="text-center mb-12">
        <h1 class="text-3xl font-serif font-light text-charcoal mb-4">
          Merci, {{ clientFirstName }}
        </h1>
        <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400">
          Votre commande a été enregistrée
        </p>
      </div>

      <!-- Receipt Card -->
      <div ref="receiptRef" class="bg-white border border-gray-200 p-8 md:p-12 relative mb-12">
        
        <!-- Header -->
        <div class="text-center border-b border-gray-200 pb-8 mb-8">
          <p class="text-xs uppercase tracking-widest text-charcoal mb-2">Samiah Cosmetics</p>
          <p class="font-serif text-2xl text-charcoal mb-1">#{{ order.order_number }}</p>
          <p class="text-[10px] uppercase tracking-widest text-gray-400">{{ orderDate }}</p>
        </div>

        <!-- Client Info -->
        <div class="grid grid-cols-2 gap-8 mb-12">
          <div>
            <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Facturation à</p>
            <p class="font-medium text-charcoal text-sm mb-1">{{ order.client_name }}</p>
            <p class="text-sm font-light text-gray-500">{{ order.client_phone }}</p>
            <p class="text-sm font-light text-gray-500">{{ order.client_city }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Méthode de paiement</p>
            <p class="font-medium text-charcoal text-sm uppercase tracking-widest mb-1">{{ formatPaymentMethod(order.payment_method) }}</p>
            <p v-if="order.transaction_ref" class="text-[10px] text-gray-400 font-mono tracking-wider">
              Réf: {{ order.transaction_ref }}
            </p>
          </div>
        </div>

        <!-- Order Items -->
        <div class="mb-12">
          <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-4 mb-4">Détails des articles</p>
          <div class="space-y-4">
            <div v-for="(item, index) in order.items" :key="index" class="flex justify-between items-center text-sm font-light">
              <div>
                <span class="text-charcoal">{{ item.product_title }}</span>
                <span class="text-gray-400 text-xs ml-2">x{{ item.quantity }}</span>
              </div>
              <span class="text-charcoal">{{ formatPrice(item.subtotal) }}</span>
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="border-t border-gray-200 pt-6 space-y-3 mb-12">
          <div class="flex justify-between text-sm font-light">
            <span class="text-gray-500">Sous-total</span>
            <span class="text-charcoal">{{ formatPrice(order.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm font-light">
            <span class="text-gray-500">Livraison</span>
            <span class="text-[10px] uppercase tracking-widest text-charcoal">
              {{ order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : 'Calculée ultérieurement' }}
            </span>
          </div>
          <div class="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
            <span class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal">Total</span>
            <span class="text-xl font-serif text-charcoal">{{ formatPrice(order.total) }}</span>
          </div>
        </div>

        <div class="text-center">
          <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400">
            Nous vous contacterons bientôt pour la validation.
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-4 max-w-sm mx-auto">
        <button 
          @click="downloadReceipt" 
          :disabled="isGenerating"
          class="w-full bg-charcoal text-white py-4 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors hover:bg-gold disabled:opacity-50"
        >
          {{ isGenerating ? 'Génération...' : 'Télécharger le reçu' }}
        </button>

        <NuxtLink to="/produits" class="flex justify-center w-full bg-transparent border border-gray-200 text-charcoal py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:border-charcoal transition-colors">
          Retour à la boutique
        </NuxtLink>
      </div>

      <!-- WhatsApp Help -->
      <div class="mt-16 text-center">
        <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
          Une question concernant votre commande ?
        </p>
        <a 
          :href="'https://wa.me/' + config.public.whatsappNumber" 
          target="_blank"
          class="text-charcoal text-[10px] uppercase tracking-[0.2em] border-b border-charcoal pb-1 hover:text-gold hover:border-gold transition-colors"
        >
          Contacter le support
        </a>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'

useHead({
  title: 'Reçu de commande — Samiah Cosmetics',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

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
    day: 'numeric', month: 'long', year: 'numeric'
  })
})

const formatPaymentMethod = (method: string) => {
  const labels: Record<string, string> = {
    cash: 'À la livraison',
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
