// ==========================================
// TYPES SAMIAH COSMETICS
// ==========================================

// ==========================================
// PRODUITS
// ==========================================
export interface Product {
  id: string
  title: string
  price: number
  currency: string
  category: string | null
  short_description: string | null
  image: string | null
  images: string[]
  cities: string[]
  active: boolean
  expires_after_days: number | null
  published_at: string | null
  created_at: string
}

export interface ProductWithImages extends Product {
  product_images?: { url: string; sort: number }[]
}

// ==========================================
// PANIER
// ==========================================
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// ==========================================
// COMMANDES
// ==========================================
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentMethod = 'cash' | 'airtel_money' | 'moov_money' | 'western_union' | 'express_union' | 'moneygram'

export interface OrderItem {
  product_id: string
  product_title: string
  product_price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  order_number: string
  client_name: string
  client_phone: string
  client_city: string
  client_address: string
  items: OrderItem[]
  subtotal: number
  shipping_fee: number
  total: number
  payment_method: PaymentMethod
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CreateOrderPayload {
  client_name: string
  client_phone: string
  client_city: string
  client_address: string
  items: {
    product_id: string
    quantity: number
  }[]
  payment_method: PaymentMethod
  notes?: string
}

// ==========================================
// TÉMOIGNAGES
// ==========================================
export interface Testimonial {
  id: string
  client_name: string
  city: string | null
  rating: number | null
  message: string
  photos: string[] | null
  photo_url: string | null
  active: boolean
  created_at: string
}

// ==========================================
// ADMIN AUTH
// ==========================================
export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'super_admin'
}

// ==========================================
// API RESPONSES
// ==========================================
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// ==========================================
// FILTRES & TRI
// ==========================================
export type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc'

export interface ProductFilters {
  search: string
  category: string | null
  city: string | null
  sort: SortOption
  page: number
  per_page: number
}

// ==========================================
// VILLES DU TCHAD
// ==========================================
export const CHAD_CITIES = [
  "N'Djamena",
  'Moundou',
  'Sarh',
  'Abéché',
  'Bongor',
  'Kélo',
  'Pala',
  'Koumra',
  'Faya-Largeau',
] as const

export type ChadCity = typeof CHAD_CITIES[number]

// ==========================================
// CONFIGURATION LIVRAISON
// ==========================================
export interface ShippingConfig {
  default_fee: number
  free_threshold: number
  fees_by_city: Record<string, number>
}

export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
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
// STATUTS COMMANDE (Labels)
// ==========================================
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'yellow',
  confirmed: 'blue',
  shipped: 'purple',
  delivered: 'green',
  cancelled: 'red',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash à la livraison',
  airtel_money: 'Airtel Money',
  moov_money: 'Moov Money',
  western_union: 'Western Union',
  express_union: 'Express Union',
  moneygram: 'MoneyGram',
}
