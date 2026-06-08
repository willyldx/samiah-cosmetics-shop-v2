import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Samiah Cosmetics Tchad — Soins Capillaires & Consultation",
  description: "Boutique de soins capillaires au Tchad. Diagnostic gratuit, produits naturels pour cheveux crépus et frisés. Livraison à N'Djamena, Moundou, Sarh.",
  keywords: "samiah cosmetics, soins capillaires tchad, cheveux crépus n'djamena, produits cheveux afro, coiffeuse tchad, routine capillaire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white selection:bg-gold-light/30 selection:text-charcoal font-sans">
        <Header />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
