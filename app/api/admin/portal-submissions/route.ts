export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, validateSessionToken } from "@/lib/admin-auth";
import { getPortalSubmissions, updatePortalSubmission, deletePortalSubmission } from "@/lib/storage";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const submissions = await getPortalSubmissions();
  return NextResponse.json({ submissions });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, status } = (await request.json()) as { id: string; status: "new" | "reviewed" };
  if (!id || !status) {
    return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
  }
  const ok = await updatePortalSubmission(id, { status });
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
  const ok = await deletePortalSubmission(id);
  return NextResponse.json({ ok });
}
