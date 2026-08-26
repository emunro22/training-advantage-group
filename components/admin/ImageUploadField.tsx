"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, FileText } from "lucide-react";

interface UploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string, fileName?: string) => void;
  folder: "accreditations" | "courses" | "documents" | "portal-resources" | "general";
  accept?: string;
  /** When true, shows a document icon + filename instead of an image preview (for PDFs etc). */
  isDocument?: boolean;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  accept = "image/png,image/jpeg,image/webp,image/svg+xml,image/gif",
  isDocument = false,
}: UploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      setFileName(data.fileName ?? file.name);
      onChange(data.url, data.fileName ?? file.name);
    } catch {
      setError("Upload failed — please try again");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      {value ? (
        <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl p-2.5">
          {isDocument ? (
            <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <FileText size={22} className="text-gray-400" />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
          )}
          <span className="text-xs text-gray-500 truncate flex-1">{fileName || value.split("/").pop()}</span>
          <button
            type="button"
            onClick={() => { onChange("", ""); setFileName(""); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-4 text-sm text-gray-400 hover:border-blue-brand hover:text-blue-brand transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Uploading…" : "Click to upload"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
