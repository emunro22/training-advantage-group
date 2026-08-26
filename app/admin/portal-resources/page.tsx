"use client";

import { useEffect, useState } from "react";
import { FolderLock, Plus, Trash2, Edit2, X, ToggleLeft, ToggleRight, FileText, Link2, ExternalLink } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface PortalResource {
  id: string;
  title: string;
  description: string;
  resourceType: "document" | "form_link";
  url: string;
  fileName?: string;
  area: string;
  sortOrder: number;
  active: boolean;
}

const BASE_AREAS = ["staff", "instructor", "supplier", "candidate"];

const EMPTY_FORM = {
  title: "",
  description: "",
  resourceType: "form_link" as PortalResource["resourceType"],
  url: "",
  fileName: "",
  area: "instructor",
  customArea: "",
  sortOrder: 0,
  active: true,
};

export default function PortalResourcesAdmin() {
  const [resources, setResources] = useState<PortalResource[]>([]);
  const [areas, setAreas] = useState<string[]>(BASE_AREAS);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [addingArea, setAddingArea] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/portal-resources");
    const data = await res.json();
    setResources(data.resources ?? []);
    setAreas(data.areas ?? BASE_AREAS);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setAddingArea(false);
    setError("");
    setShowForm(true);
  }

  function openEdit(r: PortalResource) {
    setForm({
      title: r.title,
      description: r.description,
      resourceType: r.resourceType,
      url: r.url,
      fileName: r.fileName ?? "",
      area: r.area,
      customArea: "",
      sortOrder: r.sortOrder,
      active: r.active,
    });
    setEditId(r.id);
    setAddingArea(false);
    setError("");
    setShowForm(true);
  }

  async function save() {
    const area = addingArea ? form.customArea.trim() : form.area;
    if (!form.title || !form.url || !area) { setError("Title, URL/upload and area are required."); return; }
    setSaving(true);
    setError("");
    const payload = { ...form, area };
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...payload } : payload;
    const res = await fetch("/api/admin/portal-resources", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setShowForm(false); await load(); }
    else { const d = await res.json(); setError(d.error ?? "Failed"); }
    setSaving(false);
  }

  async function toggleActive(r: PortalResource) {
    await fetch("/api/admin/portal-resources", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id, active: !r.active }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this resource? Users who could see it will lose access immediately.")) return;
    await fetch("/api/admin/portal-resources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  const grouped = resources.reduce<Record<string, PortalResource[]>>((acc, r) => {
    (acc[r.area] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FolderLock className="text-orange-brand" size={24} />
            Portal Resources
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Documents and form links shown inside the secure portal, grouped by area. A portal user only
            sees resources whose area matches their type or one of their extra areas.
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm">
          <Plus size={16} /> Add Resource
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <FolderLock size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No portal resources yet.</p>
          <button onClick={openAdd} className="text-blue-brand font-semibold text-sm hover:underline mt-2">Add your first resource →</button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(grouped).sort().map((area) => (
            <div key={area}>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{area}</h2>
              <div className="space-y-2">
                {grouped[area].map((r) => (
                  <div key={r.id} className={`bg-white rounded-2xl border p-4 flex items-center gap-4 ${r.active ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      {r.resourceType === "document" ? <FileText size={18} className="text-orange-brand" /> : <Link2 size={18} className="text-orange-brand" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-gray-800">{r.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {r.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {r.description && <p className="text-sm text-gray-500">{r.description}</p>}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => toggleActive(r)} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Toggle active">
                        {r.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} />}
                      </button>
                      <button onClick={() => openEdit(r)} className="p-2 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => remove(r.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{editId ? "Edit Resource" : "Add Portal Resource"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. Instructor Qualification Update Form" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Type</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setForm((f) => ({ ...f, resourceType: "form_link", url: "" }))} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${form.resourceType === "form_link" ? "border-blue-brand bg-blue-50 text-blue-brand" : "border-gray-200 text-gray-500"}`}>
                    <ExternalLink size={14} /> Form link
                  </button>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, resourceType: "document", url: "" }))} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${form.resourceType === "document" ? "border-blue-brand bg-blue-50 text-blue-brand" : "border-gray-200 text-gray-500"}`}>
                    <FileText size={14} /> Document
                  </button>
                </div>
              </div>
              {form.resourceType === "form_link" ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Form URL *</label>
                  <input type="url" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="https://form.jotform.com/…" />
                </div>
              ) : (
                <ImageUploadField
                  label="Document *"
                  value={form.url}
                  onChange={(url, fileName) => setForm((f) => ({ ...f, url, fileName: fileName ?? "" }))}
                  folder="portal-resources"
                  accept=".pdf,.doc,.docx"
                  isDocument
                />
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Area *</label>
                {!addingArea ? (
                  <div className="flex gap-2">
                    <select value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white">
                      {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <button type="button" onClick={() => setAddingArea(true)} className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-blue-brand hover:text-blue-brand transition-colors whitespace-nowrap">
                      + New
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" value={form.customArea} onChange={(e) => setForm((f) => ({ ...f, customArea: e.target.value }))} className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. candidate:tm-cpc-sept-2026" />
                    <button type="button" onClick={() => setAddingArea(false)} className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-gray-300 transition-colors">
                      Cancel
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Use a base area (staff/instructor/supplier/candidate) or a custom tag for a specific course — grant
                  candidates access to a custom tag from their Portal Users record.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm font-semibold text-gray-700">Active (visible in portal)</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50/50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Resource"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
