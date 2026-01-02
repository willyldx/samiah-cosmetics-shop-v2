// ==========================================
// STORE: useCartStore (Version Luxe 2026)
// ==========================================

import type { Product, CartItem } from '~/types'

const CART_STORAGE_KEY = 'samiah_cart'

// ÉTAT GLOBAL PARTAGÉ (Singleton Pattern)
// Ces variables restent en mémoire même si on change de page
const cartItems = ref<CartItem[]>([])
const cartOpen = ref(false)
const isInitialized = ref(false)

export const useCartStore = () => {
  // On récupère le système de notification
  const toast = useToast()

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
    
    // AMÉLIORATION UX : 
    // Au lieu d'ouvrir/fermer le panier (ce qui peut gêner),
    // on ouvre le panier et on affiche une notification confirmation.
    cartOpen.value = true
    toast.success(`Ajouté : ${product.title}`)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const index = cartItems.value.findIndex(item => item.product.id === productId)
    
    if (index >= 0) {
      if (quantity <= 0) {
        // Si on descend à 0, on demande confirmation ou on supprime direct
        removeItem(productId)
      } else {
        cartItems.value[index].quantity = quantity
        saveToStorage()
      }
    }
  }

  const removeItem = (productId: string) => {
    const index = cartItems.value.findIndex(item => item.product.id === productId)
    if (index >= 0) {
      // On sauvegarde le nom pour le toast avant de supprimer
      const productName = cartItems.value[index].product.title
      
      cartItems.value.splice(index, 1)
      saveToStorage()
      
      toast.info(`${productName} retiré du panier`)
    }
  }

  const clearCart = () => {
    cartItems.value = []
    saveToStorage()
    // Pas de toast ici car c'est souvent utilisé après une commande réussie
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
  // PERSISTENCE & FORMATAGE
  // ==========================================

  const saveToStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
      } catch (e) {
        console.warn('Erreur sauvegarde panier (Mode privé ?):', e)
      }
    }
  }

  const loadFromStorage = () => {
    if (import.meta.client && !isInitialized.value) {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            cartItems.value = parsed
          }
        }
        isInitialized.value = true // Marquer comme chargé pour ne pas refaire le travail
      } catch (e) {
        console.warn('Erreur chargement panier:', e)
        // En cas d'erreur (JSON corrompu), on reset pour éviter de bloquer le site
        localStorage.removeItem(CART_STORAGE_KEY)
      }
    }
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  // Chargement automatique au démarrage (une seule fois)
  if (import.meta.client) {
    loadFromStorage()
  }

  return {
    // State
    items: cartItems, // Read-only via computed serait plus strict, mais ref est ok ici
    isOpen, // Utiliser le computed pour la lecture
    
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
  }
}
