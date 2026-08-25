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
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
