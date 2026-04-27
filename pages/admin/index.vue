<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-serif font-light text-charcoal mb-1">Tableau de bord</h1>
      <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400">Vue d'ensemble de votre activité</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Orders Today -->
      <div class="bg-white border border-gray-200 p-6 flex flex-col justify-between hover:border-charcoal transition-colors">
        <div class="flex justify-between items-start mb-6">
          <p class="text-[10px] uppercase tracking-widest text-gray-400">Aujourd'hui</p>
          <span class="w-2 h-2 bg-charcoal rounded-full"></span>
        </div>
        <div>
          <p class="text-3xl font-serif text-charcoal mb-1">{{ stats.ordersToday }}</p>
          <p class="text-[10px] uppercase tracking-widest text-gray-400">Commandes reçues</p>
        </div>
      </div>

      <!-- Pending Orders -->
      <div class="bg-white border border-gray-200 p-6 flex flex-col justify-between hover:border-yellow-600 transition-colors">
        <div class="flex justify-between items-start mb-6">
          <p class="text-[10px] uppercase tracking-widest text-gray-400">En attente</p>
          <span v-if="stats.pendingOrders > 0" class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
          <span v-else class="w-2 h-2 bg-gray-200 rounded-full"></span>
        </div>
        <div>
          <p class="text-3xl font-serif text-charcoal mb-1">{{ stats.pendingOrders }}</p>
          <p class="text-[10px] uppercase tracking-widest text-gray-400">À valider</p>
        </div>
      </div>

      <!-- Revenue Today -->
      <div class="bg-white border border-gray-200 p-6 flex flex-col justify-between hover:border-green-600 transition-colors">
        <div class="flex justify-between items-start mb-6">
          <p class="text-[10px] uppercase tracking-widest text-gray-400">Chiffre d'affaires</p>
          <span class="text-[10px] uppercase tracking-widest text-gray-400">Jour</span>
        </div>
        <div>
          <p class="text-3xl font-serif text-charcoal mb-1">{{ formatPrice(stats.revenueToday) }}</p>
          <p class="text-[10px] uppercase tracking-widest text-gray-400">Généré aujourd'hui</p>
        </div>
      </div>

      <!-- Products -->
      <div class="bg-white border border-gray-200 p-6 flex flex-col justify-between hover:border-charcoal transition-colors relative group">
        <div class="flex justify-between items-start mb-6">
          <p class="text-[10px] uppercase tracking-widest text-gray-400">Catalogue</p>
          <NuxtLink to="/admin/produits" class="text-[10px] uppercase tracking-widest text-charcoal font-medium border-b border-transparent group-hover:border-charcoal transition-all">
            Gérer
          </NuxtLink>
        </div>
        <div>
          <p class="text-3xl font-serif text-charcoal mb-1">{{ stats.totalProducts }}</p>
          <p class="text-[10px] uppercase tracking-widest text-gray-400">Produits actifs</p>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Recent Orders -->
      <div class="lg:col-span-2 bg-white border border-gray-200">
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal">Dernières commandes</h2>
          <NuxtLink to="/admin/commandes" class="text-[10px] uppercase tracking-widest text-gray-500 hover:text-charcoal border-b border-transparent hover:border-charcoal transition-colors">
            Voir tout
          </NuxtLink>
        </div>

        <div v-if="loading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="h-12 bg-gray-50 border border-gray-100"></div>
          </div>
        </div>

        <div v-else-if="recentOrders.length === 0" class="p-16 text-center border-t border-gray-100">
          <p class="text-sm font-light text-gray-400">Aucune commande pour le moment</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="p-4 hover:bg-gray-50 transition-colors cursor-pointer grid grid-cols-12 gap-4 items-center"
            @click="navigateTo(`/admin/commandes?highlight=${order.id}`)"
          >
            <div class="col-span-2">
              <span class="text-xs font-mono text-gray-500">#{{ order.order_number }}</span>
            </div>
            <div class="col-span-4 flex items-center gap-3">
              <div class="w-8 h-8 bg-gray-100 flex items-center justify-center text-xs font-medium text-charcoal">
                {{ order.client_name ? order.client_name.charAt(0).toUpperCase() : '?' }}
              </div>
              <p class="text-sm font-medium text-charcoal truncate">{{ order.client_name }}</p>
            </div>
            <div class="col-span-3 text-left">
              <p class="text-xs text-gray-500">{{ formatDate(order.created_at) }}</p>
            </div>
            <div class="col-span-3 flex items-center justify-between">
              <span class="text-sm text-charcoal">{{ formatPrice(order.total) }}</span>
              <span class="w-2 h-2 rounded-full" :class="statusBadgeClass(order.status)" :title="statusLabel(order.status)"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Revenue Card -->
        <div class="bg-charcoal border border-charcoal p-8 text-white relative">
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-[10px] uppercase tracking-[0.2em] text-white/50">Ce mois-ci</h3>
              <span class="text-[9px] border border-white/20 px-2 py-1 uppercase tracking-widest">{{ currentMonthName }}</span>
            </div>
            <p class="text-3xl font-serif text-white mb-2">{{ formatPrice(stats.revenueMonth) }}</p>
            <p class="text-xs text-white/50 font-light">{{ stats.ordersMonth }} commandes</p>
          </div>

          <div class="border-t border-white/10 pt-6">
            <h3 class="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Total Global</h3>
            <p class="text-xl font-serif text-white">{{ formatPrice(stats.revenueTotal) }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white border border-gray-200 p-6">
          <h2 class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal mb-6">Raccourcis</h2>
          <div class="space-y-2">
            <NuxtLink
              to="/admin/produits/nouveau"
              class="flex items-center justify-between p-4 border border-gray-100 hover:border-charcoal transition-colors group"
            >
              <span class="text-xs uppercase tracking-widest text-charcoal">Ajouter un produit</span>
              <svg class="w-4 h-4 text-gray-400 group-hover:text-charcoal transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"></path>
              </svg>
            </NuxtLink>

            <NuxtLink
              to="/admin/commandes?status=pending"
              class="flex items-center justify-between p-4 border border-gray-100 hover:border-yellow-600 transition-colors group"
            >
              <div class="flex items-center gap-2">
                <span class="text-xs uppercase tracking-widest text-charcoal">Valider commandes</span>
                <span v-if="stats.pendingOrders > 0" class="bg-charcoal text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                  {{ stats.pendingOrders }}
                </span>
              </div>
              <svg class="w-4 h-4 text-gray-400 group-hover:text-yellow-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </NuxtLink>

            <a
              :href="whatsappLink"
              target="_blank"
              class="flex items-center justify-between p-4 border border-gray-100 hover:border-green-600 transition-colors group"
            >
              <span class="text-xs uppercase tracking-widest text-charcoal">Ouvrir WhatsApp</span>
              <svg class="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
              </svg>
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

const statusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-500',
    pending_validation: 'bg-orange-500',
    confirmed: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  }
  return classes[status] || 'bg-gray-400'
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
