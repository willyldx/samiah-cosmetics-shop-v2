<template>
  <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-white via-white to-amber-50/30 dark:from-charcoal dark:via-gray-900 dark:to-gray-900">
    <!-- Background decorations améliorées -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-amber-50/60 via-amber-50/30 to-transparent dark:from-gold/10 dark:via-gold/5 dark:to-transparent"></div>
      <div class="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gold/10 dark:bg-gold/5 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div class="absolute top-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float"></div>
      <!-- Motif décoratif subtil -->
      <div class="absolute top-20 left-10 w-20 h-20 border border-gold/10 rounded-full"></div>
      <div class="absolute bottom-32 right-20 w-12 h-12 border border-charcoal/5 dark:border-white/5 rounded-full"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div class="space-y-8">
          <!-- Badge amélioré avec animation -->
          <div 
            class="inline-flex items-center gap-2 bg-charcoal dark:bg-white text-white dark:text-charcoal rounded-full px-5 py-2.5 shadow-lg animate-fade-in-down backdrop-blur-sm"
            style="animation-delay: 0.1s;"
          >
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span class="text-sm font-medium tracking-wide">{{ settings.badge_text }}</span>
          </div>

          <!-- Titre avec typographie premium -->
          <h1 
            class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-charcoal dark:text-white leading-[1.1] animate-fade-in-up"
            style="animation-delay: 0.2s;"
          >
            <span class="block">{{ settings.title_line1 }}</span>
            <span class="block mt-2">
              {{ settings.title_line2 }}
              <span class="relative inline-block">
                <span class="bg-gradient-to-r from-gold via-yellow-500 to-gold bg-clip-text text-transparent">{{ settings.title_highlight }}</span>
                <svg 
                  class="absolute -bottom-2 left-0 w-full h-4" 
                  viewBox="0 0 200 12" 
                  fill="none" 
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M2 10C50 2 150 2 198 10" 
                    stroke="url(#goldGradient)" 
                    stroke-width="4" 
                    stroke-linecap="round"
                    class="animate-draw-line"
                  />
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#C6A961"/>
                      <stop offset="50%" stop-color="#E5C87C"/>
                      <stop offset="100%" stop-color="#C6A961"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </span>
          </h1>

          <!-- Description avec meilleur espacement -->
          <p 
            class="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed animate-fade-in-up"
            style="animation-delay: 0.4s;"
          >
            {{ settings.description }}
          </p>

          <!-- Boutons améliorés -->
          <div 
            class="flex flex-wrap gap-4 animate-fade-in-up"
            style="animation-delay: 0.6s;"
          >
            <!-- Bouton Reserver avec effet shine -->
            <a
              v-if="settings.show_consultation_btn"
              :href="whatsappLink"
              target="_blank"
              rel="noopener"
              class="group relative inline-flex items-center gap-3 bg-charcoal text-white font-bold px-8 py-4 rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-charcoal/30 hover:-translate-y-2 active:scale-95 overflow-hidden"
            >
              <span class="relative z-10">Reserver</span>
              <svg 
                class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
              </svg>
              <!-- Effet hover glow -->
              <span class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
            </a>
            
            <!-- Bouton Produits avec effet moderne -->
            <NuxtLink
              v-if="settings.show_products_btn"
              to="/produits"
              class="group inline-flex items-center gap-3 bg-transparent border-2 border-charcoal dark:border-white text-charcoal dark:text-white font-bold px-8 py-4 rounded-full transition-all duration-500 hover:bg-charcoal dark:hover:bg-white hover:text-white dark:hover:text-charcoal hover:-translate-y-2 hover:shadow-2xl hover:shadow-charcoal/20 dark:hover:shadow-white/20 active:scale-95"
            >
              <span>Voir les produits</span>
              <svg 
                class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </NuxtLink>
          </div>

          <!-- Trust badges améliorés -->
          <div 
            class="flex flex-wrap items-center gap-8 pt-6 animate-fade-in-up"
            style="animation-delay: 0.8s;"
          >
            <div class="flex items-center gap-2.5 text-gray-600 group cursor-default">
              <div class="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <svg class="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <span class="text-sm font-medium">Réponse rapide</span>
            </div>
            <div class="flex items-center gap-2.5 text-gray-600 group cursor-default">
              <div class="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <svg class="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <span class="text-sm font-medium">Livraison au Tchad</span>
            </div>
          </div>
        </div>

        <!-- Image Section avec effets améliorés -->
        <div 
          class="relative order-first lg:order-last animate-fade-in-right"
          style="animation-delay: 0.3s;"
        >
          <div class="relative group">
            <!-- Cadres décoratifs avec animation -->
            <div class="absolute -inset-4 border-2 border-gold/40 rounded-3xl transform rotate-3 transition-all duration-700 group-hover:rotate-6 group-hover:border-gold/60"></div>
            <div class="absolute -inset-4 border-2 border-charcoal/10 rounded-3xl transform -rotate-2 transition-all duration-700 group-hover:-rotate-4"></div>
            
            <!-- Image principale -->
            <div class="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-50 to-amber-100 aspect-[4/5]">
              <img
                :src="settings.image_url"
                alt="Soins capillaires Samiah Cosmetics"
                class="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                loading="eager"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent"></div>
            </div>

            <!-- Stats card - Clientes (avec glassmorphism) -->
            <div 
              class="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-5 border border-white/50 animate-float transition-all duration-500 hover:scale-110 hover:shadow-gold/20"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-charcoal to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-2xl font-bold text-charcoal">{{ settings.stats_clients }}</div>
                  <div class="text-sm text-gray-500 font-medium">Clientes satisfaites</div>
                </div>
              </div>
            </div>

            <!-- Rating card (avec glassmorphism) -->
            <div 
              class="absolute -top-4 -right-4 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl px-5 py-3 border border-white/50 animate-float-delayed transition-all duration-500 hover:scale-110"
            >
              <div class="flex items-center gap-2">
                <span class="text-gold text-xl drop-shadow-sm">{{ ratingStars }}</span>
                <span class="text-base font-bold text-charcoal">{{ settings.rating.toFixed(1) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator amélioré -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block animate-fade-in-up" style="animation-delay: 1.5s;">
      <div class="w-7 h-11 rounded-full border-2 border-charcoal/30 flex items-start justify-center p-2 cursor-pointer hover:border-gold transition-colors duration-300 group">
        <div class="w-1.5 h-2.5 bg-charcoal/50 group-hover:bg-gold rounded-full animate-bounce transition-colors"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { heroSettings, fetchHeroSettings } = useSettings()

// Charger les settings au mount
const settings = ref({
  badge_text: 'Consultation capillaire en ligne',
  title_line1: 'La nature',
  title_line2: 'à la',
  title_highlight: 'rescousse',
  description: 'Expertise en cosmétiques naturels pour le corps, le visage et les cheveux. Nous allions soins ciblés, ingrédients naturels et accompagnement personnalisé pour sublimer votre beauté au quotidien.',
  image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  consultation_price: 10000,
  stats_clients: '500+',
  rating: 5.0,
  show_consultation_btn: true,
  show_products_btn: true,
})

// Fetch settings on mount
onMounted(async () => {
  const data = await fetchHeroSettings()
  if (data) {
    settings.value = data
  }
})

// Also try to use SSR data if available
if (heroSettings.value) {
  settings.value = heroSettings.value
}

// Computed
const whatsappLink = computed(() => {
  const price = new Intl.NumberFormat('fr-FR').format(settings.value.consultation_price)
  const message = encodeURIComponent('Bonjour Samiah Cosmetics, je souhaite reserver une consultation capillaire (' + price + ' FCFA).')
  return 'https://wa.me/' + config.public.whatsappNumber + '?text=' + message
})

const ratingStars = computed(() => {
  const fullStars = Math.floor(settings.value.rating)
  const hasHalf = settings.value.rating % 1 >= 0.5
  let stars = ''
  
  for (let i = 0; i < fullStars; i++) {
    stars += '★'
  }
  if (hasHalf) {
    stars += '☆'
  }
  
  return stars || '★★★★★'
})
</script>

<style scoped>
/* Animation Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Animation Fade In Down */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  opacity: 0;
  animation: fadeInDown 0.8s ease-out forwards;
}

/* Animation Fade In Right */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-right {
  opacity: 0;
  animation: fadeInRight 1s ease-out forwards;
}

/* Animation Float */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 4s ease-in-out infinite;
  animation-delay: 1s;
}

/* Animation soulignement en boucle */
@keyframes drawLine {
  0% {
    stroke-dashoffset: 200;
  }
  40% {
    stroke-dashoffset: 0;
  }
  70% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 200;
  }
}

.animate-draw-line {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawLine 4s ease-in-out infinite;
  animation-delay: 0.5s;
}

/* Pulse Slow */
@keyframes pulseSlow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse-slow {
  animation: pulseSlow 3s ease-in-out infinite;
}
</style>
