"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Upload, Sparkles, AlertTriangle, ArrowRight, ArrowLeft, History, X } from "lucide-react";
import type { WebsiteProduct, PublicationLogEntry } from "@/lib/storage";

const DECISION_STYLES: Record<WebsiteProduct["publishDecision"], string> = {
  "Review Required": "bg-amber-50 text-amber-700 border-amber-200",
  "Director Approved": "bg-blue-50 text-blue-700 border-blue-200",
  "Web Pending": "bg-purple-50 text-purple-700 border-purple-200",
  Published: "bg-green-50 text-green-700 border-green-200",
};

function formatGBP(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<WebsiteProduct[]>([]);
  const [log, setLog] = useState<PublicationLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WebsiteProduct["publishDecision"] | "all">("all");
  const [showImport, setShowImport] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length };
    for (const p of products) c[p.publishDecision] = (c[p.publishDecision] ?? 0) + 1;
    return c;
  }, [products]);

  const filtered = filter === "all" ? products : products.filter((p) => p.publishDecision === filter);

  async function transition(id: string, action: "advance" | "revert") {
    setBusy(true);
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    await load();
    setBusy(false);
  }

  async function runSeed() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/admin/products/seed", { method: "POST" });
    const data = await res.json();
    setMessage(`Sample catalogue: ${data.added} added, ${data.updated} updated, ${data.unchanged} unchanged.`);
    await load();
    setBusy(false);
  }

  async function runImport() {
    if (!csvText.trim()) return;
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/admin/products/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv: csvText }),
    });
    const data = await res.json();
    if (data.error) {
      setMessage(`Import failed: ${data.error}`);
    } else {
      const errorNote = data.rowErrors?.length ? ` ${data.rowErrors.length} row(s) held for review (missing/invalid fields).` : "";
      setMessage(`Import complete: ${data.added} added, ${data.updated} updated, ${data.unchanged} unchanged.${errorNote}`);
      setCsvText("");
      setShowImport(false);
    }
    await load();
    setBusy(false);
  }

  async function loadLog() {
    const res = await fetch("/api/admin/products/log");
    const data = await res.json();
    setLog(data.log ?? []);
    setShowLog(true);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <ClipboardCheck className="text-orange-brand" size={24} />
          Website Products
        </h1>
        <p className="text-gray-500 text-sm mt-1 max-w-3xl">
          Governed catalogue from the TAG Master Pricing workbook. Per TAG-WEB-REQ-001 §4, &ldquo;Review Required is not
          authority to publish&rdquo; — a row only appears on the public site once it has been moved all the way to{" "}
          <strong>Published</strong> below.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowImport((s) => !s)}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm"
        >
          <Upload size={16} /> Import CSV
        </button>
        <button
          onClick={runSeed}
          disabled={busy}
          className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:border-orange-brand hover:text-orange-brand transition-colors disabled:opacity-40"
        >
          <Sparkles size={16} /> Load sample catalogue
        </button>
        <button
          onClick={loadLog}
          className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:border-blue-brand hover:text-blue-brand transition-colors"
        >
          <History size={16} /> Publication log
        </button>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-3 rounded-xl">{message}</div>
      )}

      {showImport && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm">Paste CSV export from the Master Pricing workbook</h3>
          <p className="text-xs text-gray-500">
            Required columns: PriceID, Category, Course/Service, Price Inc VAT. Recognised columns also include Variant,
            Accreditation, Delivery, Duration/Ratio, Max Candidates, Pricing Basis, VAT Treatment, Effective From/To,
            Public Note, Joining Pack Code, Issue Pack Code, Website Product ID, Web Slug, Sale Mode. Rows missing a
            required field are held for review rather than rejected outright.
          </p>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={8}
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-brand"
            placeholder="PriceID,Category,Course/Service,Variant,PriceIncVAT,VATTreatment&#10;TAG-0001,HGV & PCV,Category C Class 2 complete package,Complete route,1795,Standard 20%"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={runImport}
              disabled={busy || !csvText.trim()}
              className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light disabled:opacity-40"
            >
              {busy ? "Importing…" : "Import"}
            </button>
            <button onClick={() => setShowImport(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["all", "Review Required", "Director Approved", "Web Pending", "Published"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              filter === f ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f === "all" ? "All" : f} ({counts[f] ?? 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <ClipboardCheck size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No products in this view yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${DECISION_STYLES[p.publishDecision]}`}>
                      {p.publishDecision}
                    </span>
                    {p.needsVerification && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold bg-red-50 text-red-700 border border-red-200">
                        <AlertTriangle size={11} /> Verify against source workbook
                      </span>
                    )}
                    <span className="text-xs font-mono text-gray-400">{p.priceId}</span>
                    {p.websiteProductId && <span className="text-xs font-mono text-gray-400">{p.websiteProductId}</span>}
                  </div>
                  <div className="font-bold text-sm text-gray-800">
                    {p.courseService}
                    {p.variant && <span className="text-gray-400 font-normal"> — {p.variant}</span>}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {p.category} · {p.delivery || "Delivery TBC"} · {p.durationRatio || "Duration TBC"}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1.5">
                    <span className="font-bold text-navy">{formatGBP(p.priceIncVatPence)} inc VAT</span>
                    <span>{p.vatTreatment}</span>
                    <span className="capitalize">{p.saleMode}</span>
                    {p.issuePackCode && <span>Issue pack: {p.issuePackCode}</span>}
                    {!p.issuePackCode && <span className="text-amber-600">Issue pack: pending TAG assignment</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {p.publishDecision !== "Review Required" && (
                    <button
                      onClick={() => transition(p.id, "revert")}
                      disabled={busy}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40"
                      title="Move back one stage"
                    >
                      <ArrowLeft size={13} /> Back
                    </button>
                  )}
                  {p.publishDecision !== "Published" && (
                    <button
                      onClick={() => transition(p.id, "advance")}
                      disabled={busy}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-navy text-white hover:bg-navy-light transition-colors disabled:opacity-40"
                      title="Move forward one stage"
                    >
                      {p.publishDecision === "Web Pending" ? "Publish" : "Approve"} <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showLog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">Publication log</h3>
              <button onClick={() => setShowLog(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="overflow-y-auto p-5 space-y-2">
              {log.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No changes logged yet.</p>
              ) : log.map((e) => (
                <div key={e.id} className="text-xs border border-gray-100 rounded-xl p-3">
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span className="font-mono">{e.priceId}</span>
                    <span>{new Date(e.createdAt).toLocaleString("en-GB")}</span>
                  </div>
                  <div className="font-semibold text-gray-700">{e.changeType}</div>
                  {e.previousValue && <div className="text-gray-500">From: {e.previousValue}</div>}
                  {e.newValue && <div className="text-gray-500">To: {e.newValue}</div>}
                  {e.outcome && <div className="text-gray-400 mt-1 italic">{e.outcome}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
