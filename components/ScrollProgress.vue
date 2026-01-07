<template>
  <div 
    class="fixed top-0 left-0 right-0 h-1 z-[100] bg-transparent"
  >
    <div 
      class="h-full bg-gradient-to-r from-gold via-yellow-400 to-gold transition-all duration-150 ease-out shadow-sm shadow-gold/50"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>

<script setup lang="ts">
const progress = ref(0)

const calculateProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  
  if (docHeight > 0) {
    progress.value = Math.min((scrollTop / docHeight) * 100, 100)
  }
}

onMounted(() => {
  window.addEventListener('scroll', calculateProgress, { passive: true })
  calculateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', calculateProgress)
})
</script>
