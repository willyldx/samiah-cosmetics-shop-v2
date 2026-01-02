export default defineNuxtRouteMiddleware((to) => {
  // Cette fonction est instantanée (pas besoin de 'await')
  const user = useSupabaseUser()

  // CAS 1 : L'utilisateur n'est PAS connecté
  if (!user.value) {
    // S'il essaie d'aller sur une page admin, mais n'est pas sur le login
    if (to.path !== '/admin/login') {
      return navigateTo('/admin/login')
    }
  } 
  
  // CAS 2 : L'utilisateur EST connecté
  else {
    // S'il essaie d'aller sur le login alors qu'il est déjà connecté
    // On le redirige vers le Dashboard pour gagner du temps
    if (to.path === '/admin/login') {
      return navigateTo('/admin') // ou '/admin/dashboard' selon ta route
    }
  }
})
