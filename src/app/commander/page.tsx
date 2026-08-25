import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <CheckoutClient
      kadryzaEnabled={process.env.KADRYZA_PAYMENT_ENABLED === "true"}
    />
  );
}
