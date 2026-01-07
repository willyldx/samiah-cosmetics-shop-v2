<template>
  <div class="min-h-screen bg-white dark:bg-charcoal">
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-charcoal via-gray-900 to-charcoal text-white py-20 lg:py-32 overflow-hidden">
      <!-- Decorations -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/5 rounded-full"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 relative">
        <div class="max-w-3xl mx-auto text-center">
          <span class="inline-flex items-center gap-2 text-gold font-medium text-sm uppercase tracking-wider mb-6">
            <span class="w-12 h-px bg-gold"></span>
            Notre Histoire
            <span class="w-12 h-px bg-gold"></span>
          </span>
          <h1 class="text-4xl lg:text-6xl font-serif font-bold mb-6">
            Samiah<span class="text-gold">'</span>Cosmetics
          </h1>
          <p class="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            La beauté naturelle, révélée par des soins authentiques et un accompagnement personnalisé.
          </p>
        </div>
      </div>
    </section>

    <!-- Qui sommes-nous -->
    <section class="py-16 lg:py-24 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span class="text-gold font-medium text-sm uppercase tracking-wider">Qui sommes-nous</span>
            <h2 class="text-3xl lg:text-4xl font-serif font-bold text-charcoal dark:text-white mt-2 mb-6">
              Une marque née de la passion
            </h2>
            <div class="space-y-5 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              <p>
                <strong class="text-charcoal dark:text-white">Samiah'Cosmetics</strong> est une marque spécialisée dans la formulation 
                et la commercialisation de <strong class="text-gold">produits cosmétiques naturels</strong> pour le corps, 
                le visage et les cheveux.
              </p>
              <p>
                Nous développons des soins ciblés pour différents types de peaux et de cheveux : 
                <span class="text-charcoal dark:text-white font-medium">secs, abîmés, crépus, cassants ou sensibles</span>.
              </p>
              <p>
                Notre marque allie <strong class="text-gold">savoir-faire cosmétique</strong>, ingrédients naturels 
                et accompagnement personnalisé, avec également un volet formation pour transmettre 
                les bases de la cosmétique artisanale.
              </p>
            </div>
          </div>
          
          <div class="relative">
            <div class="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                alt="Soins naturels Samiah Cosmetics"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <!-- Stats card -->
            <div class="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gradient-to-br from-gold to-yellow-500 rounded-xl flex items-center justify-center">
                  <svg class="w-7 h-7 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-3xl font-bold text-charcoal dark:text-white">500+</p>
                  <p class="text-gray-500 dark:text-gray-400 text-sm">Clientes satisfaites</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos Valeurs -->
    <section class="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <span class="text-gold font-medium text-sm uppercase tracking-wider">Ce qui nous définit</span>
          <h2 class="text-3xl lg:text-4xl font-serif font-bold text-charcoal dark:text-white mt-2">
            Nos Valeurs
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(value, index) in values" :key="index" 
               class="group bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-xl dark:shadow-none dark:border dark:border-gray-700 transition-all duration-500 hover:-translate-y-2">
            <div class="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <component :is="value.icon" class="w-8 h-8 text-gold" />
            </div>
            <h3 class="text-xl font-bold text-charcoal dark:text-white mb-3 group-hover:text-gold transition-colors">
              {{ value.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos Services -->
    <section class="py-16 lg:py-24 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <span class="text-gold font-medium text-sm uppercase tracking-wider">Ce que nous proposons</span>
          <h2 class="text-3xl lg:text-4xl font-serif font-bold text-charcoal dark:text-white mt-2">
            Nos Services
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(service, index) in services" :key="index"
               class="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-gold/50 transition-all duration-300 hover:shadow-lg">
            <div class="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <span class="text-2xl">{{ service.emoji }}</span>
            </div>
            <h3 class="font-bold text-charcoal dark:text-white mb-2">{{ service.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment commander -->
    <section class="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <span class="text-gold font-medium text-sm uppercase tracking-wider">Simple et rapide</span>
          <h2 class="text-3xl lg:text-4xl font-serif font-bold text-charcoal dark:text-white mt-2">
            Comment commander ?
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-6">
          <div v-for="(step, index) in steps" :key="index" class="relative text-center">
            <!-- Connector line -->
            <div v-if="index < steps.length - 1" class="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-gold to-gray-200 dark:to-gray-700"></div>
            
            <div class="relative z-10 w-16 h-16 bg-gradient-to-br from-charcoal to-gray-800 dark:from-gold dark:to-yellow-500 text-white dark:text-charcoal rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
              {{ index + 1 }}
            </div>
            <h3 class="font-bold text-charcoal dark:text-white mb-2">{{ step.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 lg:py-24 bg-gradient-to-br from-charcoal via-gray-900 to-charcoal text-white relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl"></div>
      </div>
      
      <div class="max-w-4xl mx-auto px-4 text-center relative">
        <h2 class="text-3xl lg:text-5xl font-serif font-bold mb-6">
          Prête à révéler votre <span class="text-gold">beauté naturelle</span> ?
        </h2>
        <p class="text-white/70 text-lg max-w-2xl mx-auto mb-10">
          Contactez-nous pour une consultation personnalisée ou découvrez notre sélection de produits.
        </p>
        
        <div class="flex flex-wrap justify-center gap-4">
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-all hover:scale-105 hover:shadow-xl shadow-lg shadow-green-500/30"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
            </svg>
            Nous contacter
          </a>
          
          <NuxtLink
            to="/produits"
            class="inline-flex items-center gap-3 bg-gold text-charcoal px-8 py-4 rounded-full font-bold hover:bg-yellow-500 transition-all hover:scale-105 hover:shadow-xl shadow-lg shadow-gold/30"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Voir nos produits
          </NuxtLink>
        </div>
      </div>
    </section>

    <WhatsAppFloat />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

useHead({
  title: 'À propos — Samiah Cosmetics',
  meta: [
    { name: 'description', content: 'Samiah\'Cosmetics est une marque spécialisée dans les produits cosmétiques naturels pour le corps, le visage et les cheveux. Découvrez notre histoire.' }
  ]
})

const config = useRuntimeConfig()

const whatsappLink = computed(() => {
  return 'https://wa.me/' + config.public.whatsappNumber
})

// Icônes SVG inline pour les valeurs
const IconNature = () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' })
])

const IconHeart = () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' })
])

const IconUser = () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
])

const values = [
  {
    icon: IconNature,
    title: 'Naturel',
    description: 'Des formulations à base d\'ingrédients naturels, soigneusement sélectionnés pour leur efficacité et leur douceur.'
  },
  {
    icon: IconHeart,
    title: 'Passion',
    description: 'Une équipe passionnée qui met tout son cœur dans chaque produit et chaque conseil personnalisé.'
  },
  {
    icon: IconUser,
    title: 'Accompagnement',
    description: 'Un suivi personnalisé pour vous aider à comprendre vos besoins et adopter la routine qui vous convient.'
  }
]

const services = [
  {
    emoji: '🧴',
    title: 'Soins Capillaires',
    description: 'Shampoings, masques et huiles pour cheveux crépus, secs ou abîmés.'
  },
  {
    emoji: '✨',
    title: 'Soins Visage',
    description: 'Nettoyants, sérums et crèmes pour tous types de peau.'
  },
  {
    emoji: '💆',
    title: 'Soins Corps',
    description: 'Laits, beurres et huiles pour une peau hydratée et éclatante.'
  },
  {
    emoji: '📚',
    title: 'Formations',
    description: 'Apprenez les bases de la cosmétique artisanale avec nos ateliers.'
  }
]

const steps = [
  {
    title: 'Choisissez',
    description: 'Parcourez notre catalogue et sélectionnez vos produits'
  },
  {
    title: 'Commandez',
    description: 'Ajoutez au panier et remplissez vos informations'
  },
  {
    title: 'Confirmez',
    description: 'Envoyez votre commande via WhatsApp'
  },
  {
    title: 'Recevez',
    description: 'Livraison à domicile dans votre ville'
  }
]
</script>
