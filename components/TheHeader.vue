<template>
  <header 
    class="sticky top-0 z-50 transition-all duration-300"
    :class="[
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-soft' 
        : 'bg-white'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4">
      <nav class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <NuxtLink 
          to="/" 
          class="flex items-center gap-3 group"
        >
          <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-charcoal flex items-center justify-center transition-transform group-hover:scale-105">
            <svg 
              viewBox="0 0 100 100" 
              class="w-7 h-7 md:w-8 md:h-8"
            >
              <circle cx="50" cy="50" r="28" fill="none" stroke="#F5F2EA" stroke-width="4"></circle>
              <circle cx="50" cy="50" r="22" fill="none" stroke="#D9B56C" stroke-width="4"></circle>
            </svg>
          </div>
          <span class="font-bold text-charcoal tracking-wider text-sm md:text-base">
            SAMIAH COSMETICS
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <NuxtLink 
            to="/" 
            class="text-charcoal/70 font-medium hover:text-charcoal transition-colors"
            active-class="text-charcoal"
          >
            Accueil
          </NuxtLink>
          <NuxtLink 
            to="/produits" 
            class="text-charcoal/70 font-medium hover:text-charcoal transition-colors"
            active-class="text-charcoal"
          >
            Produits
          </NuxtLink>
          <NuxtLink 
            to="/a-propos" 
            class="text-charcoal/70 font-medium hover:text-charcoal transition-colors"
            active-class="text-charcoal"
          >
            À propos
          </NuxtLink>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center gap-2 md:gap-4">
          <!-- Cart button -->
          <button 
            type="button"
            class="relative p-2 rounded-lg hover:bg-charcoal/5 transition-colors"
            @click="openCart"
          >
            <svg class="w-5 h-5 md:w-6 md:h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <!-- Cart count badge -->
            <span 
              v-if="itemCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-gold text-charcoal text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ itemCount > 9 ? '9+' : itemCount }}
            </span>
          </button>

          <!-- CTA Button (Desktop) -->
          <NuxtLink 
            to="/produits" 
            class="hidden md:inline-flex bg-gold hover:bg-gold-400 text-charcoal px-4 py-2 rounded-full font-medium text-sm transition-colors"
          >
            Commander
          </NuxtLink>

          <!-- Mobile menu button -->
          <button 
            type="button"
            class="p-2 rounded-lg hover:bg-charcoal/5 transition-colors md:hidden"
            @click="mobileMenuOpen = true"
          >
            <svg class="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>
    </div>

    <!-- Mobile Menu -->
    <MobileMenu 
      :is-open="mobileMenuOpen" 
      @close="mobileMenuOpen = false" 
    />

    <!-- Cart Drawer -->
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
