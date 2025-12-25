<template>
  <section class="py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <span class="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          Avis verifies
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-charcoal mb-4">
          Elles nous font confiance 💖
        </h2>
        <p class="text-gray-500 max-w-2xl mx-auto">
          Deja plus de 500 clientes satisfaites a N'Djamena et en province.
          Voici ce qu'elles disent apres avoir recu leurs colis.
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex gap-6 overflow-x-auto pb-8 px-4">
        <div v-for="i in 3" :key="i" class="min-w-[320px] bg-white rounded-3xl p-6 animate-pulse">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div class="h-20 bg-gray-100 rounded-xl mb-4"></div>
          <div class="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      <!-- Testimonials carousel -->
      <div 
        v-else-if="testimonials.length > 0"
        ref="scrollContainer"
        class="flex gap-6 overflow-x-auto pb-8 px-4 snap-x snap-mandatory no-scrollbar scroll-smooth"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
      >
        <article
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.id"
          class="min-w-[320px] md:min-w-[380px] snap-center flex-shrink-0"
        >
          <div 
            class="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft hover:shadow-medium transition-all duration-300 h-full flex flex-col group"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <!-- Header - Style WhatsApp -->
            <div class="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <!-- Avatar avec initiale -->
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                :class="getAvatarColor(index)"
              >
                {{ getInitial(testimonial.client_name) }}
              </div>
              
              <div class="flex-1">
                <p class="font-bold text-charcoal">{{ testimonial.client_name }}</p>
                <p class="text-xs text-gray-400 flex items-center gap-1">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  {{ testimonial.city || 'Tchad' }}
                </p>
              </div>
              
              <!-- WhatsApp icon -->
              <div class="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </div>
            </div>

            <!-- Rating stars -->
            <div v-if="testimonial.rating" class="flex items-center gap-1 mb-3">
              <span 
                v-for="star in 5" 
                :key="star"
                class="text-lg"
                :class="star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-200'"
              >
                ★
              </span>
            </div>
            
            <!-- Message bubble -->
            <div class="bg-gray-50 p-4 rounded-2xl rounded-tl-none mb-4 flex-1 relative">
              <p class="text-gray-700 text-sm leading-relaxed">
                "{{ testimonial.message }}"
              </p>
              <!-- Bubble tail -->
              <div class="absolute -left-2 top-0 w-4 h-4 bg-gray-50 transform rotate-45"></div>
            </div>

            <!-- Photo if exists -->
            <div 
              v-if="getPhotoUrl(testimonial)" 
              class="relative rounded-xl overflow-hidden aspect-video bg-gray-100 group-hover:shadow-md transition-shadow"
            >
              <img 
                :src="getPhotoUrl(testimonial)" 
                :alt="'Photo de ' + testimonial.client_name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <p class="absolute bottom-2 left-3 text-white text-xs font-medium">
                📦 Colis recu
              </p>
            </div>

            <!-- Date -->
            <p class="text-xs text-gray-400 mt-3 text-right">
              {{ formatDate(testimonial.created_at) }}
            </p>
          </div>
        </article>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <p class="text-gray-500">Les temoignages arrivent bientot...</p>
      </div>

      <!-- Scroll indicators -->
      <div v-if="testimonials.length > 2" class="flex justify-center gap-2 mt-6">
        <button
          v-for="(_, index) in Math.ceil(testimonials.length / 2)"
          :key="index"
          @click="scrollToIndex(index)"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="currentIndex === index ? 'bg-gold w-6' : 'bg-gray-300 hover:bg-gray-400'"
        />
      </div>

      <!-- CTA -->
      <div class="text-center mt-10">
        <a 
          :href="whatsappLink" 
          target="_blank" 
          class="inline-flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-full font-medium hover:bg-black transition-colors group"
        >
          <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
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
const currentIndex = ref(0)
const scrollContainer = ref<HTMLElement | null>(null)

// Drag to scroll
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

// Fetch testimonials from Supabase
const fetchTestimonials = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    testimonials.value = data || []
  } catch (e) {
    console.error('Error fetching testimonials:', e)
  } finally {
    loading.value = false
  }
}

// Avatar colors rotation
const avatarColors = [
  'bg-gradient-to-br from-green-400 to-green-600',
  'bg-gradient-to-br from-purple-400 to-purple-600',
  'bg-gradient-to-br from-blue-400 to-blue-600',
  'bg-gradient-to-br from-pink-400 to-pink-600',
  'bg-gradient-to-br from-orange-400 to-orange-600',
  'bg-gradient-to-br from-teal-400 to-teal-600',
]

const getAvatarColor = (index: number) => avatarColors[index % avatarColors.length]

const getInitial = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : '?'
}

const getPhotoUrl = (testimonial: Testimonial): string | null => {
  if (testimonial.photo_url) return testimonial.photo_url
  if (testimonial.photos && testimonial.photos.length > 0) return testimonial.photos[0]
  return null
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const whatsappLink = computed(() => `https://wa.me/${config.public.whatsappNumber}`)

// Scroll to specific testimonial group
const scrollToIndex = (index: number) => {
  if (!scrollContainer.value) return
  const cardWidth = 400
  scrollContainer.value.scrollTo({
    left: index * cardWidth * 2,
    behavior: 'smooth'
  })
  currentIndex.value = index
}

// Drag to scroll functionality
const startDrag = (e: MouseEvent) => {
  if (!scrollContainer.value) return
  isDragging.value = true
  startX.value = e.pageX - scrollContainer.value.offsetLeft
  scrollLeft.value = scrollContainer.value.scrollLeft
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !scrollContainer.value) return
  e.preventDefault()
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX.value) * 2
  scrollContainer.value.scrollLeft = scrollLeft.value - walk
}

const endDrag = () => {
  isDragging.value = false
}

// Update current index on scroll
const updateCurrentIndex = () => {
  if (!scrollContainer.value) return
  const scrollPos = scrollContainer.value.scrollLeft
  const cardWidth = 400
  currentIndex.value = Math.round(scrollPos / (cardWidth * 2))
}

onMounted(() => {
  fetchTestimonials()
  
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', updateCurrentIndex)
  }
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', updateCurrentIndex)
  }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
