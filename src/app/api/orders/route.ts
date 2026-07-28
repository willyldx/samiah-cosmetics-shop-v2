import { NextResponse } from "next/server";

import { isKadryzaEnabled } from "@/lib/checkout/config";
import {
  createOrderNumber,
  hashStatusAccessToken,
  isSameOriginRequest,
} from "@/lib/checkout/security";
import {
  calculateTrustedOrder,
  CheckoutValidationError,
  parseCheckoutInput,
} from "@/lib/checkout/validation";
import {
  createKadryzaPaymentSession,
  KadryzaUnavailableError,
} from "@/lib/kadryza/client";
import {
  getKadryzaEnvironmentFromApiKey,
  type KadryzaEnvironment,
} from "@/lib/kadryza/environment";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

function clientError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function existingOrderResponse(
  order: Record<string, unknown>,
  statusToken: string,
) {
  const baseOrder = {
    orderNumber: order.order_number,
    items: order.items,
    subtotal: order.subtotal,
    shippingFee: order.shipping_fee,
    total: order.total,
    paymentMethod: order.payment_method,
  };
  if (order.payment_method === "cash") {
    return NextResponse.json(
      { order: baseOrder, idempotentReplay: true },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      order: baseOrder,
      payment: {
        status: order.payment_status,
        checkoutUrl: order.kadryza_checkout_url,
        statusUrl: `/commande/${encodeURIComponent(String(order.order_number))}?token=${encodeURIComponent(statusToken)}`,
      },
      idempotentReplay: true,
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return clientError("Origine de requête refusée.", 403);
  }

  let rawInput: unknown;
  try {
    rawInput = await request.json();
  } catch {
    return clientError("Le corps de la requête doit être un JSON valide.");
  }

  try {
    const input = parseCheckoutInput(rawInput);
    if (input.paymentMethod === "kadryza" && !isKadryzaEnabled()) {
      return clientError(
        "Le paiement Mobile Money n'est pas encore disponible.",
        503,
      );
    }
    let kadryzaEnvironment: KadryzaEnvironment | null = null;
    if (input.paymentMethod === "kadryza") {
      try {
        kadryzaEnvironment = getKadryzaEnvironmentFromApiKey(
          process.env.KADRYZA_API_KEY ?? "",
        );
      } catch {
        return clientError(
          "Le paiement Mobile Money n'est pas correctement configuré.",
          503,
        );
      }
    }

    const supabase = getSupabaseServerClient();
    const productIds = input.items.map((item) => item.productId);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id,title,price,active")
      .in("id", productIds);

    if (productsError) {
      console.error("checkout_products_read_failed", {
        code: productsError.code,
      });
      return clientError(
        "Impossible de vérifier le panier pour le moment.",
        503,
      );
    }

    const totals = calculateTrustedOrder(input, products ?? []);
    const orderNumber = createOrderNumber();
    const statusToken = input.checkoutToken;
    const statusTokenHash = hashStatusAccessToken(statusToken);
    const isKadryza = input.paymentMethod === "kadryza";

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        client_name: input.customer.name,
        client_phone: input.customer.phone,
        payment_customer_phone: input.customer.paymentPhone,
        client_city: input.customer.city,
        client_address: input.customer.address,
        items: totals.items,
        subtotal: totals.subtotal,
        shipping_fee: totals.shippingFee,
        total: totals.total,
        payment_method: input.paymentMethod,
        status: isKadryza ? "pending_payment" : "pending",
        payment_status: isKadryza ? "pending_payment" : "not_applicable",
        expected_payment_amount: isKadryza ? totals.total : null,
        status_access_token_hash: statusTokenHash,
        kadryza_operator: isKadryza ? "AIRTEL" : null,
        kadryza_environment: kadryzaEnvironment,
        kadryza_reference: isKadryza ? orderNumber : null,
      })
      .select("id,order_number")
      .single();

    if (orderError || !order) {
      if (orderError?.code === "23505") {
        const { data: existingOrder, error: replayError } = await supabase
          .from("orders")
          .select(
            "order_number,items,subtotal,shipping_fee,total,payment_method,payment_status,kadryza_checkout_url",
          )
          .eq("status_access_token_hash", statusTokenHash)
          .maybeSingle();
        if (!replayError && existingOrder) {
          return existingOrderResponse(existingOrder, statusToken);
        }
      }
      console.error("checkout_order_insert_failed", {
        code: orderError?.code,
      });
      return clientError(
        "Impossible d'enregistrer la commande pour le moment.",
        503,
      );
    }

    const baseOrder = {
      orderNumber,
      items: totals.items,
      subtotal: totals.subtotal,
      shippingFee: totals.shippingFee,
      total: totals.total,
      paymentMethod: input.paymentMethod,
    };

    if (!isKadryza) {
      return NextResponse.json({ order: baseOrder }, { status: 201 });
    }

    try {
      const { data: claimedOrder, error: claimError } = await supabase
        .from("orders")
        .update({
          payment_status: "session_creating",
          payment_session_attempt_count: 1,
        })
        .eq("id", order.id)
        .eq("payment_status", "pending_payment")
        .select("id")
        .maybeSingle();

      if (claimError || !claimedOrder) {
        throw new KadryzaUnavailableError(
          "Impossible de préparer la session de paiement.",
        );
      }

      const session = await createKadryzaPaymentSession({
        reference: orderNumber,
        amount: totals.total,
        customerPhone: input.customer.paymentPhone!,
        description: `Commande Samiah ${orderNumber}`,
      });

      const { data: persistedSession, error: updateError } = await supabase
        .from("orders")
        .update({
          kadryza_session_id: session.id,
          kadryza_ticket: session.ticket,
          kadryza_collection_number: session.assigned_collection_number,
          kadryza_checkout_url: session.checkout_url ?? null,
          payment_status: "awaiting_payment",
          payment_expires_at: session.expires_at,
        })
        .eq("id", order.id)
        .eq("status", "pending_payment")
        .eq("payment_status", "session_creating")
        .select("id")
        .maybeSingle();

      if (updateError || !persistedSession) {
        console.error("kadryza_session_persist_failed", {
          code: updateError?.code ?? "no_row_updated",
          orderNumber,
        });
        await supabase
          .from("orders")
          .update({
            payment_status: "reconciliation_required",
            payment_failure_reason: "session_persist_failed",
          })
          .eq("id", order.id);
        return NextResponse.json(
          {
            order: baseOrder,
            payment: {
              status: "reconciliation_required",
              message:
                "La session créée doit être rapprochée manuellement. Ne relancez pas le paiement.",
              statusUrl: `/commande/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(statusToken)}`,
            },
          },
          { status: 201 },
        );
      }

      return NextResponse.json(
        {
          order: baseOrder,
          payment: {
            status: "awaiting_payment",
            operator: session.operator,
            environment: session.environment,
            collectionNumber: session.assigned_collection_number,
            ticket: session.ticket,
            expiresAt: session.expires_at,
            checkoutUrl: session.checkout_url ?? null,
            statusUrl: `/commande/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(statusToken)}`,
          },
        },
        { status: 201 },
      );
    } catch (error) {
      const publicMessage =
        error instanceof KadryzaUnavailableError
          ? error.message
          : "Kadryza est temporairement indisponible.";

      const paymentStatus =
        error instanceof KadryzaUnavailableError &&
        error.retrySafety === "reconciliation_required"
          ? "reconciliation_required"
          : "session_failed";
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: paymentStatus,
          payment_failure_reason:
            paymentStatus === "session_failed"
              ? "provider_unavailable"
              : "ambiguous_provider_result",
        })
        .eq("id", order.id)
        .eq("status", "pending_payment");

      if (updateError) {
        console.error("kadryza_unavailable_persist_failed", {
          code: updateError.code,
          orderNumber,
        });
      }

      return NextResponse.json(
        {
          order: baseOrder,
          payment: {
            status: paymentStatus,
            message: publicMessage,
            statusUrl: `/commande/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(statusToken)}`,
          },
        },
        { status: 201 },
      );
    }
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return clientError(error.message);
    }

    console.error("checkout_unexpected_error", {
      name: error instanceof Error ? error.name : "unknown",
    });
    return clientError(
      "Une erreur inattendue empêche la création de la commande.",
      500,
    );
  }
}
