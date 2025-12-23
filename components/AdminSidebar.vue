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
        <component :is="resolveIcon(item.icon)" class="w-5 h-5" />
        
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
// Import des icônes Heroicons pour éviter les bugs si les composants manquent
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  TagIcon, 
  ChatBubbleLeftRightIcon, 
  Cog6ToothIcon 
} from '@heroicons/vue/24/outline'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const route = useRoute()
const config = useRuntimeConfig()

// Mapping des icônes pour être sûr qu'elles s'affichent
const resolveIcon = (name: string) => {
  switch (name) {
    case 'IconDashboard': return HomeIcon
    case 'IconOrders': return ShoppingBagIcon
    case 'IconProducts': return TagIcon
    case 'IconTestimonials': return ChatBubbleLeftRightIcon
    case 'IconSettings': return Cog6ToothIcon
    default: return HomeIcon
  }
}

// Menu items
const menuItems = computed(() => [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: 'IconDashboard',
  },
  {
    to: '/admin/commandes',
    label: 'Commandes',
    icon: 'IconOrders',
    badge: 0, 
  },
  {
    to: '/admin/produits',
    label: 'Produits',
    icon: 'IconProducts',
  },
  {
    to: '/admin/temoignages',
    label: 'Témoignages',
    icon: 'IconTestimonials',
  },
  {
    to: '/admin/parametres',
    label: 'Paramètres',
    icon: 'IconSettings',
  },
])

const whatsappLink = computed(() => `https://wa.me/${config.public.whatsappNumber}`)

const isActive = (path: string) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>
