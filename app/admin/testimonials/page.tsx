"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Plus, Trash2, Edit2, X, Star, ToggleLeft, ToggleRight } from "lucide-react";
import type { Testimonial } from "@/lib/storage";

const CATEGORIES = ["Driver CPC", "TM CPC", "HGV Training", "ADR Training", "Plant Training", "Fleet Training", "Consultancy", "E-Learning", "General"];

const EMPTY_FORM = {
  name: "",
  company: "",
  role: "",
  text: "",
  rating: 5,
  category: "",
  active: true,
  featured: false,
};

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/testimonials");
    const data = await res.json();
    setTestimonials(data.testimonials ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(t: Testimonial) {
    setForm({
      name: t.name,
      company: t.company,
      role: t.role,
      text: t.text,
      rating: t.rating,
      category: t.category ?? "",
      active: t.active,
      featured: t.featured,
    });
    setEditId(t.id);
    setError("");
    setShowForm(true);
  }

  async function save() {
    if (!form.name || !form.text) { setError("Name and review text are required."); return; }
    setSaving(true);
    setError("");
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    const res = await fetch("/api/admin/testimonials", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setShowForm(false); await load(); }
    else { const d = await res.json(); setError(d.error ?? "Failed to save"); }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch("/api/admin/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  async function toggle(t: Testimonial, field: "active" | "featured") {
    await fetch("/api/admin/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, [field]: !t[field] }),
    });
    await load();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Testimonials</h1>
        <p className="text-gray-500 text-sm mt-1">Manage customer reviews shown on the testimonials page and homepage</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
        <strong>Active</strong> = shown on the Testimonials page. <strong>Featured</strong> = also shown in the homepage preview (up to 4).
      </div>

      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <MessageSquare size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No testimonials yet.</p>
          <button onClick={openAdd} className="text-blue-brand font-semibold text-sm hover:underline mt-2">Add your first testimonial →</button>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className={`bg-white rounded-2xl border p-4 ${t.active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-800">{t.name}</span>
                    {t.role && <span className="text-xs text-gray-500">{t.role}</span>}
                    {t.company && <span className="text-xs text-orange-brand/80">{t.company}</span>}
                    {t.category && (
                      <span className="text-xs bg-blue-50 text-blue-brand px-2 py-0.5 rounded-full font-semibold">{t.category}</span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mb-1.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={11} className="text-orange-brand fill-orange-brand" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">&ldquo;{t.text}&rdquo;</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggle(t, "featured")}
                    title={t.featured ? "Remove from homepage" : "Show on homepage"}
                    className={`p-2 rounded-lg text-xs font-semibold transition-colors ${t.featured ? "bg-orange-100 text-orange-brand" : "text-gray-400 hover:bg-orange-50 hover:text-orange-brand"}`}
                  >
                    <Star size={14} className={t.featured ? "fill-orange-brand" : ""} />
                  </button>
                  <button onClick={() => toggle(t, "active")} title="Toggle active" className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                    {t.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} />}
                  </button>
                  <button onClick={() => openEdit(t)} className="p-2 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => remove(t.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{editId ? "Edit Testimonial" : "Add Testimonial"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. John Smith" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Company</label>
                  <input type="text" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. Smith Haulage" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Role / Title</label>
                  <input type="text" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. Transport Manager" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white">
                    <option value="">— Select —</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Review Text *</label>
                <textarea value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} rows={4} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand resize-none" placeholder="Write the customer's review here…" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setForm((f) => ({ ...f, rating: n }))} className="p-1">
                      <Star size={22} className={n <= form.rating ? "text-orange-brand fill-orange-brand" : "text-gray-300"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded" />
                  <span className="text-sm font-semibold text-gray-700">Active (show on site)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 rounded" />
                  <span className="text-sm font-semibold text-gray-700">Featured (homepage)</span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50/50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
