export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";
import { getDb, ensureSchema } from "@/lib/db";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureSchema();
  const sql = getDb();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const orders = status
    ? await sql`
        SELECT * FROM orders
        WHERE status = ${status}
        ORDER BY created_at DESC
      `
    : await sql`
        SELECT * FROM orders
        ORDER BY created_at DESC
      `;

  return NextResponse.json({ orders });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await request.json();
  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }

  await ensureSchema();
  const sql = getDb();

  await sql`
    UPDATE orders SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true });
}
