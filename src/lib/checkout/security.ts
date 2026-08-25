import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function hashStatusAccessToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function statusAccessTokenMatches(
  token: string,
  expectedHash: string,
): boolean {
  const actual = Buffer.from(hashStatusAccessToken(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");

  return (
    actual.length === expected.length && timingSafeEqual(actual, expected)
  );
}

export function createOrderNumber(now = new Date()): string {
  const date = [
    now.getUTCFullYear().toString().slice(-2),
    (now.getUTCMonth() + 1).toString().padStart(2, "0"),
    now.getUTCDate().toString().padStart(2, "0"),
  ].join("");
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `SC${date}-${suffix}`;
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    if (originUrl.origin === requestUrl.origin) return true;

    const forwardedHost = request.headers
      .get("x-forwarded-host")
      ?.split(",", 1)[0]
      .trim();
    const forwardedProto = request.headers
      .get("x-forwarded-proto")
      ?.split(",", 1)[0]
      .trim();
    if (
      !forwardedHost ||
      !/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(forwardedHost) ||
      (forwardedProto !== "https" && forwardedProto !== "http")
    ) {
      return false;
    }

    return originUrl.origin === `${forwardedProto}://${forwardedHost}`;
  } catch {
    return false;
  }
}
