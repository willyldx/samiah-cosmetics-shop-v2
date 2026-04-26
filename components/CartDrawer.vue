<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[200]"
        @click="closeCart"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-400 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="isOpen"
        class="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[201] flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white text-charcoal z-10">
          <h2 class="text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-3">
            Mon Panier
            <span v-if="itemCount > 0" class="flex items-center justify-center w-5 h-5 bg-charcoal text-white text-[10px] font-medium">
              {{ itemCount }}
            </span>
          </h2>
          <button
            type="button"
            @click="closeCart"
            class="text-gray-400 hover:text-charcoal transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2 height-0"
          enter-to-class="opacity-100 translate-y-0 height-auto"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 height-auto"
          leave-to-class="opacity-0 -translate-y-2 height-0"
        >
          <div v-if="removedItems.length > 0" class="px-8 pt-6">
            <div class="p-4 border border-gray-200 flex items-start gap-3">
              <div class="flex-shrink-0 mt-0.5 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              
              <div class="flex-1 min-w-0">
                <h4 class="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal">Mise à jour du stock</h4>
                <p class="text-xs text-gray-500 font-light mt-1">
                  Les articles suivants ne sont plus disponibles :
                  <span class="block mt-1 italic text-charcoal">
                    {{ removedItems.join(', ') }}
                  </span>
                </p>
              </div>
              
              <button 
                @click="clearRemovedItems"
                class="flex-shrink-0 text-gray-400 hover:text-charcoal transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
        </Transition>

        <div class="flex-1 overflow-y-auto scrollbar-thin">
          
          <div v-if="isEmpty" class="flex flex-col items-center justify-center h-full px-8 text-center pb-20">
            <p class="text-gray-400 font-light text-sm mb-8">Votre panier est vide.</p>
            
            <button
              @click="closeCart"
              class="px-8 py-4 border border-gray-200 text-charcoal text-[10px] uppercase tracking-[0.2em] font-medium hover:border-charcoal transition-colors"
            >
              Découvrir la collection
            </button>
          </div>

          <div v-else class="px-8 py-6 space-y-6">
            <TransitionGroup
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-x-10"
              enter-to-class="opacity-100 translate-x-0"
              leave-active-class="transition-all duration-200 ease-in absolute w-full"
              leave-from-class="opacity-100 translate-x-0"
              leave-to-class="opacity-0 translate-x-10"
              move-class="transition-all duration-300"
            >
              <div
                v-for="item in items"
                :key="item.product.id"
                class="group flex gap-6 py-4 border-b border-gray-100 last:border-0 relative bg-white"
              >
                <!-- Product Image -->
                <div class="w-20 h-24 flex-shrink-0 bg-gray-50 overflow-hidden relative">
                  <img
                    :src="item.product.image || '/images/placeholder.svg'"
                    :alt="item.product.title"
                    class="w-full h-full object-cover"
                  />
                  <!-- Hover Remove Overlay -->
                  <div class="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      @click="removeItem(item.product.id)" 
                      class="text-charcoal hover:text-red-500 transition-colors"
                      title="Retirer"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                <div class="flex-1 min-w-0 flex flex-col justify-center">
                  <p class="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">{{ item.product.category }}</p>
                  <h4 class="font-serif text-lg text-charcoal line-clamp-1 mb-1">
                    {{ item.product.title }}
                  </h4>
                  <p class="text-sm font-light text-gray-500 mb-4">{{ formatPrice(item.product.price) }}</p>
                  
                  <div class="flex items-center border border-gray-200 w-fit">
                    <button 
                      @click="updateQuantity(item.product.id, item.quantity - 1)" 
                      class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-charcoal transition-colors disabled:opacity-30"
                      :disabled="item.quantity <= 1"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 12H4"/></svg>
                    </button>
                    <span class="w-8 text-center text-xs font-light text-charcoal">{{ item.quantity }}</span>
                    <button 
                      @click="updateQuantity(item.product.id, item.quantity + 1)" 
                      class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-charcoal transition-colors"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <div v-if="!isEmpty" class="border-t border-gray-100 p-8 bg-white">
          <div class="space-y-4 mb-8">
            <div class="flex justify-between items-center">
              <span class="text-[10px] uppercase tracking-[0.2em] text-gray-400">Sous-total</span>
              <span class="text-sm font-light text-gray-500">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
              <span class="text-xs uppercase tracking-[0.2em] font-medium text-charcoal">Total</span>
              <span class="text-xl font-light text-charcoal">{{ formatPrice(subtotal) }}</span>
            </div>
          </div>
          
          <NuxtLink
            to="/commander"
            class="block w-full bg-charcoal text-white text-center py-5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors duration-300"
            @click="closeCart"
          >
            Passer la commande
          </NuxtLink>
          
          <p class="text-center text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-6 flex items-center justify-center gap-2">
            Livraison calculée à l'étape suivante
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// On récupère TOUT depuis useCart (y compris removedItems et clearRemovedItems)
const { 
  items, 
  isOpen, 
  itemCount, 
  subtotal, 
  isEmpty, 
  removedItems, 
  updateQuantity, 
  removeItem, 
  closeCart, 
  formatPrice, 
  clearRemovedItems 
} = useCart()
</script>
