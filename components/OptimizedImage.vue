<script lang="ts" setup>
// ==========================================
// OPTIMIZED IMAGE COMPONENT
// Wrapper for NuxtImg with lazy loading and blur placeholder
// ==========================================

interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  class?: string
  loading?: 'lazy' | 'eager'
  placeholder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  placeholder: true,
  sizes: 'xs:100vw sm:50vw md:33vw lg:25vw'
})

const isLoaded = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)

const onLoad = () => {
  isLoaded.value = true
}

// Fallback image on error
const onError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = '/images/placeholder.svg'
}
</script>

<template>
  <div class="relative overflow-hidden" :class="props.class">
    <!-- Blur placeholder -->
    <div 
      v-if="placeholder && !isLoaded"
      class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
    />
    
    <!-- Optimized image -->
    <NuxtImg
      ref="imageRef"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :sizes="sizes"
      :loading="loading"
      format="webp"
      quality="80"
      class="w-full h-full object-cover transition-opacity duration-500"
      :class="{ 'opacity-0': !isLoaded, 'opacity-100': isLoaded }"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>
