"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Plus, Trash2, Edit2, X, ToggleRight, ToggleLeft } from "lucide-react";
import type { UpcomingCourse } from "@/lib/storage";

const LOCATIONS = ["Bothwell", "Motherwell", "Glasgow", "Remote / Online", "On-site"];

const EMPTY_FORM = {
  courseName: "",
  courseId: "",
  date: "",
  endDate: "",
  location: "Bothwell",
  spotsAvailable: 10,
  totalSpots: 10,
  price: "",
  bookingUrl: "",
  notes: "",
  active: true,
};

export default function UpcomingCoursesAdmin() {
  const [courses, setCourses] = useState<UpcomingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/upcoming-courses");
    const data = await res.json();
    setCourses(data.courses ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(c: UpcomingCourse) {
    setForm({
      courseName: c.courseName,
      courseId: c.courseId,
      date: c.date,
      endDate: c.endDate ?? "",
      location: c.location,
      spotsAvailable: c.spotsAvailable,
      totalSpots: c.totalSpots,
      price: c.price,
      bookingUrl: c.bookingUrl ?? "",
      notes: c.notes ?? "",
      active: c.active,
    });
    setEditId(c.id);
    setError("");
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.courseName || !form.date) { setError("Course name and date are required."); return; }
    setSaving(true);
    setError("");

    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;

    const res = await fetch("/api/admin/upcoming-courses", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) { setShowForm(false); await load(); }
    else { const d = await res.json(); setError(d.error ?? "Failed"); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this course date?")) return;
    await fetch("/api/admin/upcoming-courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  async function toggleActive(c: UpcomingCourse) {
    await fetch("/api/admin/upcoming-courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, active: !c.active }),
    });
    await load();
  }

  const fmtDate = (d: string) => {
    if (!d) return "—";
    const dt = new Date(d);
    return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const spotsColor = (available: number, total: number) => {
    if (available === 0) return "text-red-600 bg-red-50";
    if (available <= total * 0.25) return "text-amber-600 bg-amber-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Upcoming Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage upcoming course dates shown on the site</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm">
          <Plus size={16} /> Add Course Date
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <CalendarDays size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No upcoming courses scheduled.</p>
          <button onClick={openAdd} className="text-blue-brand font-semibold text-sm hover:underline mt-2">Schedule your first course →</button>
        </div>
      ) : (
        <div className="space-y-2">
          {courses
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((c) => (
              <div key={c.id} className={`bg-white rounded-2xl border p-4 flex items-center gap-4 ${c.active ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
                <div className="w-14 h-14 bg-navy rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white">
                  <div className="text-lg font-black leading-none">{new Date(c.date).getDate()}</div>
                  <div className="text-[10px] uppercase tracking-wide opacity-70">
                    {new Date(c.date).toLocaleDateString("en-GB", { month: "short" })}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-bold text-sm text-gray-800">{c.courseName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {c.active ? "Active" : "Hidden"}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${spotsColor(c.spotsAvailable, c.totalSpots)}`}>
                      {c.spotsAvailable === 0 ? "Full" : `${c.spotsAvailable} spots left`}
                    </span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-400 flex-wrap">
                    <span>{fmtDate(c.date)}{c.endDate ? ` – ${fmtDate(c.endDate)}` : ""}</span>
                    <span>{c.location}</span>
                    {c.price && <span className="font-semibold text-blue-brand">{c.price}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleActive(c)} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Toggle visibility">
                    {c.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} />}
                  </button>
                  <button onClick={() => openEdit(c)} className="p-2 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{editId ? "Edit Course Date" : "Add Course Date"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Course Name *</label>
                <input type="text" value={form.courseName} onChange={(e) => setForm((f) => ({ ...f, courseName: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. IOSH Managing Safely" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Start Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Location</label>
                  <select value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white">
                    {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Price</label>
                  <input type="text" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="£395" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Total Spots</label>
                  <input type="number" value={form.totalSpots} onChange={(e) => setForm((f) => ({ ...f, totalSpots: +e.target.value, spotsAvailable: Math.min(f.spotsAvailable, +e.target.value) }))} min="1" className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Spots Available</label>
                  <input type="number" value={form.spotsAvailable} onChange={(e) => setForm((f) => ({ ...f, spotsAvailable: Math.min(+e.target.value, f.totalSpots) }))} min="0" max={form.totalSpots} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Booking URL (optional)</label>
                <input type="url" value={form.bookingUrl} onChange={(e) => setForm((f) => ({ ...f, bookingUrl: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="/booking or external URL" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand resize-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm font-semibold text-gray-700">Show on site</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50/50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
