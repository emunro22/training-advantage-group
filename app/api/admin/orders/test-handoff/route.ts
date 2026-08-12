export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";
import { sendOrderHandoffEmail, type OrderHandoffData } from "@/lib/email";
import { generateOrderRef } from "@/lib/order-contract";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

// TAG-WEB-REQ-001 §5: "The website developer must supply five test messages: valid paid order,
// multi-candidate order, quotation/review order, cancelled/refunded order and deliberately
// incomplete order." Sends all five, in the fixed Order Data Contract format, to
// ORDER_HANDOFF_MAILBOX for TAG's acceptance testing. No real order rows are created.
export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();
  const base: Omit<OrderHandoffData, "orderId" | "paymentStatus"> = {
    orderDateTime: now,
    purchaserFirstName: "Test",
    purchaserLastName: "Candidate",
    email: "test-candidate@example.com",
    phone: "07000000000",
    company: "",
    courseServiceName: "Driver CPC — National Driver CPC",
    variant: "3.5-hour module",
    deliveryMode: "Classroom",
    venueOrSession: "Bothwell — 2026-09-01",
    candidateCount: 1,
    currency: "GBP",
    grossIncVatPence: 7500,
    netExVatPence: 6250,
    vatAmountPence: 1250,
    vatTreatment: "Standard 20%",
    termsVersion: process.env.TERMS_VERSION,
    privacyNoticeVersion: process.env.PRIVACY_NOTICE_VERSION,
    candidateRegistrationRequired: true,
    joiningPackCode: "IP-DCPC",
    issuePackCode: "IP-DCPC",
  };

  const messages: OrderHandoffData[] = [
    {
      ...base,
      orderId: generateOrderRef(),
      paymentStatus: "Paid",
      paymentReference: "sq_test_paid_001",
      websiteProductId: "WEB-TAG-0030",
      tagPriceId: "TAG-0030",
      reviewIndicator: "1 of 5 — valid paid order",
    },
    {
      ...base,
      orderId: generateOrderRef(),
      paymentStatus: "Paid",
      paymentReference: "sq_test_multi_002",
      websiteProductId: "WEB-TAG-0030",
      tagPriceId: "TAG-0030",
      candidateCount: 6,
      grossIncVatPence: 45000,
      netExVatPence: 37500,
      vatAmountPence: 7500,
      reviewIndicator: "2 of 5 — multi-candidate order",
    },
    {
      ...base,
      orderId: generateOrderRef(),
      paymentStatus: "Pending",
      courseServiceName: "On-site / private employer — Quote/scope",
      variant: "Bespoke site delivery",
      grossIncVatPence: 0,
      netExVatPence: undefined,
      vatAmountPence: undefined,
      joiningPackCode: undefined,
      issuePackCode: undefined,
      reviewIndicator: "3 of 5 — quotation/administrator review order",
    },
    {
      ...base,
      orderId: generateOrderRef(),
      paymentStatus: "Refunded",
      paymentReference: "sq_test_refund_004",
      websiteProductId: "WEB-TAG-0030",
      tagPriceId: "TAG-0030",
      reviewIndicator: "4 of 5 — cancelled/refunded order",
    },
    {
      orderId: generateOrderRef(),
      orderDateTime: now,
      purchaserFirstName: "Test",
      purchaserLastName: "Incomplete",
      email: "",
      courseServiceName: "",
      candidateCount: 1,
      currency: "GBP",
      grossIncVatPence: 0,
      paymentStatus: "Pending",
      candidateRegistrationRequired: true,
      reviewIndicator: "5 of 5 — DELIBERATELY INCOMPLETE (missing PriceID/email/course) — must be held for administrator review",
    },
  ];

  const results = await Promise.allSettled(messages.map((m) => sendOrderHandoffEmail(m)));
  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - sent;

  return NextResponse.json({ sent, failed, mailboxConfigured: !!process.env.ORDER_HANDOFF_MAILBOX });
}
