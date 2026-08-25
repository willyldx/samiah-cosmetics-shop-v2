export type KadryzaEnvironment = "test" | "live";

export function getKadryzaEnvironmentFromApiKey(
  apiKey: string,
): KadryzaEnvironment {
  if (apiKey.startsWith("kadryza_test_")) return "test";
  if (apiKey.startsWith("kadryza_live_")) return "live";
  throw new Error("La clé API Kadryza n'a pas un préfixe reconnu.");
}
