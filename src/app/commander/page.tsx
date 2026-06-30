"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

const SHIPPING_FEES: Record<string, number> = {
  "N'Djamena": 1000,
  "Moundou": 2000,
  "Sarh": 2000,
  "Abeche": 2500,
  "Bongor": 1500,
  "Kelo": 2000,
  "Pala": 2000,
  "Koumra": 2000,
  "Faya-Largeau": 3000,
};

const FREE_SHIPPING_THRESHOLD = 20000;

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("N'Djamena");
  const [address, setAddress] = useState("");
  const [shippingFee, setShippingFee] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      setShippingFee(0);
    } else {
      setShippingFee(SHIPPING_FEES[city] || 1500);
    }
  }, [city, subtotal]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SC${year}${month}${day}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    const orderNumber = generateOrderNumber();
    const total = subtotal + shippingFee;

    const orderItems = cartItems.map(item => ({
      product_id: item.product.id,
      product_title: item.product.title,
      product_price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
    }));

    try {
      // 1. Insert order to Supabase
      const { data, error } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          client_name: name,
          client_phone: phone,
          client_city: city,
          client_address: address,
          items: orderItems,
          subtotal,
          shipping_fee: shippingFee,
          total,
          payment_method: "cash",
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // 2. Format WhatsApp Message
      const lines = [
        "=============================",
        "   NOUVELLE COMMANDE",
        "=============================",
        "",
        `Numéro: ${orderNumber}`,
        "",
        "--- INFORMATIONS CLIENT ---",
        `Nom: ${name}`,
        `Tel: ${phone}`,
        `Ville: ${city}`,
        `Adresse: ${address}`,
        "",
        "--- PRODUITS COMMANDÉS ---",
        ...orderItems.map(item => `- ${item.product_title} x${item.quantity} = ${formatPrice(item.subtotal)}`),
        "",
        "--- RÉCAPITULATIF ---",
        `Sous-total: ${formatPrice(subtotal)}`,
        `Livraison: ${shippingFee === 0 ? "GRATUITE" : formatPrice(shippingFee)}`,
        `TOTAL: ${formatPrice(total)}`,
        "",
        "Mode de paiement: Paiement à la livraison",
        "",
        "=============================",
      ];

      const message = encodeURIComponent(lines.join("\n"));
      
      // 3. Clear cart and set success state
      clearCart();
      setOrderPlaced(true);

      // 4. Redirect to WhatsApp
      window.location.href = `https://wa.me/23563462615?text=${message}`;

    } catch (err) {
      console.error("Erreur de création de commande:", err);
      alert("Une erreur s'est produite lors de la validation. Veuillez réessayer.");
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
                      onChange={(e) => setCity(e.target.value)}
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
                <div className="border border-gold p-6 text-center bg-sand/10 rounded-sm">
                  <p className="text-charcoal font-semibold text-xs uppercase tracking-widest mb-1.5">Paiement à la livraison</p>
                  <p className="text-charcoal/50 font-light text-xs">Vous paierez en espèces lors de la réception de votre commande.</p>
                </div>
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
                  {loading ? "Traitement..." : "Confirmer la commande"}
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
