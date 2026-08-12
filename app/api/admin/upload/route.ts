export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { validateSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
const DOCUMENT_TYPES = [...IMAGE_TYPES, "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const ALLOWED_FOLDERS: Record<string, { types: string[]; label: string }> = {
  accreditations: { types: IMAGE_TYPES, label: "image" },
  courses: { types: IMAGE_TYPES, label: "image" },
  documents: { types: DOCUMENT_TYPES, label: "document" },
  general: { types: IMAGE_TYPES, label: "image" },
};

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "File storage is not configured." }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") ?? "general");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const config = ALLOWED_FOLDERS[folder] ?? ALLOWED_FOLDERS.general;
    if (!config.types.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type for this upload (${config.label} expected)` },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File is too large (10MB limit)" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const blob = await put(`${folder}/${Date.now()}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url, fileName: file.name }, { status: 201 });
  } catch (e) {
    console.error("[upload] error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
