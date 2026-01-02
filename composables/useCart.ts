// ==========================================
// COMPOSABLE: useCart (Version Flash Cart)
// Le panier s'ouvre et se referme tout seul
// ==========================================

import type { Product, CartItem } from '~/types'

const CART_STORAGE_KEY = 'samiah_cart'

// Variable pour gérer le chrono (en dehors de la fonction pour être unique)
let autoCloseTimer: any = null

export const useCart = () => {
  const supabase = useSupabaseClient()
  const toast = useToast()
  
  // État réactif
  const items = useState<CartItem[]>('cart-items', () => [])
  const isOpen = useState<boolean>('cart-open', () => false)
  const removedItems = useState<string[]>('cart-removed', () => [])

  // ==========================================
  // COMPUTED
  // ==========================================
  
  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))
  const isEmpty = computed(() => items.value.length === 0)

  // ==========================================
  // ACTIONS
  // ==========================================

  const addItem = (product: Product, quantity: number = 1) => {
    // Vérification produit actif
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
    
    // --- LE COMPORTEMENT QUE TU VOULAIS ---
    
    // 1. On ouvre le panier
    isOpen.value = true
    toast.success(`Ajouté : ${product.title}`)
    
    // 2. On annule l'ancien chrono s'il y en avait un (si le client clique vite)
    if (autoCloseTimer) clearTimeout(autoCloseTimer)

    // 3. On lance un nouveau chrono de 2.5 secondes
    autoCloseTimer = setTimeout(() => {
      isOpen.value = false
    }, 2500) 
  }

  const updateQuantity = (productId: string, quantity: number) => {
    // Si l'utilisateur modifie la quantité DANS le panier, on annule la fermeture auto
    // pour ne pas que le panier se ferme pendant qu'il clique sur "+"
    if (autoCloseTimer) clearTimeout(autoCloseTimer)

    const index = items.value.findIndex(item => item.product.id === productId)
    if (index >= 0) {
      if (quantity <= 0) {
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
      const productName = items.value[index].product.title
      items.value.splice(index, 1)
      saveToStorage()
      toast.info(`${productName} retiré`)
    }
  }

  const clearCart = () => {
    items.value = []
    saveToStorage()
  }

  const toggleCart = () => isOpen.value = !isOpen.value
  
  const openCart = () => {
    isOpen.value = true
    // Si on ouvre manuellement, on annule la fermeture auto
    if (autoCloseTimer) clearTimeout(autoCloseTimer)
  }
  
  const closeCart = () => isOpen.value = false

  // ==========================================
  // VALIDATION & SYNC (Ton ancien code conservé)
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

      if (error) return { valid: true, removed: [] }

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
      return { valid: true, removed: [] }
    }
  }

  const clearRemovedItems = () => { removedItems.value = [] }

  // ==========================================
  // PERSISTENCE & HELPERS
  // ==========================================
  const saveToStorage = () => {
    if (import.meta.client) {
      try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value)) } catch (e) {}
    }
  }

  const loadFromStorage = async () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY)
        if (saved) {
          items.value = JSON.parse(saved)
          await validateCart()
        }
      } catch (e) {}
    }
  }

  const isInCart = (productId: string) => items.value.some(item => item.product.id === productId)
  
  const getQuantity = (productId: string) => {
    const item = items.value.find(item => item.product.id === productId)
    return item?.quantity ?? 0
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'

  const generateWhatsAppMessage = () => {
    if (isEmpty.value) return ''
    let message = 'Bonjour Samiah Cosmetics, je souhaite commander :\n\n'
    items.value.forEach(item => {
      message += `• ${item.product.title} x${item.quantity} — ${formatPrice(item.product.price * item.quantity)}\n`
    })
    message += `\n💰 Total : ${formatPrice(subtotal.value)}`
    return encodeURIComponent(message)
  }

  if (import.meta.client) loadFromStorage()

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
