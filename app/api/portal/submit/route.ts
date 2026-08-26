export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { PORTAL_COOKIE, validatePortalSessionToken } from "@/lib/portal-auth";
import { getPortalUserById, getPortalResourceById, addPortalSubmission, type PortalSubmission } from "@/lib/storage";
import { sendPortalSubmissionNotification } from "@/lib/email";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
];
// Fallback for browsers that report an unhelpful/empty MIME type for some files
// (seen for HEIC photos and a few document managers) — checked by extension instead.
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "png", "jpg", "jpeg", "webp", "heic", "heif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

function isAllowedFile(file: File): boolean {
  if (ALLOWED_TYPES.includes(file.type)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return !!ext && ALLOWED_EXTENSIONS.includes(ext);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = validatePortalSessionToken(cookieStore.get(PORTAL_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const user = await getPortalUserById(session.userId);
  if (!user || !user.active) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const form = await request.formData();
  const kind = String(form.get("kind") ?? "");
  if (kind !== "form" && kind !== "upload") {
    return NextResponse.json({ error: "Invalid submission type" }, { status: 400 });
  }

  const allowedAreas = [user.type, ...user.extraAreas];
  let resourceTitle = "";
  let area: string = user.type;

  if (kind === "form") {
    const resourceId = String(form.get("resourceId") ?? "");
    const resource = resourceId ? await getPortalResourceById(resourceId) : null;
    if (
      !resource ||
      !resource.active ||
      resource.resourceType !== "online_form" ||
      !allowedAreas.includes(resource.area)
    ) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }
    resourceTitle = resource.title;
    area = resource.area;
  } else {
    resourceTitle = String(form.get("title") ?? "Document upload").trim() || "Document upload";
  }

  const files = form.getAll("file").filter((f): f is File => f instanceof File);
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `A maximum of ${MAX_FILES} files can be attached` }, { status: 400 });
  }
  for (const file of files) {
    if (!isAllowedFile(file)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.name}` }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: `${file.name} is too large (10MB limit)` }, { status: 400 });
    }
  }

  if (files.length > 0 && !process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "File storage is not configured." }, { status: 503 });
  }

  const attachments: { fileName: string; url: string }[] = [];
  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const blob = await put(`portal-submissions/${Date.now()}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    attachments.push({ fileName: file.name, url: blob.url });
  }

  let answers: Record<string, string> = {};
  const answersRaw = form.get("answers");
  if (typeof answersRaw === "string" && answersRaw) {
    try {
      const parsed = JSON.parse(answersRaw);
      if (parsed && typeof parsed === "object") {
        answers = Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, String(v)]));
      }
    } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
  }

  const courseRef = String(form.get("courseRef") ?? "").trim() || undefined;
  const notes = kind === "upload" ? String(form.get("notes") ?? "").trim() || undefined : undefined;

  const submission: PortalSubmission = {
    id: `sub-${Date.now()}`,
    kind,
    resourceId: kind === "form" ? String(form.get("resourceId") ?? "") : undefined,
    resourceTitle,
    portalUserId: user.id,
    tagId: user.tagId,
    userName: user.name,
    userType: user.type,
    area,
    courseRef,
    answers,
    notes,
    attachments,
    status: "new",
    submittedAt: new Date().toISOString(),
  };

  await addPortalSubmission(submission);

  try {
    await sendPortalSubmissionNotification({
      kind,
      resourceTitle,
      tagId: user.tagId,
      userName: user.name,
      userType: user.type,
      submissionId: submission.id,
      attachmentCount: attachments.length,
    });
  } catch (e) {
    console.error("[portal submit] notification failed:", e);
  }

  return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
}
