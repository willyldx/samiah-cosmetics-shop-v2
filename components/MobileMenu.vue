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
        class="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[200]"
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
        class="fixed left-0 top-0 h-full w-full max-w-[320px] bg-white shadow-2xl z-[201] flex flex-col"
      >
        <!-- Header avec logo -->
        <div class="relative px-6 py-8 border-b border-gray-100 flex items-center justify-between">
          <img src="/logo.png" alt="Samiah Cosmetics" class="h-12 w-auto object-contain" />
          
          <button
            @click="$emit('close')"
            class="p-2 text-charcoal hover:bg-gray-50 rounded-full transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation principale -->
        <nav class="flex-1 px-6 py-8 overflow-y-auto">
          <div class="flex flex-col space-y-6">
            <NuxtLink
              to="/"
              class="text-xs tracking-widest uppercase font-medium transition-colors"
              :class="isActive('/') ? 'text-gold' : 'text-charcoal hover:text-gold'"
              @click="$emit('close')"
            >
              Accueil
            </NuxtLink>

            <NuxtLink
              to="/produits"
              class="text-xs tracking-widest uppercase font-medium transition-colors"
              :class="isActive('/produits') ? 'text-gold' : 'text-charcoal hover:text-gold'"
              @click="$emit('close')"
            >
              Produits
            </NuxtLink>

            <NuxtLink
              to="/suivi"
              class="text-xs tracking-widest uppercase font-medium transition-colors"
              :class="isActive('/suivi') ? 'text-gold' : 'text-charcoal hover:text-gold'"
              @click="$emit('close')"
            >
              Suivre ma commande
            </NuxtLink>

            <NuxtLink
              to="/a-propos"
              class="text-xs tracking-widest uppercase font-medium transition-colors"
              :class="isActive('/a-propos') ? 'text-gold' : 'text-charcoal hover:text-gold'"
              @click="$emit('close')"
            >
              À propos
            </NuxtLink>
          </div>
        </nav>

        <!-- Footer avec actions -->
        <div class="px-6 py-8 border-t border-gray-100 space-y-4">
          <!-- Bouton Commander -->
          <NuxtLink
            to="/produits"
            class="flex items-center justify-center w-full bg-charcoal text-white py-4 text-[10px] tracking-widest uppercase font-medium hover:bg-gold transition-colors"
            @click="$emit('close')"
          >
            Commander
          </NuxtLink>
          
          <!-- Bouton WhatsApp -->
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener"
            class="flex items-center justify-center gap-2 w-full bg-transparent border border-gray-200 text-charcoal py-4 text-[10px] tracking-widest uppercase font-medium hover:border-charcoal transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            Contact
          </a>

          <!-- Copyright -->
          <p class="text-[10px] text-center text-gray-400 pt-4 uppercase tracking-widest">
            © {{ new Date().getFullYear() }} Samiah
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
