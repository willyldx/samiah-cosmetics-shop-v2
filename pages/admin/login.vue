<template>
  <div class="min-h-screen bg-charcoal flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-charcoal font-bold text-2xl">S</span>
        </div>
        <h1 class="text-2xl font-bold text-white">Samiah Admin</h1>
        <p class="text-white/60 mt-1">Connectez-vous pour gérer votre boutique</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="bg-white rounded-2xl p-8 shadow-xl">
        <div class="space-y-5">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="admin@samiah.com"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              :class="{ 'border-red-500': error }"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Mot de passe
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all pr-12"
                :class="{ 'border-red-500': error }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
            {{ error }}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-charcoal text-white py-3 rounded-xl font-bold hover:bg-charcoal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span v-else>Se connecter</span>
          </button>
        </div>
      </form>

      <!-- Back link -->
      <div class="text-center mt-6">
        <NuxtLink to="/" class="text-white/60 hover:text-white text-sm transition-colors">
          ← Retour au site
        </NuxtLink>
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

    // Redirect to admin dashboard
    router.push('/admin')
  } catch (e: any) {
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>
