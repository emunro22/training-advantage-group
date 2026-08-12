"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Plus, Trash2, Edit2, X, ToggleLeft, ToggleRight, FileText } from "lucide-react";
import type { TagDocument } from "@/lib/storage";
import ImageUploadField from "@/components/admin/ImageUploadField";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "General",
  fileUrl: "",
  fileName: "",
  active: true,
};

export default function DocumentsAdmin() {
  const [documents, setDocuments] = useState<TagDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/documents");
    const data = await res.json();
    setDocuments(data.documents ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(d: TagDocument) {
    setForm({
      title: d.title,
      description: d.description,
      category: d.category,
      fileUrl: d.fileUrl,
      fileName: d.fileName,
      active: d.active,
    });
    setEditId(d.id);
    setError("");
    setShowForm(true);
  }

  async function save() {
    if (!form.title || !form.fileUrl) { setError("Title and file are required."); return; }
    setSaving(true);
    setError("");
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    const res = await fetch("/api/admin/documents", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setShowForm(false); await load(); }
    else { const d = await res.json(); setError(d.error ?? "Failed"); }
    setSaving(false);
  }

  async function toggleActive(d: TagDocument) {
    await fetch("/api/admin/documents", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: d.id, active: !d.active }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this document?")) return;
    await fetch("/api/admin/documents", {
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
            <FolderOpen className="text-orange-brand" size={24} />
            Documents
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Manage the public downloads page — policies, handbooks and course information. Replacing a
            file&apos;s upload keeps the same public link, so previously shared links never break.
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm">
          <Plus size={16} /> Add Document
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <FolderOpen size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No documents yet.</p>
          <button onClick={openAdd} className="text-blue-brand font-semibold text-sm hover:underline mt-2">Add your first document →</button>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((d) => (
            <div key={d.id} className={`bg-white rounded-2xl border p-4 flex items-center gap-4 ${d.active ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-sm text-gray-800">{d.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${d.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {d.active ? "Active" : "Inactive"}
                  </span>
                </div>
                {d.description && <p className="text-sm text-gray-500">{d.description}</p>}
                <span className="text-xs text-gray-400">{d.category}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(d)} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Toggle active">
                  {d.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => openEdit(d)} className="p-2 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => remove(d.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
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
              <h3 className="font-bold text-gray-900">{editId ? "Edit Document" : "Add Document"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>}
              <ImageUploadField
                label="File *"
                value={form.fileUrl}
                onChange={(url, fileName) => setForm((f) => ({ ...f, fileUrl: url, fileName: fileName ?? f.fileName }))}
                folder="documents"
                accept="application/pdf,image/png,image/jpeg,.doc,.docx"
                isDocument
              />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. Learner Handbook" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Category</label>
                <input type="text" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. Policies, Handbooks, Course Information" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm font-semibold text-gray-700">Active (visible on site)</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50/50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Document"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
