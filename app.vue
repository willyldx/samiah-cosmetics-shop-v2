<template>
  <div>
    <NuxtLoadingIndicator color="#C6A961" :height="3" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <ToastContainer />
    
    <WhatsAppFloat />
  </div>
</template>

<script setup lang="ts">
// Import CSS
import '~/assets/css/main.css'

// SEO & META TAGS AVANCÉS
useHead({
  // Définir la langue pour Google
  htmlAttrs: {
    lang: 'fr'
  },
  // Titre dynamique
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} — Samiah Cosmetics` : 'Samiah Cosmetics — Consultation capillaire & produits'
  },
  // Métadonnées pour le partage social et le mobile
  meta: [
    { name: 'description', content: 'Découvrez notre gamme de cosmétiques de luxe et profitez de nos consultations capillaires expertes au Tchad.' },
    { name: 'theme-color', content: '#0A0A0A' }, // La barre du navigateur sera noire (Charcoal) sur mobile
    
    // Facebook / WhatsApp (Open Graph)
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Samiah Cosmetics' },
    { property: 'og:title', content: 'Samiah Cosmetics — Beauté & Soins' },
    { property: 'og:description', content: 'Cosmétiques de luxe et expertise capillaire.' },
    { property: 'og:image', content: '/og-image.jpg' }, // Assure-toi d'avoir une image 'og-image.jpg' dans ton dossier public/
    
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' } // Favicon
  ]
})

// Handle hydration
// Initialize dark mode
const { init: initDarkMode } = useDarkMode()

onMounted(() => {
  // Initialize theme
  initDarkMode()
  
  // Petit délai pour s'assurer que les animations CSS se chargent bien
  setTimeout(() => {
    document.querySelectorAll('.skeleton').forEach(el => {
      el.classList.remove('skeleton')
    })
  }, 100)
})
</script>

<style>
/* Transitions de pages fluides (Lié au CSS que je t'ai donné avant) */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-out;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
