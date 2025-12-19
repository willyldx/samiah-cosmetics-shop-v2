// ==========================================
// STORE: useCartStore
// Store Pinia-like pour le panier (compatible avec TheHeader)
// ==========================================

import type { Product, CartItem } from '~/types'

const CART_STORAGE_KEY = 'samiah_cart'

// État global partagé
const cartItems = ref<CartItem[]>([])
const cartOpen = ref(false)

export const useCartStore = () => {
  // ==========================================
  // COMPUTED
  // ==========================================
  
  const itemCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  })

  const isEmpty = computed(() => cartItems.value.length === 0)

  const isOpen = computed(() => cartOpen.value)

  // ==========================================
  // ACTIONS
  // ==========================================

  const addItem = (product: Product, quantity: number = 1) => {
    const existingIndex = cartItems.value.findIndex(item => item.product.id === product.id)
    
    if (existingIndex >= 0) {
      cartItems.value[existingIndex].quantity += quantity
    } else {
      cartItems.value.push({ product, quantity })
    }
    
    saveToStorage()
    cartOpen.value = true
    
    setTimeout(() => {
      cartOpen.value = false
    }, 2000)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const index = cartItems.value.findIndex(item => item.product.id === productId)
    
    if (index >= 0) {
      if (quantity <= 0) {
        cartItems.value.splice(index, 1)
      } else {
        cartItems.value[index].quantity = quantity
      }
      saveToStorage()
    }
  }

  const removeItem = (productId: string) => {
    const index = cartItems.value.findIndex(item => item.product.id === productId)
    if (index >= 0) {
      cartItems.value.splice(index, 1)
      saveToStorage()
    }
  }

  const clearCart = () => {
    cartItems.value = []
    saveToStorage()
  }

  const toggleCart = () => {
    cartOpen.value = !cartOpen.value
  }

  const openCart = () => {
    cartOpen.value = true
  }

  const closeCart = () => {
    cartOpen.value = false
  }

  // ==========================================
  // PERSISTENCE
  // ==========================================

  const saveToStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
      } catch (e) {
        console.warn('Cannot save cart:', e)
      }
    }
  }

  const loadFromStorage = () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            cartItems.value = parsed
          }
        }
      } catch (e) {
        console.warn('Cannot load cart:', e)
      }
    }
  }

  // ==========================================
  // HELPERS
  // ==========================================

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  // Auto-load on client
  if (import.meta.client) {
    loadFromStorage()
  }

  return {
    // State (reactive)
    items: cartItems,
    isOpen: cartOpen,
    
    // Computed
    itemCount,
    subtotal,
    isEmpty,
    
    // Actions
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    
    // Helpers
    formatPrice,
    loadFromStorage,
  }
}
