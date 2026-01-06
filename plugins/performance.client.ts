// ==========================================
// PLUGIN: Performance Optimizations
// Intersection Observer pour animations au scroll
// ==========================================

export default defineNuxtPlugin(() => {
    // Only run on client
    if (typeof window === 'undefined') return

    // Lazy reveal animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    }

    const revealOnScroll = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible')
                observer.unobserve(entry.target)
            }
        })
    }

    const observer = new IntersectionObserver(revealOnScroll, observerOptions)

    // Expose the observer globally for components to use
    return {
        provide: {
            revealObserver: observer
        }
    }
})
