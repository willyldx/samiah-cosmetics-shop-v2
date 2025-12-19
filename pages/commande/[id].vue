<template>
  <div class="min-h-screen bg-ivory-100">
    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p class="text-gray-500">Chargement...</p>
      </div>
    </div>

    <!-- Commande non trouvée -->
    <div v-else-if="!order" class="flex items-center justify-center min-h-screen">
      <div class="text-center px-4">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-xl font-bold text-charcoal mb-2">Commande introuvable</h1>
        <p class="text-gray-500 mb-6">Cette commande n'existe pas ou a été supprimée.</p>
        <NuxtLink to="/produits" class="bg-charcoal text-white px-6 py-3 rounded-full font-medium">
          Voir les produits
        </NuxtLink>
      </div>
    </div>

    <!-- Confirmation -->
    <div v-else class="max-w-2xl mx-auto px-4 py-12">
      <!-- Success Icon -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl lg:text-3xl font-bold text-charcoal mb-2">Commande enregistrée !</h1>
        <p class="text-gray-600">
          Votre commande <span class="font-semibold text-charcoal">#{{ order.order_number }}</span> a été enregistrée avec succès.
        </p>
      </div>

      <!-- Carte commande -->
      <div class="bg-white rounded-2xl shadow-soft overflow-hidden mb-6">
        <!-- Header -->
        <div class="bg-charcoal text-white px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-white/70">Numéro de commande</p>
              <p class="text-xl font-bold">{{ order.order_number }}</p>
            </div>
            <div class="text-right">
              <span 
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                :class="statusClasses"
              >
                <span class="w-2 h-2 rounded-full" :class="statusDotClass" />
                {{ statusLabel }}
              </span>
            </div>
          </div>
        </div>

        <!-- Contenu -->
        <div class="p-6 space-y-6">
          <!-- Infos client -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Informations de livraison</h3>
            <div class="bg-gray-50 rounded-xl p-4 space-y-2">
              <p class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="font-medium">{{ order.client_name }}</span>
              </p>
              <p class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{{ order.client_phone }}</span>
              </p>
              <p class="flex items-start gap-2">
                <svg class="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ order.client_address }}, {{ order.client_city }}</span>
              </p>
            </div>
          </div>

          <!-- Produits -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Produits commandés</h3>
            <div class="space-y-3">
              <div
                v-for="(item, index) in order.items"
                :key="index"
                class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p class="font-medium text-charcoal">{{ item.product_title }}</p>
                  <p class="text-sm text-gray-500">{{ formatPrice(item.product_price) }} × {{ item.quantity }}</p>
                </div>
                <p class="font-semibold text-charcoal">{{ formatPrice(item.subtotal) }}</p>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="border-t border-gray-200 pt-4">
            <div class="flex justify-between items-center text-sm mb-2">
              <span class="text-gray-600">Sous-total</span>
              <span>{{ formatPrice(order.subtotal) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm mb-2">
              <span class="text-gray-600">Livraison</span>
              <span class="text-gold font-medium">
                {{ order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : 'À confirmer' }}
              </span>
            </div>
            <div class="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span class="text-gold">{{ formatPrice(order.total) }}</span>
            </div>
          </div>

          <!-- Mode de paiement -->
          <div class="bg-gold/10 rounded-xl p-4">
            <p class="text-sm text-gray-600">Mode de paiement</p>
            <p class="font-semibold text-charcoal">{{ paymentMethodLabel }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-3">
        <!-- Bouton WhatsApp principal -->
        <a
          :href="whatsappLink"
          target="_blank"
          rel="noopener"
          class="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#22c55e] transition-colors"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          Confirmer sur WhatsApp
        </a>

        <p class="text-center text-sm text-gray-500">
          Cliquez pour envoyer les détails de votre commande à Samiah Cosmetics
        </p>

        <NuxtLink
          to="/produits"
          class="w-full bg-gray-100 text-charcoal py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Continuer mes achats
        </NuxtLink>
      </div>

      <!-- Note -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          📞 Un problème ? Contactez-nous sur WhatsApp au 
          <a :href="`tel:+${config.public.whatsappNumber}`" class="text-gold font-medium">
            +{{ config.public.whatsappNumber }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '~/types'
import type { OrderStatus, PaymentMethod } from '~/types'

const route = useRoute()
const config = useRuntimeConfig()
const { fetchOrder, formatPrice, generateWhatsAppOrderMessage } = useOrders()

const orderId = route.params.id as string

// Fetch order
const { data: order, pending } = await useAsyncData(`order-${orderId}`, () => fetchOrder(orderId))

// SEO
useHead({
  title: computed(() => order.value 
    ? `Commande #${order.value.order_number} — Samiah Cosmetics` 
    : 'Commande — Samiah Cosmetics'
  ),
})

// Status
const statusLabel = computed(() => {
  if (!order.value) return ''
  return ORDER_STATUS_LABELS[order.value.status as OrderStatus] || order.value.status
})

const statusClasses = computed(() => {
  if (!order.value) return ''
  const status = order.value.status as OrderStatus
  return {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800'
})

const statusDotClass = computed(() => {
  if (!order.value) return ''
  const status = order.value.status as OrderStatus
  return {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  }[status] || 'bg-gray-500'
})

// Payment method
const paymentMethodLabel = computed(() => {
  if (!order.value) return ''
  return PAYMENT_METHOD_LABELS[order.value.payment_method as PaymentMethod] || order.value.payment_method
})

// WhatsApp link
const whatsappLink = computed(() => {
  if (!order.value) return '#'
  const message = generateWhatsAppOrderMessage(order.value)
  return `https://wa.me/${config.public.whatsappNumber}?text=${message}`
})
</script>
