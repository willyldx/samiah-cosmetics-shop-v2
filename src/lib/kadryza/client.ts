import {
  KADRYZA_CURRENCY,
  KADRYZA_OPERATOR,
} from "../checkout/config.ts";
import {
  getKadryzaEnvironmentFromApiKey,
  type KadryzaEnvironment,
} from "./environment.ts";

export interface CreatePaymentSessionInput {
  reference: string;
  amount: number;
  customerPhone: string;
  description: string;
}

export interface KadryzaPaymentSession {
  id: string;
  reference: string;
  ticket: string;
  amount: number;
  currency: "XAF";
  operator: "AIRTEL";
  status: string;
  environment: KadryzaEnvironment;
  assigned_collection_number: string;
  expires_at: string;
  created_at: string;
  instructions?: string;
  checkout_url?: string;
}

export class KadryzaUnavailableError extends Error {
  readonly statusCode?: number;
  readonly retrySafety: "safe" | "reconciliation_required";

  constructor(
    message: string,
    statusCode?: number,
    retrySafety: "safe" | "reconciliation_required" = "safe",
  ) {
    super(message);
    this.name = "KadryzaUnavailableError";
    this.statusCode = statusCode;
    this.retrySafety = retrySafety;
  }
}

type Fetch = typeof fetch;

function requireConfiguration(): {
  apiUrl: string;
  apiKey: string;
  environment: KadryzaEnvironment;
} {
  const apiUrl = process.env.KADRYZA_API_URL?.replace(/\/+$/, "");
  const apiKey = process.env.KADRYZA_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new KadryzaUnavailableError(
      "Le paiement Mobile Money est temporairement indisponible.",
    );
  }

  let environment: KadryzaEnvironment;
  try {
    environment = getKadryzaEnvironmentFromApiKey(apiKey);
  } catch {
    throw new KadryzaUnavailableError(
      "La configuration Kadryza est invalide.",
    );
  }

  return { apiUrl, apiKey, environment };
}

function isValidSessionResponse(
  value: unknown,
  expectedEnvironment: KadryzaEnvironment,
): value is KadryzaPaymentSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Record<string, unknown>;

  const checkoutUrlIsValid = (() => {
    if (session.checkout_url === undefined) return true;
    if (typeof session.checkout_url !== "string") return false;
    try {
      const url = new URL(session.checkout_url);
      return (
        url.protocol === "https:" &&
        (url.hostname === "kadryza.app" ||
          url.hostname.endsWith(".kadryza.app"))
      );
    } catch {
      return false;
    }
  })();

  return (
    typeof session.id === "string" &&
    typeof session.reference === "string" &&
    typeof session.ticket === "string" &&
    typeof session.amount === "number" &&
    session.currency === KADRYZA_CURRENCY &&
    session.operator === KADRYZA_OPERATOR &&
    typeof session.status === "string" &&
    session.environment === expectedEnvironment &&
    typeof session.assigned_collection_number === "string" &&
    typeof session.expires_at === "string" &&
    typeof session.created_at === "string" &&
    checkoutUrlIsValid
  );
}

export async function createKadryzaPaymentSession(
  input: CreatePaymentSessionInput,
  fetchImplementation: Fetch = fetch,
): Promise<KadryzaPaymentSession> {
  const { apiUrl, apiKey, environment } = requireConfiguration();

  let response: Response;
  try {
    response = await fetchImplementation(`${apiUrl}/v1/payment-sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        reference: input.reference,
        amount: input.amount,
        currency: KADRYZA_CURRENCY,
        operator: KADRYZA_OPERATOR,
        customer_phone: input.customerPhone,
        description: input.description,
        metadata: {
          integration: "samiah-cosmetics",
          phase: "1A",
        },
        ttl_minutes: 15,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new KadryzaUnavailableError(
      "Réponse Kadryza incertaine. Une vérification manuelle est requise avant toute nouvelle tentative.",
      undefined,
      "reconciliation_required",
    );
  }

  if (response.status === 409) {
    throw new KadryzaUnavailableError(
      "Une session existe déjà pour cette commande. Une vérification manuelle est requise.",
      response.status,
      "reconciliation_required",
    );
  }

  if (!response.ok) {
    throw new KadryzaUnavailableError(
      "Kadryza est temporairement indisponible.",
      response.status,
    );
  }

  const body: unknown = await response.json();
  if (!isValidSessionResponse(body, environment)) {
    throw new KadryzaUnavailableError(
      "La réponse de Kadryza est invalide ou utilise un environnement inattendu.",
      undefined,
      "reconciliation_required",
    );
  }

  if (
    body.reference !== input.reference ||
    body.amount !== input.amount ||
    body.status !== "AWAITING_PAYMENT"
  ) {
    throw new KadryzaUnavailableError(
      "La session Kadryza ne correspond pas à la commande.",
      undefined,
      "reconciliation_required",
    );
  }

  return body;
}
