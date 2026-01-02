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
        class="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[90]"
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
        class="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[95] flex flex-col border-l border-gray-100"
      >
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white z-10">
          <h2 class="text-xl font-bold text-charcoal flex items-center gap-2">
            Mon Panier
            <span v-if="itemCount > 0" class="flex items-center justify-center w-6 h-6 rounded-full bg-gold text-white text-xs font-bold">
              {{ itemCount }}
            </span>
          </h2>
          <button
            type="button"
            @click="closeCart"
            class="p-2 -mr-2 text-gray-400 hover:text-charcoal hover:bg-gray-100 rounded-full transition-all"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto scrollbar-thin">
          
          <div v-if="isEmpty" class="flex flex-col items-center justify-center h-full px-8 text-center pb-20">
            <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-float">
              <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-charcoal mb-2">Votre panier est vide</h3>
            <p class="text-gray-500 mb-8">Il semblerait que vous n'ayez pas encore craqué pour nos produits.</p>
            
            <button
              @click="closeCart"
              class="px-8 py-3 bg-charcoal text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-charcoal/20 hover:-translate-y-1"
            >
              Découvrir la boutique
            </button>
          </div>

          <div v-else class="p-6 space-y-6">
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
                class="group flex gap-4 relative bg-white"
              >
                <div class="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                  <img
                    :src="item.product.image || '/images/placeholder.svg'"
                    :alt="item.product.title"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <div class="flex justify-between items-start gap-2">
                      <h4 class="font-bold text-charcoal line-clamp-2 leading-tight">
                        {{ item.product.title }}
                      </h4>
                      <button 
                        @click="removeItem(item.product.id)" 
                        class="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Retirer"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">{{ item.product.category }}</p>
                  </div>

                  <div class="flex items-center justify-between mt-2">
                    <p class="text-gold font-bold">{{ formatPrice(item.product.price) }}</p>
                    
                    <div class="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                      <button 
                        @click="updateQuantity(item.product.id, item.quantity - 1)" 
                        class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-charcoal transition-all disabled:opacity-50"
                        :disabled="item.quantity <= 1"
                      >
                        -
                      </button>
                      <span class="w-8 text-center font-bold text-sm">{{ item.quantity }}</span>
                      <button 
                        @click="updateQuantity(item.product.id, item.quantity + 1)" 
                        class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-charcoal transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <div v-if="!isEmpty" class="border-t border-gray-100 p-6 bg-white/80 backdrop-blur-md">
          <div class="space-y-3 mb-4">
            <div class="flex justify-between text-gray-500 text-sm">
              <span>Sous-total</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-charcoal font-bold text-xl">
              <span>Total</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
          </div>
          
          <NuxtLink
            to="/commander"
            class="group w-full bg-charcoal text-white py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            @click="closeCart"
          >
            Passer la commande
            <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </NuxtLink>
          
          <p class="text-center text-xs text-gray-400 mt-3">
            Livraison calculée à l'étape suivante
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// On importe le store mis à jour (sans removedItems)
const { 
  items, 
  isOpen, 
  itemCount, 
  subtotal, 
  isEmpty, 
  updateQuantity, 
  removeItem, 
  closeCart, 
  formatPrice
} = useCartStore() 
// Note : Si ton fichier s'appelle 'useCart.ts', utilise `useCartStore` car c'est le nom de l'export que je t'ai donné avant.
// Si ça ne marche pas, essaie `useCart`.
</script>
