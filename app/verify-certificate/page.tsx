"use client";

import { useState } from "react";
import { Search, CheckCircle2, XCircle, AlertCircle, Award, Calendar, MapPin, BookOpen, Shield } from "lucide-react";
import Link from "next/link";

interface CertResult {
  found: boolean;
  certificate?: {
    certificateNumber: string;
    holderName: string;
    course: string;
    courseType: string;
    issueDate: string;
    expiryDate: string;
    status: "valid" | "expired" | "revoked";
    trainingCentre?: string;
  };
}

function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function VerifyCertificatePage() {
  const [certNumber, setCertNumber] = useState("");
  const [lastName, setLastName] = useState("");
  const [result, setResult] = useState<CertResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!certNumber.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/certificates/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificateNumber: certNumber.trim(),
          lastName: lastName.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Server error");
      const data: CertResult = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setCertNumber("");
    setLastName("");
    setError("");
  }

  const statusConfig = {
    valid: {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      badge: "bg-green-100 text-green-700",
      label: "Valid",
      message: "This certificate is valid and has been issued by Training Advantage Group Ltd.",
    },
    expired: {
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700",
      label: "Expired",
      message: "This certificate has expired. The holder may need to renew their training.",
    },
    revoked: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      badge: "bg-red-100 text-red-700",
      label: "Revoked",
      message: "This certificate has been revoked. Please contact us for more information.",
    },
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-hero overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 pattern-bg pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-brand/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-brand via-red-brand to-orange-brand" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-brand/20 border border-orange-brand/30 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            <Shield size={13} />
            Certificate Verification
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Verify a Certificate
          </h1>
          <p className="text-lg text-blue-light/90 max-w-xl mx-auto leading-relaxed">
            Enter a certificate number below to instantly verify its authenticity and check the holder&apos;s details.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 bg-gray-light min-h-[60vh]">
        <div className="max-w-2xl mx-auto px-4">

          {/* Search form */}
          {!result && (
            <div className="bg-white rounded-2xl shadow-card p-8 mb-6">
              <div className="text-center mb-7">
                <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Award size={26} className="text-orange-brand" />
                </div>
                <h2 className="text-xl font-black text-navy">Certificate Checker</h2>
                <p className="text-gray-500 text-sm mt-1">Verify any certificate issued by Training Advantage Group Ltd</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Certificate Number *
                  </label>
                  <input
                    type="text"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors font-mono"
                    placeholder="e.g. TAG-IOSH-2024-001"
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Holder&apos;s Last Name
                    <span className="ml-1.5 text-xs font-normal text-gray-400">(optional — adds extra verification)</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors"
                    placeholder="Smith"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <XCircle size={16} className="flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !certNumber.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-navy text-white font-bold py-3.5 rounded-xl hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Checking…
                    </>
                  ) : (
                    <>
                      <Search size={17} />
                      Verify Certificate
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Not found */}
          {result && !result.found && (
            <div className="bg-white rounded-2xl shadow-card p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Certificate Not Found</h2>
              <p className="text-gray-500 text-sm mb-2">
                No certificate matching <span className="font-mono font-semibold text-gray-700">{certNumber}</span> was found in our records.
              </p>
              {lastName && (
                <p className="text-gray-400 text-xs mb-5">
                  (searched with last name: {lastName})
                </p>
              )}
              <p className="text-gray-500 text-sm mb-6">
                Please double-check the certificate number. If you believe this is an error, please{" "}
                <Link href="/contact" className="text-blue-brand font-semibold hover:underline">contact us</Link>.
              </p>
              <button onClick={handleReset} className="btn-navy">
                Search Again
              </button>
            </div>
          )}

          {/* Found */}
          {result?.found && result.certificate && (() => {
            const cert = result.certificate;
            const cfg = statusConfig[cert.status];
            const Icon = cfg.icon;

            return (
              <div className={`bg-white rounded-2xl shadow-card overflow-hidden border-2 ${cfg.border}`}>
                {/* Status banner */}
                <div className={`${cfg.bg} px-6 py-4 flex items-center gap-3 border-b ${cfg.border}`}>
                  <Icon size={22} className={cfg.color} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900">Certificate {cert.status === "valid" ? "Verified" : cert.status === "expired" ? "Expired" : "Revoked"}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{cfg.message}</p>
                  </div>
                </div>

                {/* Certificate details */}
                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award size={18} className="text-orange-brand" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Certificate Number</div>
                      <div className="font-mono font-bold text-navy text-lg">{cert.certificateNumber}</div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Certificate Holder</div>
                      <div className="font-bold text-gray-900">{cert.holderName}</div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                        <BookOpen size={12} />
                        Course
                      </div>
                      <div className="font-bold text-gray-900 text-sm">{cert.course}</div>
                      {cert.courseType && <div className="text-xs text-gray-500 mt-0.5">{cert.courseType}</div>}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                        <Calendar size={12} />
                        Issue Date
                      </div>
                      <div className="font-bold text-gray-900 text-sm">{fmtDate(cert.issueDate)}</div>
                    </div>

                    <div className={`rounded-xl p-4 ${cert.status === "valid" ? "bg-green-50" : cert.status === "expired" ? "bg-amber-50" : "bg-red-50"}`}>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                        <Calendar size={12} />
                        Expiry Date
                      </div>
                      <div className={`font-bold text-sm ${cert.status === "valid" ? "text-green-800" : cert.status === "expired" ? "text-amber-800" : "text-red-800"}`}>
                        {cert.expiryDate ? fmtDate(cert.expiryDate) : "No expiry"}
                      </div>
                    </div>

                    {cert.trainingCentre && (
                      <div className="bg-gray-50 rounded-xl p-4 sm:col-span-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                          <MapPin size={12} />
                          Training Centre
                        </div>
                        <div className="font-bold text-gray-900 text-sm">{cert.trainingCentre}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
                    <Shield size={14} className="text-blue-brand flex-shrink-0" />
                    <span>
                      Verified by <strong className="text-gray-600">Training Advantage Group Ltd</strong>. This information was retrieved from our certificate registry.
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-6 flex gap-3">
                  <button onClick={handleReset} className="btn-navy flex-1 justify-center">
                    Verify Another
                  </button>
                  <Link href="/contact" className="btn-outline flex-1 justify-center">
                    Contact Us
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* Info box */}
          {!result && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-sm text-gray-700 mb-2">How it works</h3>
              <ul className="space-y-1.5">
                {[
                  "Enter the certificate number exactly as it appears on the certificate",
                  "Optionally add the holder's last name for extra verification",
                  "Results are instant — the system checks our certificate registry",
                  "Valid, expired and revoked status is displayed clearly",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                    <CheckCircle2 size={14} className="text-blue-brand flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                Employers, customers and third parties can use this tool to verify the authenticity of any certificate issued by TAG.
                If you need to report a fraudulent certificate, please{" "}
                <Link href="/contact" className="text-blue-brand hover:underline">contact us</Link>.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
