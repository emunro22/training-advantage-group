"use client";

import { useState } from "react";
import { UploadCloud, Paperclip, X, CheckCircle2, Loader2 } from "lucide-react";

export default function AdHocUploadCard() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) {
      // Some in-app browsers (WhatsApp/Instagram/Messenger's built-in browser) fire the
      // change event but hand back zero files because they block photo library access —
      // this looks identical to "nothing happened" unless we say so explicitly.
      setError("No file was received. If you opened this link inside WhatsApp or another app, try opening it in Safari or Chrome directly instead.");
      return;
    }
    setError("");
    setFiles((f) => [...f, ...Array.from(list)].slice(0, 5));
  }

  async function handleSubmit() {
    if (!title.trim()) { setError("Please give the document a title."); return; }
    if (files.length === 0) { setError("Please attach at least one file."); return; }
    setSubmitting(true);
    setError("");
    try {
      const body = new FormData();
      body.append("kind", "upload");
      body.append("title", title.trim());
      if (notes) body.append("notes", notes.trim());
      for (const f of files) body.append("file", f);

      const res = await fetch("/api/portal/submit", { method: "POST", body });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Upload failed — please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 text-center">
        <CheckCircle2 size={28} className="text-green-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-navy">Document sent to TAG office — thank you.</p>
        <button
          onClick={() => { setDone(false); setTitle(""); setNotes(""); setFiles([]); }}
          className="text-blue-brand text-xs font-semibold hover:underline mt-2"
        >
          Upload another
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-4 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm p-4 hover:border-blue-brand transition-colors text-left"
      >
        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <UploadCloud size={18} className="text-blue-brand" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-navy text-sm">Upload a document</div>
          <div className="text-xs text-gray-500 mt-0.5">Send a document straight to the TAG office, securely</div>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
      <div className="font-bold text-navy text-sm mb-3">Upload a document</div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg mb-3">{error}</div>}

      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">What is this? *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Updated qualification certificate"
          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand resize-none"
        />
      </div>

      <div className="mb-4">
        <div className="space-y-2 mb-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm">
              <Paperclip size={13} className="text-gray-400 flex-shrink-0" />
              <span className="truncate flex-1">{f.name}</span>
              <button onClick={() => setFiles((fs) => fs.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="relative inline-block">
          <span className="pointer-events-none inline-flex items-center gap-1.5 text-sm text-blue-brand font-semibold bg-blue-50 px-4 py-2 rounded-lg">
            + Add file
          </span>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.heic,.heif,image/*"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm text-gray-500 font-semibold">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 bg-orange-brand text-white font-bold py-2.5 rounded-xl hover:bg-orange-dark transition-colors disabled:opacity-50 text-sm"
        >
          {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
          {submitting ? "Sending…" : "Send to TAG Office"}
        </button>
      </div>
    </div>
  );
}
