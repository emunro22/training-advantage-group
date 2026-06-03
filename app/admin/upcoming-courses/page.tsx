"use client";

import { useEffect, useState, useRef } from "react";
import { CalendarDays, Plus, Trash2, Edit2, X, ToggleRight, ToggleLeft, Upload, Download, CalendarX } from "lucide-react";
import type { UpcomingCourse } from "@/lib/storage";

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

function parseTime(t: string): string {
  const v = t.trim();
  if (!v) return "";
  // Accept HH:MM or H:MM
  if (/^\d{1,2}:\d{2}/.test(v)) return v.slice(0, 5);
  return v;
}

function colIdx(headers: string[], ...aliases: string[]): number {
  for (const alias of aliases) {
    const a = alias.toLowerCase();
    const idx = headers.findIndex((h) => h === a || h.includes(a) || a.includes(h));
    if (idx !== -1) return idx;
  }
  return -1;
}

function parseCourseCSV(text: string): Partial<UpcomingCourse>[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const rawHeaders = parseCSVRow(lines[0]);
  const headers = rawHeaders.map((h) => h.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim());

  const nameIdx = colIdx(headers, "course name", "course nar", "coursename", "course", "name");
  const dateIdx = colIdx(headers, "start date", "date", "course date", "startdate");
  const endDateIdx = colIdx(headers, "end date", "enddate", "finish date");
  const startTimeIdx = colIdx(headers, "start time", "starttime", "time start", "from");
  const endTimeIdx = colIdx(headers, "finish time", "end time", "endtime", "finish", "to");
  const locationIdx = colIdx(headers, "location", "venue", "centre", "center", "place");
  const priceIdx = colIdx(headers, "price", "cost", "fee");
  const totalSpotsIdx = colIdx(headers, "total spots", "total", "capacity", "max spots", "max");
  const spotsAvailIdx = colIdx(headers, "spots avail", "spots available", "available", "spaces", "remaining");
  const bookingIdx = colIdx(headers, "booking url", "booking uf", "booking", "url", "link");
  const notesIdx = colIdx(headers, "notes", "note", "comments");
  const activeIdx = colIdx(headers, "show on site", "show on sit", "active", "visible", "show");

  return lines.slice(1).map((line) => {
    const vals = parseCSVRow(line);
    const get = (idx: number) => (idx >= 0 ? (vals[idx] ?? "").trim() : "");

    const rawActive = get(activeIdx).toLowerCase();
    const active = rawActive === "" || rawActive === "yes" || rawActive === "true" || rawActive === "1";
    const totalSpots = parseInt(get(totalSpotsIdx)) || 10;
    const spotsAvail = parseInt(get(spotsAvailIdx)) || totalSpots;

    // Clean price — strip currency symbol if needed, keep as string
    const price = get(priceIdx).replace(/^([£$€])/, (_, sym) => sym) || get(priceIdx);

    return {
      courseName: get(nameIdx),
      date: parseDate(get(dateIdx)),
      endDate: parseDate(get(endDateIdx)) || undefined,
      startTime: parseTime(get(startTimeIdx)) || undefined,
      endTime: parseTime(get(endTimeIdx)) || undefined,
      location: get(locationIdx) || "Bothwell",
      price,
      totalSpots,
      spotsAvailable: Math.min(spotsAvail, totalSpots),
      bookingUrl: get(bookingIdx) || undefined,
      notes: get(notesIdx) || undefined,
      active,
    } satisfies Partial<UpcomingCourse>;
  }).filter((r) => r.courseName);
}

const COURSE_TEMPLATE_HEADERS = "courseName,date,endDate,startTime,endTime,location,price,totalSpots,spotsAvailable,bookingUrl,notes,showOnSite";
const COURSE_TEMPLATE_EXAMPLE = "IOSH Managing Safely,2024-09-07,2024-09-08,09:00,16:30,Glasgow,£95,12,12,/booking,,Yes";

function downloadTemplate() {
  const csv = [COURSE_TEMPLATE_HEADERS, COURSE_TEMPLATE_EXAMPLE].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "courses-template.csv"; a.click();
  URL.revokeObjectURL(url);
}

const LOCATIONS = ["Bothwell", "Motherwell", "Glasgow", "Remote / Online", "On-site"];

const EMPTY_FORM = {
  courseName: "",
  courseId: "",
  date: "",
  endDate: "",
  startTime: "",
  endTime: "",
  location: "Bothwell",
  spotsAvailable: 10,
  totalSpots: 10,
  price: "",
  bookingUrl: "",
  notes: "",
  active: true,
};

type ImportResult = { added: number; errors: number; invalid: number } | null;

export default function UpcomingCoursesAdmin() {
  const [courses, setCourses] = useState<UpcomingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      startTime: c.startTime ?? "",
      endTime: c.endTime ?? "",
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

  async function handleDeletePast() {
    if (!confirm("Remove all course dates before today? This cannot be undone.")) return;
    const res = await fetch("/api/admin/upcoming-courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deletePast: true }),
    });
    const data = await res.json();
    alert(`Removed ${data.deleted ?? 0} past course date${data.deleted !== 1 ? "s" : ""}.`);
    await load();
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setImporting(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const parsed = parseCourseCSV(text);
      if (parsed.length === 0) {
        setImportResult({ added: 0, errors: 0, invalid: 0 });
        setImporting(false);
        return;
      }
      const res = await fetch("/api/admin/upcoming-courses/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses: parsed }),
      });
      const data = await res.json();
      setImportResult(data);
      await load();
    } catch {
      setImportResult({ added: 0, errors: 1, invalid: 0 });
    }
    setImporting(false);
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Upcoming Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage upcoming course dates shown on the site</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDeletePast}
            className="flex items-center gap-2 border-2 border-red-200 text-red-600 px-3 py-2 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors"
            title="Remove all course dates before today"
          >
            <CalendarX size={14} />
            Remove Past
          </button>
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
            title="Import from CSV (save Excel as CSV first)"
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
          <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm">
            <Plus size={16} /> Add Course Date
          </button>
        </div>
      </div>

      {/* Import result banner */}
      {importResult && (
        <div className={`flex items-start justify-between gap-3 px-4 py-3 rounded-xl text-sm border ${importResult.added > 0 ? "bg-green-50 border-green-200 text-green-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          <div>
            <span className="font-semibold">Import complete: </span>
            {importResult.added} course{importResult.added !== 1 ? "s" : ""} added
            {importResult.invalid > 0 && `, ${importResult.invalid} invalid (missing course name or date)`}
            {importResult.errors > 0 && `, ${importResult.errors} errors`}
          </div>
          <button onClick={() => setImportResult(null)} className="text-current opacity-60 hover:opacity-100 flex-shrink-0"><X size={14} /></button>
        </div>
      )}

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
                    {(c.startTime || c.endTime) && (
                      <span className="font-semibold text-gray-500">
                        {c.startTime || ""}
                        {c.startTime && c.endTime ? " – " : ""}
                        {c.endTime || ""}
                      </span>
                    )}
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
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Start Time</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="09:00" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Finish Time</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="17:00" />
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
