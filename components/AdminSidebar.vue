<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 w-64 bg-charcoal transform transition-transform duration-300 lg:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex items-center gap-3 h-16 px-6 border-b border-white/10">
      <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden">
        <img 
          src="/icon-192.png" 
          alt="Admin Logo" 
          class="w-full h-full object-cover p-1" 
        />
      </div>
      <div>
        <h1 class="text-white font-bold">Samiah</h1>
        <p class="text-white/50 text-xs">Administration</p>
      </div>
    </div>

    <nav class="p-4 space-y-1">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        :class="{ 'bg-white/10 text-white': isActive(item.to) }"
        @click="$emit('close')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconPath" />
        </svg>
        
        <span>{{ item.label }}</span>
        <span
          v-if="item.badge && item.badge > 0"
          class="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
        >
          {{ item.badge > 99 ? '99+' : item.badge }}
        </span>
      </NuxtLink>
    </nav>

    <div class="mx-4 my-4 border-t border-white/10" />

    <div class="px-4 space-y-2">
      <p class="text-white/40 text-xs uppercase tracking-wider px-4 mb-2">Actions rapides</p>
      
      <a
        :href="whatsappLink"
        target="_blank"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-[#25D366]/20 transition-colors"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
        <span>WhatsApp</span>
      </a>

      <NuxtLink
        to="/"
        target="_blank"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <span>Voir le site</span>
      </NuxtLink>
    </div>

    <div class="absolute bottom-0 left-0 right-0 p-4">
      <div class="bg-white/5 rounded-xl p-4">
        <p class="text-white/40 text-xs">Samiah Cosmetics</p>
        <p class="text-white/60 text-sm">Admin v2.0</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// Plus d'importation externe ! On utilise des chemins SVG directement.

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const route = useRoute()
const config = useRuntimeConfig()

// Menu items avec les dessins SVG intégrés (path)
const menuItems = computed(() => [
  {
    to: '/admin',
    label: 'Dashboard',
    // Icone Maison
    iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    to: '/admin/commandes',
    label: 'Commandes',
    // Icone Sac de shopping
    iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    badge: 0, 
  },
  {
    to: '/admin/produits',
    label: 'Produits',
    // Icone Étiquette
    iconPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  },
  {
    to: '/admin/temoignages',
    label: 'Témoignages',
    // Icone Chat
    iconPath: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    to: '/admin/parametres',
    label: 'Paramètres',
    // Icone Engrenage
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
])

const whatsappLink = computed(() => `https://wa.me/${config.public.whatsappNumber}`)

const isActive = (path: string) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>
