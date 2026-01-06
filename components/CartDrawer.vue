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
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-charcoal to-gray-800 text-white z-10">
          <h2 class="text-xl font-bold flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            Mon Panier
            <span v-if="itemCount > 0" class="flex items-center justify-center px-2.5 py-0.5 rounded-full bg-gold text-charcoal text-sm font-bold">
              {{ itemCount }}
            </span>
          </h2>
          <button
            type="button"
            @click="closeCart"
            class="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
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
          <div v-if="removedItems.length > 0" class="px-6 pt-4">
            <div class="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 relative overflow-hidden">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-300"></div>
              
              <div class="flex-shrink-0 mt-0.5 text-amber-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-amber-900">Mise à jour du stock</h4>
                <p class="text-xs text-amber-700 mt-1 leading-relaxed">
                  Les articles suivants ne sont plus disponibles et ont été retirés :
                  <span class="font-medium italic block mt-1 text-amber-800">
                    {{ removedItems.join(', ') }}
                  </span>
                </p>
              </div>
              
              <button 
                @click="clearRemovedItems"
                class="flex-shrink-0 text-amber-400 hover:text-amber-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
        </Transition>

        <div class="flex-1 overflow-y-auto scrollbar-thin">
          
          <div v-if="isEmpty" class="flex flex-col items-center justify-center h-full px-8 text-center pb-20">
            <div class="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-charcoal mb-2">Votre panier est vide</h3>
            <p class="text-gray-500 mb-8">Il semblerait que vous n'ayez pas encore craqué pour nos produits.</p>
            
            <button
              @click="closeCart"
              class="group px-8 py-4 bg-charcoal text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
            >
              Découvrir la boutique
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
          </div>

          <div v-else class="p-6 space-y-4">
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
                class="group flex gap-4 relative bg-white p-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
              >
                <div class="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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

        <div v-if="!isEmpty" class="border-t border-gray-100 p-6 bg-gradient-to-b from-white to-gray-50">
          <div class="space-y-3 mb-5">
            <div class="flex justify-between text-gray-500 text-sm">
              <span>Sous-total</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-gray-100">
              <span class="text-charcoal font-bold text-lg">Total</span>
              <span class="text-2xl font-bold bg-gradient-to-r from-gold to-yellow-600 bg-clip-text text-transparent">{{ formatPrice(subtotal) }}</span>
            </div>
          </div>
          
          <NuxtLink
            to="/commander"
            class="group relative w-full bg-charcoal text-white py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all overflow-hidden hover:shadow-xl"
            @click="closeCart"
          >
            <span class="relative z-10">Passer la commande</span>
            <svg class="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
            <span class="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
          </NuxtLink>
          
          <p class="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
            <svg class="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
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
