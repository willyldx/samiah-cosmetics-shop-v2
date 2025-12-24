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
    '@nuxtjs/sitemap',
    '@vite-pwa/nuxt',
  ],

  // ==========================================
  // CONFIGURATION PWA
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
      display: 'standalone',
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
      // Tarte : J'ai mis un titre plus court et percutant pour qu'il ne soit pas coupé sur mobile
      title: 'Samiah Cosmetics : Soins Capillaires au Tchad',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Consultation capillaire en ligne et produits cosmétiques au Tchad. Réservez via WhatsApp.' },
        { name: 'theme-color', content: '#0A0A0A' },
        
        // Open Graph
        { property: 'og:site_name', content: 'Samiah Cosmetics' }, // <-- IMPORTANT : Nom du site pour Facebook/WhatsApp
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Samiah Cosmetics — Soins Capillaires' },
        { property: 'og:description', content: 'Réservez votre consultation capillaire et découvrez nos shampoings & soins.' },
        { property: 'og:image', content: '/icon-512.png' },
        { property: 'og:locale', content: 'fr_FR' },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate icon', type: 'image/png', href: '/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/icon-192.png' },
        { rel: 'preconnect', href: 'https://dzzblqlteirtzyegplgu.supabase.co', crossorigin: '' },
      ],
      // === DONNÉES STRUCTURÉES (JSON-LD) ===
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([
            // 1. L'ORGANISATION (Pour le Logo et les infos de contact)
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Samiah Cosmetics",
              "url": "https://www.samiahcosmetics.shop",
              "logo": "https://www.samiahcosmetics.shop/icon-512.png",
              "sameAs": [
                "https://facebook.com/samiahcosmetics",
                "https://instagram.com/samiahcosmetics"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+235-62-75-21-05",
                "contactType": "customer service",
                "areaServed": "TD"
              }
            },
            // 2. LE SITE WEB (C'est ICI qu'on force le nom "Samiah Cosmetics" sur Google)
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Samiah Cosmetics",
              "alternateName": ["Samiah Cosmétique", "Samiah Tchad"], // Google comprendra aussi ces recherches
              "url": "https://www.samiahcosmetics.shop"
            }
          ])
        }
      ]
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
    '/': { isr: 300 },
    '/produits': { isr: 300 },
    '/produits/**': { isr: 300 },
    '/a-propos': { isr: 3600 },
    '/panier': { ssr: true },
    '/commander': { ssr: true },
    '/commande/**': { ssr: true },
    '/admin': { ssr: false },
    '/admin/**': { ssr: false },
    '/api/**': { 
      cors: true,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    },
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
          entryFileNames: '_nuxt/[name].[hash].js',
          chunkFileNames: '_nuxt/[name].[hash].js',
          assetFileNames: '_nuxt/[name].[hash].[ext]',
        },
      },
    },
  },

  nitro: {
    preset: 'vercel',
    compressPublicAssets: true,
  },

  typescript: {
    strict: false,
    typeCheck: false,
  },

  experimental: {
    payloadExtraction: true,
    typedPages: true,
  },

  compatibilityDate: '2024-04-03',
})
