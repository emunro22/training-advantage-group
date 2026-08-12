export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { bulkAddCertificates, type Certificate } from "@/lib/storage";
import { cookies } from "next/headers";
import { validateSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json() as { certificates: Partial<Certificate>[] };
    if (!Array.isArray(body.certificates) || body.certificates.length === 0) {
      return NextResponse.json({ error: "No certificates provided" }, { status: 400 });
    }
    if (body.certificates.length > 5000) {
      return NextResponse.json({ error: "Maximum 5000 records per import" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const certs: Certificate[] = body.certificates.map((c, i) => ({
      id: `cert-import-${Date.now()}-${i}`,
      certificateNumber: (c.certificateNumber ?? "").trim(),
      holderFirstName: (c.holderFirstName ?? "").trim(),
      holderLastName: (c.holderLastName ?? "").trim(),
      course: (c.course ?? "").trim(),
      courseType: (c.courseType ?? "").trim(),
      issueDate: (c.issueDate ?? "").trim(),
      expiryDate: (c.expiryDate ?? "").trim(),
      status: normaliseStatus(c.status),
      trainingCentre: c.trainingCentre?.trim() || undefined,
      notes: c.notes?.trim() || undefined,
      createdAt: now,
    }));

    const valid = certs.filter((c) => c.certificateNumber && c.holderLastName && c.course);
    const invalidCount = certs.length - valid.length;

    const result = await bulkAddCertificates(valid);
    return NextResponse.json({ ...result, invalid: invalidCount }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function normaliseStatus(s?: string): Certificate["status"] {
  const v = (s ?? "").toLowerCase().trim();
  if (v === "expired") return "expired";
  if (v === "revoked" || v === "cancelled" || v === "canceled") return "revoked";
  if (v === "replaced") return "replaced";
  return "valid";
}
