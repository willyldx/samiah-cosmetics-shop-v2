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
          class="pointer-events-auto flex items-start gap-4 p-4 rounded-2xl shadow-2xl 
                 backdrop-blur-xl border min-w-[320px] max-w-sm group overflow-hidden relative"
          :class="getToastStyles(toast.type)"
        >
          <!-- Progress bar -->
          <div 
            class="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-100"
            :class="getProgressColor(toast.type)"
            :style="{ width: getProgress(toast.id) + '%' }"
          />

          <!-- Icon with glow effect -->
          <div class="flex-shrink-0 mt-0.5">
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="getIconBg(toast.type)"
            >
              <!-- Success Icon -->
              <svg v-if="toast.type === 'success'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <!-- Error Icon -->
              <svg v-else-if="toast.type === 'error'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <!-- Info Icon -->
              <svg v-else class="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 pt-0.5">
            <h4 class="text-sm font-bold text-white mb-0.5">
              {{ getTitle(toast.type) }}
            </h4>
            <p class="text-sm text-gray-300 leading-snug">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close button -->
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
      
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToast()

// Track progress for each toast
const progressMap = ref<Record<number, number>>({})

// Initialize progress tracking
watch(toasts, (newToasts) => {
  newToasts.forEach(toast => {
    if (!(toast.id in progressMap.value)) {
      progressMap.value[toast.id] = 100
      // Animate progress
      const startTime = Date.now()
      const duration = 4000 // Match toast duration
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
        progressMap.value[toast.id] = remaining
        
        if (remaining > 0 && toasts.value.find(t => t.id === toast.id)) {
          requestAnimationFrame(updateProgress)
        }
      }
      requestAnimationFrame(updateProgress)
    }
  })
}, { immediate: true, deep: true })

const getProgress = (id: number) => progressMap.value[id] || 0

// Styles dynamiques
const getToastStyles = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-r from-charcoal to-gray-800 border-green-500/40'
    case 'error':
      return 'bg-gradient-to-r from-charcoal to-gray-800 border-red-500/40'
    default:
      return 'bg-gradient-to-r from-charcoal to-gray-800 border-gold/40'
  }
}

const getIconBg = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30'
    case 'error':
      return 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30'
    default:
      return 'bg-gradient-to-br from-gold to-yellow-500 shadow-lg shadow-gold/30'
  }
}

const getProgressColor = (type: string) => {
  switch (type) {
    case 'success': return 'bg-green-500'
    case 'error': return 'bg-red-500'
    default: return 'bg-gold'
  }
}

const getTitle = (type: string) => {
  switch (type) {
    case 'success': return '✓ Succès'
    case 'error': return '✕ Erreur'
    default: return 'ℹ Information'
  }
}
</script>
