<template>
  <header 
    class="sticky top-0 z-50 transition-all duration-500 bg-white border-b border-gray-100"
  >
    <div class="max-w-7xl mx-auto px-4">
      <nav class="flex items-center justify-between h-16 md:h-20">
        
        <!-- Logo -->
        <NuxtLink 
          to="/" 
          class="flex items-center gap-3 group"
        >
          <div class="h-10 md:h-12 w-auto flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Samiah Cosmetics" 
              class="h-full w-auto object-contain" 
            />
          </div>
          <span class="font-serif tracking-widest text-sm uppercase text-charcoal">
            SAMIAH
          </span>
        </NuxtLink>

        <!-- Navigation desktop -->
        <div class="hidden md:flex items-center gap-8">
          <NuxtLink 
            to="/" 
            class="text-[10px] tracking-[0.2em] uppercase font-medium hover:text-charcoal transition-colors duration-300 py-2 border-b border-transparent hover:border-charcoal"
            :class="route.path === '/' ? 'text-charcoal border-charcoal' : 'text-gray-400'"
          >
            Accueil
          </NuxtLink>
          <NuxtLink 
            to="/produits" 
            class="text-[10px] tracking-[0.2em] uppercase font-medium hover:text-charcoal transition-colors duration-300 py-2 border-b border-transparent hover:border-charcoal"
            :class="route.path.startsWith('/produits') ? 'text-charcoal border-charcoal' : 'text-gray-400'"
          >
            Produits
          </NuxtLink>
          <NuxtLink 
            to="/suivi" 
            class="text-[10px] tracking-[0.2em] uppercase font-medium hover:text-charcoal transition-colors duration-300 py-2 border-b border-transparent hover:border-charcoal"
            :class="route.path === '/suivi' ? 'text-charcoal border-charcoal' : 'text-gray-400'"
          >
            Suivi
          </NuxtLink>
          <NuxtLink 
            to="/a-propos" 
            class="text-[10px] tracking-[0.2em] uppercase font-medium hover:text-charcoal transition-colors duration-300 py-2 border-b border-transparent hover:border-charcoal"
            :class="route.path === '/a-propos' ? 'text-charcoal border-charcoal' : 'text-gray-400'"
          >
            À propos
          </NuxtLink>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          
          <!-- Bouton Recherche -->
          <button 
            type="button"
            class="p-2 text-gray-400 hover:text-charcoal transition-colors duration-300"
            @click="searchOpen = true"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          
          <!-- Panier -->
          <button 
            type="button"
            class="relative p-2 text-gray-400 hover:text-charcoal transition-colors duration-300 flex items-center gap-2"
            @click="openCart"
          >
            <span class="text-[10px] tracking-widest uppercase hidden md:inline-block">Panier</span>
            <div class="relative">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span 
                v-if="itemCount > 0"
                class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-charcoal text-white text-[8px] flex items-center justify-center font-mono"
              >
                {{ itemCount > 9 ? '9+' : itemCount }}
              </span>
            </div>
          </button>

          <!-- Bouton Commander -->
          <NuxtLink 
            to="/produits" 
            class="hidden md:inline-flex items-center bg-charcoal text-white px-6 py-2.5 text-[9px] font-medium tracking-[0.2em] uppercase hover:bg-charcoal/90 transition-colors duration-300"
          >
            Commander
          </NuxtLink>

          <!-- Menu mobile -->
          <button 
            type="button"
            class="p-2 text-gray-400 hover:text-charcoal transition-colors duration-300 md:hidden"
            @click="mobileMenuOpen = true"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>
    </div>

    <MobileMenu 
      :is-open="mobileMenuOpen" 
      @close="mobileMenuOpen = false" 
    />
    <CartDrawer />
    <SearchModal 
      :is-open="searchOpen" 
      @close="searchOpen = false" 
    />
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { itemCount, openCart } = useCart()

// State
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const searchOpen = ref(false)

// Handle scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// Global keyboard shortcut for search (Ctrl+K or Cmd+K)
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    searchOpen.value = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})

// Close mobile menu on route change
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

