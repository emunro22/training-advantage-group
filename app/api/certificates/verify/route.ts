import { NextResponse } from "next/server";
import { verifyCertificate } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { certificateNumber?: string; lastName?: string };

    if (!body.certificateNumber) {
      return NextResponse.json({ error: "Certificate number is required" }, { status: 400 });
    }

    const cert = await verifyCertificate(body.certificateNumber, body.lastName);

    if (!cert) {
      return NextResponse.json({ found: false });
    }

    // Auto-update status based on expiry date
    const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();
    const effectiveStatus = cert.status === "revoked" ? "revoked" : isExpired ? "expired" : "valid";

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
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
