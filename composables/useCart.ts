// ==========================================
// COMPOSABLE: useCart (Version Hybride Pro + Luxe)
// Gestion du panier avec Supabase + UX 2026
// ==========================================

import type { Product, CartItem } from '~/types'

const CART_STORAGE_KEY = 'samiah_cart'

export const useCart = () => {
  const supabase = useSupabaseClient()
  // AJOUT : Système de notification
  const toast = useToast() 
  
  // État réactif du panier (Partagé via useState de Nuxt)
  const items = useState<CartItem[]>('cart-items', () => [])
  const isOpen = useState<boolean>('cart-open', () => false)
  const removedItems = useState<string[]>('cart-removed', () => []) 

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
  // VALIDATION DU PANIER (Logique Avancée)
  // ==========================================

  const validateCart = async (): Promise<{ valid: boolean; removed: string[] }> => {
    if (items.value.length === 0) return { valid: true, removed: [] }

    const productIds = items.value.map(item => item.product.id)
    const removedProducts: string[] = []

    try {
      const { data: activeProducts, error } = await supabase
        .from('products')
        .select('id, title, price, image, active')
        .in('id', productIds)
        .eq('active', true)

      if (error) {
        console.warn('Erreur validation panier:', error)
        return { valid: true, removed: [] }
      }

      const validItems: CartItem[] = []

      for (const item of items.value) {
        const activeProduct = activeProducts?.find(p => p.id === item.product.id)
        
        if (activeProduct) {
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
          removedProducts.push(item.product.title)
        }
      }

      if (removedProducts.length > 0) {
        items.value = validItems
        removedItems.value = removedProducts
        saveToStorage()
      }

      return { valid: removedProducts.length === 0, removed: removedProducts }

    } catch (e) {
      console.warn('Erreur validation panier:', e)
      return { valid: true, removed: [] }
    }
  }

  const clearRemovedItems = () => {
    removedItems.value = []
  }

  // ==========================================
  // ACTIONS
  // ==========================================

  const addItem = (product: Product, quantity: number = 1) => {
    if (product.active === false) {
      toast.error("Ce produit n'est plus disponible")
      return
    }

    const existingIndex = items.value.findIndex(item => item.product.id === product.id)
    
    if (existingIndex >= 0) {
      items.value[existingIndex].quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
    
    saveToStorage()
    
    // UX AMÉLIORÉE : On ouvre et on notifie
    isOpen.value = true
    toast.success(`Ajouté : ${product.title}`)
    
    // J'ai retiré le setTimeout qui refermait le panier (c'est mieux pour l'UX)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const index = items.value.findIndex(item => item.product.id === productId)
    
    if (index >= 0) {
      if (quantity <= 0) {
        // On redirige vers removeItem pour avoir le toast
        removeItem(productId)
      } else {
        items.value[index].quantity = quantity
        saveToStorage()
      }
    }
  }

  const removeItem = (productId: string) => {
    const index = items.value.findIndex(item => item.product.id === productId)
    if (index >= 0) {
      // UX AMÉLIORÉE : On récupère le nom pour le message
      const productName = items.value[index].product.title
      
      items.value.splice(index, 1)
      saveToStorage()
      
      // On notifie l'utilisateur
      toast.info(`${productName} retiré du panier`)
    }
  }

  const clearCart = () => {
    items.value = []
    saveToStorage()
  }

  const toggleCart = () => isOpen.value = !isOpen.value
  const openCart = () => isOpen.value = true
  const closeCart = () => isOpen.value = false

  // ==========================================
  // PERSISTENCE
  // ==========================================

  const saveToStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
      } catch (e) { console.warn(e) }
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
            // On valide silencieusement au chargement
            await validateCart()
          }
        }
      } catch (e) { console.warn(e) }
    }
  }

  // ==========================================
  // HELPERS
  // ==========================================

  const isInCart = (productId: string): boolean => {
    return items.value.some(item => item.product.id === productId)
  }

  const getQuantity = (productId: string): number => {
    const item = items.value.find(item => item.product.id === productId)
    return item?.quantity ?? 0
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const generateWhatsAppMessage = (): string => {
    if (isEmpty.value) return ''
    let message = 'Bonjour Samiah Cosmetics, je souhaite commander :\n\n'
    items.value.forEach(item => {
      message += `• ${item.product.title} x${item.quantity} — ${formatPrice(item.product.price * item.quantity)}\n`
    })
    message += `\n💰 Total : ${formatPrice(subtotal.value)}`
    return encodeURIComponent(message)
  }

  // Chargement initial
  if (import.meta.client) {
    loadFromStorage()
  }

  return {
    items: readonly(items),
    isOpen,
    removedItems: readonly(removedItems),
    itemCount,
    subtotal,
    isEmpty,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    validateCart,
    clearRemovedItems,
    isInCart,
    getQuantity,
    formatPrice,
    generateWhatsAppMessage,
    loadFromStorage,
  }
}
