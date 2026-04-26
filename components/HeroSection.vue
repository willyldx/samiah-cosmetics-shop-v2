<template>
  <section class="relative min-h-[85vh] flex items-center bg-white dark:bg-charcoal overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative z-10 w-full">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Contenu Textuel -->
        <div class="space-y-8 animate-fade-in-up">
          <div class="inline-flex items-center gap-3">
            <span class="w-10 h-[1px] bg-gold"></span>
            <span class="text-sm font-medium tracking-widest uppercase text-gray-500 dark:text-gray-400">
              {{ settings.badge_text }}
            </span>
          </div>

          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-charcoal dark:text-white leading-[1.1]">
            <span class="block mb-2">{{ settings.title_line1 }}</span>
            <span class="block italic text-gold">{{ settings.title_line2 }} {{ settings.title_highlight }}</span>
          </h1>

          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed font-light">
            {{ settings.description }}
          </p>

          <div class="flex flex-wrap gap-6 pt-4">
            <a
              v-if="settings.show_consultation_btn"
              :href="whatsappLink"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center justify-center px-8 py-4 bg-charcoal text-white dark:bg-white dark:text-charcoal text-sm font-medium tracking-wide uppercase hover:bg-gold hover:text-white transition-colors duration-300"
            >
              Réserver
            </a>
            
            <NuxtLink
              v-if="settings.show_products_btn"
              to="/produits"
              class="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-gray-300 dark:border-gray-600 text-charcoal dark:text-white text-sm font-medium tracking-wide uppercase hover:border-charcoal dark:hover:border-white transition-colors duration-300"
            >
              Voir la collection
            </NuxtLink>
          </div>
        </div>

        <!-- Image Épurée -->
        <div class="relative w-full h-[600px] lg:h-[700px] animate-fade-in-up delay-200">
          <img
            :src="settings.image_url"
            alt="Soins capillaires Samiah Cosmetics"
            class="w-full h-full object-cover rounded-sm"
            loading="eager"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { heroSettings, fetchHeroSettings } = useSettings()

// Charger les settings au mount
const settings = ref({
  badge_text: 'Consultation experte',
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

onMounted(async () => {
  const data = await fetchHeroSettings()
  if (data) {
    settings.value = data
  }
})

if (heroSettings.value) {
  settings.value = heroSettings.value
}

const whatsappLink = computed(() => {
  const price = new Intl.NumberFormat('fr-FR').format(settings.value.consultation_price)
  const message = encodeURIComponent('Bonjour Samiah Cosmetics, je souhaite reserver une consultation capillaire (' + price + ' FCFA).')
  return 'https://wa.me/' + config.public.whatsappNumber + '?text=' + message
})
</script>

<style scoped>
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
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-200 {
  animation-delay: 0.2s;
}
</style>
