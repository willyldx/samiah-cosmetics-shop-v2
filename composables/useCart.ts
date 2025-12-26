// ==========================================
// COMPOSABLE: useCart
// Gestion du panier d'achat avec validation
// ==========================================

import type { Product, CartItem } from '~/types'

const CART_STORAGE_KEY = 'samiah_cart'

export const useCart = () => {
  const supabase = useSupabaseClient()
  
  // État réactif du panier
  const items = useState<CartItem[]>('cart-items', () => [])
  const isOpen = useState<boolean>('cart-open', () => false)
  const removedItems = useState<string[]>('cart-removed', () => []) // Produits supprimés lors de la validation

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
  // VALIDATION DU PANIER
  // ==========================================

  /**
   * Valide le panier en vérifiant que tous les produits existent et sont actifs
   * Supprime automatiquement les produits invalides
   */
  const validateCart = async (): Promise<{ valid: boolean; removed: string[] }> => {
    if (items.value.length === 0) {
      return { valid: true, removed: [] }
    }

    const productIds = items.value.map(item => item.product.id)
    const removedProducts: string[] = []

    try {
      // Récupérer les produits actifs depuis Supabase
      const { data: activeProducts, error } = await supabase
        .from('products')
        .select('id, title, price, image, active')
        .in('id', productIds)
        .eq('active', true)

      if (error) {
        console.warn('Erreur validation panier:', error)
        return { valid: true, removed: [] } // En cas d'erreur, on garde le panier tel quel
      }

      const activeProductIds = new Set(activeProducts?.map(p => p.id) || [])

      // Filtrer les items invalides et mettre à jour les prix si nécessaire
      const validItems: CartItem[] = []

      for (const item of items.value) {
        const activeProduct = activeProducts?.find(p => p.id === item.product.id)
        
        if (activeProduct) {
          // Produit valide - mettre à jour les infos (prix, image, etc.)
          validItems.push({
            ...item,
            product: {
              ...item.product,
              price: activeProduct.price,
              image: activeProduct.image,
              title: activeProduct.title,
            }
          })
        } else {
          // Produit supprimé ou désactivé
          removedProducts.push(item.product.title)
        }
      }

      // Mettre à jour le panier si des produits ont été retirés
      if (removedProducts.length > 0) {
        items.value = validItems
        removedItems.value = removedProducts
        saveToStorage()
      }

      return { 
        valid: removedProducts.length === 0, 
        removed: removedProducts 
      }

    } catch (e) {
      console.warn('Erreur validation panier:', e)
      return { valid: true, removed: [] }
    }
  }

  /**
   * Efface la liste des produits supprimés (après affichage de la notification)
   */
  const clearRemovedItems = () => {
    removedItems.value = []
  }

  // ==========================================
  // ACTIONS
  // ==========================================

  /**
   * Ajouter un produit au panier
   */
  const addItem = (product: Product, quantity: number = 1) => {
    // Vérifier que le produit est actif
    if (product.active === false) {
      console.warn('Tentative d\'ajout d\'un produit inactif:', product.title)
      return
    }

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

  const loadFromStorage = async () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            items.value = parsed
            // Valider le panier après chargement
            await validateCart()
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
    removedItems: readonly(removedItems),
    
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
    
    // Validation
    validateCart,
    clearRemovedItems,
    
    // Helpers
    isInCart,
    getQuantity,
    formatPrice,
    generateWhatsAppMessage,
    loadFromStorage,
  }
}
