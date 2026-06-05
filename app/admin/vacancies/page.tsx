"use client";

import { useEffect, useState } from "react";
import { Briefcase, Plus, Trash2, Edit2, X, ToggleLeft, ToggleRight, Download, ChevronDown, ChevronUp } from "lucide-react";
import type { JobVacancy } from "@/lib/storage";

const ICONS = ["💼", "🚛", "📋", "⚠️", "🏗️", "🎓", "🔧", "🚌", "📦", "🏭"];

const JOB_TYPES = ["Full-time", "Part-time", "Full-time / Part-time", "Full-time / Freelance", "Freelance", "Contract"];

const DEFAULT_VACANCIES: Omit<JobVacancy, "id" | "createdAt">[] = [
  {
    title: "Driver CPC Instructor",
    type: "Full-time / Part-time",
    location: "Bothwell / Motherwell / Glasgow",
    description: "Deliver engaging Driver CPC periodic training sessions across our Scottish training centres. JAUPT approved content, professional facilities.",
    requirements: ["Current Driver CPC qualification", "Strong communication skills", "Transport industry background preferred"],
    icon: "🚛",
    active: true,
    sortOrder: 0,
  },
  {
    title: "Transport Manager CPC Tutor",
    type: "Full-time / Freelance",
    location: "Bothwell HQ + Remote",
    description: "Teach Transport Manager CPC classroom intensive courses. Thorough knowledge of the TM CPC syllabus and NLTC qualification framework required.",
    requirements: ["Transport Manager CPC qualification", "Teaching experience preferred", "Real TM operational experience"],
    icon: "📋",
    active: true,
    sortOrder: 1,
  },
  {
    title: "ADR Instructor",
    type: "Full-time / Freelance",
    location: "Central Scotland",
    description: "Deliver DVSA-approved ADR (Dangerous Goods) training across initial and requalification programmes.",
    requirements: ["DVSA approved ADR instructor status", "ADR all classes experience", "Excellent presentation skills"],
    icon: "⚠️",
    active: true,
    sortOrder: 2,
  },
  {
    title: "Plant / NPORS Assessor",
    type: "Full-time",
    location: "Central Scotland",
    description: "Deliver and assess counterbalance, reach truck, telehandler and plant operator training. Onsite and centre-based delivery.",
    requirements: ["NPORS registration or equivalent", "Relevant plant operator experience", "Assessor qualification"],
    icon: "🏗️",
    active: true,
    sortOrder: 3,
  },
];

const EMPTY_FORM = {
  title: "",
  type: "",
  location: "",
  description: "",
  requirementsText: "",
  icon: "💼",
  active: true,
  sortOrder: 0,
};

export default function VacanciesAdmin() {
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/vacancies");
    const data = await res.json();
    setVacancies(data.vacancies ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm({ ...EMPTY_FORM, sortOrder: vacancies.length });
    setEditId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(v: JobVacancy) {
    setForm({
      title: v.title,
      type: v.type,
      location: v.location,
      description: v.description,
      requirementsText: v.requirements.join("\n"),
      icon: v.icon,
      active: v.active,
      sortOrder: v.sortOrder,
    });
    setEditId(v.id);
    setError("");
    setShowForm(true);
  }

  async function save() {
    if (!form.title.trim()) { setError("Job title is required."); return; }
    setSaving(true);
    setError("");
    const requirements = form.requirementsText
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);
    const payload = {
      title: form.title.trim(),
      type: form.type.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      requirements,
      icon: form.icon,
      active: form.active,
      sortOrder: Number(form.sortOrder),
      ...(editId ? { id: editId } : {}),
    };
    const res = await fetch("/api/admin/vacancies", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) { setShowForm(false); await load(); }
    else { const d = await res.json(); setError(d.error ?? "Failed to save"); }
    setSaving(false);
  }

  async function seedDefaults() {
    if (!confirm("This will load the 4 existing roles from the careers page into the database. Continue?")) return;
    setSeeding(true);
    for (const v of DEFAULT_VACANCIES) {
      await fetch("/api/admin/vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
    }
    await load();
    setSeeding(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this vacancy?")) return;
    await fetch("/api/admin/vacancies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  async function toggleActive(v: JobVacancy) {
    await fetch("/api/admin/vacancies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: v.id, active: !v.active }),
    });
    await load();
  }

  async function moveOrder(v: JobVacancy, dir: "up" | "down") {
    const sorted = [...vacancies].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((x) => x.id === v.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swapTarget = sorted[swapIdx];
    await Promise.all([
      fetch("/api/admin/vacancies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: v.id, sortOrder: swapTarget.sortOrder }),
      }),
      fetch("/api/admin/vacancies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: swapTarget.id, sortOrder: v.sortOrder }),
      }),
    ]);
    await load();
  }

  const sorted = [...vacancies].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Job Vacancies</h1>
        <p className="text-gray-500 text-sm mt-1">Manage current job openings shown on the Careers page</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
        <strong>Active</strong> vacancies are shown on the public Careers page. Inactive roles are hidden from visitors but kept in the system.
      </div>

      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm">
          <Plus size={16} /> Add Vacancy
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Briefcase size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No vacancies yet.</p>
          <button onClick={openAdd} className="text-blue-brand font-semibold text-sm hover:underline mt-2">Add your first vacancy →</button>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3">Or load the 4 existing roles from the current careers page:</p>
            <button onClick={seedDefaults} disabled={seeding} className="inline-flex items-center gap-2 bg-orange-brand text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-dark disabled:opacity-40">
              <Download size={14} />
              {seeding ? "Loading…" : "Load Existing Vacancies"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((v, i) => (
            <div key={v.id} className={`bg-white rounded-2xl border p-4 ${v.active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-start gap-4">
                <div className="text-2xl flex-shrink-0 mt-0.5">{v.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start flex-wrap gap-2 mb-1">
                    <span className="font-bold text-sm text-navy">{v.title}</span>
                    {v.type && (
                      <span className="text-xs bg-blue-50 text-blue-brand px-2 py-0.5 rounded-full font-semibold">{v.type}</span>
                    )}
                    {!v.active && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">Hidden</span>
                    )}
                  </div>
                  {v.location && <p className="text-xs text-gray-400 mb-1">{v.location}</p>}
                  <p className="text-sm text-gray-600 line-clamp-2">{v.description}</p>
                  {v.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {v.requirements.map((r) => (
                        <span key={r} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100">{r}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveOrder(v, "up")} disabled={i === 0} className="p-1 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20" title="Move up">
                      <ChevronUp size={13} />
                    </button>
                    <button onClick={() => moveOrder(v, "down")} disabled={i === sorted.length - 1} className="p-1 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20" title="Move down">
                      <ChevronDown size={13} />
                    </button>
                  </div>
                  <button onClick={() => toggleActive(v)} title="Toggle visibility" className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                    {v.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} />}
                  </button>
                  <button onClick={() => openEdit(v)} className="p-2 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => remove(v.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
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
              <h3 className="font-bold text-gray-900">{editId ? "Edit Vacancy" : "Add Vacancy"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Job Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand"
                  placeholder="e.g. Driver CPC Instructor"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Employment Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white"
                  >
                    <option value="">— Select —</option>
                    {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Icon</label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white"
                  >
                    {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand"
                  placeholder="e.g. Bothwell / Glasgow / Remote"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand resize-none"
                  placeholder="Brief description of the role…"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Requirements (one per line)</label>
                <textarea
                  value={form.requirementsText}
                  onChange={(e) => setForm((f) => ({ ...f, requirementsText: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand resize-none font-mono"
                  placeholder={"Current Driver CPC qualification\nStrong communication skills\nTransport industry background preferred"}
                />
                <p className="text-xs text-gray-400 mt-1">Each line becomes a bullet point on the careers page</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={form.sortOrder}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-semibold text-gray-700">Active (show on site)</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50/50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Vacancy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
