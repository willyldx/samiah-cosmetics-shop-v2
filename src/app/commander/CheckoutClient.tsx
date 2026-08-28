"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Banknote, Check, ShieldCheck, Smartphone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEES,
  type ShippingCity,
} from "@/lib/checkout/config";
import type { PaymentMethod } from "@/lib/checkout/types";

interface CheckoutClientProps {
  kadryzaEnabled: boolean;
}

interface CreatedOrder {
  orderNumber: string;
  items: Array<{
    product_title: string;
    quantity: number;
    subtotal: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
}

export default function CheckoutClient({
  kadryzaEnabled,
}: CheckoutClientProps) {
  const { cartItems, subtotal, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState<ShippingCity>("N'Djamena");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash");
  const checkoutTokenRef = useRef<string | null>(null);

  const shippingFee =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEES[city];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    checkoutTokenRef.current ??= crypto.randomUUID();

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name,
            phone,
            city,
            address,
          },
          checkoutToken: checkoutTokenRef.current,
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          paymentMethod,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "La commande n'a pas pu être créée.");
      }

      const order = result.order as CreatedOrder;
      if (paymentMethod === "kadryza") {
        window.location.assign(result.payment.statusUrl);
        return;
      }

      const lines = [
        "=============================",
        "   NOUVELLE COMMANDE",
        "=============================",
        "",
        `Numéro: ${order.orderNumber}`,
        "",
        "--- INFORMATIONS CLIENT ---",
        `Nom: ${name}`,
        `Tel: ${phone}`,
        `Ville: ${city}`,
        `Adresse: ${address}`,
        "",
        "--- PRODUITS COMMANDÉS ---",
        ...order.items.map(
          (item) =>
            `- ${item.product_title} x${item.quantity} = ${formatPrice(item.subtotal)}`,
        ),
        "",
        "--- RÉCAPITULATIF ---",
        `Sous-total: ${formatPrice(order.subtotal)}`,
        `Livraison: ${order.shippingFee === 0 ? "GRATUITE" : formatPrice(order.shippingFee)}`,
        `TOTAL: ${formatPrice(order.total)}`,
        "",
        "Mode de paiement: Paiement à la livraison",
        "",
        "=============================",
      ];

      const message = encodeURIComponent(lines.join("\n"));
      clearCart();
      setOrderPlaced(true);
      window.location.href = `https://wa.me/23562752105?text=${message}`;

    } catch (err) {
      console.error("Erreur de création de commande:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors de la validation.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-6">
          <h2 className="text-3xl font-serif text-charcoal">Merci pour votre commande !</h2>
          <p className="text-charcoal/50 text-sm font-light leading-relaxed">
            Votre commande a été enregistrée avec succès. Vous allez être redirigé vers WhatsApp pour finaliser la livraison avec notre conseillère.
          </p>
          <p className="text-xs text-gold font-semibold uppercase tracking-widest">Paiement à la livraison</p>
          <Link
            href="/produits"
            className="inline-block bg-charcoal text-white px-8 py-4.5 text-[9px] uppercase tracking-[0.25em] font-semibold hover:bg-gold hover:text-charcoal transition-all duration-500 rounded-sm shadow-md"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="space-y-4 mb-16 text-center lg:text-left">
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold">Finaliser</span>
          <h1 className="text-4xl lg:text-5xl font-serif font-light text-charcoal">Votre Commande</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 border border-sand/40 rounded-sm bg-white shadow-sm max-w-2xl mx-auto px-6">
            <h2 className="text-2xl font-serif text-charcoal mb-4">Votre panier est vide</h2>
            <p className="text-charcoal/50 text-sm font-light mb-8 max-w-sm mx-auto leading-relaxed">
              Ajoutez des produits à votre panier avant de passer à la caisse.
            </p>
            <Link
              href="/produits"
              className="inline-block bg-charcoal text-white px-8 py-4.5 text-[9px] uppercase tracking-[0.25em] font-semibold hover:bg-gold hover:text-charcoal transition-all duration-500 rounded-sm shadow-md"
            >
              Voir nos produits
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12 items-start">

            {/* Formulaire */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8 animate-fade-in-up">
              <div className="bg-white p-8 md:p-12 border border-sand/40 rounded-sm shadow-[0_4px_25px_rgba(26,26,26,0.02)]">
                <h2 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-gold mb-8 pb-4 border-b border-sand/30">
                  1. Vos coordonnées
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-charcoal font-semibold mb-2">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-sand px-4 py-3.5 bg-cream/30 focus:bg-white focus:border-gold outline-none transition-all font-light text-sm rounded-sm text-charcoal"
                      placeholder="Ex: Adoum Mahamat"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-charcoal font-semibold mb-2">Numéro WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-sand px-4 py-3.5 bg-cream/30 focus:bg-white focus:border-gold outline-none transition-all font-light text-sm rounded-sm text-charcoal"
                      placeholder="Ex: 66 00 00 00"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-charcoal font-semibold mb-2">Ville *</label>
                    <select
                      value={city}
                      onChange={(e) =>
                        setCity(e.target.value as ShippingCity)
                      }
                      className="w-full border border-sand px-4 py-3.5 bg-cream/30 focus:bg-white focus:border-gold outline-none transition-all font-light text-sm rounded-sm text-charcoal cursor-pointer"
                    >
                      {Object.keys(SHIPPING_FEES).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-charcoal font-semibold mb-2">Adresse de livraison / Quartier *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-sand px-4 py-3.5 bg-cream/30 focus:bg-white focus:border-gold outline-none transition-all font-light text-sm rounded-sm text-charcoal"
                      placeholder="Ex: Quartier Sabangali, rue 20..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 md:p-12 border border-sand/40 rounded-sm shadow-[0_4px_25px_rgba(26,26,26,0.02)]">
                <h2 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-gold mb-8 pb-4 border-b border-sand/30">
                  2. Paiement
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label
                    className={`group relative flex min-h-40 cursor-pointer flex-col overflow-hidden border p-5 sm:p-6 rounded-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-gold/35 focus-within:ring-offset-2 active:translate-y-px ${
                      paymentMethod === "cash"
                        ? "border-gold bg-sand/20 shadow-[0_10px_30px_rgba(164,134,94,0.10)]"
                        : "border-sand bg-white hover:-translate-y-0.5 hover:border-gold/60 hover:bg-cream/35 hover:shadow-[0_10px_28px_rgba(26,26,26,0.06)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="sr-only"
                    />
                    <span className="mb-5 flex items-center justify-between gap-4">
                      <span className="flex size-10 items-center justify-center border border-sand bg-cream text-charcoal/65 transition-colors group-hover:border-gold/40 group-hover:text-gold-dark">
                        <Banknote className="size-4.5" strokeWidth={1.6} />
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex size-5 items-center justify-center rounded-full border transition-all ${
                          paymentMethod === "cash"
                            ? "border-gold bg-gold text-white"
                            : "border-sand bg-white text-transparent group-hover:border-gold/50"
                        }`}
                      >
                        <Check className="size-3" strokeWidth={2.4} />
                      </span>
                    </span>
                    <span className="block text-[15px] font-serif font-medium leading-snug text-charcoal">
                      Paiement à la livraison
                    </span>
                    <span className="mt-2 block max-w-[34ch] text-xs font-light leading-relaxed text-charcoal/50">
                      Réglez en espèces lorsque votre commande vous est remise.
                    </span>
                  </label>

                  {kadryzaEnabled && (
                    <label
                      className={`group relative flex min-h-40 cursor-pointer flex-col overflow-hidden border p-5 sm:p-6 rounded-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-gold/35 focus-within:ring-offset-2 active:translate-y-px ${
                        paymentMethod === "kadryza"
                          ? "border-gold bg-[radial-gradient(circle_at_top_right,rgba(197,168,128,0.18),transparent_48%),linear-gradient(145deg,#fff_20%,#faf8f5_100%)] shadow-[0_14px_36px_rgba(164,134,94,0.14)]"
                          : "border-sand bg-white hover:-translate-y-0.5 hover:border-gold/70 hover:bg-cream/25 hover:shadow-[0_12px_32px_rgba(164,134,94,0.10)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="kadryza"
                        checked={paymentMethod === "kadryza"}
                        onChange={() => setPaymentMethod("kadryza")}
                        className="sr-only"
                        aria-describedby="kadryza-payment-description"
                      />
                      <span className="mb-5 flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2.5">
                          <span className="flex size-10 items-center justify-center bg-charcoal text-white shadow-[0_6px_16px_rgba(26,26,26,0.14)] transition-transform duration-300 group-hover:scale-[1.04]">
                            <Smartphone className="size-4.5" strokeWidth={1.6} />
                          </span>
                          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-dark">
                            Mobile Money
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`flex size-5 items-center justify-center rounded-full border transition-all ${
                            paymentMethod === "kadryza"
                              ? "border-gold bg-gold text-white"
                              : "border-sand bg-white text-transparent group-hover:border-gold/60"
                          }`}
                        >
                          <Check className="size-3" strokeWidth={2.4} />
                        </span>
                      </span>
                      <span className="block text-[17px] font-serif font-medium leading-snug text-charcoal text-balance">
                        Payer par Mobile Money
                      </span>
                      <span
                        id="kadryza-payment-description"
                        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-charcoal/55"
                      >
                        <ShieldCheck
                          className="size-3.5 shrink-0 text-gold-dark"
                          strokeWidth={1.8}
                        />
                        Paiement sécurisé via Kadryza
                      </span>
                      <span className="mt-2 block max-w-[36ch] text-[11px] font-light leading-relaxed text-charcoal/45">
                        Choisissez votre opérateur sur le checkout sécurisé.
                      </span>
                    </label>
                  )}
                </div>
                {paymentMethod === "kadryza" && (
                  <div className="mt-4 flex gap-3 border border-gold/25 bg-sand/20 px-4 py-3.5 text-charcoal/55 sm:px-5">
                    <ShieldCheck
                      className="mt-0.5 size-4 shrink-0 text-gold-dark"
                      strokeWidth={1.7}
                    />
                    <p className="text-[11px] font-light leading-relaxed text-pretty">
                      Kadryza vous présente uniquement les opérateurs disponibles
                      et collecte votre numéro sur son espace sécurisé. Votre
                      panier reste conservé jusqu&apos;à la confirmation du
                      paiement.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
              <div className="bg-white p-6 md:p-8 border border-sand/40 rounded-sm shadow-[0_4px_25px_rgba(26,26,26,0.02)]">
                <h2 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-gold mb-6 pb-4 border-b border-sand/30">
                  Récapitulatif
                </h2>

                <div className="space-y-6 mb-8 max-h-[30vh] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-cream relative border border-sand/30 rounded-xs overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-charcoal font-serif text-sm font-medium truncate max-w-[150px]">{item.product.title}</h3>
                        <p className="text-charcoal/40 text-[9px] uppercase tracking-widest mt-1">Qté: {item.quantity}</p>
                        <p className="text-charcoal/80 font-medium text-sm mt-1.5">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-sand/30 pt-6 space-y-4 mb-8">
                  <div className="flex justify-between text-xs text-charcoal/50 font-light">
                    <span>Sous-total</span>
                    <span className="font-medium text-charcoal/80">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-charcoal/50 font-light">
                    <span>Livraison</span>
                    <span className="font-medium text-charcoal/80">
                      {shippingFee === 0 ? "GRATUITE" : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between items-end text-charcoal pt-4 border-t border-sand/30">
                    <span className="text-[9px] uppercase tracking-widest font-semibold pb-1">Total estimé</span>
                    <span className="text-2xl font-serif text-charcoal/90">{formatPrice(subtotal + shippingFee)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-charcoal text-white py-5 text-[9px] uppercase tracking-[0.25em] font-semibold hover:bg-gold hover:text-charcoal transition-all duration-500 rounded-sm shadow-lg shadow-charcoal/5 disabled:opacity-50"
                >
                  {loading
                    ? "Traitement..."
                    : paymentMethod === "kadryza"
                      ? "Continuer vers le paiement"
                      : "Confirmer la commande"}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-[8px] uppercase tracking-widest text-charcoal/40 font-semibold">
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
