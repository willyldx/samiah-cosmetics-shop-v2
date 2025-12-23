<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-charcoal">Dashboard</h1>
      <p class="text-gray-500">Bienvenue sur votre tableau de bord</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <span class="text-green-500 text-sm font-medium">Aujourd'hui</span>
        </div>
        <p class="text-3xl font-bold text-charcoal">{{ stats.ordersToday }}</p>
        <p class="text-gray-500 text-sm">Commandes reçues</p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span v-if="stats.pendingOrders > 0" class="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            Action requise
          </span>
        </div>
        <p class="text-3xl font-bold text-charcoal">{{ stats.pendingOrders }}</p>
        <p class="text-gray-500 text-sm">En attente de validation</p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span class="text-gray-400 text-sm">Aujourd'hui</span>
        </div>
        <p class="text-3xl font-bold text-charcoal">{{ formatPrice(stats.revenueToday) }}</p>
        <p class="text-gray-500 text-sm">Chiffre d'affaires</p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <NuxtLink to="/admin/produits" class="text-gold text-sm font-medium hover:underline">
            Gérer
          </NuxtLink>
        </div>
        <p class="text-3xl font-bold text-charcoal">{{ stats.totalProducts }}</p>
        <p class="text-gray-500 text-sm">Produits actifs</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-charcoal">Dernières commandes</h2>
          <NuxtLink to="/admin/commandes" class="text-gold font-medium text-sm hover:underline">
            Voir tout
          </NuxtLink>
        </div>

        <div v-if="loading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 rounded-xl"></div>
          </div>
        </div>

        <div v-else-if="recentOrders.length === 0" class="p-12 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <p class="text-gray-500">Aucune commande pour le moment</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-charcoal/10 rounded-full flex items-center justify-center">
                  <span class="font-bold text-charcoal text-sm">
                    {{ order.client_name ? order.client_name.charAt(0).toUpperCase() : '?' }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-charcoal">{{ order.client_name }}</p>
                  <p class="text-sm text-gray-500 flex items-center gap-2">
                    {{ order.order_number }}
                    <span class="text-xs text-gray-300">•</span>
                    {{ formatDate(order.created_at) }}
                  </p>
                  <p v-if="order.transaction_ref" class="text-xs text-green-600 font-mono mt-0.5">
                    ID: {{ order.transaction_ref }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-charcoal">{{ formatPrice(order.total) }}</p>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="statusClass(order.status)"
                >
                  {{ statusLabel(order.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-gradient-to-br from-charcoal to-gray-800 rounded-2xl p-6 text-white shadow-lg">
          
          <div class="mb-4">
            <div class="flex justify-between items-center mb-1">
              <h3 class="text-white/70 text-sm">Ce mois-ci</h3>
              <span class="text-xs bg-white/10 px-2 py-0.5 rounded text-white/50">{{ currentMonthName }}</span>
            </div>
            <p class="text-3xl font-bold">{{ formatPrice(stats.revenueMonth) }}</p>
            <p class="text-white/50 text-xs mt-1">{{ stats.ordersMonth }} commandes</p>
          </div>

          <div class="border-t border-white/10 my-4"></div>

          <div>
            <h3 class="text-gold text-xs font-bold uppercase tracking-wider mb-1">Total Global</h3>
            <p class="text-xl font-bold text-white">{{ formatPrice(stats.revenueTotal) }}</p>
          </div>

        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 class="text-lg font-bold text-charcoal mb-4">Raccourcis</h2>
          <div class="space-y-3">
            <NuxtLink
              to="/admin/produits/nouveau"
              class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              <div class="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors text-gold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <span class="font-medium text-charcoal">Ajouter un produit</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/commandes?status=pending"
              class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="font-medium text-charcoal">Valider commandes</span>
              <span v-if="stats.pendingOrders > 0" class="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                {{ stats.pendingOrders }}
              </span>
            </NuxtLink>

            <a
              :href="whatsappLink"
              target="_blank"
              class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors"
            >
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                </svg>
              </div>
              <span class="font-medium text-charcoal">Ouvrir WhatsApp</span>
            </a>
          </div>
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

useHead({
  title: 'Dashboard - Admin Samiah',
})

const supabase = useSupabaseClient()
const config = useRuntimeConfig()

const loading = ref(true)
const recentOrders = ref<any[]>([])
const stats = reactive({
  ordersToday: 0,
  pendingOrders: 0,
  revenueToday: 0,
  totalProducts: 0,
  ordersMonth: 0,
  revenueMonth: 0,
  revenueTotal: 0, // AJOUT : Total global
})

const whatsappLink = computed(() => 'https://wa.me/' + config.public.whatsappNumber)
const currentMonthName = computed(() => new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' }))

// Status labels
const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  pending_validation: 'Vérif. Paiement', // Important pour le mobile money
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

// Fetch data
const fetchData = async () => {
  loading.value = true
  
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    // C'EST ICI LA MAGIE DU RESET MENSUEL :
    // On demande à l'ordi : "Quel est le 1er jour de ce mois ?"
    // Si on est le 1er Mars, ça donnera "2025-03-01". Les ventes de Février sont ignorées.
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthISO = monthStart.toISOString()

    // Recent orders
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    recentOrders.value = orders || []

    // Orders today
    const { count: ordersToday } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayISO)

    stats.ordersToday = ordersToday || 0

    // Pending orders (Inclut aussi pending_validation pour mobile money)
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'pending_validation'])

    stats.pendingOrders = pendingOrders || 0

    // Revenue today
    const { data: todayOrders } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', todayISO)
      .neq('status', 'cancelled')

    stats.revenueToday = todayOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

    // Total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)

    stats.totalProducts = totalProducts || 0

    // Orders this month (Le filtre monthISO assure le reset)
    const { count: ordersMonth, data: monthOrders } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', monthISO)
      .neq('status', 'cancelled')

    stats.ordersMonth = ordersMonth || 0
    stats.revenueMonth = monthOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

    // TOTAL GLOBAL (All Time)
    const { data: allOrders } = await supabase
      .from('orders')
      .select('total')
      .neq('status', 'cancelled')

    stats.revenueTotal = allOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// Helpers
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' F'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusLabel = (status: string) => {
  return ORDER_STATUS_LABELS[status] || status
}

const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    pending_validation: 'bg-orange-100 text-orange-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Fetch on mount
onMounted(async () => {
  await fetchData()

  // Real-time updates
  const channel = supabase
    .channel('dashboard-updates')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      fetchData()
    })
    .subscribe()

  onUnmounted(() => {
    supabase.removeChannel(channel)
  })
})
</script>
