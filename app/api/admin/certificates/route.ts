import { NextResponse } from "next/server";
import {
  getCertificates,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  type Certificate,
} from "@/lib/storage";
import { cookies } from "next/headers";
import { validateSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const certs = await getCertificates();
  return NextResponse.json({ certificates: certs });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Partial<Certificate>;
    const cert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: body.certificateNumber ?? "",
      holderFirstName: body.holderFirstName ?? "",
      holderLastName: body.holderLastName ?? "",
      course: body.course ?? "",
      courseType: body.courseType ?? "",
      issueDate: body.issueDate ?? "",
      expiryDate: body.expiryDate ?? "",
      status: body.status ?? "valid",
      trainingCentre: body.trainingCentre,
      notes: body.notes,
      createdAt: new Date().toISOString(),
    };

    if (!cert.certificateNumber || !cert.holderLastName || !cert.course) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await addCertificate(cert);
    return NextResponse.json({ certificate: cert }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, ...updates } = (await request.json()) as { id: string } & Partial<Certificate>;
    const ok = await updateCertificate(id, updates);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = (await request.json()) as { id: string };
    const ok = await deleteCertificate(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
