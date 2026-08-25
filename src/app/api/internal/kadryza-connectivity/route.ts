import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

function tokenMatches(request: Request): boolean {
  const expected = process.env.KADRYZA_ADMIN_AUDIT_TOKEN;
  const authorization = request.headers.get("authorization");
  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  const actual = authorization.slice("Bearer ".length);
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  if (!tokenMatches(request)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const apiUrl = process.env.KADRYZA_API_URL;
  const apiKey = process.env.KADRYZA_API_KEY;
  if (apiUrl !== "https://api.kadryza.app" || !apiKey) {
    return NextResponse.json({ error: "configuration_invalid" }, { status: 503 });
  }

  const headers = { "X-API-Key": apiKey };
  let action = "audit";
  try {
    const body = (await request.json()) as { action?: unknown };
    if (
      body.action === "create" ||
      body.action === "test" ||
      body.action === "cleanup"
    ) {
      action = body.action;
    }
  } catch {
    // Un body vide conserve le mode audit en lecture seule.
  }
  const listResponse = await fetch(`${apiUrl}/v1/webhooks`, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!listResponse.ok) {
    return NextResponse.json(
      { registered: false, listStatus: listResponse.status },
      { status: 502 },
    );
  }

  const body = (await listResponse.json()) as {
    endpoints?: Array<{ id: string; url: string; is_active: boolean }>;
  };
  const expectedUrl =
    "https://www.samiahcosmetics.shop/api/webhooks/kadryza";
  const endpoint = body.endpoints?.find(
    (item) => item.url === expectedUrl && item.is_active,
  );
  if (!endpoint) {
    if (action === "create") {
      const createResponse = await fetch(`${apiUrl}/v1/webhooks`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ url: expectedUrl }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      if (!createResponse.ok) {
        return NextResponse.json(
          { registered: false, createStatus: createResponse.status },
          { status: 502 },
        );
      }
      const created = (await createResponse.json()) as {
        secret?: string;
      };
      if (!created.secret) {
        return NextResponse.json(
          { registered: false, error: "secret_missing" },
          { status: 502 },
        );
      }
      return NextResponse.json({
        registered: true,
        exactUrl: true,
        created: true,
        secret: created.secret,
      });
    }
    return NextResponse.json(
      { registered: false, exactUrl: false },
      { status: 409 },
    );
  }

  if (action === "cleanup") {
    let staleEndpointsRemaining = 0;
    const staleEndpoints =
      body.endpoints?.filter(
        (item) => item.id !== endpoint.id && item.is_active,
      ) ?? [];
    for (const staleEndpoint of staleEndpoints) {
      const deleteResponse = await fetch(
        `${apiUrl}/v1/webhooks/${encodeURIComponent(staleEndpoint.id)}`,
        {
          method: "DELETE",
          headers,
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
        },
      );
      if (!deleteResponse.ok) staleEndpointsRemaining += 1;
    }
    return NextResponse.json({
      registered: true,
      exactUrl: true,
      staleEndpointsRemaining,
    });
  }

  if (action !== "test") {
    return NextResponse.json({
      registered: true,
      exactUrl: true,
      created: false,
    });
  }

  const testResponse = await fetch(
    `${apiUrl}/v1/webhooks/${encodeURIComponent(endpoint.id)}/test`,
    {
      method: "POST",
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    },
  );

  let staleEndpointsRemaining = 0;
  if (testResponse.ok) {
    const staleEndpoints =
      body.endpoints?.filter(
        (item) => item.id !== endpoint.id && item.is_active,
      ) ?? [];
    for (const staleEndpoint of staleEndpoints) {
      const deleteResponse = await fetch(
        `${apiUrl}/v1/webhooks/${encodeURIComponent(staleEndpoint.id)}`,
        {
          method: "DELETE",
          headers,
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
        },
      );
      if (!deleteResponse.ok) staleEndpointsRemaining += 1;
    }
  }

  return NextResponse.json(
    {
      registered: true,
      exactUrl: true,
      testDelivered: testResponse.ok,
      testStatus: testResponse.status,
      staleEndpointsRemaining,
    },
    { status: testResponse.ok ? 200 : 502 },
  );
}
