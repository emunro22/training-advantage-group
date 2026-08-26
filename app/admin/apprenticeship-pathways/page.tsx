"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Plus, Trash2, Edit2, X, ToggleLeft, ToggleRight, ChevronUp, ChevronDown, Download } from "lucide-react";

interface ApprenticeshipPathway {
  id: string;
  icon: string;
  title: string;
  description: string;
  status: "developing" | "live";
  sortOrder: number;
  active: boolean;
}

const ICONS = ["🚛", "🏗", "⚙", "💼", "🛒", "💻", "❤️", "🍽", "🎓", "🔧"];

const EMPTY_FORM = {
  icon: "🎓",
  title: "",
  description: "",
  status: "developing" as ApprenticeshipPathway["status"],
  sortOrder: 0,
  active: true,
};

const DEFAULT_PATHWAYS: Omit<ApprenticeshipPathway, "id">[] = [
  { icon: "🚛", title: "Transport & Logistics", description: "", status: "developing", sortOrder: 0, active: true },
  { icon: "🏗", title: "Plant & Construction", description: "", status: "developing", sortOrder: 1, active: true },
  { icon: "⚙", title: "Engineering & Manufacturing", description: "", status: "developing", sortOrder: 2, active: true },
  { icon: "💼", title: "Business & Administration", description: "", status: "developing", sortOrder: 3, active: true },
  { icon: "🛒", title: "Retail & Customer Service", description: "", status: "developing", sortOrder: 4, active: true },
  { icon: "💻", title: "Digital / IT", description: "", status: "developing", sortOrder: 5, active: true },
  { icon: "❤️", title: "Health & Social Care", description: "", status: "developing", sortOrder: 6, active: true },
  { icon: "🍽", title: "Hospitality & Leisure", description: "", status: "developing", sortOrder: 7, active: true },
];

export default function ApprenticeshipPathwaysAdmin() {
  const [pathways, setPathways] = useState<ApprenticeshipPathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/apprenticeship-pathways");
    const data = await res.json();
    setPathways(data.pathways ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm({ ...EMPTY_FORM, sortOrder: pathways.length });
    setEditId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(p: ApprenticeshipPathway) {
    setForm({ icon: p.icon, title: p.title, description: p.description, status: p.status, sortOrder: p.sortOrder, active: p.active });
    setEditId(p.id);
    setError("");
    setShowForm(true);
  }

  async function save() {
    if (!form.title.trim()) { setError("Pathway name is required."); return; }
    setSaving(true);
    setError("");
    const payload = { ...form, title: form.title.trim(), description: form.description.trim(), ...(editId ? { id: editId } : {}) };
    const res = await fetch("/api/admin/apprenticeship-pathways", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) { setShowForm(false); await load(); }
    else { const d = await res.json(); setError(d.error ?? "Failed to save"); }
    setSaving(false);
  }

  async function seedDefaults() {
    if (!confirm("This will add the 8 suggested pathways (Transport & Logistics, Plant & Construction, etc.) as Developing. Continue?")) return;
    setSeeding(true);
    for (const p of DEFAULT_PATHWAYS) {
      await fetch("/api/admin/apprenticeship-pathways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
    }
    await load();
    setSeeding(false);
  }

  async function remove(id: string) {
    if (!confirm("Remove this pathway? It will disappear from the Apprenticeships & SVQ page.")) return;
    await fetch("/api/admin/apprenticeship-pathways", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  async function toggleActive(p: ApprenticeshipPathway) {
    await fetch("/api/admin/apprenticeship-pathways", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, active: !p.active }) });
    await load();
  }

  async function toggleStatus(p: ApprenticeshipPathway) {
    const status = p.status === "live" ? "developing" : "live";
    await fetch("/api/admin/apprenticeship-pathways", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, status }) });
    await load();
  }

  async function moveOrder(p: ApprenticeshipPathway, dir: "up" | "down") {
    const sorted = [...pathways].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((x) => x.id === p.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swapTarget = sorted[swapIdx];
    await Promise.all([
      fetch("/api/admin/apprenticeship-pathways", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, sortOrder: swapTarget.sortOrder }) }),
      fetch("/api/admin/apprenticeship-pathways", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: swapTarget.id, sortOrder: p.sortOrder }) }),
    ]);
    await load();
  }

  const sorted = [...pathways].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <GraduationCap className="text-orange-brand" size={24} />
            Apprenticeship &amp; SVQ Pathways
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Pathway cards shown on the Apprenticeships &amp; SVQ page. Only mark a pathway <strong>Live</strong> once
            it&apos;s actually SDS-approved — everything else shows a &quot;provision currently in development&quot; banner.
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm flex-shrink-0">
          <Plus size={16} /> Add Pathway
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <GraduationCap size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No pathways yet.</p>
          <button onClick={openAdd} className="text-blue-brand font-semibold text-sm hover:underline mt-2">Add your first pathway →</button>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3">Or load the 8 suggested pathways to get started:</p>
            <button onClick={seedDefaults} disabled={seeding} className="inline-flex items-center gap-2 bg-orange-brand text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-dark disabled:opacity-40">
              <Download size={14} />
              {seeding ? "Loading…" : "Load Suggested Pathways"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((p, i) => (
            <div key={p.id} className={`bg-white rounded-2xl border p-4 ${p.active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-start gap-4">
                <div className="text-2xl flex-shrink-0 mt-0.5">{p.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start flex-wrap gap-2 mb-1">
                    <span className="font-bold text-sm text-navy">{p.title}</span>
                    <button
                      onClick={() => toggleStatus(p)}
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${p.status === "live" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}
                      title="Click to toggle Live / Developing"
                    >
                      {p.status === "live" ? "Live" : "Developing"}
                    </button>
                    {!p.active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">Hidden</span>}
                  </div>
                  {p.description && <p className="text-sm text-gray-600">{p.description}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveOrder(p, "up")} disabled={i === 0} className="p-1 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20"><ChevronUp size={13} /></button>
                    <button onClick={() => moveOrder(p, "down")} disabled={i === sorted.length - 1} className="p-1 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20"><ChevronDown size={13} /></button>
                  </div>
                  <button onClick={() => toggleActive(p)} title="Toggle visibility" className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                    {p.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors"><Edit2 size={15} /></button>
                  <button onClick={() => remove(p.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{editId ? "Edit Pathway" : "Add Pathway"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Icon</label>
                  <select value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} className="w-full px-2 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white">
                    {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Pathway Name *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. Transport & Logistics" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Approval Status</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setForm((f) => ({ ...f, status: "developing" }))} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${form.status === "developing" ? "border-amber-400 bg-amber-50 text-amber-700" : "border-gray-200 text-gray-500"}`}>
                    Developing
                  </button>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, status: "live" }))} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${form.status === "live" ? "border-green-400 bg-green-50 text-green-700" : "border-gray-200 text-gray-500"}`}>
                    Live (Approved)
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Developing pathways show a &quot;register your interest&quot; banner instead of &quot;Available Now&quot;.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm font-semibold text-gray-700">Active (show on site)</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50/50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Pathway"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
