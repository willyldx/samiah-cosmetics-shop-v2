// Composable for dynamic SEO meta tags
export const useSeo = () => {
    const config = useRuntimeConfig()
    const route = useRoute()

    const setSeo = (options: {
        title?: string
        description?: string
        image?: string
        type?: 'website' | 'product' | 'article'
        price?: number
        currency?: string
    }) => {
        const {
            title,
            description = 'Boutique de soins capillaires au Tchad. Produits naturels pour cheveux crépus et frisés.',
            image = '/icon-512.png',
            type = 'website',
            price,
            currency = 'XAF'
        } = options

        const fullTitle = title
            ? `${title} — Samiah Cosmetics`
            : 'Samiah Cosmetics Tchad — Soins Capillaires'

        const fullImage = image.startsWith('http')
            ? image
            : `${config.public.siteUrl}${image}`

        const currentUrl = `${config.public.siteUrl}${route.fullPath}`

        const meta: any[] = [
            { name: 'description', content: description },

            // Open Graph
            { property: 'og:title', content: fullTitle },
            { property: 'og:description', content: description },
            { property: 'og:image', content: fullImage },
            { property: 'og:url', content: currentUrl },
            { property: 'og:type', content: type },

            // Twitter
            { name: 'twitter:title', content: fullTitle },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: fullImage },
        ]

        // Add product schema if it's a product
        if (type === 'product' && price) {
            meta.push(
                { property: 'product:price:amount', content: price.toString() },
                { property: 'product:price:currency', content: currency }
            )
        }

        useHead({
            title: fullTitle,
            meta,
            link: [
                { rel: 'canonical', href: currentUrl }
            ]
        })
    }

    // Set SEO for a product page
    const setProductSeo = (product: {
        title: string
        short_description?: string
        image?: string
        price: number
    }) => {
        setSeo({
            title: product.title,
            description: product.short_description || `Découvrez ${product.title} chez Samiah Cosmetics.`,
            image: product.image,
            type: 'product',
            price: product.price
        })
    }

    return {
        setSeo,
        setProductSeo
    }
}
