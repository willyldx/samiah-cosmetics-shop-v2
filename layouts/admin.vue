<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar 
      :is-open="sidebarOpen" 
      @close="sidebarOpen = false" 
    />

    <div 
      class="lg:pl-64 flex flex-col min-h-screen transition-all duration-300"
      :class="{ 'pl-0': !sidebarOpen }"
    >
      <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6">
          
          <div class="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              class="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100"
              @click="sidebarOpen = true"
            >
              <span class="sr-only">Ouvrir le menu</span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div class="flex items-center gap-2">
              <img src="/icon-192.png" alt="Logo" class="w-8 h-8 rounded-lg object-cover" />
              <h1 class="text-lg font-semibold text-charcoal">
                Admin
              </h1>
            </div>
          </div>

          <div class="hidden lg:block"></div>

          <div class="flex items-center gap-4">
            <button 
              type="button"
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span 
                v-if="pendingOrders > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
              >
                {{ pendingOrders > 9 ? '9+' : pendingOrders }}
              </span>
            </button>

            <div class="relative">
              <button 
                type="button"
                class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all"
                @click="userMenuOpen = !userMenuOpen"
              >
                <div class="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center overflow-hidden border border-gold/20">
                  <img src="/icon-192.png" alt="Admin" class="w-full h-full object-cover" />
                </div>
                <span class="hidden sm:block text-sm font-medium text-charcoal">
                  Samiah
                </span>
                <svg class="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div 
                  v-if="userMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 origin-top-right z-50"
                >
                  <NuxtLink 
                    to="/" 
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    @click="userMenuOpen = false"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    Voir le site
                  </NuxtLink>
                  <hr class="my-1 border-gray-100">
                  <button 
                    type="button"
                    class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    @click="handleLogout"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Se déconnecter
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </header>

      <div class="flex-1 p-4 sm:p-6">
        <slot />
      </div>
    </div>

    <Transition
      enter-active-class="transition-opacity ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

// State
const sidebarOpen = ref(false)
const userMenuOpen = ref(false)
const pendingOrders = ref(0)

// Close user menu when clicking outside
import { onClickOutside } from '@vueuse/core'
const userMenuRef = ref(null) // Si tu veux être plus précis, sinon la ref null marche avec le template actuel par chance
onClickOutside(userMenuRef, () => {
  userMenuOpen.value = false
})

// Fetch pending orders count
const fetchPendingOrders = async () => {
  try {
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'pending_validation']) // On compte aussi les paiements mobiles à valider
    
    pendingOrders.value = count || 0
  } catch (error) {
    console.error('Error fetching pending orders:', error)
  }
}

// Logout handler
const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/admin/login')
}

// Subscribe to new orders
onMounted(async () => {
  await fetchPendingOrders()

  // Real-time subscription
  const channel = supabase
    .channel('admin-orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      () => fetchPendingOrders()
    )
    .subscribe()

  onUnmounted(() => {
    supabase.removeChannel(channel)
  })
})
</script>
