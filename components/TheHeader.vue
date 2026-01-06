<template>
  <header 
    class="sticky top-0 z-50 transition-all duration-500"
    :class="[
      isScrolled 
        ? 'bg-white/85 backdrop-blur-xl shadow-md border-b border-gray-100/50' 
        : 'bg-white'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4">
      <nav class="flex items-center justify-between h-16 md:h-20">
        
        <!-- Logo avec animation -->
        <NuxtLink 
          to="/" 
          class="flex items-center gap-3 group"
        >
          <div class="h-14 md:h-16 w-auto flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]">
            <img 
              src="/favicon.svg" 
              alt="Samiah Cosmetics" 
              class="h-full w-auto object-contain drop-shadow-sm" 
            />
          </div>
          
          <span class="sr-only font-bold text-charcoal tracking-wider text-sm md:text-base">
            SAMIAH COSMETICS
          </span>
        </NuxtLink>

        <!-- Navigation desktop avec indicateurs actifs -->
        <div class="hidden md:flex items-center gap-8">
          <NuxtLink 
            to="/" 
            class="relative text-charcoal/70 font-medium hover:text-gold transition-colors duration-300 py-2 group"
            :class="{ '!text-charcoal': route.path === '/' }"
          >
            Accueil
            <span 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gold rounded-full transition-transform duration-300 origin-left"
              :class="route.path === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
            ></span>
          </NuxtLink>
          <NuxtLink 
            to="/produits" 
            class="relative text-charcoal/70 font-medium hover:text-gold transition-colors duration-300 py-2 group"
            :class="{ '!text-charcoal': route.path.startsWith('/produits') }"
          >
            Produits
            <span 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gold rounded-full transition-transform duration-300 origin-left"
              :class="route.path.startsWith('/produits') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
            ></span>
          </NuxtLink>
          <NuxtLink 
            to="/suivi" 
            class="relative text-charcoal/70 font-medium hover:text-gold transition-colors duration-300 py-2 group flex items-center gap-1.5"
            :class="{ '!text-charcoal': route.path === '/suivi' }"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Suivre ma commande
            <span 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gold rounded-full transition-transform duration-300 origin-left"
              :class="route.path === '/suivi' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
            ></span>
          </NuxtLink>
          <NuxtLink 
            to="/a-propos" 
            class="relative text-charcoal/70 font-medium hover:text-gold transition-colors duration-300 py-2 group"
            :class="{ '!text-charcoal': route.path === '/a-propos' }"
          >
            À propos
            <span 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gold rounded-full transition-transform duration-300 origin-left"
              :class="route.path === '/a-propos' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
            ></span>
          </NuxtLink>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 md:gap-4">
          <!-- Panier avec animation -->
          <button 
            type="button"
            class="relative p-2 rounded-xl hover:bg-charcoal/5 transition-all duration-300 hover:scale-105 active:scale-95"
            @click="openCart"
          >
            <svg class="w-5 h-5 md:w-6 md:h-6 text-charcoal transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span 
              v-if="itemCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-gold text-charcoal text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-gold/30"
            >
              {{ itemCount > 9 ? '9+' : itemCount }}
            </span>
          </button>

          <!-- Bouton Commander avec effet shine -->
          <NuxtLink 
            to="/produits" 
            class="hidden md:inline-flex items-center bg-gold hover:bg-yellow-500 text-charcoal px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30 relative overflow-hidden group"
          >
            <span class="relative z-10">Commander</span>
            <span class="absolute inset-0 bg-white/30 -translate-x-full skew-x-[-15deg] group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
          </NuxtLink>

          <!-- Menu mobile -->
          <button 
            type="button"
            class="p-2 rounded-xl hover:bg-charcoal/5 transition-all duration-300 hover:scale-105 active:scale-95 md:hidden"
            @click="mobileMenuOpen = true"
          >
            <svg class="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
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
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { itemCount, openCart } = useCart()

// State
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

// Handle scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Close mobile menu on route change
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>
