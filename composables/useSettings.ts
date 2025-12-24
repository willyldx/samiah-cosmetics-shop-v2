// ==========================================
// COMPOSABLE: useSettings
// Gestion des parametres du site (Hero, etc.)
// ==========================================

export interface HeroSettings {
  badge_text: string
  title_line1: string
  title_line2: string
  title_highlight: string
  description: string
  image_url: string
  consultation_price: number
  stats_clients: string
  rating: number
  show_consultation_btn: boolean
  show_products_btn: boolean
}

// Valeurs par defaut (valeurs actuelles du site)
const DEFAULT_HERO_SETTINGS: HeroSettings = {
  badge_text: 'Consultation capillaire en ligne',
  title_line1: 'La nature',
  title_line2: 'à la',
  title_highlight: 'rescousse',
  description: 'Expertise en cosmétiques naturels pour le corps, le visage et les cheveux. Nous allions soins ciblés, ingrédients naturels et accompagnement personnalisé pour sublimer votre beauté au quotidien.',
  image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  consultation_price: 10000,
  stats_clients: '500+',
  rating: 5.0,
  show_consultation_btn: true,
  show_products_btn: true,
}

export const useSettings = () => {
  const supabase = useSupabaseClient()
  
  // State
  const heroSettings = useState<HeroSettings>('hero-settings', () => ({ ...DEFAULT_HERO_SETTINGS }))
  const isLoading = useState<boolean>('settings-loading', () => false)
  const error = useState<string | null>('settings-error', () => null)

  // ==========================================
  // FETCH HERO SETTINGS
  // ==========================================
  
  const fetchHeroSettings = async (): Promise<HeroSettings> => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('value')
        .eq('id', 'hero')
        .single()

      if (fetchError) {
        // Si pas trouve, utiliser les valeurs par defaut
        if (fetchError.code === 'PGRST116') {
          console.log('Hero settings not found, using defaults')
          heroSettings.value = { ...DEFAULT_HERO_SETTINGS }
          return heroSettings.value
        }
        throw fetchError
      }

      // Fusionner avec les defauts pour s'assurer que toutes les cles existent
      heroSettings.value = {
        ...DEFAULT_HERO_SETTINGS,
        ...(data?.value as Partial<HeroSettings>),
      }
      
      return heroSettings.value
    } catch (e: any) {
      console.error('Error fetching hero settings:', e)
      error.value = e.message
      heroSettings.value = { ...DEFAULT_HERO_SETTINGS }
      return heroSettings.value
    } finally {
      isLoading.value = false
    }
  }

  // ==========================================
  // UPDATE HERO SETTINGS
  // ==========================================
  
  const updateHeroSettings = async (newSettings: Partial<HeroSettings>): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    
    try {
      // Fusionner les nouvelles valeurs avec les existantes
      const updatedSettings = {
        ...heroSettings.value,
        ...newSettings,
      }

      const { error: updateError } = await supabase
        .from('settings')
        .upsert({
          id: 'hero',
          value: updatedSettings,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        })

      if (updateError) throw updateError

      heroSettings.value = updatedSettings
      return true
    } catch (e: any) {
      console.error('Error updating hero settings:', e)
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // ==========================================
  // UPLOAD HERO IMAGE
  // ==========================================
  
  const uploadHeroImage = async (file: File): Promise<string | null> => {
    try {
      // Generer un nom unique
      const fileExt = file.name.split('.').pop()
      const fileName = `hero-${Date.now()}.${fileExt}`
      const filePath = `hero/${fileName}`

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // Recuperer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (e: any) {
      console.error('Error uploading hero image:', e)
      error.value = e.message
      return null
    }
  }

  // ==========================================
  // RESET TO DEFAULTS
  // ==========================================
  
  const resetHeroSettings = async (): Promise<boolean> => {
    return await updateHeroSettings(DEFAULT_HERO_SETTINGS)
  }

  // ==========================================
  // HELPERS
  // ==========================================
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  return {
    // State
    heroSettings,
    isLoading,
    error,
    
    // Actions
    fetchHeroSettings,
    updateHeroSettings,
    uploadHeroImage,
    resetHeroSettings,
    
    // Constants
    DEFAULT_HERO_SETTINGS,
    
    // Helpers
    formatPrice,
  }
}
