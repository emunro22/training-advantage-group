import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "Training Advantage Group Ltd | Professional Transport & Industrial Training Scotland",
    template: "%s | Training Advantage Group Ltd",
  },
  description:
    "Scotland's leading provider of transport, logistics, compliance and industrial training. Driver CPC, Transport Manager CPC, HGV/PCV, ADR, Plant, NPORS & E-Learning. Bothwell, Motherwell & Glasgow.",
  keywords: [
    "Driver CPC Scotland",
    "Transport Manager CPC",
    "HGV Training Glasgow",
    "ADR Training Scotland",
    "Forklift Training",
    "NPORS Scotland",
    "Training Advantage Group",
    "TM CPC Scotland",
    "Fleet Training",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/images/logo.png",
  },
  openGraph: {
    siteName: "Training Advantage Group Ltd",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
