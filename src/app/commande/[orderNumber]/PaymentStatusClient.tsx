"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useCart } from "@/context/CartContext";

interface PaymentView {
  orderNumber: string;
  total: number;
  paymentStatus:
    | "pending_payment"
    | "session_creating"
    | "awaiting_payment"
    | "paid"
    | "under_review"
    | "expired"
    | "session_failed"
    | "reconciliation_required";
  ticket: string | null;
  operator: string | null;
  environment: "test" | "live" | null;
  collectionNumber: string | null;
  checkoutUrl: string | null;
  expiresAt: string | null;
  confirmedAt: string | null;
  retryAllowed: boolean;
}

const TERMINAL_STATUSES = new Set([
  "paid",
  "under_review",
  "expired",
  "session_failed",
  "reconciliation_required",
]);

function formatPrice(amount: number) {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;
}

export default function PaymentStatusClient({
  orderNumber,
  token,
}: {
  orderNumber: string;
  token: string;
}) {
  const { clearCart } = useCart();
  const [payment, setPayment] = useState<PaymentView | null>(null);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);

  const refresh = useCallback(async () => {
    const response = await fetch(
      `/api/orders/${encodeURIComponent(orderNumber)}/payment-status?token=${encodeURIComponent(token)}`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error("Impossible de consulter le statut de cette commande.");
    }
    setPayment(await response.json());
  }, [orderNumber, token]);

  useEffect(() => {
    // Chargement client requis : le token de statut reste hors du rendu serveur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch((caught) =>
      setError(caught instanceof Error ? caught.message : "Erreur de statut."),
    );
  }, [refresh]);

  useEffect(() => {
    if (!payment || TERMINAL_STATUSES.has(payment.paymentStatus)) return;
    const timer = window.setInterval(() => {
      refresh().catch(() => undefined);
    }, 5_000);
    return () => window.clearInterval(timer);
  }, [payment, refresh]);

  useEffect(() => {
    if (payment?.paymentStatus === "paid") {
      clearCart();
    }
  }, [clearCart, payment?.paymentStatus]);

  const retry = async () => {
    setRetrying(true);
    setError("");
    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(orderNumber)}/payment-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        },
      );
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      await refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "La nouvelle tentative a échoué.",
      );
      await refresh().catch(() => undefined);
    } finally {
      setRetrying(false);
    }
  };

  const whatsappUrl = `https://wa.me/23562752105?text=${encodeURIComponent(
    `Bonjour Samiah Cosmetics, je vous contacte au sujet de la commande ${orderNumber}.`,
  )}`;

  if (error && !payment) {
    return <StatusShell title="Statut indisponible" message={error} />;
  }
  if (!payment) {
    return (
      <StatusShell
        title="Chargement du paiement"
        message="Nous vérifions le statut serveur de votre commande."
      />
    );
  }

  const commonDetails = (
    <div className="mt-8 grid gap-3 text-left text-sm border-t border-sand/40 pt-6">
      <Detail label="Commande" value={payment.orderNumber} />
      <Detail label="Montant" value={formatPrice(payment.total)} />
      {payment.operator && <Detail label="Opérateur" value={payment.operator} />}
      {payment.ticket && <Detail label="Ticket" value={payment.ticket} />}
      {payment.expiresAt && (
        <Detail
          label="Expiration"
          value={new Date(payment.expiresAt).toLocaleString("fr-FR")}
        />
      )}
      {payment.environment === "test" && (
        <p className="text-amber-700 text-xs mt-2">
          Session de test : aucun argent réel ne doit être envoyé.
        </p>
      )}
    </div>
  );

  if (payment.paymentStatus === "paid") {
    return (
      <StatusShell
        tone="success"
        title="Paiement confirmé"
        message="Kadryza a confirmé le paiement par webhook sécurisé. Votre commande va être préparée."
      >
        {commonDetails}
        <a className="primary-action mt-8" href={whatsappUrl}>
          Continuer sur WhatsApp
        </a>
      </StatusShell>
    );
  }

  if (payment.paymentStatus === "under_review") {
    return (
      <StatusShell
        tone="warning"
        title="Paiement en vérification"
        message="Le paiement n'est pas confirmé. L'équipe vérifiera la transaction manuellement ; ne payez pas une seconde fois."
      >
        {commonDetails}
        <a className="secondary-action mt-8" href={whatsappUrl}>
          Contacter l’assistance
        </a>
      </StatusShell>
    );
  }

  if (payment.paymentStatus === "expired") {
    return (
      <StatusShell
        tone="warning"
        title="Session expirée"
        message="La fenêtre de paiement est terminée et la commande n'est pas payée."
      >
        {commonDetails}
        <a className="secondary-action mt-8" href={whatsappUrl}>
          Demander de l’aide
        </a>
      </StatusShell>
    );
  }

  if (
    payment.paymentStatus === "session_failed" ||
    payment.paymentStatus === "reconciliation_required"
  ) {
    const reconciliation =
      payment.paymentStatus === "reconciliation_required";
    return (
      <StatusShell
        tone="warning"
        title={
          reconciliation
            ? "Vérification requise"
            : "Service temporairement indisponible"
        }
        message={
          reconciliation
            ? "Le résultat de la création est incertain. Ne relancez pas le paiement ; contactez l’assistance."
            : "Aucune session active n'a été créée. Vous pouvez lancer une nouvelle tentative contrôlée."
        }
      >
        {commonDetails}
        {payment.retryAllowed && (
          <button
            className="primary-action mt-8"
            disabled={retrying}
            onClick={retry}
          >
            {retrying ? "Nouvelle tentative…" : "Réessayer"}
          </button>
        )}
        <a className="secondary-action mt-4" href={whatsappUrl}>
          Contacter l’assistance
        </a>
        {error && <p className="text-rose-700 text-xs mt-4">{error}</p>}
      </StatusShell>
    );
  }

  return (
    <StatusShell
      title="En attente du paiement"
      message="Votre commande n'est pas encore payée. La confirmation viendra exclusivement du webhook Kadryza."
    >
      {commonDetails}
      {payment.collectionNumber && (
        <p className="mt-6 text-xs text-charcoal/60">
          Numéro attribué :{" "}
          <strong className="text-charcoal">{payment.collectionNumber}</strong>
        </p>
      )}
      {payment.checkoutUrl ? (
        <a
          className="primary-action mt-8"
          href={payment.checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
        >
          Ouvrir le checkout sécurisé Kadryza
        </a>
      ) : (
        <p className="mt-8 text-amber-700 text-xs">
          Le checkout hébergé est indisponible. Contactez l’assistance avant de
          payer.
        </p>
      )}
      <p className="mt-5 text-[11px] leading-relaxed text-charcoal/45">
        Le checkout s’ouvre dans un nouvel onglet, car le contrat Kadryza actif
        ne documente pas encore de paramètre de retour marchand.
      </p>
    </StatusShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6">
      <span className="text-charcoal/45">{label}</span>
      <strong className="text-charcoal text-right">{value}</strong>
    </div>
  );
}

function StatusShell({
  title,
  message,
  tone = "neutral",
  children,
}: {
  title: string;
  message: string;
  tone?: "neutral" | "success" | "warning";
  children?: React.ReactNode;
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-200"
      : tone === "warning"
        ? "border-amber-200"
        : "border-sand/40";
  return (
    <main className="min-h-screen bg-cream pt-32 pb-24 flex items-center">
      <section
        className={`w-full max-w-xl mx-auto bg-white border ${toneClass} p-8 sm:p-12 text-center shadow-sm`}
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-semibold">
          Airtel Money avec Kadryza
        </span>
        <h1 className="mt-4 text-3xl font-serif text-charcoal">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/55">
          {message}
        </p>
        {children}
        <Link
          href="/produits"
          className="block mt-8 text-[9px] uppercase tracking-widest text-charcoal/45 hover:text-gold"
        >
          Retour à la boutique
        </Link>
      </section>
    </main>
  );
}
