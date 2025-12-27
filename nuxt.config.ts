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
      name: 'Samiah Cosmetics Tchad',
      short_name: 'Samiah',
      description: 'Boutique de soins capillaires au Tchad. Diagnostic gratuit, produits naturels pour cheveux crépus.',
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
    url: 'https://samiahcosmetics.shop',
  },

  // ==========================================
  // APP CONFIGURATION
  // ==========================================
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Samiah Cosmetics Tchad — Soins Capillaires & Consultation',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Boutique de soins capillaires au Tchad. Diagnostic gratuit, produits naturels pour cheveux crépus et frisés. Livraison à N\'Djamena.' },
        { name: 'theme-color', content: '#0A0A0A' },
        { name: 'robots', content: 'index, follow' },
        
        // Open Graph (Facebook, WhatsApp, LinkedIn)
        { property: 'og:site_name', content: 'Samiah Cosmetics Tchad' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Samiah Cosmetics Tchad — Soins Capillaires & Consultation' },
        { property: 'og:description', content: 'Boutique de soins capillaires au Tchad. Diagnostic gratuit, produits naturels pour cheveux crépus et frisés.' },
        { property: 'og:image', content: 'https://samiahcosmetics.shop/icon-512.png' },
        { property: 'og:url', content: 'https://samiahcosmetics.shop' },
        { property: 'og:locale', content: 'fr_TD' },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Samiah Cosmetics Tchad — Soins Capillaires' },
        { name: 'twitter:description', content: 'Boutique de soins capillaires au Tchad. Diagnostic gratuit, produits naturels pour cheveux crépus.' },
        { name: 'twitter:image', content: 'https://samiahcosmetics.shop/icon-512.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate icon', type: 'image/png', href: '/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/icon-192.png' },
        { rel: 'canonical', href: 'https://samiahcosmetics.shop' },
        { rel: 'preconnect', href: 'https://dzzblqlteirtzyegplgu.supabase.co', crossorigin: '' },
      ],
      // === DONNÉES STRUCTURÉES (JSON-LD) ===
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([
            // 1. L'ORGANISATION
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Samiah Cosmetics Tchad",
              "url": "https://samiahcosmetics.shop",
              "logo": "https://samiahcosmetics.shop/icon-512.png",
              "sameAs": [
                "https://facebook.com/samiahcosmetics",
                "https://instagram.com/samiahcosmetics"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+235-62-75-21-05",
                "contactType": "customer service",
                "areaServed": "TD",
                "availableLanguage": "French"
              }
            },
            // 2. LE SITE WEB
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Samiah Cosmetics Tchad",
              "alternateName": ["Samiah Cosmetics", "Samiah Cosmétique", "Samiah Tchad"],
              "url": "https://samiahcosmetics.shop"
            },
            // 3. LE COMMERCE LOCAL
            {
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "Samiah Cosmetics Tchad",
              "description": "Boutique de soins capillaires au Tchad. Produits pour cheveux crépus et frisés.",
              "url": "https://samiahcosmetics.shop",
              "telephone": "+235-62-75-21-05",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "N'Djamena",
                "addressCountry": "TD"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "12.1348",
                "longitude": "15.0557"
              }
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
      exclude: ['/', '/produits', '/produits/*', '/panier', '/commander', '/a-propos', '/commande/*', '/suivi', '/cgv', '/mentions-legales'],
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
      siteName: 'Samiah Cosmetics Tchad',
      siteUrl: 'https://samiahcosmetics.shop',
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
    '/suivi': { ssr: true },
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
