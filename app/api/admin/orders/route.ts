export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
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
    ? await sql`SELECT * FROM orders WHERE status = ${status} ORDER BY created_at DESC`
    : await sql`SELECT * FROM orders ORDER BY created_at DESC`;

  return NextResponse.json({ orders });
}

const manualOrderSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().optional().default(""),
  courseName: z.string().min(1),
  courseId: z.string().optional().default("manual"),
  preferredDate: z.string().min(1),
  delegates: z.number().min(1).max(50),
  location: z.string().min(1),
  notes: z.string().optional().default(""),
  paymentType: z.enum(["full", "deposit"]),
  amountPaidPence: z.number().min(0),
  totalAmountPence: z.number().min(0),
});

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data = manualOrderSchema.parse(body);
  const remainingPence = data.totalAmountPence - data.amountPaidPence;
  const status = data.paymentType === "deposit" ? "deposit_paid" : "paid";

  await ensureSchema();
  const sql = getDb();

  const orderId = crypto.randomUUID();
  await sql`
    INSERT INTO orders (
      id, status, payment_type, amount_paid_pence, total_amount_pence,
      remaining_balance_pence, first_name, last_name, email, phone, company,
      course_id, course_name, preferred_date, delegates, location, notes
    ) VALUES (
      ${orderId}, ${status}, ${data.paymentType}, ${data.amountPaidPence},
      ${data.totalAmountPence}, ${remainingPence},
      ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone},
      ${data.company}, ${data.courseId}, ${data.courseName},
      ${data.preferredDate}, ${data.delegates}, ${data.location}, ${data.notes}
    )
  `;

  return NextResponse.json({ ok: true, orderId });
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

  await sql`UPDATE orders SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await ensureSchema();
  const sql = getDb();

  await sql`DELETE FROM orders WHERE id = ${id}`;

  return NextResponse.json({ ok: true });
}
