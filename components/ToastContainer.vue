<template>
  <Teleport to="body">
    <div class="fixed bottom-24 right-4 z-[100] flex flex-col items-end space-y-3 pointer-events-none">
      
      <TransitionGroup
        enter-active-class="transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1)"
        enter-from-class="opacity-0 translate-x-8 scale-90"
        enter-to-class="opacity-100 translate-x-0 scale-100"
        leave-active-class="transition-all duration-300 ease-in absolute"
        leave-from-class="opacity-100 translate-x-0 scale-100"
        leave-to-class="opacity-0 translate-x-8 scale-90"
        move-class="transition-all duration-300 ease-out"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-4 p-4 rounded-2xl shadow-strong 
                 backdrop-blur-md border min-w-[300px] max-w-sm group overflow-hidden relative"
          :class="getToastStyles(toast.type)"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine" />

          <div class="flex-shrink-0 mt-0.5">
            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/10">
              <svg v-if="toast.type === 'success'" class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <svg v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              <svg v-else class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>

          <div class="flex-1 pt-1">
            <h4 class="text-sm font-bold text-white mb-0.5 capitalize">
              {{ getTitle(toast.type) }}
            </h4>
            <p class="text-sm text-gray-300 leading-snug">
              {{ toast.message }}
            </p>
          </div>

          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 text-gray-500 hover:text-white transition-colors pt-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </TransitionGroup>
      
    </div>
  </Teleport>
</template>

<script setup lang="ts">
// On importe ton composable existant
const { toasts, removeToast } = useToast()

// Styles dynamiques (Version Luxe Dark)
const getToastStyles = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-charcoal/90 border-green-500/30'
    case 'error':
      return 'bg-charcoal/90 border-red-500/30'
    default:
      return 'bg-charcoal/90 border-gold/30'
  }
}

// Titres automatiques
const getTitle = (type: string) => {
  switch (type) {
    case 'success': return 'Succès'
    case 'error': return 'Erreur'
    default: return 'Information'
  }
}
</script>
