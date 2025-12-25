<template>
  <section class="py-16 bg-[#ECE5DD] overflow-hidden">
    <div class="max-w-6xl mx-auto px-4">
      
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          Avis WhatsApp verifies
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-[#111B21] mb-3">
          Elles nous font confiance 💖
        </h2>
        <p class="text-[#667781] max-w-xl mx-auto">
          Deja plus de 500 clientes satisfaites. Voici leurs vrais messages apres reception de leurs colis.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid md:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-4 animate-pulse">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div class="h-20 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      <!-- Reviews Grid -->
      <div v-else-if="testimonials.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <article
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.id"
          class="group"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- WhatsApp Chat Card -->
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            
            <!-- Chat Header - Like WhatsApp -->
            <div class="bg-[#008069] px-4 py-3 flex items-center gap-3">
              <!-- Avatar -->
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                :class="getAvatarBg(index)"
              >
                {{ getInitial(testimonial.client_name) }}
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="font-medium text-white truncate">{{ testimonial.client_name }}</p>
                <p class="text-[#8EBDB6] text-xs flex items-center gap-1">
                  <span class="w-2 h-2 bg-[#25D366] rounded-full animate-pulse"></span>
                  {{ testimonial.city || 'Tchad' }}
                </p>
              </div>
              
              <!-- WhatsApp icon -->
              <svg class="w-6 h-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
            </div>

            <!-- Chat Body - WhatsApp style background -->
            <div class="p-4 bg-[#EFEAE2] min-h-[180px] relative" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23d4cfc4&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
              
              <!-- Message Bubble -->
              <div class="bg-white rounded-lg rounded-tl-none p-3 shadow-sm relative max-w-[95%] mb-3">
                <!-- Bubble tail -->
                <div class="absolute -left-2 top-0 w-0 h-0 border-t-8 border-t-white border-l-8 border-l-transparent"></div>
                
                <p class="text-[#111B21] text-sm leading-relaxed">
                  {{ testimonial.message }}
                </p>
                
                <!-- Time & checkmarks -->
                <div class="flex items-center justify-end gap-1 mt-1">
                  <span class="text-[10px] text-[#667781]">{{ formatTime(testimonial.created_at) }}</span>
                  <svg class="w-4 h-4 text-[#53BDEB]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.53 8.47a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l2.47 2.47 5.47-5.47a.75.75 0 0 1 1.06 0z"/>
                    <path d="M12.53 14.47l5.47-5.47a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-1.06 0l-.5-.5 1.03-1.09z"/>
                  </svg>
                </div>
              </div>

              <!-- Photo if exists -->
              <div 
                v-if="getPhotoUrl(testimonial)" 
                class="bg-white rounded-lg rounded-tl-none p-1.5 shadow-sm relative max-w-[85%]"
              >
                <div class="absolute -left-2 top-0 w-0 h-0 border-t-8 border-t-white border-l-8 border-l-transparent"></div>
                <div class="relative rounded-md overflow-hidden">
                  <img 
                    :src="getPhotoUrl(testimonial)" 
                    :alt="'Photo de ' + testimonial.client_name"
                    class="w-full h-32 object-cover"
                    loading="lazy"
                  />
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p class="text-white text-xs font-medium">📦 Colis recu ✨</p>
                  </div>
                </div>
                <div class="flex items-center justify-end gap-1 mt-1 px-1">
                  <span class="text-[10px] text-[#667781]">{{ formatTime(testimonial.created_at) }}</span>
                  <svg class="w-4 h-4 text-[#53BDEB]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.53 8.47a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l2.47 2.47 5.47-5.47a.75.75 0 0 1 1.06 0z"/>
                    <path d="M12.53 14.47l5.47-5.47a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-1.06 0l-.5-.5 1.03-1.09z"/>
                  </svg>
                </div>
              </div>

            </div>

            <!-- Rating bar -->
            <div v-if="testimonial.rating" class="bg-white px-4 py-2 border-t border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-1">
                <span 
                  v-for="star in 5" 
                  :key="star"
                  class="text-sm"
                  :class="star <= testimonial.rating ? 'text-[#FFB800]' : 'text-gray-200'"
                >★</span>
              </div>
              <span class="text-xs text-[#667781]">Cliente verifiee</span>
            </div>

          </div>
        </article>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-2xl p-12 text-center max-w-md mx-auto">
        <div class="w-20 h-20 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
        </div>
        <p class="text-[#667781]">Les temoignages arrivent bientot...</p>
      </div>

      <!-- CTA -->
      <div class="text-center mt-10">
        <a 
          :href="whatsappLink" 
          target="_blank" 
          class="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3.5 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          Voir plus d'avis sur WhatsApp
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import type { Testimonial } from '~/types'

const config = useRuntimeConfig()
const supabase = useSupabaseClient()

const testimonials = ref<Testimonial[]>([])
const loading = ref(true)

// Fetch testimonials from Supabase
const fetchTestimonials = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) throw error
    testimonials.value = data || []
  } catch (e) {
    console.error('Error fetching testimonials:', e)
  } finally {
    loading.value = false
  }
}

// Avatar background colors
const avatarBgs = [
  'bg-[#00A884]',
  'bg-[#7C3AED]',
  'bg-[#EC4899]',
  'bg-[#F59E0B]',
  'bg-[#3B82F6]',
  'bg-[#10B981]',
]

const getAvatarBg = (index: number) => avatarBgs[index % avatarBgs.length]

const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : '?'

const getPhotoUrl = (testimonial: Testimonial): string | null => {
  if (testimonial.photo_url) return testimonial.photo_url
  if (testimonial.photos && testimonial.photos.length > 0) return testimonial.photos[0]
  return null
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `${diffDays}j`
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const whatsappLink = computed(() => `https://wa.me/${config.public.whatsappNumber}`)

onMounted(() => {
  fetchTestimonials()
})
</script>
