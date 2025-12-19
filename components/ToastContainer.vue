<template>
  <Teleport to="body">
    <div class="fixed bottom-20 right-4 z-50 space-y-2">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-8"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-8"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="px-5 py-3 rounded-xl font-medium shadow-strong flex items-center gap-3 max-w-sm"
          :class="toastClasses(toast.type)"
        >
          <!-- Icon -->
          <span v-if="toast.type === 'success'" class="text-lg">✓</span>
          <span v-else-if="toast.type === 'error'" class="text-lg">✕</span>
          <span v-else-if="toast.type === 'info'" class="text-lg">ℹ</span>
          
          <!-- Message -->
          <span>{{ toast.message }}</span>
          
          <!-- Close button -->
          <button
            @click="removeToast(toast.id)"
            class="ml-auto opacity-70 hover:opacity-100 transition-opacity"
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
interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = useState<Toast[]>('toasts', () => [])

const toastClasses = (type: Toast['type']) => {
  return {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-charcoal text-white',
  }[type]
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index >= 0) {
    toasts.value.splice(index, 1)
  }
}

// Expose globally via composable
const addToast = (message: string, type: Toast['type'] = 'info', duration: number = 3000) => {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

// Make available globally
if (import.meta.client) {
  (window as any).__addToast = addToast
}
</script>
