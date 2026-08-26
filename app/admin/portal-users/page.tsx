"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Trash2, Edit2, X, ToggleLeft, ToggleRight, KeyRound, Copy, Check } from "lucide-react";

interface PublicPortalUser {
  id: string;
  tagId: string;
  name: string;
  type: "staff" | "instructor" | "supplier" | "candidate";
  extraAreas: string[];
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

const EMPTY_FORM = {
  tagId: "",
  name: "",
  type: "instructor" as PublicPortalUser["type"],
  extraAreas: [] as string[],
  active: true,
};

const TYPE_LABELS: Record<PublicPortalUser["type"], string> = {
  staff: "Staff",
  instructor: "Instructor / Assessor",
  supplier: "Supplier / Subcontractor",
  candidate: "Candidate",
};

export default function PortalUsersAdmin() {
  const [users, setUsers] = useState<PublicPortalUser[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newCode, setNewCode] = useState<{ tagId: string; code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function load() {
    const [usersRes, resourcesRes] = await Promise.all([
      fetch("/api/admin/portal-users"),
      fetch("/api/admin/portal-resources"),
    ]);
    const usersData = await usersRes.json();
    const resourcesData = await resourcesRes.json();
    setUsers(usersData.users ?? []);
    setAreas(resourcesData.areas ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(u: PublicPortalUser) {
    setForm({ tagId: u.tagId, name: u.name, type: u.type, extraAreas: u.extraAreas, active: u.active });
    setEditId(u.id);
    setError("");
    setShowForm(true);
  }

  function toggleExtraArea(area: string) {
    setForm((f) => ({
      ...f,
      extraAreas: f.extraAreas.includes(area) ? f.extraAreas.filter((a) => a !== area) : [...f.extraAreas, area],
    }));
  }

  async function save() {
    if (!form.tagId || !form.type) { setError("TAG ID and type are required."); return; }
    setSaving(true);
    setError("");
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    const res = await fetch("/api/admin/portal-users", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      setShowForm(false);
      if (data.accessCode) setNewCode({ tagId: form.tagId, code: data.accessCode });
      await load();
    } else {
      setError(data.error ?? "Failed");
    }
    setSaving(false);
  }

  async function toggleActive(u: PublicPortalUser) {
    await fetch("/api/admin/portal-users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, active: !u.active }),
    });
    await load();
  }

  async function resetCode(u: PublicPortalUser) {
    if (!confirm(`Reset the access code for ${u.tagId}? Their old code will stop working immediately.`)) return;
    const res = await fetch("/api/admin/portal-users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, resetCode: true }),
    });
    const data = await res.json();
    if (data.accessCode) setNewCode({ tagId: u.tagId, code: data.accessCode });
  }

  async function remove(id: string) {
    if (!confirm("Delete this portal user? They will no longer be able to sign in.")) return;
    await fetch("/api/admin/portal-users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  function copyCode() {
    if (!newCode) return;
    navigator.clipboard.writeText(newCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Users className="text-orange-brand" size={24} />
            Portal Users
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Instructors, suppliers, staff and candidates who can sign in at /portal/login with a TAG ID
            and access code to see only the resources allocated to their role or extra areas.
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm">
          <Plus size={16} /> Add User
        </button>
      </div>

      {newCode && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center gap-4">
          <KeyRound className="text-amber-600 flex-shrink-0" size={20} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-900">
              New access code for {newCode.tagId} — copy this now, it won&apos;t be shown again
            </p>
            <p className="text-2xl font-mono font-black text-amber-900 tracking-widest mt-1">{newCode.code}</p>
          </div>
          <button onClick={copyCode} className="flex items-center gap-1.5 bg-amber-600 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors flex-shrink-0">
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={() => setNewCode(null)} className="p-2 rounded-lg text-amber-600 hover:bg-amber-100 flex-shrink-0"><X size={16} /></button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Users size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No portal users yet.</p>
          <button onClick={openAdd} className="text-blue-brand font-semibold text-sm hover:underline mt-2">Add your first user →</button>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className={`bg-white rounded-2xl border p-4 flex items-center gap-4 ${u.active ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold text-blue-brand text-center px-1">
                {u.tagId}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-bold text-sm text-gray-800">{u.name || u.tagId}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {u.active ? "Active" : "Deactivated"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                  <span className="font-semibold text-gray-500">{TYPE_LABELS[u.type]}</span>
                  {u.extraAreas.length > 0 && <span>+ {u.extraAreas.join(", ")}</span>}
                  {u.lastLoginAt && <span>Last login {new Date(u.lastLoginAt).toLocaleDateString("en-GB")}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => resetCode(u)} className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Reset access code">
                  <KeyRound size={15} />
                </button>
                <button onClick={() => toggleActive(u)} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Toggle active">
                  {u.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => openEdit(u)} className="p-2 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => remove(u.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
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
              <h3 className="font-bold text-gray-900">{editId ? "Edit Portal User" : "Add Portal User"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">TAG ID *</label>
                <input type="text" value={form.tagId} onChange={(e) => setForm((f) => ({ ...f, tagId: e.target.value.toUpperCase() }))} disabled={!!editId} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand disabled:bg-gray-50 disabled:text-gray-400" placeholder="e.g. INS-0047" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="For your own reference" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Type</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as PublicPortalUser["type"] }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white">
                  {(Object.keys(TYPE_LABELS) as PublicPortalUser["type"][]).map((t) => (
                    <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">They automatically see all resources tagged for this type.</p>
              </div>
              {areas.filter((a) => !Object.keys(TYPE_LABELS).includes(a)).length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Extra areas (optional)</label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto border-2 border-gray-100 rounded-xl p-2.5">
                    {areas.filter((a) => !Object.keys(TYPE_LABELS).includes(a)).map((area) => (
                      <label key={area} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.extraAreas.includes(area)} onChange={() => toggleExtraArea(area)} className="w-4 h-4 rounded" />
                        <span className="text-sm text-gray-700">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm font-semibold text-gray-700">Active (can sign in)</span>
              </label>
              {!editId && (
                <p className="text-xs text-gray-400">A random access code will be generated and shown once you save.</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50/50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
