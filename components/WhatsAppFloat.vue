<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
    
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-10 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-10 opacity-0 scale-95"
    >
      <div 
        v-if="isOpen"
        class="bg-white w-[350px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col origin-bottom-right"
        style="max-height: calc(100dvh - 7rem);"
      >
        <div class="bg-charcoal p-4 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/10">
                <img src="/favicon.svg" alt="Samiah" class="w-full h-full object-cover p-1" />
              </div>
              <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-charcoal rounded-full"></span>
            </div>
            <div>
              <h3 class="font-bold text-white text-sm">Samiah Cosmetics</h3>
              <p class="text-white/60 text-xs">Service Client • En ligne</p>
            </div>
          </div>
          <button @click="toggleChat" class="text-white/50 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div ref="messagesContainer" class="bg-gray-50 flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-0">
          <div class="text-center mb-2">
            <span class="text-[10px] font-medium text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-full">Aujourd'hui</span>
          </div>

          <div class="flex gap-2 max-w-[90%] animate-fade-in-up">
            <div class="w-8 h-8 rounded-full bg-gold/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gold mt-1">SC</div>
            <div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 border border-gray-100">
              Bonjour ! 👋 Bienvenue chez Samiah Cosmetics.
            </div>
          </div>

          <div v-if="showSecondMessage" class="flex gap-2 max-w-[90%] animate-fade-in-up">
            <div class="w-8 h-8 rounded-full bg-gold/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gold mt-1">SC</div>
            <div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 border border-gray-100">
              Que puis-je faire pour vous aujourd'hui ? Avez-vous déjà repéré des produits qui vous intéressent ? 🧴✨
            </div>
          </div>

          <div v-if="!showSecondMessage" class="flex gap-2 ml-10 animate-pulse">
            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div class="w-2 h-2 bg-gray-300 rounded-full animation-delay-200"></div>
            <div class="w-2 h-2 bg-gray-300 rounded-full animation-delay-400"></div>
          </div>

          <div v-if="showSecondMessage" class="flex flex-col items-end gap-2 mt-2 animate-fade-in-up pb-2">
            <button 
              @click="handleAction('products')"
              class="bg-white text-gold border border-gold hover:bg-gold hover:text-white active:bg-gold active:text-white transition-colors text-xs px-4 py-3 rounded-full shadow-sm font-medium text-left flex items-center gap-2"
            >
              <span>Oui, je veux commander 🛍️ </span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
            <button 
              @click="handleAction('advice')"
              class="bg-white text-charcoal border border-gray-200 hover:border-gold hover:text-gold active:bg-gray-50 transition-colors text-xs px-4 py-3 rounded-full shadow-sm font-medium text-left"
            >
              Non, j'ai besoin de conseils 💇🏽‍♀️
            </button>
          </div>
        </div>

        <div class="p-3 bg-white border-t border-gray-100 flex-shrink-0">
          <form @submit.prevent="sendMessage" class="flex items-center gap-2">
            <input 
              v-model="userMessage"
              type="text" 
              placeholder="Écrivez un message..." 
              class="flex-1 bg-gray-100 text-base rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-charcoal placeholder:text-gray-400"
              ref="inputRef"
            >
            <button 
              type="submit"
              :disabled="!userMessage.trim()"
              class="w-10 h-10 rounded-full bg-gold text-charcoal flex items-center justify-center transition-all hover:bg-yellow-400 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <button 
      @click="toggleChat"
      class="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#22c55e] transition-all duration-300 hover:scale-110 active:scale-95"
    >
      <span 
        v-if="!isOpen && !hasSeenChat" 
        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce border-2 border-white"
      >
        1
      </span>
      <svg v-if="!isOpen" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      <svg v-else class="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()
const isOpen = ref(false)
const userMessage = ref('')
const hasSeenChat = ref(false)
const showSecondMessage = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  const seen = localStorage.getItem('chat_seen')
  if (seen) hasSeenChat.value = true

  setTimeout(() => {
    if (!hasSeenChat.value && !isOpen.value) {
      isOpen.value = true
    }
  }, 7000)
})

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasSeenChat.value = true
    localStorage.setItem('chat_seen', 'true')
    
    // Pas de focus automatique pour éviter le saut du clavier
    if (!showSecondMessage.value) {
      setTimeout(() => {
        showSecondMessage.value = true
        setTimeout(() => {
          if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
          }
        }, 100)
      }, 1500)
    }
  }
}

const sendMessage = () => {
  if (!userMessage.value.trim()) return
  redirectToWhatsApp(userMessage.value)
  userMessage.value = ''
}

const handleAction = (type: 'products' | 'advice') => {
  isOpen.value = false
  if (type === 'products') {
    router.push('/produits')
  } else {
    const message = "Je ne sais pas quoi choisir, j'ai besoin de conseils personnalisés. 💇🏽‍♀️"
    redirectToWhatsApp(message)
  }
}

const redirectToWhatsApp = (message: string) => {
  const phone = config.public.whatsappNumber
  const fullMessage = `Bonjour Samiah Cosmetics ! 👋\n${message}`
  const encoded = encodeURIComponent(fullMessage)
  
  isOpen.value = false
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank')
}
</script>

<style scoped>
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-400 { animation-delay: 0.4s; }
</style>
