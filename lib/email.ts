import { Resend } from "resend";
import type { BookingFormData, ContactFormData } from "./types";

// Lazy initialisation so missing API key only fails at send time, not at build
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");
  return _resend;
}
const resend = { emails: { send: (...args: Parameters<Resend["emails"]["send"]>) => getResend().emails.send(...args) } };

const FROM = "Training Advantage Group <office@trainingadvantagegroup.co.uk>";

const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://trainingadvantagegroup.co.uk";
const LOGO_URL = `${SITE_URL}/images/logo.png`;

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Shared visual shell for customer-facing emails: rounded card, gradient header with logo, dark footer. */
function renderCustomerEmail(opts: {
  title: string;
  eyebrow?: string;
  bodyHtml: string;
}): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #e9edf3; padding: 32px 12px; font-family: ${FONT_STACK};">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(13, 27, 75, 0.12);">
            <tr>
              <td style="background: linear-gradient(135deg, #0d1b4b 0%, #0066cc 100%); padding: 36px 30px; text-align: center;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 18px;">
                  <tr>
                    <td style="background: #ffffff; border-radius: 16px; padding: 10px; box-shadow: 0 4px 14px rgba(0,0,0,0.18);">
                      <img src="${LOGO_URL}" width="48" height="48" alt="Training Advantage Group" style="display: block; border: 0;" />
                    </td>
                  </tr>
                </table>
                ${opts.eyebrow ? `<p style="color: #9fc2ff; margin: 0 0 6px; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">${opts.eyebrow}</p>` : ""}
                <h1 style="color: #ffffff; margin: 0; font-size: 23px; font-weight: 700; letter-spacing: -0.2px;">${opts.title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 30px; background: #ffffff;">
                ${opts.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="background: #0d1b4b; padding: 26px 30px; text-align: center;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 14px;">
                  <tr>
                    <td style="padding: 0 12px;">
                      <a href="tel:01412582024" style="color: #cfe0ff; font-size: 13px; text-decoration: none; font-weight: 600;">📞 0141 258 2024</a>
                    </td>
                    <td style="color: #35468a; font-size: 13px;">|</td>
                    <td style="padding: 0 12px;">
                      <a href="mailto:office@trainingadvantagegroup.co.uk" style="color: #cfe0ff; font-size: 13px; text-decoration: none; font-weight: 600;">✉️ office@trainingadvantagegroup.co.uk</a>
                    </td>
                  </tr>
                </table>
                <p style="color: #8399cf; margin: 0; font-size: 11px; line-height: 1.6;">Training Advantage Group Ltd &middot; Registered in Scotland No. SC765674<br/>1st Floor Training Suite, APC Depot, Coalburn Road, Bothwell, G71 8DA</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

export async function sendBookingConfirmation(data: BookingFormData) {
  const customerHtml = renderCustomerEmail({
    eyebrow: "Training Advantage Group Ltd",
    title: "Booking Request Received",
    bodyHtml: `
        <p style="color: #1a1a1a; font-size: 16px; margin: 0 0 12px;">Dear ${data.firstName},</p>
        <p style="color: #444; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">Thank you for your booking request. We have received your enquiry and will confirm your place within 24 hours.</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f4f7fa; border-radius: 10px; border-left: 4px solid #ff6600; margin: 0 0 24px;">
          <tr><td style="padding: 22px 24px;">
            <h2 style="color: #0d1b4b; margin: 0 0 16px; font-size: 16px; font-weight: 700;">Booking Summary</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #667; width: 40%; font-size: 14px;">Course</td><td style="padding: 8px 0; color: #1a1a1a; font-weight: 700; font-size: 14px;">${data.courseName}</td></tr>
              <tr><td style="padding: 8px 0; color: #667; font-size: 14px;">Preferred Date</td><td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.preferredDate}</td></tr>
              <tr><td style="padding: 8px 0; color: #667; font-size: 14px;">Location</td><td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.location}</td></tr>
              <tr><td style="padding: 8px 0; color: #667; font-size: 14px;">Delegates</td><td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.delegates}</td></tr>
              ${data.company ? `<tr><td style="padding: 8px 0; color: #667; font-size: 14px;">Company</td><td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.company}</td></tr>` : ""}
            </table>
          </td></tr>
        </table>

        <p style="color: #444; font-size: 15px; margin: 0 0 12px;">If you have any questions, please don't hesitate to contact us:</p>
        <p style="margin: 0;">
          <a href="tel:01412582024" style="color: #0066cc; text-decoration: none; font-size: 14px; font-weight: 600;">📞 0141 258 2024</a>
        </p>
        <p style="margin: 6px 0 0;">
          <a href="mailto:office@trainingadvantagegroup.co.uk" style="color: #0066cc; text-decoration: none; font-size: 14px; font-weight: 600;">✉️ office@trainingadvantagegroup.co.uk</a>
        </p>
    `,
  });

  await Promise.all([
    resend.emails.send({
      from: FROM,
      to: [data.email],
      subject: `Booking Request Confirmed – ${data.courseName} | Training Advantage Group`,
      html: customerHtml,
    }),
    sendFixedFormatNotification({
      kind: "BOOKING",
      submissionId: `book-${Date.now()}`,
      timestamp: new Date().toISOString(),
      name: `${data.firstName} ${data.lastName}`.trim(),
      company: data.company,
      email: data.email,
      telephone: data.phone,
      courseOrService: data.courseName,
      status: "Booking requested — preferred date " + data.preferredDate,
      consent: data.consent ? "Terms & Privacy Notice accepted" : undefined,
      sourcePage: data.sourcePage,
      subjectRef: data.courseName,
      extra: data.message ? { label: "Message", value: data.message } : undefined,
    }),
  ]);
}

export interface OrderConfirmationData {
  orderId: string;
  paymentType: "full" | "deposit";
  amountPaidPence: number;
  totalAmountPence: number;
  remainingBalancePence: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  courseName: string;
  preferredDate: string;
  delegates: number;
  location: string;
  notes: string;
}

function formatGBP(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  const isDeposit = data.paymentType === "deposit";
  const subjectVerb = isDeposit ? "Deposit Received" : "Payment Confirmed";

  const depositNote = isDeposit
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7e6; border-left:4px solid #ff6600; border-radius:10px; margin: 0 0 20px;">
        <tr><td style="padding: 18px 20px; color: #333; font-size: 14px; line-height: 1.6;">
          <strong style="color: #b45309;">Deposit Payment</strong><br/>
          You paid a deposit of <strong>${formatGBP(data.amountPaidPence)}</strong> today.<br/>
          The remaining balance of <strong>${formatGBP(data.remainingBalancePence)}</strong> is due before your course date.
          Our team will contact you with payment details for the balance.
        </td></tr>
      </table>`
    : "";

  const customerHtml = renderCustomerEmail({
    eyebrow: "Training Advantage Group Ltd",
    title: `${subjectVerb} — Booking Confirmed`,
    bodyHtml: `
        <p style="color: #1a1a1a; font-size: 16px; margin: 0 0 12px;">Dear ${data.firstName},</p>
        <p style="color: #444; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">Thank you — your payment has been received and your booking is confirmed. A member of our team will be in touch shortly with joining instructions.</p>
        ${depositNote}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f4f7fa; border-radius: 10px; border-left: 4px solid #ff6600; margin: 0 0 24px;">
          <tr><td style="padding: 22px 24px;">
            <h2 style="color: #0d1b4b; margin: 0 0 16px; font-size: 16px; font-weight: 700;">Booking Summary</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #667; width: 40%; font-size: 14px;">Course</td><td style="padding: 8px 0; color: #1a1a1a; font-weight: 700; font-size: 14px;">${data.courseName}</td></tr>
              <tr><td style="padding: 8px 0; color: #667; font-size: 14px;">Preferred Date</td><td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.preferredDate}</td></tr>
              <tr><td style="padding: 8px 0; color: #667; font-size: 14px;">Location</td><td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.location}</td></tr>
              <tr><td style="padding: 8px 0; color: #667; font-size: 14px;">Delegates</td><td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.delegates}</td></tr>
              <tr><td style="padding: 8px 0; color: #667; font-size: 14px;">Amount Paid</td><td style="padding: 8px 0; color: #16a34a; font-weight: 700; font-size: 14px;">${formatGBP(data.amountPaidPence)}</td></tr>
              ${data.company ? `<tr><td style="padding: 8px 0; color: #667; font-size: 14px;">Company</td><td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.company}</td></tr>` : ""}
              <tr><td style="padding: 8px 0; color: #667; font-size: 14px;">Booking Ref</td><td style="padding: 8px 0; color: #999; font-size: 12px;">${data.orderId}</td></tr>
            </table>
          </td></tr>
        </table>
        <p style="color: #444; font-size: 15px; margin: 0 0 12px;">If you have any questions, please contact us:</p>
        <p style="margin: 0;">
          <a href="tel:01412582024" style="color: #0066cc; text-decoration: none; font-size: 14px; font-weight: 600;">📞 0141 258 2024</a>
        </p>
        <p style="margin: 6px 0 0;">
          <a href="mailto:office@trainingadvantagegroup.co.uk" style="color: #0066cc; text-decoration: none; font-size: 14px; font-weight: 600;">✉️ office@trainingadvantagegroup.co.uk</a>
        </p>
    `,
  });

  // Office notification for this order is the single fixed-format WEB ORDER email
  // (sendOrderHandoffEmail, sent from the Square webhook) — this function only emails the customer,
  // so office@ never receives two differently-formatted emails for the same paid order.
  await resend.emails.send({
    from: FROM,
    to: [data.email],
    subject: `${subjectVerb} – ${data.courseName} | Training Advantage Group`,
    html: customerHtml,
  });
}

// TAG-WEB-SPEC-001 §3 Order Data Contract. Field order is fixed and must not change — a standard
// Microsoft 365 flow parses this on the receiving mailbox. Only the approved field list appears
// here: no candidate ID, licence image, signature or other restricted evidence is ever included
// (TAG-WEB-REQ-001 §5 / security boundary).
export interface OrderHandoffData {
  orderId: string;
  orderDateTime: string;
  websiteProductId?: string;
  tagPriceId?: string;
  purchaserFirstName: string;
  purchaserLastName: string;
  email: string;
  phone?: string;
  company?: string;
  courseServiceName: string;
  variant?: string;
  deliveryMode?: string;
  venueOrSession?: string;
  candidateCount: number;
  currency: string;
  grossIncVatPence: number;
  netExVatPence?: number;
  vatAmountPence?: number;
  vatTreatment?: string;
  paymentStatus: "Paid" | "Deposit Paid" | "Pending" | "Refunded" | "Cancelled";
  paymentReference?: string;
  discountCode?: string;
  termsVersion?: string;
  privacyNoticeVersion?: string;
  candidateRegistrationRequired: boolean;
  joiningPackCode?: string;
  issuePackCode?: string;
  reviewIndicator?: string;
  /** Page the order originated from, e.g. "/booking" — reported to Power Automate. */
  sourcePage?: string;
  /** ISO timestamp the customer accepted Terms/Privacy at checkout, if recorded. */
  consentGivenAt?: string;
}

function handoffLine(label: string, value: string | number | boolean | undefined): string {
  const shown = value === undefined || value === "" ? "—" : String(value);
  return `${label}: ${shown}`;
}

export async function sendOrderHandoffEmail(data: OrderHandoffData) {
  const mailbox = process.env.ORDER_HANDOFF_MAILBOX;
  if (!mailbox) {
    console.warn("[email] ORDER_HANDOFF_MAILBOX not set — order handoff email skipped for", data.orderId);
    return;
  }

  const fields = [
    "=== Identity ===",
    handoffLine("OrderID", data.orderId),
    handoffLine("OrderDateTime", data.orderDateTime),
    handoffLine("WebsiteProductID", data.websiteProductId),
    handoffLine("TAG PriceID", data.tagPriceId),
    "",
    "=== Purchaser ===",
    handoffLine("First name", data.purchaserFirstName),
    handoffLine("Last name", data.purchaserLastName),
    handoffLine("Email", data.email),
    handoffLine("Telephone", data.phone),
    handoffLine("Company", data.company),
    "",
    "=== Course/product ===",
    handoffLine("Product/service name", data.courseServiceName),
    handoffLine("Variant", data.variant),
    handoffLine("Delivery mode", data.deliveryMode),
    handoffLine("Venue/requested date or session", data.venueOrSession),
    handoffLine("Candidate count", data.candidateCount),
    "",
    "=== Price/payment ===",
    handoffLine("Currency", data.currency),
    handoffLine("Gross including VAT", (data.grossIncVatPence / 100).toFixed(2)),
    handoffLine("Net ex VAT", data.netExVatPence !== undefined ? (data.netExVatPence / 100).toFixed(2) : undefined),
    handoffLine("VAT amount", data.vatAmountPence !== undefined ? (data.vatAmountPence / 100).toFixed(2) : undefined),
    handoffLine("VAT treatment", data.vatTreatment),
    handoffLine("Payment status", data.paymentStatus),
    handoffLine("Payment reference", data.paymentReference),
    handoffLine("Discount code", data.discountCode),
    "",
    "=== Control versions ===",
    handoffLine("TermsVersion", data.termsVersion),
    handoffLine("PrivacyNoticeVersion", data.privacyNoticeVersion),
    handoffLine("Consent", data.consentGivenAt ? `Accepted at ${data.consentGivenAt}` : undefined),
    handoffLine("Source Page", data.sourcePage),
    "",
    "=== Required action ===",
    handoffLine("CandidateRegistrationRequired", data.candidateRegistrationRequired ? "Yes" : "No"),
    handoffLine("JoiningPackCode", data.joiningPackCode),
    handoffLine("IssuePackCode", data.issuePackCode),
    handoffLine("Quotation/administrator review indicator", data.reviewIndicator),
  ].join("\n");

  // Wrapping markup is cosmetic only — the field text and line breaks inside <pre> are untouched
  // so the receiving M365 flow's parsing (TAG-WEB-SPEC-001 §3) keeps working.
  const html = renderCustomerEmail({
    eyebrow: "Internal Notification",
    title: "New Web Order",
    bodyHtml: `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f4f7fa; border-radius: 10px; border-left: 4px solid #0066cc;">
          <tr><td style="padding: 20px 22px;">
            <pre style="margin: 0; font-family: Consolas, 'Courier New', monospace; font-size: 13px; line-height: 1.6; color: #1a1a1a; white-space: pre-wrap;">${fields}</pre>
          </td></tr>
        </table>
    `,
  });

  const customerName = `${data.purchaserFirstName} ${data.purchaserLastName}`.trim();
  await resend.emails.send({
    from: FROM,
    to: [mailbox],
    subject: `WEB ORDER | ${data.orderId} | ${customerName}`,
    html,
  });
}

// Shared Power Automate notification format for BOOKING / ENQUIRY / CERTIFICATE_UPDATE events.
// Orders use the richer sendOrderHandoffEmail above (same mailbox, same "one notification per
// event" rule, its own field set per TAG-WEB-SPEC-001 §3). Never includes ID/licence/signature/
// medical/bank evidence — customers are directed to the secure portal for that instead.
export interface FixedFormatNotification {
  kind: "BOOKING" | "ENQUIRY" | "CERTIFICATE_UPDATE" | "PORTAL_SUBMISSION";
  submissionId: string;
  timestamp: string;
  name?: string;
  company?: string;
  email?: string;
  telephone?: string;
  courseOrService?: string;
  status?: string;
  consent?: string;
  sourcePage?: string;
  /** Subject-line identifier: course/service name for BOOKING/ENQUIRY, certificate number for CERTIFICATE_UPDATE. */
  subjectRef: string;
  /** Free-text content (e.g. an enquiry message) appended after the fixed fields — outside the parsed block. */
  extra?: { label: string; value: string };
}

function buildNotificationSubject(n: FixedFormatNotification): string {
  const name = n.name || "Unknown";
  switch (n.kind) {
    case "BOOKING":
      return `WEB BOOKING | ${n.subjectRef} | ${name}`;
    case "ENQUIRY":
      return `WEB ENQUIRY | ${n.subjectRef} | ${name}`;
    case "CERTIFICATE_UPDATE":
      return `CERTIFICATE UPDATE | ${n.subjectRef}`;
    case "PORTAL_SUBMISSION":
      return `PORTAL SUBMISSION | ${n.subjectRef} | ${name}`;
  }
}

export async function sendFixedFormatNotification(n: FixedFormatNotification) {
  const mailbox = process.env.ORDER_HANDOFF_MAILBOX;
  if (!mailbox) {
    console.warn(`[email] ORDER_HANDOFF_MAILBOX not set — ${n.kind} notification skipped for`, n.submissionId);
    return;
  }

  const fields = [
    handoffLine("SubmissionID", n.submissionId),
    handoffLine("Timestamp", n.timestamp),
    handoffLine("Name", n.name),
    handoffLine("Company", n.company),
    handoffLine("Email", n.email),
    handoffLine("Telephone", n.telephone),
    handoffLine("Course/Service", n.courseOrService),
    handoffLine("Status", n.status),
    handoffLine("Consent", n.consent),
    handoffLine("Source Page", n.sourcePage),
    ...(n.extra ? ["", `${n.extra.label}:`, n.extra.value] : []),
  ].join("\n");

  const titleByKind: Record<FixedFormatNotification["kind"], string> = {
    BOOKING: "New Booking Request",
    ENQUIRY: "New Enquiry",
    CERTIFICATE_UPDATE: "Certificate Update",
    PORTAL_SUBMISSION: "New Portal Submission",
  };

  // Wrapping markup is cosmetic only — the field text and line breaks inside <pre> are untouched
  // so the receiving M365 flow's parsing keeps working.
  const html = renderCustomerEmail({
    eyebrow: "Internal Notification",
    title: titleByKind[n.kind],
    bodyHtml: `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f4f7fa; border-radius: 10px; border-left: 4px solid #0066cc;">
          <tr><td style="padding: 20px 22px;">
            <pre style="margin: 0; font-family: Consolas, 'Courier New', monospace; font-size: 13px; line-height: 1.6; color: #1a1a1a; white-space: pre-wrap;">${fields}</pre>
          </td></tr>
        </table>
    `,
  });

  await resend.emails.send({
    from: FROM,
    to: [mailbox],
    subject: buildNotificationSubject(n),
    html,
  });
}

export async function sendCertificateUpdateNotification(data: {
  certificateNumber: string;
  holderName: string;
  course: string;
  status: string;
}) {
  await sendFixedFormatNotification({
    kind: "CERTIFICATE_UPDATE",
    submissionId: data.certificateNumber,
    timestamp: new Date().toISOString(),
    name: data.holderName,
    courseOrService: data.course,
    status: data.status,
    sourcePage: "/admin/certificates",
    subjectRef: data.certificateNumber,
  });
}

// Portal users submit forms/uploads that may contain licences, IDs or other restricted
// evidence (see the "never includes ID/licence/signature/medical/bank evidence" rule above) —
// so this notification is deliberately just a pointer telling staff to review it in
// /admin/portal-submissions, never the answers or attachment links themselves.
export async function sendPortalSubmissionNotification(data: {
  kind: "form" | "upload";
  resourceTitle: string;
  tagId: string;
  userName: string;
  userType: string;
  submissionId: string;
  attachmentCount: number;
}) {
  await sendFixedFormatNotification({
    kind: "PORTAL_SUBMISSION",
    submissionId: data.submissionId,
    timestamp: new Date().toISOString(),
    name: `${data.userName} (${data.tagId})`,
    courseOrService: data.resourceTitle,
    status:
      data.kind === "form"
        ? `Online form completed by ${data.userType}`
        : `Document uploaded by ${data.userType}`,
    sourcePage: "/portal",
    subjectRef: data.resourceTitle,
    extra: {
      label: "Action required",
      value: `${data.attachmentCount} attachment(s) waiting. Review and download in the admin portal: /admin/portal-submissions. Never sent by email — sign in to view.`,
    },
  });
}

export async function sendContactEmail(data: ContactFormData) {
  const autoReplyHtml = renderCustomerEmail({
    eyebrow: "Training Advantage Group Ltd",
    title: "Thank You for Your Enquiry",
    bodyHtml: `
        <p style="color: #1a1a1a; font-size: 16px; margin: 0 0 12px;">Dear ${data.firstName},</p>
        <p style="color: #444; font-size: 15px; line-height: 1.6; margin: 0 0 12px;">Thank you for contacting Training Advantage Group. We have received your message and will respond within 1 business day.</p>
        <p style="color: #444; font-size: 15px; line-height: 1.6; margin: 0;">For urgent enquiries please call us on <a href="tel:01412582024" style="color: #0066cc; font-weight: 700; text-decoration: none;">0141 258 2024</a>.</p>
    `,
  });

  await Promise.all([
    resend.emails.send({
      from: FROM,
      to: [data.email],
      subject: "We've received your enquiry | Training Advantage Group",
      html: autoReplyHtml,
    }),
    sendFixedFormatNotification({
      kind: "ENQUIRY",
      submissionId: `enq-${Date.now()}`,
      timestamp: new Date().toISOString(),
      name: `${data.firstName} ${data.lastName}`.trim(),
      company: data.company,
      email: data.email,
      telephone: data.phone,
      courseOrService: data.subject,
      status: "New enquiry",
      consent: data.consent ? "Terms & Privacy Notice accepted" : undefined,
      sourcePage: data.sourcePage,
      subjectRef: data.subject,
      extra: { label: "Message", value: data.message },
    }),
  ]);
}
