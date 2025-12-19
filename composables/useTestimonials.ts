// ==========================================
// COMPOSABLE: useTestimonials
// Gestion des témoignages clients
// ==========================================

import type { Testimonial } from '~/types'

export const useTestimonials = () => {
  const supabase = useSupabaseClient()
  
  // État
  const testimonials = useState<Testimonial[]>('testimonials', () => [])
  const loading = useState<boolean>('testimonials-loading', () => false)
  const error = useState<string | null>('testimonials-error', () => null)

  // ==========================================
  // FETCH TESTIMONIALS (Public)
  // ==========================================
  
  const fetchTestimonials = async (limit: number = 10) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('testimonials')
        .select('id, client_name, city, rating, message, photos, photo_url, active, created_at')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (fetchError) throw fetchError
      
      testimonials.value = data as Testimonial[]
      
    } catch (e: any) {
      console.error('Erreur fetchTestimonials:', e)
      error.value = e.message || 'Erreur de chargement des témoignages'
    } finally {
      loading.value = false
    }
  }

  // ==========================================
  // HELPERS
  // ==========================================

  /**
   * Obtenir l'URL de la photo du témoignage
   */
  const getPhotoUrl = (testimonial: Testimonial): string | null => {
    if (testimonial.photo_url) return testimonial.photo_url
    if (testimonial.photos?.length) return testimonial.photos[0]
    return null
  }

  /**
   * Générer les étoiles de notation
   */
  const getRatingStars = (rating: number | null): string => {
    if (!rating || rating < 1 || rating > 5) return ''
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  /**
   * Formater la date
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  }

  return {
    // État
    testimonials: readonly(testimonials),
    loading: readonly(loading),
    error: readonly(error),
    
    // Actions
    fetchTestimonials,
    
    // Helpers
    getPhotoUrl,
    getRatingStars,
    formatDate,
  }
}
