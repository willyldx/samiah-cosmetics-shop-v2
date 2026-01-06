<script lang="ts" setup>
// ==========================================
// DARK MODE TOGGLE BUTTON
// Animated sun/moon toggle with smooth transition
// ==========================================
const { isDark, toggle } = useDarkMode()
</script>
<template>
  <button
    type="button"
    @click="toggle"
    class="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
           bg-gray-100 hover:bg-gray-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700
           hover:scale-105 active:scale-95"
    :aria-label="isDark ? 'Activer le mode clair' : 'Activer le mode sombre'"
  >
    <!-- Sun Icon (Light mode) -->
    <svg
      class="w-5 h-5 text-gold transition-all duration-300 absolute"
      :class="isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    
    <!-- Moon Icon (Dark mode) -->
    <svg
      class="w-5 h-5 text-gold transition-all duration-300 absolute"
      :class="isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>
