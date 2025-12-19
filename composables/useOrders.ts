// ==========================================
// COMPOSABLE: useOrders
// Gestion des commandes
// ==========================================

import type { 
  Order, 
  CreateOrderPayload, 
  OrderStatus, 
  PaymentMethod,
  ShippingConfig,
  DEFAULT_SHIPPING_CONFIG 
} from '~/types'

export const useOrders = () => {
  const supabase = useSupabaseClient()
  const config = useRuntimeConfig()
  
  // ==========================================
  // SHIPPING CONFIG
  // ==========================================
  
  const shippingConfig: ShippingConfig = {
    default_fee: 1500,
    free_threshold: 20000,
    fees_by_city: {
      "N'Djamena": 1000,
      'Moundou': 2000,
      'Sarh': 2000,
      'Abéché': 2500,
      'Bongor': 1500,
      'Kélo': 2000,
      'Pala': 2000,
      'Koumra': 2000,
      'Faya-Largeau': 3000,
    },
  }

  // ==========================================
  // CALCULATE SHIPPING
  // ==========================================

  const calculateShipping = (city: string, subtotal: number): number => {
    // Livraison gratuite si > seuil
    if (subtotal >= shippingConfig.free_threshold) {
      return 0
    }
    
    // Frais par ville ou défaut
    return shippingConfig.fees_by_city[city] ?? shippingConfig.default_fee
  }

  // ==========================================
  // GENERATE ORDER NUMBER
  // ==========================================

  const generateOrderNumber = (): string => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    
    return `SC${year}${month}${day}-${random}`
  }

  // ==========================================
  // CREATE ORDER
  // ==========================================

  const createOrder = async (payload: CreateOrderPayload): Promise<{ order: Order | null; error: string | null }> => {
    try {
      // 1. Récupérer les produits pour calculer les prix
      const productIds = payload.items.map(item => item.product_id)
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, title, price')
        .in('id', productIds)

      if (productsError) throw productsError

      // 2. Construire les items de la commande
      const orderItems = payload.items.map(item => {
        const product = productsData?.find((p: any) => p.id === item.product_id)
        if (!product) throw new Error(`Produit ${item.product_id} introuvable`)
        
        return {
          product_id: product.id,
          product_title: product.title,
          product_price: product.price,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        }
      })

      // 3. Calculer les totaux
      const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
      const shippingFee = calculateShipping(payload.client_city, subtotal)
      const total = subtotal + shippingFee

      // 4. Créer la commande
      const orderNumber = generateOrderNumber()
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          client_name: payload.client_name,
          client_phone: payload.client_phone,
          client_city: payload.client_city,
          client_address: payload.client_address,
          items: orderItems,
          subtotal,
          shipping_fee: shippingFee,
          total,
          payment_method: payload.payment_method,
          status: 'pending' as OrderStatus,
          notes: payload.notes || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      return { order: orderData as Order, error: null }
      
    } catch (e: any) {
      console.error('Erreur createOrder:', e)
      return { order: null, error: e.message || 'Erreur lors de la création de la commande' }
    }
  }

  // ==========================================
  // FETCH ORDER BY ID
  // ==========================================

  const fetchOrder = async (id: string): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Order
    } catch (e) {
      console.error('Erreur fetchOrder:', e)
      return null
    }
  }

  // ==========================================
  // FETCH ORDER BY NUMBER
  // ==========================================

  const fetchOrderByNumber = async (orderNumber: string): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single()

      if (error) throw error
      return data as Order
    } catch (e) {
      console.error('Erreur fetchOrderByNumber:', e)
      return null
    }
  }

  // ==========================================
  // WHATSAPP MESSAGE
  // ==========================================

  const generateWhatsAppOrderMessage = (order: Order): string => {
    const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
    
    let message = `🛒 *Nouvelle commande #${order.order_number}*\n\n`
    message += `👤 *Client:* ${order.client_name}\n`
    message += `📱 *Tél:* ${order.client_phone}\n`
    message += `📍 *Adresse:* ${order.client_address}, ${order.client_city}\n\n`
    message += `📦 *Produits:*\n`
    
    order.items.forEach((item: any) => {
      message += `• ${item.product_title} x${item.quantity} — ${formatPrice(item.subtotal)}\n`
    })
    
    message += `\n💰 Sous-total: ${formatPrice(order.subtotal)}\n`
    message += `🚚 Livraison: ${order.shipping_fee === 0 ? 'GRATUITE' : formatPrice(order.shipping_fee)}\n`
    message += `💵 *TOTAL: ${formatPrice(order.total)}*\n\n`
    
    const paymentLabels: Record<PaymentMethod, string> = {
      cash: '💵 Cash à la livraison',
      airtel_money: '📱 Airtel Money',
      moov_money: '📱 Moov Money',
    }
    message += `💳 *Paiement:* ${paymentLabels[order.payment_method]}`
    
    return encodeURIComponent(message)
  }

  // ==========================================
  // HELPERS
  // ==========================================

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  return {
    // Config
    shippingConfig,
    
    // Actions
    calculateShipping,
    createOrder,
    fetchOrder,
    fetchOrderByNumber,
    
    // Helpers
    generateOrderNumber,
    generateWhatsAppOrderMessage,
    formatPrice,
  }
}
