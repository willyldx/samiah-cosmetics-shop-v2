<template>
  <div class="min-h-screen flex flex-col bg-white selection:bg-gold/30 selection:text-charcoal">
    
    <TheHeader @open-search="openSearch" />

    <main class="flex-1 relative z-10">
      <slot />
    </main>

    <TheFooter />

    <CartDrawer />

    <SearchModal 
      :is-open="isSearchOpen" 
      @close="closeSearch" 
    />
    
    </div>
</template>

<script setup lang="ts">
// État de la modal de recherche
const isSearchOpen = ref(false)

const openSearch = () => {
  isSearchOpen.value = true
}

const closeSearch = () => {
  isSearchOpen.value = false
}

// Raccourci Clavier : Ctrl + K ou Cmd + K pour ouvrir la recherche (Style Pro)
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      isSearchOpen.value ? closeSearch() : openSearch()
    }
  }
  window.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})
</script>
