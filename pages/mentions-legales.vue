<template>
  <div class="py-16 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
          Mentions Légales
        </h1>
        <div class="w-20 h-1 bg-gold mx-auto rounded-full"></div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">
        
        <section>
          <h2 class="text-xl font-bold text-charcoal mb-3">Éditeur du site</h2>
          <p>
            Le site <strong>www.samiahcosmetics.shop</strong> est édité par l'entreprise <strong>Samiah Cosmetics</strong>.
          </p>
          <ul class="mt-4 space-y-2">
            <li><strong>Siège social :</strong> N'Djamena, Tchad</li>
            <li><strong>Téléphone :</strong> +235 62 75 21 05</li>
            <li><strong>Directrice de la publication :</strong> Raissa Yann Samiah </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-charcoal mb-3">Hébergement</h2>
          <p>
            Le site est hébergé par SPX Inc.<br>
            <span class="text-sm text-gray-500">440 N Barranca Ave #4133, Covina, CA 91723, USA.</span>
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-charcoal mb-3">Propriété Intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Mentions Légales - Samiah Cosmetics',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>
