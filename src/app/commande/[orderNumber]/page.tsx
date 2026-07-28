import { notFound } from "next/navigation";

import PaymentStatusClient from "./PaymentStatusClient";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function PaymentStatusPage({
  params,
  searchParams,
}: PageProps) {
  const { orderNumber } = await params;
  const { token } = await searchParams;

  if (!token) notFound();

  return <PaymentStatusClient orderNumber={orderNumber} token={token} />;
}
