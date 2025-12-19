<template>
  <header 
    class="sticky top-0 z-50 transition-all duration-300"
    :class="[
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-soft' 
        : 'bg-white'
    ]"
  >
    <div class="container-main">
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
              aria-hidden="true"
            >
              <circle cx="50" cy="50" r="28" fill="none" stroke="#F5F2EA" stroke-width="4"/>
              <circle cx="50" cy="50" r="22" fill="none" stroke="#D9B56C" stroke-width="4"/>
              <g transform="translate(50,50)" fill="none" stroke="#F5F2EA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M0,-9 C3,-15 12,-15 15,-9 C12,-3 3,-3 0,-9Z"/>
                <path d="M-4,3 C-9,2 -12,6 -9,9 C-5,11 -1,8 -4,3Z"/>
              </g>
            </svg>
          </div>
          <span class="font-display font-bold text-charcoal tracking-wider text-sm md:text-base">
            SAMIAH COSMETICS
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <NuxtLink 
            to="/" 
            class="nav-link"
            :class="{ 'nav-link-active': route.path === '/' }"
          >
            Accueil
          </NuxtLink>
          <NuxtLink 
            to="/produits" 
            class="nav-link"
            :class="{ 'nav-link-active': route.path.startsWith('/produits') }"
          >
            Produits
          </NuxtLink>
          <NuxtLink 
            to="/a-propos" 
            class="nav-link"
            :class="{ 'nav-link-active': route.path === '/a-propos' }"
          >
            À propos
          </NuxtLink>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center gap-2 md:gap-4">
          <!-- Search button (mobile) -->
          <button 
            type="button"
            class="p-2 rounded-lg hover:bg-charcoal/5 transition-colors md:hidden"
            @click="searchOpen = true"
          >
            <svg class="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Cart button -->
          <button 
            type="button"
            class="relative p-2 rounded-lg hover:bg-charcoal/5 transition-colors"
            @click="cartStore.toggleCart()"
          >
            <svg class="w-5 h-5 md:w-6 md:h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <!-- Cart count badge -->
            <Transition
              enter-active-class="transition-all duration-200"
              enter-from-class="scale-0 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition-all duration-150"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-0 opacity-0"
            >
              <span 
                v-if="cartStore.itemCount > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-gold text-charcoal text-xs font-bold rounded-full flex items-center justify-center animate-scale-in"
              >
                {{ cartStore.itemCount > 9 ? '9+' : cartStore.itemCount }}
              </span>
            </Transition>
          </button>

          <!-- CTA Button (Desktop) -->
          <NuxtLink 
            to="/produits" 
            class="hidden md:inline-flex btn-gold text-sm"
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
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

    <!-- Search Modal -->
    <SearchModal 
      :is-open="searchOpen" 
      @close="searchOpen = false" 
    />

    <!-- Cart Drawer -->
    <CartDrawer />
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const cartStore = useCartStore()

// State
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const searchOpen = ref(false)

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

<style scoped>
.nav-link {
  @apply text-charcoal/70 font-medium transition-colors hover:text-charcoal relative;
}

.nav-link::after {
  content: '';
  @apply absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300;
}

.nav-link:hover::after {
  @apply w-full;
}

.nav-link-active {
  @apply text-charcoal;
}

.nav-link-active::after {
  @apply w-full;
}
</style>
