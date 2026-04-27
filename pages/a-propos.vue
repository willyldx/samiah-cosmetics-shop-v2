<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="border-b border-gray-100 pt-32 pb-24 text-center px-4">
      <span class="inline-flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-charcoal mb-8">
        <span class="w-8 h-px bg-gray-200"></span>
        Notre Histoire
        <span class="w-8 h-px bg-gray-200"></span>
      </span>
      <h1 class="text-4xl lg:text-6xl font-serif font-light text-charcoal mb-8">
        Samiah<span class="text-gold">'</span>Cosmetics
      </h1>
      <p class="text-lg text-gray-400 font-light max-w-xl mx-auto">
        La beauté naturelle, révélée par des soins authentiques et un accompagnement personnalisé.
      </p>
    </section>

    <!-- Qui sommes-nous -->
    <section class="py-24 px-4 max-w-5xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 class="text-2xl font-serif font-light text-charcoal mb-8">
            Une marque née de la passion
          </h2>
          <div class="space-y-6 text-gray-500 font-light text-sm leading-loose">
            <p>
              <strong class="text-charcoal font-medium">Samiah'Cosmetics</strong> est une marque spécialisée dans la formulation 
              et la commercialisation de produits cosmétiques naturels pour le corps, 
              le visage et les cheveux.
            </p>
            <p>
              Nous développons des soins ciblés pour différents types de peaux et de cheveux : 
              secs, abîmés, crépus, cassants ou sensibles.
            </p>
            <p>
              Notre marque allie savoir-faire artisanal, ingrédients naturels 
              et accompagnement personnalisé, avec également un volet formation pour transmettre 
              les bases de la cosmétique.
            </p>
          </div>
        </div>
        
        <div class="relative">
          <div class="aspect-[4/5] bg-gray-50 filter grayscale">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
              alt="Soins naturels Samiah Cosmetics"
              class="w-full h-full object-cover opacity-80"
              loading="lazy"
            />
          </div>
          <!-- Stats badge -->
          <div class="absolute -bottom-6 -left-6 bg-white p-6 border border-gray-200 text-center">
            <p class="text-3xl font-serif text-charcoal mb-1">500+</p>
            <p class="text-[9px] uppercase tracking-[0.2em] text-gray-400">Clientes</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos Valeurs -->
    <section class="py-32 bg-gray-50/50 border-t border-gray-100">
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-[10px] tracking-[0.2em] uppercase text-charcoal">
            Ce qui nous définit
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-12">
          <div v-for="(value, index) in values" :key="index" class="text-center">
            <div class="mb-6 flex justify-center">
              <component :is="value.icon" class="w-6 h-6 text-charcoal opacity-80" />
            </div>
            <h3 class="text-sm font-serif text-charcoal mb-4 uppercase tracking-widest">
              {{ value.title }}
            </h3>
            <p class="text-gray-500 font-light text-xs leading-relaxed max-w-xs mx-auto">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos Services -->
    <section class="py-32 bg-white border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-24">
          <h2 class="text-[10px] tracking-[0.2em] uppercase text-charcoal">
            Notre expertise
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          <div v-for="(service, index) in services" :key="index" class="text-center px-4">
            <div class="w-12 h-[1px] bg-charcoal mx-auto mb-8"></div>
            <h3 class="font-serif text-charcoal text-lg mb-4">{{ service.title }}</h3>
            <p class="text-gray-400 font-light text-[11px] uppercase tracking-widest leading-loose">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment commander -->
    <section class="py-32 bg-gray-50/50 border-t border-gray-100">
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-24">
          <h2 class="text-[10px] tracking-[0.2em] uppercase text-charcoal">
            L'Expérience Samiah
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <div v-for="(step, index) in steps" :key="index" class="text-center">
            <div class="text-[10px] font-mono text-gray-300 mb-6 tracking-widest">
              0{{ index + 1 }}
            </div>
            <h3 class="font-serif text-charcoal text-sm uppercase tracking-widest mb-3">{{ step.title }}</h3>
            <p class="text-gray-500 font-light text-xs">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-32 bg-white border-t border-gray-100 text-center px-4">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-serif font-light text-charcoal mb-8">
          Prête à révéler votre beauté naturelle ?
        </h2>
        <p class="text-gray-400 font-light text-sm mb-12">
          Contactez-nous pour une consultation personnalisée ou découvrez notre sélection.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener"
            class="w-full sm:w-auto px-10 py-5 bg-charcoal text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-gold transition-colors"
          >
            Nous contacter
          </a>
          
          <NuxtLink
            to="/produits"
            class="w-full sm:w-auto px-10 py-5 bg-transparent border border-gray-200 text-charcoal text-[10px] tracking-[0.2em] uppercase font-medium hover:border-charcoal transition-colors"
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

// Icônes SVG inline pour les valeurs (fines et élégantes)
const IconNature = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1' }, [
  h('path', { d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' })
])

const IconHeart = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1' }, [
  h('path', { d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' })
])

const IconUser = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1' }, [
  h('path', { d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
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
    description: 'Un suivi sur mesure pour vous aider à comprendre vos besoins et adopter la routine idéale.'
  }
]

const services = [
  {
    title: 'Soins Capillaires',
    description: 'Shampoings, masques et huiles pour cheveux crépus, secs ou abîmés.'
  },
  {
    title: 'Soins Visage',
    description: 'Nettoyants, sérums et crèmes pour tous types de peau.'
  },
  {
    title: 'Soins Corps',
    description: 'Laits, beurres et huiles pour une peau hydratée et éclatante.'
  },
  {
    title: 'Formations',
    description: 'Apprenez les bases de la cosmétique artisanale avec nos experts.'
  }
]

const steps = [
  {
    title: 'Choisissez',
    description: 'Sélectionnez vos produits.'
  },
  {
    title: 'Commandez',
    description: 'Renseignez vos coordonnées.'
  },
  {
    title: 'Confirmez',
    description: 'Validation via WhatsApp.'
  },
  {
    title: 'Recevez',
    description: 'Livraison à domicile.'
  }
]
</script>
