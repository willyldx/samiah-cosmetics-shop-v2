// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // ==========================================
  // MODULES
  // ==========================================
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap', // Module ajouté pour le référencement Google
    '@vite-pwa/nuxt',  // <--- AJOUTÉ : Module pour l'Application Mobile
  ],

  // ==========================================
  // CONFIGURATION PWA (APPLICATION MOBILE)
  // ==========================================
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Samiah Cosmetics',
      short_name: 'Samiah',
      description: 'Consultation capillaire et produits cosmétiques au Tchad.',
      theme_color: '#0A0A0A',
      background_color: '#ffffff',
      lang: 'fr',
      display: 'standalone', // Cache la barre d'adresse pour faire "App Native"
      orientation: 'portrait',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true,
    },
  },

  // ==========================================
  // SITE CONFIGURATION (SEO)
  // ==========================================
  site: {
    url: 'https://www.samiahcosmetics.shop',
  },

  // ==========================================
  // APP CONFIGURATION
  // ==========================================
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Samiah Cosmetics — Consultation capillaire & produits',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Consultation capillaire en ligne et produits cosmétiques au Tchad. Réservez via WhatsApp.' },
        { name: 'theme-color', content: '#0A0A0A' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Samiah Cosmetics — Consultation capillaire & produits' },
        { property: 'og:description', content: 'Réservez votre consultation capillaire et découvrez nos shampoings & soins.' },
        { property: 'og:image', content: '/images/og-image.jpg' },
        { property: 'og:locale', content: 'fr_FR' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/icon-192.png' }, // Mis à jour pour pointer vers l'icône mobile
        { rel: 'preconnect', href: 'https://dzzblqlteirtzyegplgu.supabase.co', crossorigin: '' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  // ==========================================
  // SUPABASE CONFIGURATION
  // ==========================================
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '/admin/login',
      callback: '/admin',
      exclude: ['/', '/produits', '/produits/*', '/panier', '/commander', '/a-propos', '/commande/*', '/cgv', '/mentions-legales'],
    },
  },

  // ==========================================
  // IMAGE OPTIMIZATION
  // ==========================================
  image: {
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    domains: ['dzzblqlteirtzyegplgu.supabase.co'],
    alias: {
      supabase: 'https://dzzblqlteirtzyegplgu.supabase.co/storage/v1/object/public',
    },
  },

  // ==========================================
  // RUNTIME CONFIG
  // ==========================================
  runtimeConfig: {
    // Secrets (server only)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    adminSecret: process.env.ADMIN_SECRET,
    // Public (client + server)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://dzzblqlteirtzyegplgu.supabase.co',
      supabaseKey: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6emJscWx0ZWlydHp5ZWdwbGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MjgyMDgsImV4cCI6MjA3NTAwNDIwOH0.WbjNAjF2qxly8QMu-3VJLPQE88UgzkeAn9XPj0lcb1Y',
      whatsappNumber: '23562752105',
      siteName: 'Samiah Cosmetics',
      siteUrl: process.env.SITE_URL || 'https://samiahcosmetics.shop',
    },
  },

  // ==========================================
  // ROUTE RULES (CACHE OPTIMIZATION)
  // ==========================================
  routeRules: {
    // Pages publiques : ISR (cache 5 min, revalidation en arrière-plan)
    '/': { isr: 300 },
    '/produits': { isr: 300 },
    '/produits/**': { isr: 300 },
    '/a-propos': { isr: 3600 },
    
    // Panier et commande : pas de cache (dynamique)
    '/panier': { ssr: true },
    '/commander': { ssr: true },
    '/commande/**': { ssr: true },
    
    // Admin : côté client uniquement (protégé)
    '/admin': { ssr: false },
    '/admin/**': { ssr: false },
    
    // API : jamais de cache
    '/api/**': { 
      cors: true,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    },
    
    // Assets statiques : cache long avec hash (géré par Vite)
    '/_nuxt/**': {
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
  },

  // ==========================================
  // BUILD OPTIMIZATION
  // ==========================================
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Hash unique pour chaque fichier = pas de problème de cache
          entryFileNames: '_nuxt/[name].[hash].js',
          chunkFileNames: '_nuxt/[name].[hash].js',
          assetFileNames: '_nuxt/[name].[hash].[ext]',
        },
      },
    },
  },

  // ==========================================
  // NITRO (SERVER)
  // ==========================================
  nitro: {
    preset: 'vercel',
    compressPublicAssets: true,
  },

  // ==========================================
  // TYPESCRIPT
  // ==========================================
  typescript: {
    strict: false,
    typeCheck: false,
  },

  // ==========================================
  // EXPERIMENTAL
  // ==========================================
  experimental: {
    payloadExtraction: true,
    typedPages: true,
  },

  compatibilityDate: '2024-04-03',
})
