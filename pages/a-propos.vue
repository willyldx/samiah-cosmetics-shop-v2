<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="relative bg-gray-50 py-20 lg:py-32 overflow-hidden border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 relative">
        <div class="max-w-3xl mx-auto text-center">
          <span class="inline-flex items-center gap-2 text-gold font-medium text-xs uppercase tracking-widest mb-6">
            <span class="w-8 h-px bg-gold"></span>
            Notre Histoire
            <span class="w-8 h-px bg-gold"></span>
          </span>
          <h1 class="text-4xl lg:text-6xl font-serif font-light text-charcoal mb-6">
            Samiah<span class="text-gold">'</span>Cosmetics
          </h1>
          <p class="text-xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
            La beauté naturelle, révélée par des soins authentiques et un accompagnement personnalisé.
          </p>
        </div>
      </div>
    </section>

    <!-- Qui sommes-nous -->
    <section class="py-16 lg:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span class="text-gray-400 font-medium text-xs uppercase tracking-widest">Qui sommes-nous</span>
            <h2 class="text-3xl lg:text-4xl font-serif font-light text-charcoal mt-2 mb-8">
              Une marque née de la passion
            </h2>
            <div class="space-y-6 text-gray-500 font-light leading-relaxed text-lg">
              <p>
                <strong class="text-charcoal font-medium">Samiah'Cosmetics</strong> est une marque spécialisée dans la formulation 
                et la commercialisation de <strong class="text-gold font-medium">produits cosmétiques naturels</strong> pour le corps, 
                le visage et les cheveux.
              </p>
              <p>
                Nous développons des soins ciblés pour différents types de peaux et de cheveux : 
                <span class="text-charcoal font-medium">secs, abîmés, crépus, cassants ou sensibles</span>.
              </p>
              <p>
                Notre marque allie <strong class="text-gold font-medium">savoir-faire cosmétique</strong>, ingrédients naturels 
                et accompagnement personnalisé, avec également un volet formation pour transmettre 
                les bases de la cosmétique artisanale.
              </p>
            </div>
          </div>
          
          <div class="relative">
            <div class="aspect-[4/5] bg-gray-50 rounded-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                alt="Soins naturels Samiah Cosmetics"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <!-- Stats card -->
            <div class="absolute -bottom-6 -left-6 bg-white shadow-xl p-8 border border-gray-100">
              <div class="flex items-center gap-6">
                <div>
                  <p class="text-4xl font-serif text-charcoal">500+</p>
                  <p class="text-gray-400 text-xs uppercase tracking-widest mt-1">Clientes satisfaites</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos Valeurs -->
    <section class="py-24 bg-gray-50 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <span class="text-gray-400 font-medium text-xs uppercase tracking-widest">Ce qui nous définit</span>
          <h2 class="text-3xl lg:text-4xl font-serif font-light text-charcoal mt-2">
            Nos Valeurs
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-12">
          <div v-for="(value, index) in values" :key="index" class="text-center group">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
              <component :is="value.icon" class="w-6 h-6 text-gold" />
            </div>
            <h3 class="text-xl font-serif text-charcoal mb-4 group-hover:text-gold transition-colors">
              {{ value.title }}
            </h3>
            <p class="text-gray-500 font-light leading-relaxed text-sm">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos Services -->
    <section class="py-24 bg-white border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <span class="text-gray-400 font-medium text-xs uppercase tracking-widest">Ce que nous proposons</span>
          <h2 class="text-3xl lg:text-4xl font-serif font-light text-charcoal mt-2">
            Nos Services
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(service, index) in services" :key="index" class="text-center group p-6">
            <div class="mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
              <span class="text-4xl">{{ service.emoji }}</span>
            </div>
            <h3 class="font-serif text-charcoal text-lg mb-3">{{ service.title }}</h3>
            <p class="text-gray-500 font-light text-sm leading-relaxed">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment commander -->
    <section class="py-24 bg-gray-50 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <span class="text-gray-400 font-medium text-xs uppercase tracking-widest">Simple et rapide</span>
          <h2 class="text-3xl lg:text-4xl font-serif font-light text-charcoal mt-2">
            Comment commander ?
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-12 text-center">
          <div v-for="(step, index) in steps" :key="index" class="relative">
            <div class="w-12 h-12 bg-white text-gold rounded-full flex items-center justify-center text-xl font-serif mx-auto mb-6 shadow-sm">
              {{ index + 1 }}
            </div>
            <h3 class="font-serif text-charcoal text-lg mb-3">{{ step.title }}</h3>
            <p class="text-gray-500 font-light text-sm">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-32 bg-charcoal text-white relative text-center">
      <div class="max-w-3xl mx-auto px-4">
        <span class="block text-xs font-medium text-gold tracking-widest uppercase mb-6">Commencez l'expérience</span>
        <h2 class="text-4xl lg:text-6xl font-serif font-light mb-8 leading-tight">
          Prête à révéler votre <br/>
          <i class="text-gold">beauté naturelle</i> ?
        </h2>
        <p class="text-white/60 text-lg font-light mb-12">
          Contactez-nous pour une consultation personnalisée ou découvrez notre sélection de produits.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener"
            class="w-full sm:w-auto px-10 py-4 bg-white text-charcoal text-sm font-medium tracking-widest uppercase hover:bg-gold hover:text-white transition-colors duration-300"
          >
            Nous contacter
          </a>
          
          <NuxtLink
            to="/produits"
            class="w-full sm:w-auto px-10 py-4 bg-transparent border border-white/30 text-white text-sm font-medium tracking-widest uppercase hover:border-white transition-colors duration-300"
          >
            Voir les produits
          </NuxtLink>
        </div>
      </div>
    </section>


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
