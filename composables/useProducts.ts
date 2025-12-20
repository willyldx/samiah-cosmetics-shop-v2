// ==========================================
// COMPOSABLE: useProducts
// Récupération et gestion des produits
// ==========================================

import type { Product, ProductFilters, SortOption } from '~/types'

export const useProducts = () => {
  const supabase = useSupabaseClient()
  
  // État
  const products = useState<Product[]>('products', () => [])
  const loading = useState<boolean>('products-loading', () => false)
  const error = useState<string | null>('products-error', () => null)

  // ==========================================
  // FETCH ALL PRODUCTS
  // ==========================================
  
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      products.value = data || []
      
    } catch (e: any) {
      console.error('Erreur fetchProducts:', e)
      error.value = e.message || 'Erreur de chargement des produits'
    } finally {
      loading.value = false
    }
  }

  // ==========================================
  // FETCH SINGLE PRODUCT
  // ==========================================
  
  const fetchProduct = async (id: string): Promise<Product | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      
      return data as Product
    } catch (e: any) {
      console.error('Erreur fetchProduct:', e)
      return null
    }
  }

  // ==========================================
  // FILTERING & SORTING
  // ==========================================

  const filterProducts = (
    list: Product[],
    filters: Partial<ProductFilters>
  ): Product[] => {
    let result = [...list]

    // Filtre par recherche
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        (p.category?.toLowerCase().includes(q)) ||
        (p.short_description?.toLowerCase().includes(q))
      )
    }

    // Filtre par catégorie
    if (filters.category && filters.category !== 'Toutes') {
      result = result.filter(p => p.category === filters.category)
    }

    // Filtre par ville
    if (filters.city && filters.city !== 'Toutes') {
      result = result.filter(p => p.cities?.includes(filters.city!))
    }

    // Tri
    if (filters.sort) {
      result = sortProducts(result, filters.sort)
    }

    return result
  }

  const sortProducts = (list: Product[], sort: SortOption): Product[] => {
    const sorted = [...list]
    
    switch (sort) {
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      case 'oldest':
        return sorted.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'title_asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case 'title_desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title))
      default:
        return sorted
    }
  }

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = computed(() => {
    const cats = new Set<string>()
    products.value.forEach(p => {
      if (p.category) cats.add(p.category)
    })
    return ['Toutes', ...Array.from(cats).sort()]
  })

  // ==========================================
  // HELPERS
  // ==========================================

  const buildGallery = (product: Product): string[] => {
    const gallery: string[] = []
    
    if (product.image) gallery.push(product.image)
    if (product.images?.length) gallery.push(...product.images)
    
    return [...new Set(gallery)]
  }

  const isNewProduct = (product: Product): boolean => {
    if (!product.created_at) return false
    const created = Date.parse(product.created_at)
    const twoDays = 2 * 24 * 60 * 60 * 1000
    return (Date.now() - created) <= twoDays
  }

  return {
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    fetchProducts,
    fetchProduct,
    filterProducts,
    sortProducts,
    categories,
    buildGallery,
    isNewProduct,
  }
}
