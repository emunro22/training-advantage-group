import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify a Certificate",
  alternates: { canonical: "/verify-certificate" },
  description:
    "Check the authenticity of a Training Advantage Group certificate by certificate number and surname.",
};

export default function VerifyCertificateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
