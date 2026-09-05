import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SpecialOfferBanner from "@/components/layout/SpecialOfferBanner";
import RouteGate from "@/components/layout/RouteGate";
import CookieConsent from "@/components/layout/CookieConsent";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";
import StructuredData from "@/components/seo/StructuredData";
import { buildOrganizationSchema } from "@/lib/schema";
import { getGoogleReviews } from "@/lib/google-reviews";
import { getCustomPages } from "@/lib/storage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.trainingadvantagegroup.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Training Advantage Group | Transport & Industrial Training",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reviews = await getGoogleReviews().catch(() => null);
  const customPages = await getCustomPages(true).catch(() => []); // published only, no auth needed
  const navCustomPages = customPages.map((p) => ({ slug: p.slug, title: p.title, navLabel: p.navLabel, navCategory: p.navCategory }));
  const reviewsSummary = reviews ? { rating: reviews.rating, totalReviews: reviews.totalReviews } : null;

  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <StructuredData data={buildOrganizationSchema(reviews)} />
      </head>
      <body className="font-sans antialiased">
        <RouteGate exclude={["/admin", "/portal"]}>
          <SpecialOfferBanner />
          <Header customPages={navCustomPages} reviewsSummary={reviewsSummary} />
        </RouteGate>
        <main className="min-h-screen">{children}</main>
        <RouteGate exclude={["/admin", "/portal"]}>
          <Footer />
        </RouteGate>
        <Analytics />
        <RouteGate exclude={["/admin", "/portal"]}>
          <GoogleAnalytics />
          <CookieConsent />
        </RouteGate>
      </body>
    </html>
  );
}
