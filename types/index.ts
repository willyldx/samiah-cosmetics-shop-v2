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
  featured?: boolean
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
export type OrderStatus = 'pending' | 'pending_validation' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
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
  transaction_ref?: string | null
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
  payment_method: PaymentMethod | string
  transaction_ref?: string
  status?: OrderStatus | string
  notes?: string
}

// ==========================================
// CLIENTS
// ==========================================
export interface Client {
  id?: string
  phone: string
  full_name: string
  city: string
  address: string
  created_at?: string
  updated_at?: string
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
  'Abeche',
  'Bongor',
  'Kelo',
  'Pala',
  'Koumra',
  'Faya-Largeau',
  'Am Timan',
  'Mongo',
  'Doba',
  'Ati',
  'Lai',
  'Oum Hadjer',
  'Bitkine',
  'Massaguet',
  'Dourbali',
  'Massakory',
  'Ngama',
  'Bokoro',
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
    'Abeche': 2500,
    'Bongor': 1500,
    'Kelo': 2000,
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
  pending_validation: 'Verif. Paiement',
  confirmed: 'Confirmee',
  shipped: 'Expediee',
  delivered: 'Livree',
  cancelled: 'Annulee',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'yellow',
  pending_validation: 'orange',
  confirmed: 'blue',
  shipped: 'purple',
  delivered: 'green',
  cancelled: 'red',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash a la livraison',
  airtel_money: 'Airtel Money',
  moov_money: 'Moov Money',
  western_union: 'Western Union',
  express_union: 'Express Union',
  moneygram: 'MoneyGram',
}

// ==========================================
// SETTINGS
// ==========================================
export interface HeroSettings {
  title?: string
  subtitle?: string
  description?: string
  image?: string
  consultation_price?: number
  stats_clients?: string
  rating?: number
}
