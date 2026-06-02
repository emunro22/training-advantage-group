import { NextRequest, NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import { getDb, ensureSchema } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature") ?? "";
  const sigKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY ?? "";
  const webhookUrl =
    (process.env.NEXT_PUBLIC_URL ?? "https://trainingadvantagegroup.co.uk") +
    "/api/webhooks/square";

  const isValid = await WebhooksHelper.verifySignature({
    requestBody: body,
    signatureHeader: signature,
    signatureKey: sigKey,
    notificationUrl: webhookUrl,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.type !== "payment.updated") {
    return NextResponse.json({ ok: true });
  }

  type PaymentObj = { status?: string; order_id?: string; id?: string };
  const payment = (
    event as { data?: { object?: { payment?: PaymentObj } } }
  )?.data?.object?.payment;

  if (!payment || payment.status !== "COMPLETED") {
    return NextResponse.json({ ok: true });
  }

  const squareOrderId = payment.order_id;
  const squarePaymentId = payment.id;

  if (!squareOrderId) {
    return NextResponse.json({ ok: true });
  }

  await ensureSchema();
  const sql = getDb();

  type OrderRow = {
    id: string;
    payment_type: string;
    amount_paid_pence: number;
    total_amount_pence: number;
    remaining_balance_pence: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company: string;
    course_name: string;
    preferred_date: string;
    delegates: number;
    location: string;
    notes: string;
    status: string;
  };

  const rows = (await sql`
    SELECT * FROM orders WHERE square_order_id = ${squareOrderId} LIMIT 1
  `) as OrderRow[];

  if (!rows.length) {
    console.error("Webhook: no order found for square_order_id", squareOrderId);
    return NextResponse.json({ ok: true });
  }

  const order = rows[0];

  if (order.status !== "pending") {
    return NextResponse.json({ ok: true });
  }

  const newStatus = order.payment_type === "deposit" ? "deposit_paid" : "paid";

  await sql`
    UPDATE orders
    SET status = ${newStatus}, square_payment_id = ${squarePaymentId ?? null}, updated_at = NOW()
    WHERE id = ${order.id}
  `;

  try {
    await sendOrderConfirmation({
      orderId: order.id,
      paymentType: order.payment_type as "full" | "deposit",
      amountPaidPence: order.amount_paid_pence,
      totalAmountPence: order.total_amount_pence,
      remainingBalancePence: order.remaining_balance_pence,
      firstName: order.first_name,
      lastName: order.last_name,
      email: order.email,
      phone: order.phone,
      company: order.company,
      courseName: order.course_name,
      preferredDate: order.preferred_date,
      delegates: order.delegates,
      location: order.location,
      notes: order.notes,
    });
  } catch (e) {
    console.error("Failed to send order confirmation email:", e);
  }

  return NextResponse.json({ ok: true });
}
