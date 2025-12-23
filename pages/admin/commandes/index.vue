<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-charcoal">Commandes</h1>
      <p class="text-gray-500">Gérez vos commandes et validez les paiements</p>
    </div>

    <div class="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
      <button
        @click="currentFilter = 'all'"
        class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
        :class="currentFilter === 'all' ? 'bg-charcoal text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
      >
        Toutes
      </button>
      
      <button
        @click="currentFilter = 'pending_validation'"
        class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2"
        :class="currentFilter === 'pending_validation' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-gray-600 hover:bg-gray-50'"
      >
        <span>À Valider (SMS)</span>
        <span v-if="counts.validation > 0" class="bg-white text-orange-600 text-xs font-bold px-1.5 rounded-full">
          {{ counts.validation }}
        </span>
      </button>

      <button
        @click="currentFilter = 'pending'"
        class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
        :class="currentFilter === 'pending' ? 'bg-yellow-400 text-charcoal' : 'bg-white text-gray-600 hover:bg-gray-50'"
      >
        En attente
      </button>

      <button
        @click="currentFilter = 'confirmed'"
        class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
        :class="currentFilter === 'confirmed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
      >
        Confirmées
      </button>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white h-32 rounded-2xl animate-pulse"></div>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="bg-white rounded-2xl p-12 text-center shadow-sm">
      <p class="text-gray-500">Aucune commande dans cette catégorie.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md"
        :class="{ 'border-l-4 border-l-orange-500': order.status === 'pending_validation' }"
      >
        <div class="flex flex-col md:flex-row justify-between gap-4">
          
          <div class="flex-1">
            <div class="flex items-center justify-between md:justify-start gap-3 mb-2">
              <span class="font-mono text-xs text-gray-400">#{{ order.order_number }}</span>
              <span class="text-xs text-gray-400">{{ formatDate(order.created_at) }}</span>
            </div>
            
            <h3 class="font-bold text-charcoal text-lg">{{ order.client_name }}</h3>
            <div class="text-sm text-gray-500 flex flex-col gap-1 mt-1">
              <a :href="`tel:${order.client_phone}`" class="flex items-center gap-1 hover:text-gold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                {{ order.client_phone }}
              </a>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {{ order.client_city }}, {{ order.client_address }}
              </span>
            </div>
          </div>

          <div class="flex-1 md:text-right md:border-l md:border-gray-100 md:pl-6">
            <div class="mb-2">
              <p class="text-xs text-gray-500 mb-1">Total à payer</p>
              <p class="text-xl font-bold text-charcoal">{{ formatPrice(order.total) }}</p>
            </div>
            
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-sm font-medium text-gray-700">
              <span v-if="['airtel_money', 'moov_money'].includes(order.payment_method)">📱</span>
              <span v-else>💵</span>
              {{ paymentLabels[order.payment_method] || order.payment_method }}
            </div>

            <div v-if="order.status === 'pending_validation'" class="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-2 text-left md:text-right">
              <p class="text-xs text-orange-600 font-bold mb-1">VERIFIER SMS :</p>
              <p class="font-mono text-lg font-bold text-charcoal select-all">{{ order.transaction_ref || 'Non renseigné' }}</p>
            </div>
          </div>

          <div class="flex md:flex-col justify-end gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
            
            <button
              v-if="order.status === 'pending_validation'"
              @click="updateStatus(order, 'confirmed')"
              class="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              Reçu
            </button>

            <button
              v-if="order.status === 'pending'"
              @click="updateStatus(order, 'confirmed')"
              class="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
            >
              Confirmer
            </button>

            <div class="flex gap-2">
               <button
                @click="updateStatus(order, 'cancelled')"
                class="flex-1 bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                Annuler
              </button>
              <NuxtLink :to="`/admin/commandes/${order.id}`" class="flex-1 bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors text-center">
                Détails
              </NuxtLink>
            </div>

          </div>
        </div>
        
        <div v-if="order.notes" class="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 italic">
          "{{ order.notes }}"
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const supabase = useSupabaseClient()
const loading = ref(true)
const orders = ref<any[]>([])
const currentFilter = ref('all')

const counts = reactive({
  validation: 0
})

const paymentLabels: Record<string, string> = {
  cash: 'Cash',
  airtel_money: 'Airtel Money',
  moov_money: 'Moov Money',
  western_union: 'Western Union',
}

// Fetch Orders
const fetchOrders = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    orders.value = data || []
    
    // Compter les "A Valider"
    counts.validation = orders.value.filter(o => o.status === 'pending_validation').length

  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Filter Logic
const filteredOrders = computed(() => {
  if (currentFilter.value === 'all') return orders.value
  return orders.value.filter(o => o.status === currentFilter.value)
})

// Update Status
const updateStatus = async (order: any, newStatus: string) => {
  if (!confirm(`Changer le statut en "${newStatus}" ?`)) return

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', order.id)

    if (error) throw error

    // Mise à jour locale pour éviter de recharger
    order.status = newStatus
    // Recalcul du compteur
    counts.validation = orders.value.filter(o => o.status === 'pending_validation').length
    
    // Si on vient de valider, on peut changer de filtre automatiquement
    if (currentFilter.value === 'pending_validation' && newStatus === 'confirmed') {
      // On reste là ou on bascule ? Reste là, c'est mieux.
    }

  } catch (e) {
    alert('Erreur lors de la mise à jour')
  }
}

// Helpers
const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' F'
const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })

onMounted(() => {
  fetchOrders()
  
  // Écoute temps réel des nouvelles commandes
  const channel = supabase
    .channel('orders-list')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      fetchOrders() // Recharge si une nouvelle commande arrive
    })
    .subscribe()
    
  onUnmounted(() => supabase.removeChannel(channel))
})
</script>
