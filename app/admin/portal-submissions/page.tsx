"use client";

import { useEffect, useMemo, useState } from "react";
import { Inbox, Paperclip, CheckCircle2, Circle, FileText, UploadCloud } from "lucide-react";

interface PortalSubmission {
  id: string;
  kind: "form" | "upload";
  resourceTitle: string;
  tagId: string;
  userName: string;
  userType: string;
  area: string;
  courseRef?: string;
  answers: Record<string, string>;
  notes?: string;
  attachments: { fileName: string; url: string }[];
  status: "new" | "reviewed";
  submittedAt: string;
}

export default function PortalSubmissionsAdmin() {
  const [submissions, setSubmissions] = useState<PortalSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "reviewed">("all");

  async function load() {
    const res = await fetch("/api/admin/portal-submissions");
    const data = await res.json();
    setSubmissions(data.submissions ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: "new" | "reviewed") {
    await fetch("/api/admin/portal-submissions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  const filtered = useMemo(
    () => (filter === "all" ? submissions : submissions.filter((s) => s.status === filter)),
    [submissions, filter]
  );

  const newCount = submissions.filter((s) => s.status === "new").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Inbox className="text-orange-brand" size={24} />
          Portal Submissions
        </h1>
        <p className="text-gray-500 text-sm mt-1 max-w-xl">
          Online forms and documents submitted by portal users. This is the only place this data appears —
          it is never emailed, only a notification pointing here.
        </p>
      </div>

      <div className="flex gap-2">
        {(["all", "new", "reviewed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${filter === f ? "bg-navy text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-navy"}`}
          >
            {f === "all" ? "All" : f === "new" ? `New (${newCount})` : "Reviewed"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Inbox size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className={`bg-white rounded-2xl border p-4 ${s.status === "new" ? "border-orange-200" : "border-gray-100"}`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                  {s.kind === "form" ? <FileText size={16} className="text-orange-brand" /> : <UploadCloud size={16} className="text-orange-brand" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-0.5">
                    <span className="font-bold text-sm text-navy">{s.resourceTitle}</span>
                    <span className="text-xs bg-blue-50 text-blue-brand px-2 py-0.5 rounded-full font-semibold">{s.userType}</span>
                    {s.status === "new" && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">New</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {s.userName} ({s.tagId}) · {new Date(s.submittedAt).toLocaleString("en-GB")}
                    {s.courseRef && <> · Course ref: {s.courseRef}</>}
                  </p>

                  {Object.keys(s.answers).length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-2 space-y-1">
                      {Object.entries(s.answers).map(([k, v]) => (
                        <div key={k} className="text-xs text-gray-600"><span className="text-gray-400">{k}:</span> {v || "—"}</div>
                      ))}
                    </div>
                  )}
                  {s.notes && <p className="text-xs text-gray-600 mb-2">{s.notes}</p>}

                  {s.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {s.attachments.map((a, i) => (
                        <a
                          key={i}
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-blue-brand bg-blue-50 rounded-lg px-2.5 py-1.5 hover:bg-blue-100 transition-colors"
                        >
                          <Paperclip size={12} /> {a.fileName}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setStatus(s.id, s.status === "new" ? "reviewed" : "new")}
                  className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors flex-shrink-0"
                  title={s.status === "new" ? "Mark reviewed" : "Mark as new"}
                >
                  {s.status === "reviewed" ? <CheckCircle2 size={18} className="text-green-600" /> : <Circle size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
