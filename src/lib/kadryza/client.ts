import { KADRYZA_CURRENCY } from "../checkout/config.ts";
import {
  getKadryzaEnvironmentFromApiKey,
  type KadryzaEnvironment,
} from "./environment.ts";

export interface CreateHostedCheckoutInput {
  reference: string;
  amount: number;
  description: string;
}

export interface KadryzaHostedCheckoutIntent {
  id: string;
  reference: string;
  amount: number;
  currency: "XAF";
  environment: KadryzaEnvironment;
  status: "OPEN" | "SELECTED" | "EXPIRED";
  selected_operator?: string;
  payment_session_id?: string;
  expires_at: string;
  created_at: string;
  checkout_url: string;
}

export interface KadryzaCheckoutPaymentSession {
  id: string;
  reference: string;
  ticket: string;
  amount: number;
  currency: "XAF";
  operator: string;
  status: string;
  environment: KadryzaEnvironment;
  assigned_collection_number: string;
  expires_at: string;
  instructions: string;
}

export interface KadryzaHostedCheckoutView {
  id: string;
  reference: string;
  amount: number;
  currency: "XAF";
  environment: KadryzaEnvironment;
  status: "OPEN" | "SELECTED" | "EXPIRED";
  operator_availability: string;
  expires_at: string;
  eligible_operators: Array<{ operator: string; label: string }>;
  payment_session?: KadryzaCheckoutPaymentSession;
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
      "Le paiement Kadryza est temporairement indisponible.",
    );
  }
  try {
    const parsedApiUrl = new URL(apiUrl);
    if (parsedApiUrl.origin !== "https://api.kadryza.app") {
      throw new Error("unexpected_api_origin");
    }
  } catch {
    throw new KadryzaUnavailableError(
      "L'URL API Kadryza est invalide.",
    );
  }

  let environment: KadryzaEnvironment;
  try {
    environment = getKadryzaEnvironmentFromApiKey(apiKey);
  } catch {
    throw new KadryzaUnavailableError("La configuration Kadryza est invalide.");
  }
  return { apiUrl, apiKey, environment };
}

function isKadryzaCheckoutUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "kadryza.app" || url.hostname.endsWith(".kadryza.app"))
    );
  } catch {
    return false;
  }
}

function isEnvironment(
  value: unknown,
  expected: KadryzaEnvironment,
): value is KadryzaEnvironment {
  return value === expected;
}

function isValidIntentResponse(
  value: unknown,
  expectedEnvironment: KadryzaEnvironment,
): value is KadryzaHostedCheckoutIntent {
  if (!value || typeof value !== "object") return false;
  const intent = value as Record<string, unknown>;
  return (
    typeof intent.id === "string" &&
    typeof intent.reference === "string" &&
    typeof intent.amount === "number" &&
    intent.currency === KADRYZA_CURRENCY &&
    isEnvironment(intent.environment, expectedEnvironment) &&
    ["OPEN", "SELECTED", "EXPIRED"].includes(String(intent.status)) &&
    typeof intent.expires_at === "string" &&
    typeof intent.created_at === "string" &&
    isKadryzaCheckoutUrl(intent.checkout_url)
  );
}

function isCheckoutPaymentSession(
  value: unknown,
  expectedEnvironment: KadryzaEnvironment,
): value is KadryzaCheckoutPaymentSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Record<string, unknown>;
  return (
    typeof session.id === "string" &&
    typeof session.reference === "string" &&
    typeof session.ticket === "string" &&
    typeof session.amount === "number" &&
    session.currency === KADRYZA_CURRENCY &&
    typeof session.operator === "string" &&
    session.operator.length > 0 &&
    typeof session.status === "string" &&
    isEnvironment(session.environment, expectedEnvironment) &&
    typeof session.assigned_collection_number === "string" &&
    typeof session.expires_at === "string" &&
    typeof session.instructions === "string"
  );
}

function isValidHostedCheckoutView(
  value: unknown,
  expectedEnvironment: KadryzaEnvironment,
): value is KadryzaHostedCheckoutView {
  if (!value || typeof value !== "object") return false;
  const view = value as Record<string, unknown>;
  if (
    typeof view.id !== "string" ||
    typeof view.reference !== "string" ||
    typeof view.amount !== "number" ||
    view.currency !== KADRYZA_CURRENCY ||
    !isEnvironment(view.environment, expectedEnvironment) ||
    !["OPEN", "SELECTED", "EXPIRED"].includes(String(view.status)) ||
    typeof view.operator_availability !== "string" ||
    typeof view.expires_at !== "string" ||
    !Array.isArray(view.eligible_operators)
  ) {
    return false;
  }
  if (
    !view.eligible_operators.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as Record<string, unknown>).operator === "string" &&
        typeof (item as Record<string, unknown>).label === "string",
    )
  ) {
    return false;
  }
  return (
    view.payment_session === undefined ||
    isCheckoutPaymentSession(view.payment_session, expectedEnvironment)
  );
}

export async function createKadryzaHostedCheckout(
  input: CreateHostedCheckoutInput,
  fetchImplementation: Fetch = fetch,
): Promise<KadryzaHostedCheckoutIntent> {
  const { apiUrl, apiKey, environment } = requireConfiguration();
  let response: Response;
  try {
    response = await fetchImplementation(`${apiUrl}/v1/hosted-checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        reference: input.reference,
        amount: input.amount,
        currency: KADRYZA_CURRENCY,
        description: input.description,
        metadata: {
          integration: "samiah-cosmetics",
          phase: "live-1a",
        },
        ttl_minutes: 15,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    // Le contrat Hosted Checkout est idempotent par référence et empreinte.
    throw new KadryzaUnavailableError(
      "Kadryza n'a pas répondu. Vous pouvez réessayer cette même commande.",
    );
  }

  if (!response.ok) {
    throw new KadryzaUnavailableError(
      response.status === 409
        ? "La référence Kadryza existe avec des paramètres différents. Une vérification est requise."
        : "Kadryza est temporairement indisponible.",
      response.status,
      response.status === 409 ? "reconciliation_required" : "safe",
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new KadryzaUnavailableError(
      "La réponse du Hosted Checkout est illisible.",
      undefined,
      "reconciliation_required",
    );
  }
  if (!isValidIntentResponse(body, environment)) {
    throw new KadryzaUnavailableError(
      "La réponse du Hosted Checkout est invalide ou utilise un environnement inattendu.",
      undefined,
      "reconciliation_required",
    );
  }
  if (body.reference !== input.reference || body.amount !== input.amount) {
    throw new KadryzaUnavailableError(
      "Le Hosted Checkout ne correspond pas à la commande.",
      undefined,
      "reconciliation_required",
    );
  }
  return body;
}

export async function getKadryzaHostedCheckout(
  intentId: string,
  fetchImplementation: Fetch = fetch,
): Promise<KadryzaHostedCheckoutView> {
  const { apiUrl, environment } = requireConfiguration();
  let response: Response;
  try {
    response = await fetchImplementation(
      `${apiUrl}/v1/checkout/intents/${encodeURIComponent(intentId)}`,
      { cache: "no-store", signal: AbortSignal.timeout(5_000) },
    );
  } catch {
    throw new KadryzaUnavailableError(
      "Impossible de vérifier le Hosted Checkout.",
    );
  }
  if (!response.ok) {
    throw new KadryzaUnavailableError(
      "Le Hosted Checkout est temporairement indisponible.",
      response.status,
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new KadryzaUnavailableError("La réponse du Hosted Checkout est illisible.");
  }
  if (!isValidHostedCheckoutView(body, environment) || body.id !== intentId) {
    throw new KadryzaUnavailableError("La réponse du Hosted Checkout est invalide.");
  }
  return body;
}
