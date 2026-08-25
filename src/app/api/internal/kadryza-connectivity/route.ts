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
    return NextResponse.json(
      { registered: false, exactUrl: false },
      { status: 409 },
    );
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

  return NextResponse.json(
    {
      registered: true,
      exactUrl: true,
      testDelivered: testResponse.ok,
      testStatus: testResponse.status,
    },
    { status: testResponse.ok ? 200 : 502 },
  );
}
