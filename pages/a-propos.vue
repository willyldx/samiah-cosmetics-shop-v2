<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="relative bg-charcoal text-white py-20 lg:py-32 overflow-hidden">
      <!-- Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 relative">
        <div class="max-w-3xl">
          <span class="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-4">
            Notre Histoire
          </span>
          <h1 class="text-4xl lg:text-5xl font-serif font-bold mb-6">
            Samiah Cosmetics
          </h1>
          <p class="text-xl text-white/80 leading-relaxed">
            Des soins capillaires pens&#233;s pour sublimer la beaut&#233; naturelle 
            des cheveux africains, disponibles au Tchad.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span class="text-gold font-medium text-sm uppercase tracking-wider">Notre Mission</span>
            <h2 class="text-3xl lg:text-4xl font-serif font-bold text-charcoal mt-2 mb-6">
              R&#233;v&#233;ler la beaut&#233; de vos cheveux
            </h2>
            <div class="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Chez Samiah Cosmetics, nous croyons que chaque femme m&#233;rite des cheveux 
                en pleine sant&#233;. Notre mission est d&#39;accompagner les femmes tchadiennes 
                dans leur parcours capillaire avec des conseils personnalis&#233;s et des 
                produits adapt&#233;s.
              </p>
              <p>
                Gr&#226;ce &#224; nos consultations capillaires en ligne, nous analysons votre 
                profil unique pour cr&#233;er une routine sur mesure qui r&#233;pond &#224; vos besoins 
                sp&#233;cifiques.
              </p>
            </div>
          </div>
          
          <div class="relative">
            <div class="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                alt="Soins capillaires Samiah Cosmetics"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
              <p class="text-gold text-4xl font-bold mb-1">500+</p>
              <p class="text-gray-600">Clientes satisfaites au Tchad</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="py-16 lg:py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-gold font-medium text-sm uppercase tracking-wider">Nos Services</span>
          <h2 class="text-3xl lg:text-4xl font-serif font-bold text-charcoal mt-2">
            Ce que nous proposons
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Service 1 -->
          <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-charcoal mb-3">Consultation Capillaire</h3>
            <p class="text-gray-600 mb-4">
              Analyse compl&#232;te de votre profil capillaire, diagnostic des probl&#232;mes 
              et cr&#233;ation d&#39;une routine personnalis&#233;e.
            </p>
            <p class="text-gold font-bold text-lg">10 000 FCFA</p>
          </div>

          <!-- Service 2 -->
          <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-charcoal mb-3">Produits Capillaires</h3>
            <p class="text-gray-600 mb-4">
              Une s&#233;lection de shampoings, soins et traitements adapt&#233;s 
              aux cheveux cr&#233;pus, fris&#233;s et textur&#233;s.
            </p>
            <NuxtLink to="/produits" class="text-gold font-medium hover:underline">
              Voir les produits &#8594;
            </NuxtLink>
          </div>

          <!-- Service 3 -->
          <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-charcoal mb-3">Livraison au Tchad</h3>
            <p class="text-gray-600 mb-4">
              Nous livrons &#224; N&#39;Djamena et dans les principales villes du Tchad. 
              Frais calcul&#233;s selon votre quartier.
            </p>
            <p class="text-gray-500 text-sm">N&#39;Djamena, Moundou, Sarh, Ab&#233;ch&#233;...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment ca marche -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-gold font-medium text-sm uppercase tracking-wider">Processus</span>
          <h2 class="text-3xl lg:text-4xl font-serif font-bold text-charcoal mt-2">
            Comment commander ?
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <div v-for="(step, index) in steps" :key="index" class="text-center">
            <div class="w-12 h-12 bg-charcoal text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              {{ index + 1 }}
            </div>
            <h3 class="font-bold text-charcoal mb-2">{{ step.title }}</h3>
            <p class="text-gray-600 text-sm">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact / CTA -->
    <section class="py-16 lg:py-24 bg-charcoal text-white">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-3xl lg:text-4xl font-serif font-bold mb-4">
          Une question ?
        </h2>
        <p class="text-white/70 max-w-xl mx-auto mb-8">
          Contactez-nous directement sur WhatsApp pour toute question 
          sur nos produits ou nos services.
        </p>
        
        <div class="flex flex-wrap justify-center gap-4">
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
            </svg>
            Nous contacter
          </a>
          
          <a
            href="https://facebook.com/SamiahCosmetics"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
            </svg>
            Facebook
          </a>
        </div>
      </div>
    </section>

    <WhatsAppFloat />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'A propos - Samiah Cosmetics',
  meta: [
    { name: 'description', content: 'Decouvrez Samiah Cosmetics, votre partenaire beaute capillaire au Tchad. Consultations personnalisees et produits de qualite.' }
  ]
})

const config = useRuntimeConfig()

const whatsappLink = computed(() => {
  return 'https://wa.me/' + config.public.whatsappNumber
})

const steps = [
  {
    title: 'Choisissez',
    description: 'Parcourez notre catalogue et selectionnez vos produits'
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
    description: 'Livraison a domicile dans votre ville'
  }
]
</script>
