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
      'Abeche': 2500,
      'Bongor': 1500,
      'Kelo': 2000,
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
    
    // Frais par ville ou defaut
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
      // 1. Recuperer les produits pour calculer les prix
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

      // 4. Creer la commande
      const orderNumber = generateOrderNumber()
      
      // Determiner le statut initial
      const initialStatus = payload.status || 'pending'
      
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
          transaction_ref: payload.transaction_ref || null,
          status: initialStatus as OrderStatus,
          notes: payload.notes || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      return { order: orderData as Order, error: null }
      
    } catch (e: any) {
      console.error('Erreur createOrder:', e)
      return { order: null, error: e.message || 'Erreur lors de la creation de la commande' }
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
  // WHATSAPP MESSAGE (FORMAT PROPRE ASCII)
  // ==========================================

  const generateWhatsAppOrderMessage = (order: Order): string => {
    const formatPriceSimple = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
    
    const paymentLabels: Record<string, string> = {
      cash: 'Cash a la livraison',
      airtel_money: 'Airtel Money',
      moov_money: 'Moov Money',
      western_union: 'Western Union',
      express_union: 'Express Union',
      moneygram: 'MoneyGram',
    }
    
    const lines: string[] = []
    
    lines.push('=============================')
    lines.push('   NOUVELLE COMMANDE')
    lines.push('=============================')
    lines.push('')
    lines.push('Numero: ' + order.order_number)
    lines.push('')
    lines.push('--- INFORMATIONS CLIENT ---')
    lines.push('Nom: ' + order.client_name)
    lines.push('Tel: ' + order.client_phone)
    lines.push('Ville: ' + order.client_city)
    lines.push('Adresse: ' + order.client_address)
    lines.push('')
    lines.push('--- PRODUITS COMMANDES ---')
    
    order.items.forEach((item: any) => {
      lines.push('- ' + item.product_title + ' x' + item.quantity + ' = ' + formatPriceSimple(item.subtotal))
    })
    
    lines.push('')
    lines.push('--- RECAPITULATIF ---')
    lines.push('Sous-total: ' + formatPriceSimple(order.subtotal))
    lines.push('Livraison: ' + (order.shipping_fee === 0 ? 'GRATUITE' : formatPriceSimple(order.shipping_fee)))
    lines.push('TOTAL: ' + formatPriceSimple(order.total))
    lines.push('')
    lines.push('Mode de paiement: ' + (paymentLabels[order.payment_method] || order.payment_method))
    
    if (order.transaction_ref) {
      lines.push('Ref. Transaction: ' + order.transaction_ref)
    }
    
    if (order.notes) {
      lines.push('')
      lines.push('Notes: ' + order.notes)
    }
    
    lines.push('')
    lines.push('=============================')

    return encodeURIComponent(lines.join('\n'))
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
