<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-charcoal">Commandes</h1>
        <p class="text-gray-500">Gerez toutes les commandes</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl shadow-sm p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="Rechercher par nom, numero..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
            />
          </div>
        </div>

        <!-- Status filter -->
        <select
          v-model="statusFilter"
          class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmee</option>
          <option value="shipped">Expediee</option>
          <option value="delivered">Livree</option>
          <option value="cancelled">Annulee</option>
        </select>

        <!-- Refresh -->
        <button
          @click="fetchOrders"
          class="p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5 text-gray-600" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Orders List -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="p-8">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 5" :key="i" class="h-20 bg-gray-100 rounded-xl"></div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredOrders.length === 0" class="p-12 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <p class="text-gray-500">Aucune commande trouvee</p>
      </div>

      <!-- Orders -->
      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between gap-4">
            <!-- Order Info -->
            <div class="flex items-start gap-4 flex-1">
              <div class="w-12 h-12 bg-charcoal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="font-bold text-charcoal">
                  {{ order.client_name ? order.client_name.charAt(0).toUpperCase() : '?' }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="font-bold text-charcoal">{{ order.order_number }}</p>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="statusClass(order.status)"
                  >
                    {{ statusLabel(order.status) }}
                  </span>
                </div>
                <p class="text-gray-600">{{ order.client_name }} - {{ order.client_phone }}</p>
                <p class="text-sm text-gray-400">{{ order.client_address }}, {{ order.client_city }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatDate(order.created_at) }}</p>
              </div>
            </div>

            <!-- Amount & Actions -->
            <div class="text-right flex-shrink-0">
              <p class="text-lg font-bold text-charcoal">{{ formatPrice(order.total) }}</p>
              <p class="text-sm text-gray-400">{{ order.items?.length || 0 }} article(s)</p>
              
              <div class="flex items-center gap-2 mt-2">
                <!-- WhatsApp - ENVOIE AU CLIENT -->
                <a
                  :href="getWhatsAppLinkToClient(order)"
                  target="_blank"
                  class="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                  title="Contacter le client sur WhatsApp"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                  </svg>
                </a>

                <!-- View Details -->
                <button
                  @click="openOrderDetails(order)"
                  class="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Voir les details"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>

                <!-- Status dropdown -->
                <select
                  :value="order.status"
                  @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
                  class="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmee</option>
                  <option value="shipped">Expediee</option>
                  <option value="delivered">Livree</option>
                  <option value="cancelled">Annulee</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="selectedOrder"
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          @click.self="selectedOrder = null"
        >
          <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 class="text-lg font-bold text-charcoal">Commande {{ selectedOrder.order_number }}</h2>
              <button @click="selectedOrder = null" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6">
              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  :value="selectedOrder.status"
                  @change="updateStatus(selectedOrder.id, ($event.target as HTMLSelectElement).value); selectedOrder.status = ($event.target as HTMLSelectElement).value"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmee</option>
                  <option value="shipped">Expediee</option>
                  <option value="delivered">Livree</option>
                  <option value="cancelled">Annulee</option>
                </select>
              </div>

              <!-- Client -->
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="font-medium text-charcoal mb-2">Client</h3>
                <p class="text-gray-600">{{ selectedOrder.client_name }}</p>
                <p class="text-gray-600">{{ selectedOrder.client_phone }}</p>
                <p class="text-gray-600">{{ selectedOrder.client_address }}, {{ selectedOrder.client_city }}</p>
              </div>

              <!-- Products -->
              <div>
                <h3 class="font-medium text-charcoal mb-2">Produits</h3>
                <div class="space-y-2">
                  <div
                    v-for="(item, idx) in selectedOrder.items"
                    :key="idx"
                    class="flex justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p class="font-medium text-charcoal">{{ item.product_title }}</p>
                      <p class="text-sm text-gray-500">{{ formatPrice(item.product_price) }} x {{ item.quantity }}</p>
                    </div>
                    <p class="font-bold text-charcoal">{{ formatPrice(item.subtotal) }}</p>
                  </div>
                </div>
              </div>

              <!-- Total -->
              <div class="bg-charcoal text-white rounded-xl p-4">
                <div class="flex justify-between mb-1">
                  <span class="text-white/70">Sous-total</span>
                  <span>{{ formatPrice(selectedOrder.subtotal) }}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="text-white/70">Livraison</span>
                  <span>{{ selectedOrder.shipping_fee > 0 ? formatPrice(selectedOrder.shipping_fee) : 'A confirmer' }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold pt-2 border-t border-white/20">
                  <span>Total</span>
                  <span class="text-gold">{{ formatPrice(selectedOrder.total) }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <!-- Confirmer commande -->
                <a
                  :href="getConfirmationWhatsApp(selectedOrder)"
                  target="_blank"
                  class="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                  </svg>
                  Confirmer au client via WhatsApp
                </a>
                
                <!-- Expedier -->
                <a
                  :href="getShippingWhatsApp(selectedOrder)"
                  target="_blank"
                  class="w-full bg-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                  </svg>
                  Informer expedition
                </a>

                <button
                  @click="selectedOrder = null"
                  class="w-full bg-gray-100 text-charcoal py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

useHead({
  title: 'Commandes - Admin Samiah',
})

const supabase = useSupabaseClient()
const route = useRoute()

const loading = ref(true)
const orders = ref<any[]>([])
const search = ref('')
const statusFilter = ref(route.query.status as string || '')
const selectedOrder = ref<any | null>(null)

// Status labels
const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmee',
  shipped: 'Expediee',
  delivered: 'Livree',
  cancelled: 'Annulee',
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Cash a la livraison',
  airtel_money: 'Airtel Money',
  moov_money: 'Moov Money',
  western_union: 'Western Union',
  express_union: 'Express Union',
  moneygram: 'MoneyGram',
}

// Filtered orders
const filteredOrders = computed(() => {
  let result = orders.value

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(o =>
      o.order_number.toLowerCase().includes(q) ||
      o.client_name.toLowerCase().includes(q) ||
      o.client_phone.includes(q)
    )
  }

  if (statusFilter.value) {
    result = result.filter(o => o.status === statusFilter.value)
  }

  return result
})

// Fetch orders
const fetchOrders = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    orders.value = data || []
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

// Update status
const updateStatus = async (orderId: string, newStatus: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) throw error

    // Update local state
    const order = orders.value.find(o => o.id === orderId)
    if (order) order.status = newStatus
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Erreur lors de la mise a jour du statut')
  }
}

// Helpers
const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusLabel = (status: string) => ORDER_STATUS_LABELS[status] || status

const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Formater numero tchadien pour WhatsApp
const formatPhoneForWhatsApp = (phone: string) => {
  // Enlever espaces et caracteres speciaux
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '')
  
  // Si commence par 0, remplacer par +235
  if (cleaned.startsWith('0')) {
    cleaned = '235' + cleaned.substring(1)
  }
  
  // Si pas de code pays, ajouter +235 (Tchad)
  if (!cleaned.startsWith('+') && !cleaned.startsWith('235')) {
    cleaned = '235' + cleaned
  }
  
  // Enlever le + pour l'URL WhatsApp
  return cleaned.replace('+', '')
}

// WhatsApp link TO CLIENT (pas a la boutique!)
const getWhatsAppLinkToClient = (order: any) => {
  const phone = formatPhoneForWhatsApp(order.client_phone)
  const msg = 'Bonjour ' + order.client_name + ', concernant votre commande ' + order.order_number + ' chez Samiah Cosmetics...'
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg)
}

// Message de confirmation au client
const getConfirmationWhatsApp = (order: any) => {
  const phone = formatPhoneForWhatsApp(order.client_phone)
  
  const lines = [
    'Bonjour ' + order.client_name + '!',
    '',
    'Votre commande ' + order.order_number + ' est CONFIRMEE!',
    '',
    '--- DETAILS ---',
  ]
  
  order.items?.forEach((item: any) => {
    lines.push('- ' + item.product_title + ' x' + item.quantity)
  })
  
  lines.push('')
  lines.push('Total: ' + formatPrice(order.total))
  lines.push('')
  lines.push('Nous preparons votre colis et vous informerons de l\'expedition.')
  lines.push('')
  lines.push('Merci pour votre confiance!')
  lines.push('- Samiah Cosmetics')
  
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(lines.join('\n'))
}

// Message d'expedition au client
const getShippingWhatsApp = (order: any) => {
  const phone = formatPhoneForWhatsApp(order.client_phone)
  
  const lines = [
    'Bonjour ' + order.client_name + '!',
    '',
    'Bonne nouvelle! Votre commande ' + order.order_number + ' a ete EXPEDIEE!',
    '',
    'Adresse de livraison:',
    order.client_address + ', ' + order.client_city,
    '',
    'Vous serez contacte(e) par notre livreur tres bientot.',
    '',
    'Merci pour votre confiance!',
    '- Samiah Cosmetics',
  ]
  
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(lines.join('\n'))
}

const openOrderDetails = (order: any) => {
  selectedOrder.value = order
}

// Real-time updates
onMounted(async () => {
  await fetchOrders()

  const channel = supabase
    .channel('orders-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      fetchOrders()
    })
    .subscribe()

  onUnmounted(() => {
    supabase.removeChannel(channel)
  })
})
</script>
