<template>
  <div class="animate-pulse" :class="wrapperClass">
    <!-- Product Card Skeleton -->
    <template v-if="type === 'product-card'">
      <div class="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-soft dark:shadow-none dark:border dark:border-gray-700">
        <div class="aspect-square bg-gray-200 dark:bg-gray-700"></div>
        <div class="p-5 space-y-3">
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-2"></div>
        </div>
      </div>
    </template>
    <!-- Product Detail Skeleton -->
    <template v-else-if="type === 'product-detail'">
      <div class="grid lg:grid-cols-2 gap-12">
        <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
        <div class="space-y-4 py-8">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div class="space-y-2 mt-4">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
          <div class="h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl w-full mt-6"></div>
        </div>
      </div>
    </template>
    <!-- Order Card Skeleton -->
    <template v-else-if="type === 'order-card'">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div class="flex-1 space-y-2">
            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
          <div class="text-right space-y-2">
            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </template>
    <!-- Stat Card Skeleton -->
    <template v-else-if="type === 'stat-card'">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div class="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </div>
    </template>
    <!-- Text Line Skeleton -->
    <template v-else-if="type === 'text'">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded" :class="widthClass"></div>
    </template>
    <!-- Avatar Skeleton -->
    <template v-else-if="type === 'avatar'">
      <div class="rounded-full bg-gray-200 dark:bg-gray-700" :class="sizeClass"></div>
    </template>
    <!-- Image Skeleton -->
    <template v-else-if="type === 'image'">
      <div class="bg-gray-200 dark:bg-gray-700 rounded-2xl" :class="aspectClass"></div>
    </template>
    <!-- Button Skeleton -->
    <template v-else-if="type === 'button'">
      <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" :class="widthClass"></div>
    </template>
    <!-- Default Box Skeleton -->
    <template v-else>
      <div class="bg-gray-200 dark:bg-gray-700 rounded-xl" :class="[heightClass, widthClass]"></div>
    </template>
  </div>
</template>
<script setup lang="ts">
type SkeletonType = 'product-card' | 'product-detail' | 'order-card' | 'stat-card' | 'text' | 'avatar' | 'image' | 'button' | 'box'
const props = withDefaults(defineProps<{
  type?: SkeletonType
  width?: 'full' | '3/4' | '1/2' | '1/3' | '1/4'
  height?: 'sm' | 'md' | 'lg' | 'xl'
  size?: 'sm' | 'md' | 'lg'
  aspect?: 'square' | 'video' | '4/3'
  class?: string
}>(), {
  type: 'box',
  width: 'full',
  height: 'md',
  size: 'md',
  aspect: 'square'
})
const wrapperClass = computed(() => props.class || '')
const widthClass = computed(() => {
  const widths = {
    'full': 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4'
  }
  return widths[props.width]
})
const heightClass = computed(() => {
  const heights = {
    'sm': 'h-8',
    'md': 'h-12',
    'lg': 'h-20',
    'xl': 'h-32'
  }
  return heights[props.height]
})
const sizeClass = computed(() => {
  const sizes = {
    'sm': 'w-8 h-8',
    'md': 'w-12 h-12',
    'lg': 'w-16 h-16'
  }
  return sizes[props.size]
})
const aspectClass = computed(() => {
  const aspects = {
    'square': 'aspect-square',
    'video': 'aspect-video',
    '4/3': 'aspect-[4/3]'
  }
  return aspects[props.aspect]
})
</script>
