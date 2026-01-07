// Composable for scroll reveal animations using Intersection Observer
export const useScrollReveal = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    }

    const setupReveal = (selector: string = '.reveal') => {
        if (typeof window === 'undefined') return

        const elements = document.querySelectorAll(selector)

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed')
                    observer.unobserve(entry.target)
                }
            })
        }, observerOptions)

        elements.forEach((el) => {
            observer.observe(el)
        })

        return observer
    }

    return {
        setupReveal
    }
}
