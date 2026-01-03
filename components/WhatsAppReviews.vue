<template>
  <section class="py-16 bg-[#ECE5DD] overflow-hidden">
    <div class="max-w-6xl mx-auto px-4">
      
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          Avis WhatsApp vérifiés
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-[#111B21] mb-3">
          Elles nous font confiance 💖
        </h2>
        <p class="text-[#667781] max-w-xl mx-auto">
          Déjà plus de 500 clientes satisfaites. Voici leurs vrais messages après réception de leurs colis.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center">
        <div class="bg-white rounded-xl p-6 animate-pulse w-full max-w-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div class="h-24 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      <!-- Carousel -->
      <div v-else-if="testimonials.length > 0" class="relative">
        
        <!-- Navigation Arrows -->
        <button 
          @click="prevSlide" 
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#008069] hover:bg-[#008069] hover:text-white transition-all duration-300 -ml-2 md:-ml-5"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
          :disabled="currentIndex === 0"
        >
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <button 
          @click="nextSlide" 
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#008069] hover:bg-[#008069] hover:text-white transition-all duration-300 -mr-2 md:-mr-5"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex >= maxIndex }"
          :disabled="currentIndex >= maxIndex"
        >
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Carousel Container -->
        <div 
          ref="carouselRef"
          class="overflow-hidden mx-6 md:mx-8"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div 
            class="flex transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(-${currentIndex * slideWidth}%)` }"
          >
            <article
              v-for="(testimonial, index) in testimonials"
              :key="testimonial.id"
              class="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
            >
              <!-- WhatsApp Chat Card -->
              <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                
                <!-- Chat Header -->
                <div class="bg-[#008069] px-4 py-3 flex items-center gap-3">
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
                  
                  <svg class="w-6 h-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                </div>

                <!-- Chat Body -->
                <div class="p-4 bg-[#EFEAE2] min-h-[200px] relative" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23d4cfc4&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
                  
                  <!-- Message Bubble -->
                  <div class="bg-white rounded-lg rounded-tl-none p-3 shadow-sm relative max-w-[95%] mb-3">
                    <div class="absolute -left-2 top-0 w-0 h-0 border-t-8 border-t-white border-l-8 border-l-transparent"></div>
                    
                    <p class="text-[#111B21] text-sm leading-relaxed">
                      {{ testimonial.message }}
                    </p>
                    
                    <div class="flex items-center justify-end gap-1 mt-1">
                      <span class="text-[10px] text-[#667781]">{{ formatTime(testimonial.created_at) }}</span>
                      <svg class="w-4 h-4 text-[#53BDEB]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.53 8.47a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l2.47 2.47 5.47-5.47a.75.75 0 0 1 1.06 0z"/>
                        <path d="M12.53 14.47l5.47-5.47a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-1.06 0l-.5-.5 1.03-1.09z"/>
                      </svg>
                    </div>
                  </div>

                  <!-- Photo Bubble (Clickable) -->
                  <div 
                    v-if="getPhotoUrl(testimonial)" 
                    class="bg-white rounded-lg rounded-tl-none p-1.5 shadow-sm relative max-w-[85%] cursor-pointer group"
                    @click="openLightbox(getPhotoUrl(testimonial)!, testimonial.client_name)"
                  >
                    <div class="absolute -left-2 top-0 w-0 h-0 border-t-8 border-t-white border-l-8 border-l-transparent"></div>
                    <div class="relative rounded-md overflow-hidden">
                      <img 
                        :src="getPhotoUrl(testimonial)" 
                        :alt="'Photo de ' + testimonial.client_name"
                        class="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <!-- Overlay on hover -->
                      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div class="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg class="w-5 h-5 text-[#008069]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                          </svg>
                        </div>
                      </div>
                      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p class="text-white text-xs font-medium">📦 Colis reçu ✨</p>
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
                  <span class="text-xs text-[#667781]">Cliente vérifiée</span>
                </div>

              </div>
            </article>
          </div>
        </div>

        <!-- Dots Navigation -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="(_, index) in dotCount"
            :key="index"
            @click="goToSlide(index)"
            class="w-2.5 h-2.5 rounded-full transition-all duration-300"
            :class="currentIndex === index ? 'bg-[#008069] w-8' : 'bg-[#008069]/30 hover:bg-[#008069]/50'"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-2xl p-12 text-center max-w-md mx-auto">
        <div class="w-20 h-20 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
        </div>
        <p class="text-[#667781]">Les témoignages arrivent bientôt...</p>
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
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>

    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div 
          v-if="lightboxOpen" 
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          @click="closeLightbox"
        >
          <!-- Close button -->
          <button 
            class="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            @click="closeLightbox"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Image container -->
          <div 
            class="relative max-w-4xl w-full"
            @click.stop
          >
            <!-- WhatsApp style header -->
            <div class="bg-[#008069] px-4 py-3 rounded-t-xl flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center text-white font-bold">
                {{ lightboxName ? lightboxName.charAt(0).toUpperCase() : '?' }}
              </div>
              <div>
                <p class="font-medium text-white">{{ lightboxName }}</p>
                <p class="text-[#8EBDB6] text-xs">Photo du colis reçu</p>
              </div>
            </div>

            <!-- Image -->
            <div class="bg-[#EFEAE2] p-4 rounded-b-xl">
              <img 
                :src="lightboxImage!" 
                :alt="lightboxName || 'Témoignage'"
                class="w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
              <p class="text-center text-[#667781] text-sm mt-3">📦 Colis reçu avec succès ✨</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </section>
</template>

<script setup lang="ts">
interface Testimonial {
  id: string
  client_name: string
  city: string | null
  rating: number | null
  message: string
  photo_url: string | null
  photos?: string[]
  active: boolean
  created_at: string
}

const config = useRuntimeConfig()
const supabase = useSupabaseClient()

const testimonials = ref<Testimonial[]>([])
const loading = ref(true)
const currentIndex = ref(0)
const carouselRef = ref<HTMLElement | null>(null)

// Touch handling
const touchStartX = ref(0)
const touchEndX = ref(0)

// Lightbox state
const lightboxOpen = ref(false)
const lightboxImage = ref<string | null>(null)
const lightboxName = ref<string | null>(null)

// Responsive slide width
const slideWidth = computed(() => {
  if (typeof window === 'undefined') return 100
  if (window.innerWidth >= 1024) return 33.333 // lg: 3 cards
  if (window.innerWidth >= 768) return 50 // md: 2 cards
  return 100 // mobile: 1 card
})

const slidesPerView = computed(() => {
  if (typeof window === 'undefined') return 1
  if (window.innerWidth >= 1024) return 3
  if (window.innerWidth >= 768) return 2
  return 1
})

const maxIndex = computed(() => Math.max(0, testimonials.value.length - slidesPerView.value))

const dotCount = computed(() => maxIndex.value + 1)

// Fetch testimonials
const fetchTestimonials = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(9)

    if (error) throw error
    testimonials.value = data || []
  } catch (e) {
    console.error('Error fetching testimonials:', e)
  } finally {
    loading.value = false
  }
}

// Navigation
const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const goToSlide = (index: number) => {
  currentIndex.value = Math.min(index, maxIndex.value)
}

// Touch handlers for swipe
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchMove = (e: TouchEvent) => {
  touchEndX.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  const diff = touchStartX.value - touchEndX.value
  const threshold = 50

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }
}

// Lightbox
const openLightbox = (imageUrl: string, name: string) => {
  lightboxImage.value = imageUrl
  lightboxName.value = name
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

// Handle ESC key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && lightboxOpen.value) {
    closeLightbox()
  }
}

// Avatar colors
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
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Lightbox transitions */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-active .relative,
.lightbox-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.lightbox-enter-from .relative,
.lightbox-leave-to .relative {
  transform: scale(0.9);
  opacity: 0;
}
</style>
