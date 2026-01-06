// ==========================================
// COMPOSABLE: useDarkMode
// Toggle between light and dark themes
// ==========================================

export const useDarkMode = () => {
    const isDark = useState<boolean>('dark-mode', () => false)

    // Initialize from localStorage or system preference
    const init = () => {
        if (typeof window === 'undefined') return

        // Check localStorage first
        const stored = localStorage.getItem('theme')
        if (stored) {
            isDark.value = stored === 'dark'
        } else {
            // Fall back to system preference
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }

        applyTheme()
    }

    // Apply theme to document
    const applyTheme = () => {
        if (typeof document === 'undefined') return

        if (isDark.value) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    // Toggle dark mode
    const toggle = () => {
        isDark.value = !isDark.value
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        applyTheme()
    }

    // Set specific mode
    const setDark = (value: boolean) => {
        isDark.value = value
        localStorage.setItem('theme', value ? 'dark' : 'light')
        applyTheme()
    }

    return {
        isDark: readonly(isDark),
        init,
        toggle,
        setDark
    }
}
