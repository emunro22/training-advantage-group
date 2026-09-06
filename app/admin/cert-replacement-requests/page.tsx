"use client";

import { useEffect, useMemo, useState } from "react";
import { FileSignature, Mail, Phone, Trash2, CheckCircle2, Circle, CreditCard } from "lucide-react";

interface CertReplacementRequest {
  id: string;
  type: "electronic" | "awarding_body";
  status: "new" | "pending_payment" | "paid" | "handled";
  certificateNumber: string;
  holderName: string;
  course: string;
  awardingBody?: string;
  contactName: string;
  email: string;
  phone: string;
  notes?: string;
  amountPence?: number;
  createdAt: string;
}

const STATUS_LABEL: Record<CertReplacementRequest["status"], string> = {
  new: "New",
  pending_payment: "Awaiting payment",
  paid: "Paid",
  handled: "Handled",
};

const STATUS_BADGE: Record<CertReplacementRequest["status"], string> = {
  new: "bg-orange-100 text-orange-700",
  pending_payment: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  handled: "bg-green-100 text-green-700",
};

export default function CertReplacementRequestsAdmin() {
  const [requests, setRequests] = useState<CertReplacementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "handled">("open");

  async function load() {
    const res = await fetch("/api/admin/cert-replacement-requests");
    const data = await res.json();
    setRequests(data.requests ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this request permanently? This can't be undone.")) return;
    await fetch("/api/admin/cert-replacement-requests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  async function setStatus(id: string, status: CertReplacementRequest["status"]) {
    await fetch("/api/admin/cert-replacement-requests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  const filtered = useMemo(
    () =>
      filter === "all"
        ? requests
        : filter === "open"
        ? requests.filter((r) => r.status === "new" || r.status === "paid")
        : requests.filter((r) => r.status === "handled"),
    [requests, filter]
  );

  const openCount = requests.filter((r) => r.status === "new" || r.status === "paid").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <FileSignature className="text-orange-brand" size={24} />
          Certificate Replacement Requests
        </h1>
        <p className="text-gray-500 text-sm mt-1 max-w-xl">
          Free electronic reissue requests and paid awarding-body replacement orders submitted from the
          public Certificate Checker.
        </p>
      </div>

      <div className="flex gap-2">
        {(["open", "handled", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${filter === f ? "bg-navy text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-navy"}`}
          >
            {f === "open" ? `Open (${openCount})` : f === "handled" ? "Handled" : "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <FileSignature size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className={`bg-white rounded-2xl border p-4 ${r.status === "new" || r.status === "paid" ? "border-orange-200" : "border-gray-100"}`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                  {r.type === "awarding_body" ? <CreditCard size={16} className="text-orange-brand" /> : <FileSignature size={16} className="text-orange-brand" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-0.5">
                    <span className="font-bold text-sm text-navy font-mono">{r.certificateNumber}</span>
                    <span className="text-xs bg-blue-50 text-blue-brand px-2 py-0.5 rounded-full font-semibold">
                      {r.type === "awarding_body" ? "Awarding body (paid)" : "Electronic (free)"}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {r.holderName} · {r.course} · {new Date(r.createdAt).toLocaleString("en-GB")}
                    {r.awardingBody && <> · {r.awardingBody}</>}
                    {typeof r.amountPence === "number" && <> · £{(r.amountPence / 100).toFixed(2)}</>}
                  </p>

                  <div className="bg-gray-50 rounded-xl p-3 mb-2 space-y-1">
                    <div className="text-xs text-gray-600 font-semibold">{r.contactName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Mail size={11} /> <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a>
                    </div>
                    {r.phone && (
                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Phone size={11} /> <a href={`tel:${r.phone}`} className="hover:underline">{r.phone}</a>
                      </div>
                    )}
                  </div>
                  {r.notes && <p className="text-xs text-gray-600">{r.notes}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setStatus(r.id, r.status === "handled" ? "new" : "handled")}
                    className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                    title={r.status === "handled" ? "Mark as open" : "Mark handled"}
                  >
                    {r.status === "handled" ? <CheckCircle2 size={18} className="text-green-600" /> : <Circle size={18} />}
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
