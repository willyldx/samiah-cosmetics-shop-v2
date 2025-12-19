<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        @click="closeCart"
      />
    </Transition>

    <!-- Drawer -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="isOpen"
        class="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-lg font-bold text-charcoal">
            Mon Panier
            <span v-if="itemCount > 0" class="text-sm font-normal text-gray-500 ml-1">
              ({{ itemCount }})
            </span>
          </h2>
          <button
            @click="closeCart"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenu -->
        <div class="flex-1 overflow-y-auto">
          <!-- Panier vide -->
          <div v-if="isEmpty" class="flex flex-col items-center justify-center h-full px-6 text-center">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 class="font-semibold text-charcoal mb-2">Votre panier est vide</h3>
            <p class="text-gray-500 text-sm mb-6">Découvrez nos produits</p>
            <NuxtLink
              to="/produits"
              class="bg-charcoal text-white px-6 py-3 rounded-full font-medium"
              @click="closeCart"
            >
              Voir les produits
            </NuxtLink>
          </div>

          <!-- Items -->
          <div v-else class="px-4 py-4 space-y-3">
            <div
              v-for="item in items"
              :key="item.product.id"
              class="flex gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <img
                :src="getOptimizedUrl(item.product.image)"
                :alt="item.product.title"
                class="w-16 h-16 rounded-lg object-cover bg-white"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-sm text-charcoal line-clamp-1">{{ item.product.title }}</h4>
                <p class="text-gold font-bold text-sm">{{ formatPrice(item.product.price) }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <button @click="updateQuantity(item.product.id, item.quantity - 1)" class="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-xs">−</button>
                  <span class="text-sm font-medium w-6 text-center">{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.product.id, item.quantity + 1)" class="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-xs">+</button>
                </div>
              </div>
              <button @click="removeItem(item.product.id)" class="text-gray-400 hover:text-red-500 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="!isEmpty" class="border-t px-6 py-4 space-y-3 bg-white">
          <div class="flex justify-between">
            <span class="text-gray-600">Sous-total</span>
            <span class="font-bold text-lg">{{ formatPrice(subtotal) }}</span>
          </div>
          <NuxtLink
            to="/commander"
            class="w-full bg-charcoal text-white py-3 rounded-full font-bold text-center block"
            @click="closeCart"
          >
            Commander
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { items, isOpen, itemCount, subtotal, isEmpty, updateQuantity, removeItem, closeCart, formatPrice } = useCart()
const { getOptimizedImageUrl } = useProducts()

const getOptimizedUrl = (url: string | null) => {
  return url ? getOptimizedImageUrl(url, 200) : '/images/placeholder.png'
}
</script>
