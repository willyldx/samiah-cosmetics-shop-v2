export const useSettings = () => {
  const supabase = useSupabaseClient()
  
  const heroSettings = useState<any>('hero-settings', () => ({
    title: 'Révélez la beauté de vos cheveux',
    subtitle: 'Consultation capillaire en ligne',
    description: 'Définition de votre profil capillaire, analyse des problèmes, correction des habitudes et mise en place d une routine personnalisée.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    consultation_price: 10000,
    stats_clients: '500+',
    rating: 5.0
  }))
  
  const loading = useState<boolean>('settings-loading', () => false)

  const fetchHeroSettings = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('id', 'hero')
        .single()

      if (error) throw error
      if (data) {
        heroSettings.value = data.value
      }
    } catch (e) {
      console.error('Error fetching hero settings:', e)
    } finally {
      loading.value = false
    }
  }

  const updateHeroSettings = async (newSettings: any) => {
    try {
      const { error } = await supabase
        .from('settings')
        .update({ 
          value: newSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'hero')

      if (error) throw error
      heroSettings.value = newSettings
      return true
    } catch (e) {
      console.error('Error updating hero settings:', e)
      return false
    }
  }

  return {
    heroSettings,
    loading,
    fetchHeroSettings,
    updateHeroSettings
  }
}
