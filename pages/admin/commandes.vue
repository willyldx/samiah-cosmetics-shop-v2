<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-serif font-light text-charcoal mb-1">Commandes</h1>
        <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400">Gestion et suivi des commandes</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-gray-200 p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="Rechercher (nom, numéro...)"
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent text-sm text-charcoal focus:bg-white focus:border-gray-200 focus:outline-none focus:ring-0 transition-all font-light"
            />
          </div>
        </div>

        <!-- Status filter -->
        <select
          v-model="statusFilter"
          class="px-4 py-2 bg-gray-50 border border-transparent text-sm text-charcoal focus:bg-white focus:border-gray-200 focus:outline-none focus:ring-0 transition-all font-light appearance-none"
        >
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirmee">Confirmée</option>
          <option value="en_preparation">En préparation</option>
          <option value="en_livraison">En livraison</option>
          <option value="livree">Livrée</option>
          <option value="annulee">Annulée</option>
        </select>

        <!-- Refresh -->
        <button
          @click="fetchOrders"
          class="p-2 border border-gray-200 hover:border-charcoal hover:bg-gray-50 transition-colors text-charcoal"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Orders List -->
    <div class="bg-white border border-gray-200 overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="h-12 bg-gray-50 border border-gray-100 animate-pulse"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredOrders.length === 0" class="p-16 text-center">
        <p class="text-sm font-light text-gray-400">Aucune commande trouvée</p>
      </div>

      <!-- Orders -->
      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="p-4 hover:bg-gray-50 transition-colors grid grid-cols-12 gap-4 items-center cursor-pointer"
          @click="openOrderDetails(order)"
        >
          <div class="col-span-2">
            <span class="text-xs font-mono text-gray-500">#{{ order.order_number }}</span>
          </div>
          
          <div class="col-span-3">
            <p class="text-sm font-medium text-charcoal truncate">{{ order.client_name }}</p>
            <p class="text-[10px] text-gray-400 mt-0.5">{{ order.client_phone }}</p>
          </div>
          
          <div class="col-span-2">
            <p class="text-[10px] uppercase tracking-widest text-gray-500">{{ formatDate(order.created_at) }}</p>
          </div>
          
          <div class="col-span-2">
            <p class="text-sm text-charcoal font-medium">{{ formatPrice(order.total) }}</p>
          </div>

          <div class="col-span-2 flex justify-start items-center gap-2">
            <span class="w-2 h-2 rounded-full" :class="statusBadgeClass(order.status)"></span>
            <span class="text-[10px] uppercase tracking-widest text-charcoal">{{ statusLabel(order.status) }}</span>
          </div>

          <div class="col-span-1 flex justify-end gap-2" @click.stop>
            <a
              :href="getWhatsAppLinkToClient(order)"
              target="_blank"
              class="p-1.5 text-gray-400 hover:text-green-600 border border-transparent hover:border-green-200 transition-colors"
              title="Contacter le client sur WhatsApp"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
              </svg>
            </a>
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
          class="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          @click.self="selectedOrder = null"
        >
          <div class="bg-white border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal">Commande #{{ selectedOrder.order_number }}</h2>
                <p class="text-[10px] text-gray-400 mt-1">{{ formatDate(selectedOrder.created_at) }}</p>
              </div>
              <button @click="selectedOrder = null" class="p-2 text-gray-400 hover:text-charcoal hover:bg-gray-50 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div class="space-y-8">
                <!-- Client -->
                <div>
                  <h3 class="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3 border-b border-gray-100 pb-2">Client</h3>
                  <p class="text-sm font-medium text-charcoal">{{ selectedOrder.client_name }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ selectedOrder.client_phone }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ selectedOrder.client_address }}, {{ selectedOrder.client_city }}</p>
                </div>

                <!-- Status -->
                <div>
                  <h3 class="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3 border-b border-gray-100 pb-2">Statut</h3>
                  <select
                    :value="selectedOrder.status"
                    @change="updateStatus(selectedOrder.id, ($event.target as HTMLSelectElement).value); selectedOrder.status = ($event.target as HTMLSelectElement).value"
                    class="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-sm text-charcoal focus:bg-white focus:border-charcoal focus:outline-none transition-all appearance-none"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="confirmee">Confirmée</option>
                    <option value="en_preparation">En préparation</option>
                    <option value="en_livraison">En livraison</option>
                    <option value="livree">Livrée</option>
                    <option value="annulee">Annulée</option>
                  </select>
                </div>
              </div>

              <div class="space-y-8">
                <!-- Products -->
                <div>
                  <h3 class="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3 border-b border-gray-100 pb-2">Produits</h3>
                  <div class="space-y-3">
                    <div
                      v-for="(item, idx) in selectedOrder.items"
                      :key="idx"
                      class="flex justify-between items-start"
                    >
                      <div>
                        <p class="text-sm font-medium text-charcoal">{{ item.product_title || item.title }}</p>
                        <p class="text-[10px] text-gray-400">{{ formatPrice(item.product_price || item.price) }} × {{ item.quantity }}</p>
                      </div>
                      <p class="text-sm font-medium text-charcoal">{{ formatPrice(item.subtotal || (item.price * item.quantity)) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Total -->
                <div class="bg-gray-50 p-4 border border-gray-200">
                  <div class="flex justify-between mb-2">
                    <span class="text-xs text-gray-500">Sous-total</span>
                    <span class="text-xs text-charcoal">{{ formatPrice(selectedOrder.subtotal) }}</span>
                  </div>
                  <div class="flex justify-between mb-4">
                    <span class="text-xs text-gray-500">Livraison</span>
                    <span class="text-xs text-charcoal">{{ selectedOrder.shipping_fee > 0 ? formatPrice(selectedOrder.shipping_fee) : 'À confirmer' }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span class="text-[10px] uppercase tracking-widest text-charcoal">Total</span>
                    <span class="text-lg font-serif text-charcoal">{{ formatPrice(selectedOrder.total) }}</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Actions Footer -->
            <div class="p-6 border-t border-gray-100 bg-gray-50 flex flex-wrap gap-3">
              <a
                :href="getConfirmationWhatsApp(selectedOrder)"
                target="_blank"
                class="flex-1 bg-white border border-gray-200 text-charcoal px-4 py-2 text-[10px] uppercase tracking-widest text-center hover:border-charcoal transition-colors"
              >
                Confirmer
              </a>
              
              <a
                :href="getPreparationWhatsApp(selectedOrder)"
                target="_blank"
                class="flex-1 bg-white border border-gray-200 text-charcoal px-4 py-2 text-[10px] uppercase tracking-widest text-center hover:border-charcoal transition-colors"
              >
                Préparation
              </a>

              <a
                :href="getShippingWhatsApp(selectedOrder)"
                target="_blank"
                class="flex-1 bg-charcoal border border-charcoal text-white px-4 py-2 text-[10px] uppercase tracking-widest text-center hover:bg-charcoal/90 transition-colors"
              >
                Expédier
              </a>
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

const ORDER_STATUS_LABELS: Record<string, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  en_preparation: 'En préparation',
  en_livraison: 'En livraison',
  livree: 'Livrée',
  annulee: 'Annulée',
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En préparation',
  shipped: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const statusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    en_attente: 'bg-yellow-500',
    confirmee: 'bg-blue-500',
    en_preparation: 'bg-purple-500',
    en_livraison: 'bg-orange-500',
    livree: 'bg-green-500',
    annulee: 'bg-red-500',
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    processing: 'bg-purple-500',
    shipped: 'bg-orange-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  }
  return classes[status] || 'bg-gray-400'
}

const filteredOrders = computed(() => {
  let result = orders.value

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(o =>
      o.order_number?.toLowerCase().includes(q) ||
      o.client_name?.toLowerCase().includes(q) ||
      o.client_phone?.includes(q)
    )
  }

  if (statusFilter.value) {
    result = result.filter(o => o.status === statusFilter.value)
  }

  return result
})

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

const updateStatus = async (orderId: string, newStatus: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) throw error

    const order = orders.value.find(o => o.id === orderId)
    if (order) order.status = newStatus
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Erreur lors de la mise à jour du statut')
  }
}

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

const formatPhoneForWhatsApp = (phone: string) => {
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '')
  
  if (cleaned.startsWith('0')) {
    cleaned = '235' + cleaned.substring(1)
  }
  
  if (!cleaned.startsWith('+') && !cleaned.startsWith('235')) {
    cleaned = '235' + cleaned
  }
  
  return cleaned.replace('+', '')
}

const getWhatsAppLinkToClient = (order: any) => {
  const phone = formatPhoneForWhatsApp(order.client_phone)
  const msg = 'Bonjour ' + order.client_name + ', concernant votre commande ' + order.order_number + ' chez Samiah Cosmetics...'
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg)
}

const getConfirmationWhatsApp = (order: any) => {
  const phone = formatPhoneForWhatsApp(order.client_phone)
  
  const lines = [
    'Bonjour ' + order.client_name + ',',
    '',
    'Votre commande ' + order.order_number + ' est CONFIRMÉE !',
    '',
    'Détails :',
  ]
  
  order.items?.forEach((item: any) => {
    const title = item.product_title || item.title
    lines.push('- ' + title + ' × ' + item.quantity)
  })
  
  lines.push('')
  lines.push('Total : ' + formatPrice(order.total))
  lines.push('')
  lines.push('Nous préparons votre commande et vous informerons de l\'expédition.')
  lines.push('')
  lines.push('Merci pour votre confiance,')
  lines.push('Samiah Cosmetics')
  
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(lines.join('\n'))
}

const getPreparationWhatsApp = (order: any) => {
  const phone = formatPhoneForWhatsApp(order.client_phone)
  
  const lines = [
    'Bonjour ' + order.client_name + ',',
    '',
    'Votre commande ' + order.order_number + ' est EN PRÉPARATION.',
    '',
    'Notre équipe prépare soigneusement vos produits.',
    'Vous serez informé(e) dès l\'expédition.',
    '',
    'Merci pour votre confiance,',
    'Samiah Cosmetics',
  ]
  
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(lines.join('\n'))
}

const getShippingWhatsApp = (order: any) => {
  const phone = formatPhoneForWhatsApp(order.client_phone)
  
  const lines = [
    'Bonjour ' + order.client_name + ',',
    '',
    'Bonne nouvelle, votre commande ' + order.order_number + ' est EN LIVRAISON.',
    '',
    'Adresse de livraison :',
    order.client_address + ', ' + order.client_city,
    '',
    'Notre transporteur vous contactera sous peu.',
    '',
    'Merci pour votre confiance,',
    'Samiah Cosmetics',
  ]
  
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(lines.join('\n'))
}

const openOrderDetails = (order: any) => {
  selectedOrder.value = order
}

onMounted(async () => {
  if (route.query.highlight) {
    const orderId = route.query.highlight as string;
    await fetchOrders();
    const order = orders.value.find(o => o.id === orderId);
    if (order) {
      openOrderDetails(order);
    }
  } else {
    await fetchOrders();
  }

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
