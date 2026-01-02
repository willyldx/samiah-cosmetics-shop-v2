// ==========================================
// COMPOSABLE: useToast (Version Améliorée 2026)
// ==========================================

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const addToast = (message: string, type: Toast['type'] = 'info', duration: number = 4000) => {
    
    // AMÉLIORATION 1 : Anti-Doublon
    // Si le dernier message affiché est identique, on ne fait rien (évite le spam)
    if (toasts.value.length > 0 && toasts.value[toasts.value.length - 1].message === message) {
      return
    }

    // AMÉLIORATION 2 : Limite à 3 notifications max
    // Si on en a déjà 3, on supprime la plus vieille pour faire de la place
    if (toasts.value.length >= 3) {
      toasts.value.shift()
    }

    const id = Date.now()
    toasts.value.push({ id, message, type })
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index >= 0) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => addToast(message, 'success', duration)
  const error = (message: string, duration?: number) => addToast(message, 'error', duration)
  const info = (message: string, duration?: number) => addToast(message, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
  }
}
