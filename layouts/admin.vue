<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <AdminSidebar 
      :is-open="sidebarOpen" 
      @close="sidebarOpen = false" 
    />

    <div 
      class="lg:pl-64 flex flex-col min-h-screen transition-all duration-300"
      :class="{ 'pl-0': !sidebarOpen }"
    >
      <!-- Premium Header -->
      <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700/50">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6">
          
          <!-- Mobile menu + Logo -->
          <div class="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              class="p-2 -ml-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              @click="sidebarOpen = true"
            >
              <span class="sr-only">Ouvrir le menu</span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div class="flex items-center gap-2">
              <div class="w-9 h-9 bg-gradient-to-br from-gold to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
                <img src="/icon-192.png" alt="Logo" class="w-6 h-6 rounded-lg object-cover" />
              </div>
              <h1 class="text-lg font-bold text-charcoal dark:text-white">
                Admin
              </h1>
            </div>
          </div>

          <!-- Search (Desktop) -->
          <div class="hidden lg:flex items-center flex-1 max-w-md">
            <div class="relative w-full">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input 
                type="text" 
                placeholder="Rechercher..." 
                class="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-sm text-charcoal dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gold/50 transition-all"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 sm:gap-3">
            <!-- Dark Mode Toggle -->
            <DarkModeToggle />
            
            <!-- Notifications -->
            <button 
              type="button"
              class="relative p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span 
                v-if="pendingOrders > 0"
                class="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
              >
                {{ pendingOrders > 9 ? '9+' : pendingOrders }}
              </span>
            </button>

            <!-- User menu -->
            <div class="relative" ref="userMenuRef">
              <button 
                type="button"
                class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
                @click="userMenuOpen = !userMenuOpen"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-gold to-yellow-500 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                  <img src="/icon-192.png" alt="Admin" class="w-full h-full object-cover" />
                </div>
                <span class="hidden sm:block text-sm font-medium text-charcoal dark:text-white">
                  Samiah
                </span>
                <svg class="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
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
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 origin-top-right z-50"
                >
                  <NuxtLink 
                    to="/" 
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    @click="userMenuOpen = false"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    Voir le site
                  </NuxtLink>
                  <hr class="my-1 border-gray-100 dark:border-gray-700">
                  <button 
                    type="button"
                    class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    @click="handleLogout"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
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

    <!-- Mobile overlay -->
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
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const supabase = useSupabaseClient()
const router = useRouter()

// State
const sidebarOpen = ref(false)
const userMenuOpen = ref(false)
const pendingOrders = ref(0)
const userMenuRef = ref(null)

// Close user menu when clicking outside
onClickOutside(userMenuRef, () => {
  userMenuOpen.value = false
})

// Fetch pending orders count
const fetchPendingOrders = async () => {
  try {
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'pending_validation'])
    
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
