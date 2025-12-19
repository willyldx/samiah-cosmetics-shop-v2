<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- Toast notifications -->
    <ToastContainer />
    
    <!-- WhatsApp floating button -->
    <WhatsAppFloat />
  </div>
</template>

<script setup lang="ts">
// Import CSS
import '~/assets/css/main.css'

// SEO defaults
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} — Samiah Cosmetics` : 'Samiah Cosmetics — Consultation capillaire & produits'
  },
})

// Handle hydration
onMounted(() => {
  // Remove skeleton classes after hydration
  document.querySelectorAll('.skeleton').forEach(el => {
    el.classList.remove('skeleton')
  })
})
</script>

<style>
/* Prevent FOUC (Flash of Unstyled Content) */
html {
  visibility: visible;
  opacity: 1;
}
</style>
