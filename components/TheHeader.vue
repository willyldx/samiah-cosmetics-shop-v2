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
        <NuxtLink 
          to="/" 
          class="flex items-center gap-3 group"
        >
          <div class="h-14 md:h-16 w-auto flex items-center justify-center transition-transform group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 1200 800"
                 class="h-full w-auto" 
                 preserveAspectRatio="xMidYMid meet">

              <defs>
                <radialGradient id="wash" cx="50%" cy="45%" r="55%">
                  <stop offset="0%" stop-color="#e6c9df"/>
                  <stop offset="100%" stop-color="#f3e6f0"/>
                </radialGradient>
              </defs>

              <path
                d="M200,150
                   C100,350 150,600 400,650
                   C700,720 1050,600 1020,350
                   C980,120 550,60 200,150 Z"
                fill="url(#wash)"
              />

              <text x="600"
                    y="360"
                    text-anchor="middle"
                    fill="#111111"
                    style="
                      font-family: 'Didot', 'Bodoni MT', 'Playfair Display', serif;
                      font-size: 220px;
                      font-weight: 500;
                      letter-spacing: 4px;
                    ">
                SAMIAH
              </text>

              <path d="M200 430 H450" stroke="#111111" stroke-width="2"/>
              <path d="M750 430 H1000" stroke="#111111" stroke-width="2"/>

              <text x="600"
                    y="480"
                    text-anchor="middle"
                    fill="#111111"
                    style="
                      font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
                      font-size: 42px;
                      font-weight: 300;
                      letter-spacing: 10px;
                    ">
                cosmetics
              </text>
            </svg>
          </div>
          
          <span class="sr-only font-bold text-charcoal tracking-wider text-sm md:text-base">
            SAMIAH COSMETICS
          </span>
        </NuxtLink>

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

        <div class="flex items-center gap-2 md:gap-4">
          <button 
            type="button"
            class="relative p-2 rounded-lg hover:bg-charcoal/5 transition-colors"
            @click="openCart"
          >
            <svg class="w-5 h-5 md:w-6 md:h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span 
              v-if="itemCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-gold text-charcoal text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ itemCount > 9 ? '9+' : itemCount }}
            </span>
          </button>

          <NuxtLink 
            to="/produits" 
            class="hidden md:inline-flex bg-gold hover:bg-gold-400 text-charcoal px-4 py-2 rounded-full font-medium text-sm transition-colors"
          >
            Commander
          </NuxtLink>

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
