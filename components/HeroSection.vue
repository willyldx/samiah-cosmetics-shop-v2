<template>
  <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
    <!-- Background subtle pattern -->
    <div class="absolute inset-0">
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gray-50"></div>
      <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse-slow"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Texte -->
        <div class="space-y-8">
          <!-- Badge -->
          <div 
            class="inline-flex items-center gap-2 bg-charcoal text-white rounded-full px-4 py-2 animate-fade-in-down"
            style="animation-delay: 0.1s;"
          >
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span class="text-sm font-medium">Consultation capillaire en ligne</span>
          </div>

          <!-- Titre -->
          <h1 
            class="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-tight animate-fade-in-up"
            style="animation-delay: 0.2s;"
          >
            <span class="block">R&#233;v&#233;lez la</span>
            <span class="block mt-2">
              <span class="text-gold relative">
                beaut&#233;
                <svg 
                  class="absolute -bottom-2 left-0 w-full h-3 animate-draw-line" 
                  viewBox="0 0 200 12" 
                  fill="none" 
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M2 10C50 2 150 2 198 10" 
                    stroke="#D4AF37" 
                    stroke-width="3" 
                    stroke-linecap="round"
                  />
                </svg>
              </span>
              de vos cheveux
            </span>
          </h1>

          <!-- Description -->
          <p 
            class="text-lg text-gray-600 max-w-lg leading-relaxed animate-fade-in-up"
            style="animation-delay: 0.4s;"
          >
            D&#233;finition de votre profil capillaire, analyse des probl&#232;mes, 
            correction des habitudes et mise en place d&#39;une routine personnalis&#233;e.
          </p>

          <!-- CTA Buttons -->
          <div 
            class="flex flex-wrap gap-4 animate-fade-in-up"
            style="animation-delay: 0.6s;"
          >
            <a
              :href="whatsappLink"
              target="_blank"
              rel="noopener"
              class="group inline-flex items-center gap-3 bg-charcoal text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-charcoal-800 active:scale-95"
            >
              <span>R&#233;server &#8212; 10 000 F</span>
              <svg 
                class="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
              </svg>
            </a>
            
            <NuxtLink
              to="/produits"
              class="group inline-flex items-center gap-3 bg-transparent border-2 border-charcoal text-charcoal font-bold px-8 py-4 rounded-full transition-all duration-300 hover:bg-charcoal hover:text-white hover:-translate-y-2 hover:shadow-xl active:scale-95"
            >
              <span>Voir les produits</span>
              <svg 
                class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </NuxtLink>
          </div>

          <!-- Trust badges -->
          <div 
            class="flex flex-wrap items-center gap-6 pt-4 text-sm text-gray-500 animate-fade-in-up"
            style="animation-delay: 0.8s;"
          >
            <div class="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
              <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>R&#233;ponse rapide</span>
            </div>
            <div class="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
              <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span>Livraison au Tchad</span>
            </div>
          </div>
        </div>

        <!-- Image -->
        <div 
          class="relative order-first lg:order-last animate-fade-in-right"
          style="animation-delay: 0.3s;"
        >
          <div class="relative group">
            <!-- Cadre d&#233;coratif avec animation -->
            <div class="absolute -inset-4 border-2 border-gold/30 rounded-2xl transform rotate-3 transition-transform duration-500 group-hover:rotate-6"></div>
            <div class="absolute -inset-4 border-2 border-charcoal/10 rounded-2xl transform -rotate-2 transition-transform duration-500 group-hover:-rotate-4"></div>
            
            <!-- Image principale -->
            <div class="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                alt="Soins capillaires Samiah Cosmetics"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="eager"
              />
              
              <!-- Overlay gradient subtil -->
              <div class="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <!-- Floating card - Stats -->
            <div 
              class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-5 border border-gray-100 animate-float transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              style="animation-delay: 1s;"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-charcoal rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-gold animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-2xl font-bold text-charcoal">500+</div>
                  <div class="text-sm text-gray-500">Clientes satisfaites</div>
                </div>
              </div>
            </div>

            <!-- Floating card - Rating -->
            <div 
              class="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100 animate-float-delayed transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              style="animation-delay: 1.2s;"
            >
              <div class="flex items-center gap-2">
                <span class="text-gold text-lg">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                <span class="text-sm font-bold text-charcoal">5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block animate-fade-in-up" style="animation-delay: 1.5s;">
      <div class="w-6 h-10 rounded-full border-2 border-charcoal/20 flex items-start justify-center p-2 cursor-pointer hover:border-charcoal/40 transition-colors">
        <div class="w-1 h-2 bg-charcoal/40 rounded-full animate-bounce"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const whatsappLink = computed(() => {
  const message = encodeURIComponent('Bonjour Samiah Cosmetics, je souhaite réserver une consultation capillaire (10.000F).')
  return 'https://wa.me/' + config.public.whatsappNumber + '?text=' + message
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

/* Animation Draw Line (soulignement) */
@keyframes drawLine {
  from {
    stroke-dashoffset: 200;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.animate-draw-line path {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawLine 1.5s ease-out forwards;
  animation-delay: 0.8s;
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
