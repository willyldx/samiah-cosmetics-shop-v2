<template>
  <section class="py-24 bg-white overflow-hidden border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4">
      
      <!-- Header -->
      <div class="text-center mb-16">
        <span class="inline-flex items-center gap-4 text-[10px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-4">
          <span class="w-8 h-px bg-gray-200"></span>
          Témoignages
          <span class="w-8 h-px bg-gray-200"></span>
        </span>
        <h2 class="text-3xl lg:text-4xl font-serif font-light text-charcoal mb-4">
          L'expérience Samiah
        </h2>
        <p class="text-gray-500 font-light max-w-xl mx-auto text-sm">
          Découvrez les retours authentiques de notre clientèle.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center">
        <div class="border border-gray-100 p-8 animate-pulse w-full max-w-sm">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 bg-gray-100 rounded-full"></div>
            <div class="flex-1">
              <div class="h-3 bg-gray-100 w-24 mb-3"></div>
              <div class="h-2 bg-gray-100 w-16"></div>
            </div>
          </div>
          <div class="h-24 bg-gray-50"></div>
        </div>
      </div>

      <!-- Carousel -->
      <div v-else-if="testimonials.length > 0" class="relative">
        
        <!-- Navigation Arrows -->
        <button 
          @click="prevSlide" 
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border border-gray-200 flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-300 -ml-4 lg:-ml-6"
          :class="{ 'opacity-0 invisible': currentIndex === 0 }"
          :disabled="currentIndex === 0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <button 
          @click="nextSlide" 
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border border-gray-200 flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-300 -mr-4 lg:-mr-6"
          :class="{ 'opacity-0 invisible': currentIndex >= maxIndex }"
          :disabled="currentIndex >= maxIndex"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Carousel Container -->
        <div 
          ref="carouselRef"
          class="overflow-hidden mx-4 md:mx-8"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div 
            class="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            :style="{ transform: `translateX(-${currentIndex * slideWidth}%)` }"
          >
            <article
              v-for="testimonial in testimonials"
              :key="testimonial.id"
              class="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4"
            >
              <!-- Minimalist Review Card -->
              <div class="bg-gray-50 p-8 h-full flex flex-col group transition-colors duration-500 hover:bg-gray-100">
                
                <!-- Rating -->
                <div v-if="testimonial.rating" class="flex items-center gap-1 mb-6">
                  <svg v-for="star in 5" :key="star" class="w-3 h-3" :class="star <= testimonial.rating ? 'text-gold' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>

                <!-- Message -->
                <p class="text-charcoal font-serif text-lg leading-relaxed mb-8 flex-1 italic">
                  "{{ testimonial.message }}"
                </p>

                <!-- Photo (Optional) -->
                <div 
                  v-if="getPhotoUrl(testimonial)" 
                  class="mb-8 cursor-pointer overflow-hidden rounded-sm relative aspect-video"
                  @click="openLightbox(getPhotoUrl(testimonial)!, testimonial.client_name)"
                >
                  <img 
                    :src="getPhotoUrl(testimonial)" 
                    :alt="'Photo de ' + testimonial.client_name"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span class="text-white text-[10px] tracking-[0.2em] uppercase font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Agrandir</span>
                  </div>
                </div>

                <!-- Client Info -->
                <div class="flex items-center gap-4 mt-auto border-t border-gray-200 pt-6">
                  <div class="w-10 h-10 border border-gray-300 flex items-center justify-center text-charcoal font-serif text-sm flex-shrink-0">
                    {{ getInitial(testimonial.client_name) }}
                  </div>
                  
                  <div>
                    <p class="font-medium text-charcoal text-sm uppercase tracking-wider">{{ testimonial.client_name }}</p>
                    <p class="text-gray-400 text-[10px] tracking-[0.2em] uppercase mt-1">
                      {{ testimonial.city || 'Tchad' }}
                    </p>
                  </div>
                </div>

              </div>
            </article>
          </div>
        </div>

        <!-- Progress Bar Indicator instead of dots -->
        <div class="mt-12 flex justify-center">
          <div class="flex gap-2">
            <button
              v-for="(_, index) in dotCount"
              :key="index"
              @click="goToSlide(index)"
              class="h-px transition-all duration-300"
              :class="currentIndex === index ? 'w-8 bg-charcoal' : 'w-4 bg-gray-200 hover:bg-gray-400'"
              aria-label="Aller à la diapositive"
            ></button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="py-12 text-center">
        <p class="text-gray-400 font-light text-sm">Les témoignages arrivent bientôt.</p>
      </div>

    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div 
          v-if="lightboxOpen" 
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white"
          @click="closeLightbox"
        >
          <!-- Close button -->
          <button 
            class="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-charcoal hover:text-gold transition-colors"
            @click="closeLightbox"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Image container -->
          <div class="relative max-w-5xl w-full" @click.stop>
            <img 
              :src="lightboxImage!" 
              :alt="lightboxName || 'Témoignage'"
              class="w-full max-h-[80vh] object-contain"
            />
            <p class="text-center text-gray-500 font-light text-sm mt-6 uppercase tracking-widest">
              {{ lightboxName }}
            </p>
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
