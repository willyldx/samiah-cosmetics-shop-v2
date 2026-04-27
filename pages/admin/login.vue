<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      
      <!-- Card de connexion -->
      <div class="bg-white border border-gray-200 p-10 shadow-2xl">
        
        <!-- Header -->
        <div class="text-center mb-10">
          <div class="w-12 h-12 bg-charcoal text-white flex items-center justify-center mx-auto mb-6">
            <span class="font-serif font-light text-xl">S'C</span>
          </div>
          
          <h1 class="text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal mb-2">
            Samiah Cosmetics
          </h1>
          <p class="text-sm font-light text-gray-500">
            Espace d'administration
          </p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <!-- Email -->
          <div>
            <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
              Adresse email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="admin@samiah.com"
              required
              class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors"
              :class="{ 'border-red-500 bg-red-50 focus:border-red-500': error }"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
              Mot de passe
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-charcoal text-sm text-charcoal outline-none transition-colors pr-12"
                :class="{ 'border-red-500 bg-red-50 focus:border-red-500': error }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-charcoal transition-colors"
              >
                <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Message d'erreur -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-if="error" class="text-xs text-red-500 text-center tracking-wide">
              {{ error }}
            </div>
          </Transition>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-charcoal text-white text-[10px] uppercase tracking-widest font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-if="loading">Connexion...</span>
            <span v-else>Connexion</span>
          </button>
        </form>

        <!-- Lien retour -->
        <div class="mt-8 text-center border-t border-gray-100 pt-6">
          <NuxtLink 
            to="/" 
            class="inline-flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-400 hover:text-charcoal transition-colors"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Retour à la boutique
          </NuxtLink>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-gray-400 text-[9px] uppercase tracking-widest mt-8">
        © {{ new Date().getFullYear() }} Samiah Cosmetics
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: 'Connexion Admin — Samiah Cosmetics',
})

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (authError) {
      if (authError.message.includes('Invalid login')) {
        error.value = 'Identifiants incorrects'
      } else {
        error.value = authError.message
      }
      return
    }

    router.push('/admin')
  } catch (e: any) {
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>
