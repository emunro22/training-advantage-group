"use client";

import { useEffect, useState, useRef } from "react";
import { Award, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, XCircle, X, Search, Info, Upload, Download } from "lucide-react";
import type { Certificate } from "@/lib/storage";
import { CERT_TYPES } from "@/lib/cert-types";

// ─── CSV helpers ─────────────────────────────────────────────────────────────

function parseCSVRow(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      cells.push(cur.trim()); cur = "";
    } else { cur += ch; }
  }
  cells.push(cur.trim());
  return cells;
}

function parseDate(d: string): string {
  const t = d.trim();
  if (!t) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10);
  const m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) {
    const yr = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${yr}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  }
  return t;
}

type RawRow = Record<string, string>;

function colIdx(headers: string[], ...aliases: string[]): number {
  for (const alias of aliases) {
    const a = alias.toLowerCase();
    const idx = headers.findIndex((h) => h === a || h.includes(a) || a.includes(h));
    if (idx !== -1) return idx;
  }
  return -1;
}

function parseCertificateCSV(text: string): Partial<Certificate>[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const rawHeaders = parseCSVRow(lines[0]);
  const headers = rawHeaders.map((h) => h.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim());

  // Find column indices — support their existing spreadsheet headers + template headers
  const certNumIdx = colIdx(headers, "certificate number", "cert number", "certificatenumber", "cert no");
  // If there are two columns matching "certificate", prefer the one containing TAG- style values
  // We handle this by also checking position-based: if the above didn't match, try 2nd "certificate" col
  const allCertCols = headers.reduce<number[]>((acc, h, i) => {
    if (h === "certificate" || h.includes("certificate")) acc.push(i);
    return acc;
  }, []);

  const fNameIdx = colIdx(headers, "first name", "firstname", "holder first", "given name");
  const lNameIdx = colIdx(headers, "last name", "lastname", "surname", "holder last", "family name");
  const courseIdx = colIdx(headers, "course name", "course", "training course");
  const courseTypeIdx = colIdx(headers, "course type", "coursetype", "course typ", "type", "category");
  const issueDateIdx = colIdx(headers, "issue date", "issued", "date issued", "issueddate");
  const expiryDateIdx = colIdx(headers, "expiry date", "expiry", "expires", "expiration", "valid until");
  const statusIdx = colIdx(headers, "status", "cert status");
  const centreIdx = colIdx(headers, "training centre", "training center", "centre", "training ce", "center", "venue");
  const notesIdx = colIdx(headers, "notes", "note", "comments");

  return lines.slice(1).map((line) => {
    const vals = parseCSVRow(line);
    const get = (idx: number) => (idx >= 0 ? (vals[idx] ?? "").trim() : "");

    // Determine cert number: prefer certNumIdx, else detect TAG- from allCertCols
    let certNumber = get(certNumIdx);
    if (!certNumber && allCertCols.length > 0) {
      for (const ci of allCertCols) {
        const v = get(ci);
        if (/^TAG-/i.test(v) || /^\w+-\w+-\d{4}/.test(v)) { certNumber = v; break; }
      }
      if (!certNumber && allCertCols.length >= 2) certNumber = get(allCertCols[1]);
    }

    // courseType: prefer courseTypeIdx, else first non-certNumber certificate column
    let courseType = get(courseTypeIdx);
    if (!courseType && allCertCols.length > 0 && courseTypeIdx === -1) {
      const firstCertCol = allCertCols.find((ci) => get(ci) !== certNumber);
      if (firstCertCol !== undefined) courseType = get(firstCertCol);
    }

    const course = get(courseIdx) || courseType;
    const rawStatus = get(statusIdx).toLowerCase();
    const status: Certificate["status"] = rawStatus === "expired" ? "expired" : rawStatus === "revoked" ? "revoked" : "valid";

    return {
      certificateNumber: certNumber,
      holderFirstName: get(fNameIdx),
      holderLastName: get(lNameIdx),
      course,
      courseType,
      issueDate: parseDate(get(issueDateIdx)),
      expiryDate: parseDate(get(expiryDateIdx)),
      status,
      trainingCentre: get(centreIdx) || undefined,
      notes: get(notesIdx) || undefined,
    } satisfies Partial<Certificate>;
  }).filter((r) => r.certificateNumber || r.holderLastName);
}

const CERT_TEMPLATE_HEADERS = "certificateNumber,holderFirstName,holderLastName,course,courseType,issueDate,expiryDate,status,trainingCentre,notes";
const CERT_TEMPLATE_EXAMPLE = "TAG-DCPC-2024-001,John,Smith,Driver CPC,driver-cpc,2024-01-15,2029-01-15,valid,Bothwell,";

function downloadTemplate() {
  const csv = [CERT_TEMPLATE_HEADERS, CERT_TEMPLATE_EXAMPLE].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "certificates-template.csv"; a.click();
  URL.revokeObjectURL(url);
}

const EMPTY_FORM = {
  certificateNumber: "",
  holderFirstName: "",
  holderLastName: "",
  certTypeId: "other",
  course: "",
  courseType: "",
  issueDate: "",
  expiryDate: "",
  status: "valid" as Certificate["status"],
  trainingCentre: "",
  notes: "",
};

type ImportResult = { added: number; skipped: number; errors: number; invalid: number } | null;

export default function CertificatesAdmin() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/admin/certificates");
    const data = await res.json();
    setCerts(data.certificates ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(cert: Certificate) {
    setForm({
      certificateNumber: cert.certificateNumber,
      holderFirstName: cert.holderFirstName,
      holderLastName: cert.holderLastName,
      certTypeId: cert.courseType || "other",
      course: cert.course,
      courseType: cert.courseType,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      status: cert.status,
      trainingCentre: cert.trainingCentre ?? "",
      notes: cert.notes ?? "",
    });
    setEditId(cert.id);
    setError("");
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.certificateNumber || !form.holderLastName || !form.course) {
      setError("Certificate number, holder last name, and course are required.");
      return;
    }
    setSaving(true);
    setError("");

    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;

    const res = await fetch("/api/admin/certificates", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowForm(false);
      await load();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this certificate record?")) return;
    setDeleting(id);
    await fetch("/api/admin/certificates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
    setDeleting(null);
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setImporting(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const parsed = parseCertificateCSV(text);
      if (parsed.length === 0) {
        setImportResult({ added: 0, skipped: 0, errors: 0, invalid: 0 });
        setImporting(false);
        return;
      }
      const res = await fetch("/api/admin/certificates/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificates: parsed }),
      });
      const data = await res.json();
      setImportResult(data);
      await load();
    } catch {
      setImportResult({ added: 0, skipped: 0, errors: 1, invalid: 0 });
    }
    setImporting(false);
  }

  const filtered = certs.filter(
    (c) =>
      c.certificateNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.holderLastName.toLowerCase().includes(search.toLowerCase()) ||
      c.holderFirstName.toLowerCase().includes(search.toLowerCase()) ||
      c.course.toLowerCase().includes(search.toLowerCase())
  );

  const statusIcon = {
    valid: <CheckCircle2 size={14} className="text-green-600" />,
    expired: <AlertCircle size={14} className="text-amber-500" />,
    revoked: <XCircle size={14} className="text-red-500" />,
  };

  const statusBadge = {
    valid: "bg-green-100 text-green-700",
    expired: "bg-amber-100 text-amber-700",
    revoked: "bg-red-100 text-red-600",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Certificates</h1>
          <p className="text-gray-500 text-sm mt-1">Manage certificate records for the public checker</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 px-3 py-2 rounded-xl font-semibold text-sm hover:border-gray-300 hover:text-gray-800 transition-colors"
            title="Download CSV template"
          >
            <Download size={14} />
            Template
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 border-2 border-blue-brand/30 text-blue-brand px-3 py-2 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors disabled:opacity-50"
            title="Import from CSV or Excel (save as CSV first)"
          >
            <Upload size={14} />
            {importing ? "Importing…" : "Import CSV"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={handleImportFile}
          />
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Certificate
          </button>
        </div>
      </div>

      {/* Import result banner */}
      {importResult && (
        <div className={`flex items-start justify-between gap-3 px-4 py-3 rounded-xl text-sm border ${importResult.added > 0 ? "bg-green-50 border-green-200 text-green-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          <div>
            <span className="font-semibold">Import complete: </span>
            {importResult.added} added
            {importResult.skipped > 0 && `, ${importResult.skipped} skipped (duplicate)`}
            {importResult.invalid > 0 && `, ${importResult.invalid} invalid (missing required fields)`}
            {importResult.errors > 0 && `, ${importResult.errors} errors`}
          </div>
          <button onClick={() => setImportResult(null)} className="text-current opacity-60 hover:opacity-100 flex-shrink-0"><X size={14} /></button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by certificate number, name or course…"
          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Award size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{search ? "No certificates match your search." : "No certificates yet."}</p>
          {!search && (
            <button onClick={openAdd} className="text-blue-brand font-semibold text-sm hover:underline mt-2">
              Add your first certificate →
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Cert. Number</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Holder</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Course</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Issue Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Expiry</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-navy">{cert.certificateNumber}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{cert.holderFirstName} {cert.holderLastName}</td>
                    <td className="px-4 py-3 text-gray-600">{cert.course}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{cert.issueDate}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{cert.expiryDate || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${statusBadge[cert.status]}`}>
                        {statusIcon[cert.status]}
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(cert)} className="p-1.5 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          disabled={deleting === cert.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{editId ? "Edit Certificate" : "Add Certificate"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {/* Cert type selector */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Certificate Type *</label>
                  <select
                    value={form.certTypeId}
                    onChange={(e) => {
                      const t = CERT_TYPES.find((ct) => ct.id === e.target.value);
                      setForm((f) => ({
                        ...f,
                        certTypeId: e.target.value,
                        course: t ? t.label : f.course,
                        courseType: e.target.value,
                        certificateNumber: t ? (f.certificateNumber.startsWith("TAG-") ? t.prefix + f.certificateNumber.split("-").slice(-2).join("-") : t.prefix) : f.certificateNumber,
                        expiryDate: f.expiryDate,
                      }));
                    }}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white"
                  >
                    {CERT_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                  {form.certTypeId && (() => {
                    const t = CERT_TYPES.find((ct) => ct.id === form.certTypeId);
                    if (!t) return null;
                    return (
                      <div className="mt-1.5 flex items-start gap-1.5 text-xs text-gray-400">
                        <Info size={11} className="mt-0.5 flex-shrink-0" />
                        <span>Validity: <strong>{t.validity}</strong> · Format: <code className="font-mono">{t.exampleNumber}</code></span>
                      </div>
                    );
                  })()}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Certificate Number *</label>
                  <input
                    type="text"
                    value={form.certificateNumber}
                    onChange={(e) => setForm((f) => ({ ...f, certificateNumber: e.target.value }))}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand font-mono"
                    placeholder={CERT_TYPES.find(t => t.id === form.certTypeId)?.exampleNumber ?? "TAG-XXXX-2024-001"}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">First Name</label>
                  <input type="text" value={form.holderFirstName} onChange={(e) => setForm((f) => ({ ...f, holderFirstName: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Last Name *</label>
                  <input type="text" value={form.holderLastName} onChange={(e) => setForm((f) => ({ ...f, holderLastName: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Course *</label>
                  <input type="text" value={form.course} onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. IOSH Managing Safely" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Course Type</label>
                  <input type="text" value={form.courseType} onChange={(e) => setForm((f) => ({ ...f, courseType: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. Health & Safety" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Issue Date</label>
                  <input type="date" value={form.issueDate} onChange={(e) => setForm((f) => ({ ...f, issueDate: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Certificate["status"] }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white">
                    <option value="valid">Valid</option>
                    <option value="expired">Expired</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Training Centre</label>
                  <input type="text" value={form.trainingCentre} onChange={(e) => setForm((f) => ({ ...f, trainingCentre: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. Bothwell" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand resize-none" placeholder="Internal notes (not shown publicly)" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 bg-gray-50/50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light transition-colors disabled:opacity-40"
              >
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
