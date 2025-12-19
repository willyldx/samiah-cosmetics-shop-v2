<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Sidebar -->
    <AdminSidebar 
      :is-open="sidebarOpen" 
      @close="sidebarOpen = false" 
    />

    <!-- Main content area -->
    <div 
      class="lg:pl-64 flex flex-col min-h-screen transition-all duration-300"
      :class="{ 'pl-0': !sidebarOpen }"
    >
      <!-- Top bar -->
      <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6">
          <!-- Mobile menu button -->
          <button
            type="button"
            class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            @click="sidebarOpen = true"
          >
            <span class="sr-only">Ouvrir le menu</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Page title -->
          <h1 class="text-lg font-semibold text-charcoal lg:hidden">
            Admin Samiah
          </h1>

          <!-- Right side -->
          <div class="flex items-center gap-4">
            <!-- Notifications placeholder -->
            <button 
              type="button"
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <!-- Badge pour nouvelles commandes -->
              <span 
                v-if="pendingOrders > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {{ pendingOrders > 9 ? '9+' : pendingOrders }}
              </span>
            </button>

            <!-- User menu -->
            <div class="relative">
              <button 
                type="button"
                class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                @click="userMenuOpen = !userMenuOpen"
              >
                <div class="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                  <span class="text-charcoal font-bold text-sm">S</span>
                </div>
                <span class="hidden sm:block text-sm font-medium text-charcoal">
                  Samiah
                </span>
              </button>

              <!-- Dropdown menu -->
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
                  class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1"
                >
                  <NuxtLink 
                    to="/" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    @click="userMenuOpen = false"
                  >
                    Voir le site
                  </NuxtLink>
                  <hr class="my-1 border-gray-100">
                  <button 
                    type="button"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    @click="handleLogout"
                  >
                    Se déconnecter
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <div class="flex-1 p-4 sm:p-6">
        <slot />
      </div>
    </div>

    <!-- Click outside to close sidebar on mobile -->
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
onClickOutside(ref(null), () => {
  userMenuOpen.value = false
})

// Fetch pending orders count
const fetchPendingOrders = async () => {
  try {
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    
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
