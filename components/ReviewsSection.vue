<template>
  <section class="py-16 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4">
      
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-charcoal mb-4">Elles nous font confiance 💖</h2>
        <p class="text-gray-500 max-w-2xl mx-auto">
          Déjà plus de 500 clientes satisfaites à N'Djamena et en province.
          Voici ce qu'elles disent sur WhatsApp après avoir reçu leurs colis.
        </p>
      </div>

      <div class="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar px-4 md:px-0">
        
        <div class="min-w-[300px] md:min-w-[350px] snap-center bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col relative group hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">A</div>
            <div>
              <p class="font-bold text-charcoal text-sm">Amina (Moursal)</p>
              <p class="text-xs text-gray-400">En ligne il y a 2h</p>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" class="w-6 h-6 ml-auto opacity-50" alt="WhatsApp">
          </div>
          
          <div class="bg-white p-4 rounded-xl rounded-tl-none shadow-sm text-gray-600 text-sm mb-4 relative border border-gray-100">
            Coucou ma chérie ! J'ai bien reçu ma commande ce matin. L'huile sent trop bon 😍 merci pour la rapidité ! Je vais recommander pour ma sœur.
          </div>
          
          <div class="mt-auto">
            <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=300" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Colis reçu">
            </div>
            <p class="text-xs text-center text-gray-400 mt-2">Colis livré à Moursal</p>
          </div>
        </div>

        <div class="min-w-[300px] md:min-w-[350px] snap-center bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col relative group hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">F</div>
            <div>
              <p class="font-bold text-charcoal text-sm">Fatima (Diguel)</p>
              <p class="text-xs text-gray-400">En ligne hier</p>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" class="w-6 h-6 ml-auto opacity-50" alt="WhatsApp">
          </div>
          <div class="bg-white p-4 rounded-xl rounded-tl-none shadow-sm text-gray-600 text-sm mb-4 relative border border-gray-100">
            Vraiment le shampoing solide c'est de la magie. Mes cheveux sont devenus tout doux. Merci pour les conseils Samiah ! 🙏🏾
          </div>
          <div class="mt-auto">
            <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1585232561025-82998396fae4?auto=format&fit=crop&q=80&w=300" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Produit">
            </div>
             <p class="text-xs text-center text-gray-400 mt-2">Routine complète</p>
          </div>
        </div>

        <div class="min-w-[300px] md:min-w-[350px] snap-center bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col relative group hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">Z</div>
            <div>
              <p class="font-bold text-charcoal text-sm">Zenab (Farcha)</p>
              <p class="text-xs text-gray-400">En ligne il y a 5h</p>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" class="w-6 h-6 ml-auto opacity-50" alt="WhatsApp">
          </div>
          <div class="bg-white p-4 rounded-xl rounded-tl-none shadow-sm text-gray-600 text-sm mb-4 relative border border-gray-100">
            J'avais peur de payer par Airtel avant de voir la marchandise mais vous êtes sérieux. J'ai reçu mon colis en 24h. C'est top 👍
          </div>
           <div class="mt-auto">
             <div class="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
              Capture d'écran paiement
            </div>
             <p class="text-xs text-center text-gray-400 mt-2">Paiement Airtel confirmé</p>
          </div>
        </div>

      </div>

      <div class="text-center mt-8">
        <a href="https://wa.me/23562752105" target="_blank" class="inline-flex items-center gap-2 text-gold font-bold hover:underline">
          Voir plus d'avis sur notre statut WhatsApp
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </a>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Cache la barre de scroll tout en permettant le défilement */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
