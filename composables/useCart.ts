// ==========================================
// COMPOSABLE: useCart
// Gestion du panier d'achat
// ==========================================

import type { Product, CartItem, Cart } from '~/types'

const CART_STORAGE_KEY = 'samiah_cart'

export const useCart = () => {
  // État réactif du panier
  const items = useState<CartItem[]>('cart-items', () => [])
  const isOpen = useState<boolean>('cart-open', () => false)

  // ==========================================
  // COMPUTED
  // ==========================================
  
  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  })

  const isEmpty = computed(() => items.value.length === 0)

  // ==========================================
  // ACTIONS
  // ==========================================

  /**
   * Ajouter un produit au panier
   */
  const addItem = (product: Product, quantity: number = 1) => {
    const existingIndex = items.value.findIndex(item => item.product.id === product.id)
    
    if (existingIndex >= 0) {
      // Produit déjà dans le panier → augmenter la quantité
      items.value[existingIndex].quantity += quantity
    } else {
      // Nouveau produit
      items.value.push({ product, quantity })
    }
    
    saveToStorage()
    
    // Ouvrir le panier pour feedback visuel
    isOpen.value = true
    
    // Fermer après 2 secondes
    setTimeout(() => {
      isOpen.value = false
    }, 2000)
  }

  /**
   * Mettre à jour la quantité d'un item
   */
  const updateQuantity = (productId: string, quantity: number) => {
    const index = items.value.findIndex(item => item.product.id === productId)
    
    if (index >= 0) {
      if (quantity <= 0) {
        // Supprimer si quantité <= 0
        items.value.splice(index, 1)
      } else {
        items.value[index].quantity = quantity
      }
      saveToStorage()
    }
  }

  /**
   * Supprimer un item du panier
   */
  const removeItem = (productId: string) => {
    const index = items.value.findIndex(item => item.product.id === productId)
    if (index >= 0) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  /**
   * Vider le panier
   */
  const clearCart = () => {
    items.value = []
    saveToStorage()
  }

  /**
   * Ouvrir/Fermer le panier
   */
  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  const openCart = () => {
    isOpen.value = true
  }

  const closeCart = () => {
    isOpen.value = false
  }

  // ==========================================
  // PERSISTENCE (localStorage)
  // ==========================================

  const saveToStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
      } catch (e) {
        console.warn('Impossible de sauvegarder le panier:', e)
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
            items.value = parsed
          }
        }
      } catch (e) {
        console.warn('Impossible de charger le panier:', e)
      }
    }
  }

  // ==========================================
  // HELPERS
  // ==========================================

  /**
   * Vérifie si un produit est dans le panier
   */
  const isInCart = (productId: string): boolean => {
    return items.value.some(item => item.product.id === productId)
  }

  /**
   * Obtenir la quantité d'un produit dans le panier
   */
  const getQuantity = (productId: string): number => {
    const item = items.value.find(item => item.product.id === productId)
    return item?.quantity ?? 0
  }

  /**
   * Formater le prix en FCFA
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  /**
   * Générer le message WhatsApp avec les items du panier
   */
  const generateWhatsAppMessage = (): string => {
    if (isEmpty.value) return ''
    
    let message = 'Bonjour Samiah Cosmetics, je souhaite commander :\n\n'
    
    items.value.forEach(item => {
      message += `• ${item.product.title} x${item.quantity} — ${formatPrice(item.product.price * item.quantity)}\n`
    })
    
    message += `\n💰 Total : ${formatPrice(subtotal.value)}`
    
    return encodeURIComponent(message)
  }

  // Charger le panier au montage côté client
  if (import.meta.client) {
    loadFromStorage()
  }

  return {
    // État
    items: readonly(items),
    isOpen,
    
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
    isInCart,
    getQuantity,
    formatPrice,
    generateWhatsAppMessage,
    loadFromStorage,
  }
}
