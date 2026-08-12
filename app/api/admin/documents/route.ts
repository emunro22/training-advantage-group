import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, validateSessionToken } from "@/lib/admin-auth";
import {
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
  type TagDocument,
} from "@/lib/storage";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

function revalidateDownloads() {
  try {
    revalidatePath("/downloads");
  } catch {
    // no-op outside Next.js context
  }
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const documents = await getDocuments();
  return NextResponse.json({ documents });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<TagDocument>;
  if (!body.title || !body.fileUrl) {
    return NextResponse.json({ error: "Title and file are required" }, { status: 400 });
  }
  const doc: TagDocument = {
    id: `doc-${Date.now()}`,
    title: body.title,
    description: body.description ?? "",
    category: body.category ?? "General",
    fileUrl: body.fileUrl,
    fileName: body.fileName ?? "",
    sortOrder: body.sortOrder ?? 0,
    active: body.active ?? true,
    createdAt: new Date().toISOString(),
  };
  await addDocument(doc);
  revalidateDownloads();
  return NextResponse.json({ document: doc }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, ...updates } = (await request.json()) as { id: string } & Partial<TagDocument>;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const ok = await updateDocument(id, updates);
  revalidateDownloads();
  return NextResponse.json({ ok });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = (await request.json()) as { id: string };
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const ok = await deleteDocument(id);
  revalidateDownloads();
  return NextResponse.json({ ok });
}
