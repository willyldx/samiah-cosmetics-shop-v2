<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-250 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Menu -->
    <Transition
      enter-active-class="transition-all duration-400 ease-out"
      enter-from-class="-translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="-translate-x-full opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed left-0 top-0 h-full w-full max-w-[320px] bg-white dark:bg-gray-800 shadow-2xl z-[201] flex flex-col"
      >
        <!-- Header avec logo amélioré -->
        <div class="relative px-6 py-5 bg-gradient-to-br from-charcoal via-gray-800 to-charcoal overflow-hidden">
          <!-- Effet shimmer en arrière-plan -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
          
          <!-- Bouton fermer -->
          <button
            @click="$emit('close')"
            class="absolute top-4 right-4 p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Logo et titre -->
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gold flex items-center justify-center shadow-lg shadow-gold/30 transition-transform duration-300 hover:scale-105 hover:rotate-[-3deg]">
              <span class="text-charcoal font-bold text-xl">S</span>
            </div>
            <div>
              <h2 class="font-bold text-white tracking-wide">SAMIAH</h2>
              <p class="text-gold/80 text-xs font-medium">Cosmetics</p>
            </div>
          </div>
        </div>

        <!-- Navigation principale -->
        <nav class="flex-1 px-4 py-6 overflow-y-auto">
          <div class="space-y-1">
            <!-- Accueil -->
            <NuxtLink
              to="/"
              class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group"
              :class="isActive('/') 
                ? 'bg-gold/10 text-charcoal dark:text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-charcoal dark:hover:text-white'"
              @click="$emit('close')"
            >
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                :class="isActive('/') ? 'bg-gold text-charcoal' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gold/20'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <span class="font-medium">Accueil</span>
            </NuxtLink>

            <!-- Produits -->
            <NuxtLink
              to="/produits"
              class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group"
              :class="isActive('/produits') 
                ? 'bg-gold/10 text-charcoal' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-charcoal'"
              @click="$emit('close')"
            >
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                :class="isActive('/produits') ? 'bg-gold text-charcoal' : 'bg-gray-100 text-gray-500 group-hover:bg-gold/20'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
              <span class="font-medium">Produits</span>
            </NuxtLink>

            <!-- Séparateur -->
            <div class="my-4 mx-4 border-t border-gray-100"></div>

            <!-- Suivre ma commande - Mis en avant -->
            <NuxtLink
              to="/suivi"
              class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group"
              :class="isActive('/suivi') 
                ? 'bg-gold/10 text-charcoal' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-charcoal'"
              @click="$emit('close')"
            >
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                :class="isActive('/suivi') ? 'bg-gold text-charcoal' : 'bg-orange-100 text-orange-500 group-hover:bg-orange-200'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <div>
                <span class="font-medium block">Suivre ma commande</span>
                <span class="text-xs text-gray-400">Où en est mon colis ?</span>
              </div>
            </NuxtLink>

            <!-- Séparateur -->
            <div class="my-4 mx-4 border-t border-gray-100"></div>

            <!-- À propos -->
            <NuxtLink
              to="/a-propos"
              class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group"
              :class="isActive('/a-propos') 
                ? 'bg-gold/10 text-charcoal' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-charcoal'"
              @click="$emit('close')"
            >
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                :class="isActive('/a-propos') ? 'bg-gold text-charcoal' : 'bg-gray-100 text-gray-500 group-hover:bg-gold/20'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="font-medium">À propos</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- Footer avec actions -->
        <div class="px-4 py-5 border-t border-gray-100 space-y-3 bg-gray-50">
          <!-- Bouton WhatsApp -->
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener"
            class="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-3.5 rounded-xl font-medium shadow-md hover:shadow-lg hover:bg-[#20bd5a] transition-all"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            Contacter sur WhatsApp
          </a>

          <!-- Bouton Commander -->
          <NuxtLink
            to="/produits"
            class="flex items-center justify-center gap-2 w-full bg-charcoal text-white py-3.5 rounded-xl font-medium shadow-md hover:shadow-lg hover:bg-black transition-all"
            @click="$emit('close')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            Commander maintenant
          </NuxtLink>
          
          <!-- Copyright -->
          <p class="text-xs text-center text-gray-400 pt-2">
            © {{ new Date().getFullYear() }} Samiah Cosmetics
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const route = useRoute()
const config = useRuntimeConfig()

const whatsappLink = computed(() => `https://wa.me/${config.public.whatsappNumber}`)

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
