"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Plus, Trash2, Edit2, X, ToggleLeft, ToggleRight, ExternalLink } from "lucide-react";
import type { AccreditationLogo } from "@/lib/storage";
import ImageUploadField from "@/components/admin/ImageUploadField";

const EMPTY_FORM = {
  name: "",
  typeLabel: "",
  logoUrl: "",
  linkUrl: "",
  altText: "",
  placement: "both" as AccreditationLogo["placement"],
  active: true,
};

const PLACEMENT_LABELS: Record<AccreditationLogo["placement"], string> = {
  footer: "Footer only",
  accreditations_page: "Accreditations page only",
  both: "Footer & Accreditations page",
};

export default function AccreditationsAdmin() {
  const [logos, setLogos] = useState<AccreditationLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/accreditations");
    const data = await res.json();
    setLogos(data.logos ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(l: AccreditationLogo) {
    setForm({
      name: l.name,
      typeLabel: l.typeLabel,
      logoUrl: l.logoUrl,
      linkUrl: l.linkUrl ?? "",
      altText: l.altText,
      placement: l.placement,
      active: l.active,
    });
    setEditId(l.id);
    setError("");
    setShowForm(true);
  }

  async function save() {
    if (!form.name || !form.logoUrl) { setError("Name and logo are required."); return; }
    setSaving(true);
    setError("");
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    const res = await fetch("/api/admin/accreditations", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setShowForm(false); await load(); }
    else { const d = await res.json(); setError(d.error ?? "Failed"); }
    setSaving(false);
  }

  async function toggleActive(l: AccreditationLogo) {
    await fetch("/api/admin/accreditations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: l.id, active: !l.active }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this accreditation logo?")) return;
    await fetch("/api/admin/accreditations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-orange-brand" size={24} />
            Accreditation Logos
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Manage the logos shown in the site footer and on the Accreditations page. Until you add any here, the
            site keeps showing its original logo set — nothing changes until you take over a placement.
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm">
          <Plus size={16} /> Add Logo
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : logos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <ShieldCheck size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No custom logos yet — the site is showing its original set.</p>
          <button onClick={openAdd} className="text-blue-brand font-semibold text-sm hover:underline mt-2">Add your first logo →</button>
        </div>
      ) : (
        <div className="space-y-2">
          {logos.map((l) => (
            <div key={l.id} className={`bg-white rounded-2xl border p-4 flex items-center gap-4 ${l.active ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.logoUrl} alt="" className="w-14 h-14 rounded-lg object-contain bg-gray-50 border border-gray-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-sm text-gray-800">{l.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${l.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {l.active ? "Active" : "Inactive"}
                  </span>
                </div>
                {l.typeLabel && <p className="text-sm text-gray-500">{l.typeLabel}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                  <span>{PLACEMENT_LABELS[l.placement]}</span>
                  {l.linkUrl && (
                    <a href={l.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-brand hover:underline">
                      Link <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(l)} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Toggle active">
                  {l.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => openEdit(l)} className="p-2 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => remove(l.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{editId ? "Edit Logo" : "Add Accreditation Logo"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>}
              <ImageUploadField
                label="Logo *"
                value={form.logoUrl}
                onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
                folder="accreditations"
              />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. NPORS Accredited" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Type / Description</label>
                <input type="text" value={form.typeLabel} onChange={(e) => setForm((f) => ({ ...f, typeLabel: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. Approved Training Provider" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Link URL (optional)</label>
                <input type="url" value={form.linkUrl} onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="https://…" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Alt text</label>
                <input type="text" value={form.altText} onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="Defaults to name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Where it shows</label>
                <select value={form.placement} onChange={(e) => setForm((f) => ({ ...f, placement: e.target.value as AccreditationLogo["placement"] }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white">
                  <option value="both">Footer & Accreditations page</option>
                  <option value="footer">Footer only</option>
                  <option value="accreditations_page">Accreditations page only</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm font-semibold text-gray-700">Active (visible on site)</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50/50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Logo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
