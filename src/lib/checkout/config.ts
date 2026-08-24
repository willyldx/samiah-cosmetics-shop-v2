export const SHIPPING_FEES = {
  "N'Djamena": 1_000,
  Moundou: 2_000,
  Sarh: 2_000,
  Abeche: 2_500,
  Bongor: 1_500,
  Kelo: 2_000,
  Pala: 2_000,
  Koumra: 2_000,
  "Faya-Largeau": 3_000,
} as const;

export type ShippingCity = keyof typeof SHIPPING_FEES;

export const FREE_SHIPPING_THRESHOLD = 20_000;
export const MAX_CART_ITEMS = 50;
export const MAX_ITEM_QUANTITY = 20;
export const KADRYZA_CURRENCY = "XAF" as const;

export function isKadryzaEnabled(): boolean {
  return process.env.KADRYZA_PAYMENT_ENABLED === "true";
}
