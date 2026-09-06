import { NextResponse } from "next/server";
import { verifyCertificate, addCertReplacementRequest, type CertReplacementRequest } from "@/lib/storage";
import { sendCertReplacementRequestNotification, sendCertReplacementCustomerEmail } from "@/lib/email";

// Same lightweight per-IP throttle as /api/certificates/verify — this route also re-verifies
// the certificate server-side, so it carries the same enumeration/abuse profile.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = (await request.json()) as {
      certificateNumber?: string;
      lastName?: string;
      contactName?: string;
      email?: string;
      phone?: string;
      notes?: string;
    };

    if (!body.certificateNumber || !body.contactName?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: "Certificate number, name and email are required" }, { status: 400 });
    }

    const cert = await verifyCertificate(body.certificateNumber, body.lastName);
    if (!cert) {
      return NextResponse.json({ error: "We couldn't find a matching certificate" }, { status: 404 });
    }

    const record: CertReplacementRequest = {
      id: `crr-${Date.now()}`,
      type: "electronic",
      status: "new",
      certificateNumber: cert.certificateNumber,
      holderName: `${cert.holderFirstName} ${cert.holderLastName}`,
      course: cert.course,
      contactName: body.contactName.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() ?? "",
      notes: body.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addCertReplacementRequest(record);

    // The request is already saved and visible in /admin/cert-replacement-requests at this
    // point, so a Resend failure (e.g. missing API key) is logged, not surfaced as a failure
    // to the customer — matches the portal submission notification pattern.
    try {
      await Promise.all([
        sendCertReplacementRequestNotification({
          id: record.id,
          type: "electronic",
          certificateNumber: record.certificateNumber,
          holderName: record.holderName,
          course: record.course,
          contactName: record.contactName,
          email: record.email,
          phone: record.phone,
          notes: record.notes,
        }),
        sendCertReplacementCustomerEmail({
          type: "electronic",
          contactName: record.contactName,
          email: record.email,
          certificateNumber: record.certificateNumber,
        }),
      ]);
    } catch (e) {
      console.error("[cert replacement request] notification failed:", e);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Certificate replacement request error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
