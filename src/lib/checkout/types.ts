import type { ShippingCity } from "./config.ts";

export type PaymentMethod = "cash" | "kadryza";

export interface CheckoutCartItemInput {
  productId: string;
  quantity: number;
}

export interface CheckoutInput {
  checkoutToken: string;
  customer: {
    name: string;
    phone: string;
    city: ShippingCity;
    address: string;
  };
  items: CheckoutCartItemInput[];
  paymentMethod: PaymentMethod;
}

export interface ProductRecord {
  id: string;
  title: string;
  price: number;
  active: boolean;
}

export interface TrustedOrderItem {
  product_id: string;
  product_title: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export interface TrustedOrderTotals {
  items: TrustedOrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

export type PaymentStatus =
  | "pending_payment"
  | "checkout_creating"
  | "awaiting_payment"
  | "paid"
  | "under_review"
  | "expired"
  | "checkout_failed"
  | "reconciliation_required";
