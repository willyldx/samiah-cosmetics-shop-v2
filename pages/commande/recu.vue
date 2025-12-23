<template>
  <div class="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center justify-center">
    
    <div id="ticket" class="bg-white w-full max-w-sm p-6 shadow-2xl relative">
      <div class="absolute top-0 left-0 w-full h-4 bg-gray-100" style="clip-path: polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0);"></div>

      <div class="text-center mt-4 mb-6">
        <h2 class="font-serif text-2xl font-bold text-charcoal">SAMIAH COSMETICS</h2>
        <p class="text-xs text-gray-500 uppercase tracking-widest">N'Djamena, Tchad</p>
      </div>

      <div class="border-b-2 border-dashed border-gray-300 my-4"></div>

      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-500">Commande N°</span>
        <span class="font-mono font-bold">{{ order.order_number }}</span>
      </div>
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-500">Date</span>
        <span>{{ formatDate(new Date()) }}</span>
      </div>
      <div class="flex justify-between text-sm mb-4">
        <span class="text-gray-500">Client</span>
        <span class="font-bold">{{ order.client_name }}</span>
      </div>

      <div class="border-b-2 border-dashed border-gray-300 my-4"></div>

      <div class="space-y-2 mb-4">
        <div v-for="item in order.items" class="flex justify-between text-sm">
          <span>{{ item.quantity }}x {{ item.product_title }}</span>
          <span>{{ formatPrice(item.subtotal) }}</span>
        </div>
      </div>

      <div class="border-t-2 border-black my-4 pt-2">
        <div class="flex justify-between text-xl font-bold">
          <span>TOTAL</span>
          <span>{{ formatPrice(order.total) }}</span>
        </div>
      </div>

      <div class="bg-gray-100 p-3 text-center rounded mt-6">
        <p class="text-xs text-gray-500 mb-1">ID TRANSACTION</p>
        <p class="font-mono font-bold text-lg">{{ order.transaction_ref }}</p>
        <div class="mt-2 text-xs text-orange-600 font-bold">
          ⚠️ EN ATTENTE DE VALIDATION
        </div>
      </div>

      <div class="text-center mt-8 text-xs text-gray-400">
        Merci pour votre confiance.<br>
        Gardez ce reçu comme preuve.
      </div>

      <div class="absolute bottom-0 left-0 w-full h-4 bg-gray-100" style="clip-path: polygon(0 100%, 5% 0, 10% 100%, 15% 0, 20% 100%, 25% 0, 30% 100%, 35% 0, 40% 100%, 45% 0, 50% 100%, 55% 0, 60% 100%, 65% 0, 70% 100%, 75% 0, 80% 100%, 85% 0, 90% 100%, 95% 0, 100% 100%);"></div>
    </div>

    <button onclick="window.print()" class="mt-6 bg-charcoal text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
      Enregistrer mon Reçu
    </button>
    
    <p class="mt-4 text-sm text-gray-500 text-center max-w-xs">
      Une confirmation vous sera aussi envoyée par WhatsApp une fois le paiement validé.
    </p>

  </div>
</template>
