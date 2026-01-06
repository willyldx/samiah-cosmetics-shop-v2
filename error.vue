<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-charcoal flex items-center justify-center px-4">
    <div class="text-center max-w-lg">
      <!-- Animated 404 -->
      <div class="relative mb-8">
        <h1 class="text-[150px] lg:text-[200px] font-black text-gray-100 dark:text-gray-800 leading-none select-none">
          404
        </h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-32 h-32 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center animate-pulse">
            <svg class="w-16 h-16 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Message -->
      <h2 class="text-2xl lg:text-3xl font-bold text-charcoal dark:text-white mb-4">
        Oops ! Page introuvable
      </h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        La page que vous recherchez semble avoir disparu ou n'existe pas. 
        Ne vous inquiétez pas, nos produits de beauté vous attendent !
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink 
          to="/" 
          class="group inline-flex items-center gap-2 bg-charcoal dark:bg-white text-white dark:text-charcoal px-8 py-4 rounded-full font-bold hover:bg-black dark:hover:bg-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </NuxtLink>
        
        <NuxtLink 
          to="/produits" 
          class="inline-flex items-center gap-2 bg-gold text-charcoal px-8 py-4 rounded-full font-bold hover:bg-yellow-500 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/30"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Voir nos produits
        </NuxtLink>
      </div>

      <!-- Decorative elements -->
      <div class="mt-16 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
        <span class="w-12 h-px bg-gray-200 dark:bg-gray-700"></span>
        <svg class="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span class="w-12 h-px bg-gray-200 dark:bg-gray-700"></span>
      </div>
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-4">
        Samiah Cosmetics — La beauté au naturel
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Page introuvable — Samiah Cosmetics',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>
