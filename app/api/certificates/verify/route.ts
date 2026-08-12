import { NextResponse } from "next/server";
import { verifyCertificate } from "@/lib/storage";

// Best-effort anti-enumeration/rate control (TAG-WEB-REQ-001 §7): a simple in-memory sliding
// window per IP. This resets on cold start / across serverless instances, so it is a deterrent
// against casual scripted enumeration rather than a hard guarantee — acceptable for a public
// minimum-data lookup with no restricted fields, but should be replaced with a shared store
// (e.g. Vercel KV/Upstash) if abuse is observed in production.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
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

    const body = (await request.json()) as { certificateNumber?: string; lastName?: string };

    if (!body.certificateNumber) {
      return NextResponse.json({ error: "Certificate number is required" }, { status: 400 });
    }

    const cert = await verifyCertificate(body.certificateNumber, body.lastName);

    if (!cert) {
      return NextResponse.json({ found: false });
    }

    // Auto-update status based on expiry date. "replaced" and "revoked" are administrator-set
    // terminal states and always take precedence over a date-derived expiry.
    const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();
    const effectiveStatus =
      cert.status === "revoked" || cert.status === "replaced"
        ? cert.status
        : isExpired
        ? "expired"
        : "valid";

    return NextResponse.json({
      found: true,
      certificate: {
        certificateNumber: cert.certificateNumber,
        holderName: `${cert.holderFirstName} ${cert.holderLastName}`,
        course: cert.course,
        courseType: cert.courseType,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        status: effectiveStatus,
        trainingCentre: cert.trainingCentre,
        accreditedBy: cert.accreditedBy?.length ? cert.accreditedBy : undefined,
        accreditedRef: cert.accreditedRef || undefined,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
