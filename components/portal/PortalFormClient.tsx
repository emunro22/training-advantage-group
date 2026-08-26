"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, CheckCircle2, Paperclip, X, Loader2 } from "lucide-react";
import type { PortalFormField } from "@/lib/storage";

interface Props {
  resourceId: string;
  title: string;
  description: string;
  fields: PortalFormField[];
  pdfUrl?: string;
  backHref: string;
  tagId: string;
  name: string;
}

export default function PortalFormClient({ resourceId, title, description, fields, pdfUrl, backHref, tagId, name }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [courseRef, setCourseRef] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function setAnswer(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

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
    for (const f of fields) {
      if (f.required && !answers[f.id]?.trim()) {
        setError(`"${f.label}" is required.`);
        return;
      }
    }
    setSubmitting(true);
    setError("");
    try {
      const body = new FormData();
      body.append("kind", "form");
      body.append("resourceId", resourceId);
      body.append("answers", JSON.stringify(answers));
      if (courseRef) body.append("courseRef", courseRef);
      for (const f of files) body.append("file", f);

      const res = await fetch("/api/portal/submit", { method: "POST", body });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Submission failed — please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Submission failed — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-10 text-center">
        <CheckCircle2 size={40} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-lg font-black text-navy mb-2">Submitted securely</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
          Thanks — &quot;{title}&quot; has been sent to Training Advantage Group. Our office has been notified and will
          be in touch if anything further is needed.
        </p>
        <button onClick={() => router.push(backHref)} className="text-blue-brand font-semibold text-sm hover:underline">
          &larr; Back to portal
        </button>
      </div>
    );
  }

  return (
    <div>
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-brand mb-4">
        <ArrowLeft size={14} /> Back to portal
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8">
        <h1 className="text-xl font-black text-navy mb-1">{title}</h1>
        {description && <p className="text-sm text-gray-500 mb-6">{description}</p>}

        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-brand font-semibold border border-blue-100 bg-blue-50 rounded-xl px-4 py-3 mb-6 hover:bg-blue-100 transition-colors w-fit"
          >
            <Download size={15} /> Prefer to download and complete by hand? Get the PDF
          </a>
        )}

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">TAG ID</label>
            <input value={tagId} readOnly className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm text-gray-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Name</label>
            <input value={name} readOnly className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm text-gray-500" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Course Reference (optional)</label>
          <input
            value={courseRef}
            onChange={(e) => setCourseRef(e.target.value)}
            placeholder="e.g. TM-CPC-Sept-2026"
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand"
          />
        </div>

        {fields.map((f) => (
          <div key={f.id} className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              {f.label} {f.required && <span className="text-red-brand">*</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea
                value={answers[f.id] ?? ""}
                onChange={(e) => setAnswer(f.id, e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand resize-none"
              />
            ) : f.type === "select" ? (
              <select
                value={answers[f.id] ?? ""}
                onChange={(e) => setAnswer(f.id, e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white"
              >
                <option value="">— Select —</option>
                {(f.options ?? []).map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                type={f.type}
                value={answers[f.id] ?? ""}
                onChange={(e) => setAnswer(f.id, e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand"
              />
            )}
          </div>
        ))}

        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Attach files (optional)</label>
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
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.heic,.heif,image/*"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
            className="block w-full text-sm text-gray-600 cursor-pointer
                       file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0
                       file:bg-blue-50 file:text-blue-brand file:font-semibold file:text-sm
                       hover:file:bg-blue-100 file:cursor-pointer"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-orange-brand text-white font-bold py-3 rounded-xl hover:bg-orange-dark transition-colors disabled:opacity-50"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
          {submitting ? "Submitting…" : "Submit Securely"}
        </button>
        <p className="text-xs text-gray-400 text-center mt-3">
          Submitted securely to Training Advantage Group — never sent by ordinary email.
        </p>
      </div>
    </div>
  );
}
