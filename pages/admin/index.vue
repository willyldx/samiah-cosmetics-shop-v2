<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-charcoal dark:text-white">Dashboard</h1>
      <p class="text-gray-500 dark:text-gray-400">Bienvenue sur votre tableau de bord</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Orders Today -->
      <div class="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <span class="text-green-500 text-xs font-bold px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">Aujourd'hui</span>
        </div>
        <p class="text-3xl font-bold text-charcoal dark:text-white">{{ stats.ordersToday }}</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Commandes reçues</p>
      </div>

      <!-- Pending Orders -->
      <div class="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-yellow-200 dark:hover:border-yellow-800 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span v-if="stats.pendingOrders > 0" class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            Action requise
          </span>
        </div>
        <p class="text-3xl font-bold text-charcoal dark:text-white">{{ stats.pendingOrders }}</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm">En attente de validation</p>
      </div>

      <!-- Revenue Today -->
      <div class="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-green-200 dark:hover:border-green-800 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span class="text-gray-400 dark:text-gray-500 text-xs">Aujourd'hui</span>
        </div>
        <p class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">{{ formatPrice(stats.revenueToday) }}</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Chiffre d'affaires</p>
      </div>

      <!-- Products -->
      <div class="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <NuxtLink to="/admin/produits" class="text-gold text-xs font-bold hover:underline">
            Gérer →
          </NuxtLink>
        </div>
        <p class="text-3xl font-bold text-charcoal dark:text-white">{{ stats.totalProducts }}</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Produits actifs</p>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Recent Orders -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-bold text-charcoal dark:text-white">Dernières commandes</h2>
          <NuxtLink to="/admin/commandes" class="text-gold font-medium text-sm hover:underline">
            Voir tout →
          </NuxtLink>
        </div>

        <div v-if="loading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>

        <div v-else-if="recentOrders.length === 0" class="p-12 text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400">Aucune commande pour le moment</p>
        </div>

        <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-gradient-to-br from-charcoal to-gray-700 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center">
                  <span class="font-bold text-white text-sm">
                    {{ order.client_name ? order.client_name.charAt(0).toUpperCase() : '?' }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-charcoal dark:text-white">{{ order.client_name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    {{ order.order_number }}
                    <span class="text-gray-300 dark:text-gray-600">•</span>
                    {{ formatDate(order.created_at) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-charcoal dark:text-white">{{ formatPrice(order.total) }}</p>
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

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Revenue Card -->
        <div class="bg-gradient-to-br from-charcoal via-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
          <div class="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
          
          <div class="relative mb-4">
            <div class="flex justify-between items-center mb-1">
              <h3 class="text-white/70 text-sm">Ce mois-ci</h3>
              <span class="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/50">{{ currentMonthName }}</span>
            </div>
            <p class="text-3xl font-bold bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">{{ formatPrice(stats.revenueMonth) }}</p>
            <p class="text-white/50 text-xs mt-1">{{ stats.ordersMonth }} commandes</p>
          </div>

          <div class="border-t border-white/10 my-4"></div>

          <div class="relative">
            <h3 class="text-gold text-xs font-bold uppercase tracking-wider mb-1">Total Global</h3>
            <p class="text-xl font-bold text-white">{{ formatPrice(stats.revenueTotal) }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-bold text-charcoal dark:text-white mb-4">Raccourcis</h2>
          <div class="space-y-3">
            <NuxtLink
              to="/admin/produits/nouveau"
              class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gold/10 dark:hover:bg-gold/20 transition-colors group"
            >
              <div class="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors text-gold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <span class="font-medium text-charcoal dark:text-white">Ajouter un produit</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/commandes?status=pending"
              class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
            >
              <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="font-medium text-charcoal dark:text-white">Valider commandes</span>
              <span v-if="stats.pendingOrders > 0" class="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {{ stats.pendingOrders }}
              </span>
            </NuxtLink>

            <a
              :href="whatsappLink"
              target="_blank"
              class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                </svg>
              </div>
              <span class="font-medium text-charcoal dark:text-white">Ouvrir WhatsApp</span>
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
  revenueTotal: 0,
})

const whatsappLink = computed(() => 'https://wa.me/' + config.public.whatsappNumber)
const currentMonthName = computed(() => new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' }))

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  pending_validation: 'Vérif. Paiement',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const fetchData = async () => {
  loading.value = true
  
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthISO = monthStart.toISOString()

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    recentOrders.value = orders || []

    const { count: ordersToday } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayISO)

    stats.ordersToday = ordersToday || 0

    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'pending_validation'])

    stats.pendingOrders = pendingOrders || 0

    const { data: todayOrders } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', todayISO)
      .neq('status', 'cancelled')

    stats.revenueToday = todayOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)

    stats.totalProducts = totalProducts || 0

    const { count: ordersMonth, data: monthOrders } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', monthISO)
      .neq('status', 'cancelled')

    stats.ordersMonth = ordersMonth || 0
    stats.revenueMonth = monthOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

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
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    pending_validation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

onMounted(async () => {
  await fetchData()

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
