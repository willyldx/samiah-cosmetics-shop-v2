// Sitemap configuration for Samiah Cosmetics
// This file provides additional sitemap settings

export default defineSitemapConfig({
    // Sitemap settings
    sitemaps: {
        default: {
            // Include main pages
            urls: [
                { loc: '/', changefreq: 'daily', priority: 1.0 },
                { loc: '/produits', changefreq: 'daily', priority: 0.9 },
                { loc: '/a-propos', changefreq: 'monthly', priority: 0.7 },
                { loc: '/suivi', changefreq: 'monthly', priority: 0.5 },
            ],
            // Exclude admin pages
            exclude: [
                '/admin',
                '/admin/**',
                '/admin/login',
                '/commande/**',
            ],
        },
    },
})
