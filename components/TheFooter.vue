<template>
  <footer class="bg-charcoal text-white mt-auto">
    <div class="container-main py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div class="lg:col-span-1">
          <NuxtLink to="/" class="flex items-center gap-3 mb-4">
            
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
              <img 
                src="/icon-192.png" 
                alt="Logo Samiah" 
                class="w-full h-full object-cover p-1" 
              />
            </div>
            
            <span class="font-display font-bold tracking-wider text-sm">
              SAMIAH COSMETICS
            </span>
          </NuxtLink>
          
          <p class="text-white/60 text-sm leading-relaxed mb-4">
            Spécialiste en consultation capillaire et produits cosmétiques pour cheveux afro au Tchad.
          </p>
          
          <div class="flex gap-3">
            <a 
              :href="`https://wa.me/${config.public.whatsappNumber}`"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-colors"
              aria-label="WhatsApp"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a 
              href="https://instagram.com/samiahcosmetics"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 flex items-center justify-center transition-all"
              aria-label="Instagram"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://facebook.com/samiahcosmetics"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-white mb-4">Navigation</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="text-white/60 hover:text-gold transition-colors text-sm">
                Accueil
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/produits" class="text-white/60 hover:text-gold transition-colors text-sm">
                Tous les produits
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/produits?category=Shampoings" class="text-white/60 hover:text-gold transition-colors text-sm">
                Shampoings
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/produits?category=Soins+cheveux" class="text-white/60 hover:text-gold transition-colors text-sm">
                Soins cheveux
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/a-propos" class="text-white/60 hover:text-gold transition-colors text-sm">
                À propos
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-white mb-4">Services</h3>
          <ul class="space-y-3">
            <li>
              <a 
                :href="`https://wa.me/${config.public.whatsappNumber}?text=${encodeURIComponent('Bonjour Samiah Cosmetics, je souhaite réserver une consultation capillaire.')}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-white/60 hover:text-gold transition-colors text-sm"
              >
                Consultation capillaire
              </a>
            </li>
            <li>
              <span class="text-white/60 text-sm">Livraison N'Djamena</span>
            </li>
            <li>
              <span class="text-white/60 text-sm">Livraison provinces</span>
            </li>
            <li>
              <span class="text-white/60 text-sm">Paiement à la livraison</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-white mb-4">Contact</h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-white/60 text-sm">N'Djamena, Tchad</span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a 
                :href="`tel:+${config.public.whatsappNumber}`"
                class="text-white/60 hover:text-gold transition-colors text-sm"
              >
                +235 62 75 21 05
              </a>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-white/60 text-sm">Lun - Sam : 8h - 18h</span>
            </li>
          </ul>

          <a 
            :href="`https://wa.me/${config.public.whatsappNumber}`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-[#25D366] hover:bg-[#22c55e] text-white rounded-lg font-medium text-sm transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Nous écrire
          </a>
        </div>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div class="container-main py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-white/40 text-sm text-center sm:text-left">
            © {{ currentYear }} Samiah Cosmetics — N'Djamena, Tchad
          </p>
          <div class="flex items-center gap-6">
            <NuxtLink to="/mentions-legales" class="text-white/40 hover:text-white/60 text-sm transition-colors">
              Mentions légales
            </NuxtLink>
            <NuxtLink to="/cgv" class="text-white/40 hover:text-white/60 text-sm transition-colors">
              CGV
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const currentYear = new Date().getFullYear()
</script>
