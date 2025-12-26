<template>
  <div class="min-h-screen relative overflow-hidden flex">
    <!-- Background avec motif et gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-charcoal via-gray-900 to-charcoal">
      <!-- Cercles décoratifs animés -->
      <div class="absolute top-1/4 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 -right-20 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      
      <!-- Motif grille subtil -->
      <div class="absolute inset-0 opacity-5" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23D4AF37&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 flex items-center justify-center w-full p-4">
      <div class="w-full max-w-md">
        
        <!-- Card de connexion avec effet glassmorphism -->
        <div class="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/10">
          
          <!-- Header avec logo animé -->
          <div class="text-center mb-8">
            <div class="relative inline-block">
              <!-- Halo animé derrière le logo -->
              <div class="absolute inset-0 bg-gold/30 rounded-2xl blur-xl animate-pulse"></div>
              
              <!-- Logo -->
              <div class="relative w-20 h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform hover:scale-105 transition-transform duration-300">
                <span class="text-charcoal font-bold text-3xl">S</span>
              </div>
            </div>
            
            <h1 class="text-3xl font-bold text-white mt-6 tracking-tight">
              Espace Admin
            </h1>
            <p class="text-white/50 mt-2 text-sm">
              Gérez votre boutique Samiah Cosmetics
            </p>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            
            <!-- Email -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white/70">
                Adresse email
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-white/30 group-focus-within:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <input
                  v-model="email"
                  type="email"
                  placeholder="admin@samiah.com"
                  required
                  class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:bg-white/10 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 outline-none transition-all duration-300"
                  :class="{ 'border-red-500/50 bg-red-500/5': error }"
                />
              </div>
            </div>

            <!-- Mot de passe -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white/70">
                Mot de passe
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-white/30 group-focus-within:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                  class="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:bg-white/10 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 outline-none transition-all duration-300"
                  :class="{ 'border-red-500/50 bg-red-500/5': error }"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors"
                >
                  <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div v-if="error" class="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ error }}
              </div>
            </Transition>

            <!-- Bouton de connexion -->
            <button
              type="submit"
              :disabled="loading"
              class="relative w-full group overflow-hidden"
            >
              <!-- Background animé -->
              <div class="absolute inset-0 bg-gradient-to-r from-gold via-yellow-500 to-gold bg-[length:200%_100%] group-hover:animate-shimmer rounded-xl"></div>
              
              <!-- Contenu du bouton -->
              <div class="relative flex items-center justify-center gap-2 py-3.5 font-bold text-charcoal rounded-xl transition-all">
                <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="loading">Connexion en cours...</span>
                <span v-else>Se connecter</span>
                <svg v-if="!loading" class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </div>
            </button>
          </form>

          <!-- Séparateur -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-white/10"></div>
            <span class="text-white/30 text-xs uppercase tracking-wider">Samiah Cosmetics</span>
            <div class="flex-1 h-px bg-white/10"></div>
          </div>

          <!-- Lien retour -->
          <NuxtLink 
            to="/" 
            class="flex items-center justify-center gap-2 text-white/40 hover:text-white text-sm transition-all duration-300 group"
          >
            <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Retour à la boutique
          </NuxtLink>
        </div>

        <!-- Footer -->
        <p class="text-center text-white/20 text-xs mt-6">
          © {{ new Date().getFullYear() }} Samiah Cosmetics. Tous droits réservés.
        </p>
      </div>
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
        error.value = 'Email ou mot de passe incorrect'
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

<style scoped>
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.group:hover .group-hover\:animate-shimmer {
  animation: shimmer 2s linear infinite;
}
</style>
