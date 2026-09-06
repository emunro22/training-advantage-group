import { NextRequest, NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import { getDb, ensureSchema } from "@/lib/db";
import { sendOrderConfirmation, sendOrderHandoffEmail, sendCertReplacementRequestNotification, sendCertReplacementCustomerEmail } from "@/lib/email";
import { getCertReplacementRequestBySquareOrderId, updateCertReplacementRequest } from "@/lib/storage";

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
    order_ref: string | null;
    website_product_id: string | null;
    tag_price_id: string | null;
    net_ex_vat_pence: number | null;
    vat_amount_pence: number | null;
    vat_treatment: string | null;
    terms_version: string | null;
    privacy_notice_version: string | null;
    candidate_registration_required: boolean | null;
    joining_pack_code: string | null;
    issue_pack_code: string | null;
    handoff_sent_at: string | null;
    created_at: string;
    source_page: string | null;
    consent_given_at: string | null;
    discount_code: string | null;
  };

  const rows = (await sql`
    SELECT * FROM orders WHERE square_order_id = ${squareOrderId} LIMIT 1
  `) as OrderRow[];

  if (!rows.length) {
    const certRequest = await getCertReplacementRequestBySquareOrderId(squareOrderId);
    if (!certRequest) {
      console.error("Webhook: no order found for square_order_id", squareOrderId);
      return NextResponse.json({ ok: true });
    }
    if (certRequest.status !== "pending_payment") {
      return NextResponse.json({ ok: true });
    }

    await updateCertReplacementRequest(certRequest.id, {
      status: "paid",
      squarePaymentId: squarePaymentId ?? undefined,
    });

    try {
      await Promise.all([
        sendCertReplacementRequestNotification({
          id: certRequest.id,
          type: "awarding_body",
          certificateNumber: certRequest.certificateNumber,
          holderName: certRequest.holderName,
          course: certRequest.course,
          awardingBody: certRequest.awardingBody,
          contactName: certRequest.contactName,
          email: certRequest.email,
          phone: certRequest.phone,
          notes: certRequest.notes,
          amountPence: certRequest.amountPence,
        }),
        sendCertReplacementCustomerEmail({
          type: "awarding_body",
          contactName: certRequest.contactName,
          email: certRequest.email,
          certificateNumber: certRequest.certificateNumber,
        }),
      ]);
    } catch (e) {
      console.error("Failed to send cert replacement confirmation emails:", e);
    }

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

  // TAG-WEB-REQ-001 §5 fixed-format order handoff. Guarded by the same "pending" check above —
  // a re-delivered webhook for an already-processed order never reaches this point twice.
  try {
    await sendOrderHandoffEmail({
      orderId: order.order_ref ?? order.id,
      orderDateTime: order.created_at,
      websiteProductId: order.website_product_id ?? undefined,
      tagPriceId: order.tag_price_id ?? undefined,
      purchaserFirstName: order.first_name,
      purchaserLastName: order.last_name,
      email: order.email,
      phone: order.phone,
      company: order.company,
      courseServiceName: order.course_name,
      venueOrSession: `${order.location} — ${order.preferred_date}`,
      candidateCount: order.delegates,
      currency: "GBP",
      grossIncVatPence: order.total_amount_pence,
      netExVatPence: order.net_ex_vat_pence ?? undefined,
      vatAmountPence: order.vat_amount_pence ?? undefined,
      vatTreatment: order.vat_treatment ?? undefined,
      paymentStatus: order.payment_type === "deposit" ? "Deposit Paid" : "Paid",
      paymentReference: squarePaymentId ?? undefined,
      termsVersion: order.terms_version ?? undefined,
      privacyNoticeVersion: order.privacy_notice_version ?? undefined,
      candidateRegistrationRequired: order.candidate_registration_required ?? true,
      joiningPackCode: order.joining_pack_code ?? undefined,
      issuePackCode: order.issue_pack_code ?? undefined,
      sourcePage: order.source_page ?? undefined,
      consentGivenAt: order.consent_given_at ?? undefined,
      discountCode: order.discount_code ?? undefined,
    });
    await sql`UPDATE orders SET handoff_sent_at = NOW() WHERE id = ${order.id}`;
  } catch (e) {
    console.error("Failed to send order handoff email:", e);
  }

  return NextResponse.json({ ok: true });
}
