export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, validateSessionToken } from "@/lib/admin-auth";
import { getCertReplacementRequests, updateCertReplacementRequest, deleteCertReplacementRequest } from "@/lib/storage";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const requests = await getCertReplacementRequests();
  return NextResponse.json({ requests });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, status } = (await request.json()) as {
    id: string;
    status: "new" | "pending_payment" | "paid" | "handled";
  };
  if (!id || !status) {
    return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
  }
  const ok = await updateCertReplacementRequest(id, { status });
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
  const ok = await deleteCertReplacementRequest(id);
  return NextResponse.json({ ok });
}
