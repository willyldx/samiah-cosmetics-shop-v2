<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <TheHeader />

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
// Default layout - used for all public pages
</script>
