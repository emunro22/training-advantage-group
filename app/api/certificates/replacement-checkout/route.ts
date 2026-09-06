import { NextResponse } from "next/server";
import { getSquareClient } from "@/lib/square";
import {
  verifyCertificate,
  addCertReplacementRequest,
  updateCertReplacementRequest,
  type CertReplacementRequest,
} from "@/lib/storage";

// Same lightweight per-IP throttle as /api/certificates/verify — this route also re-verifies
// the certificate server-side before creating a payment link.
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

// Flat re-issue fee, same for every awarding body — see REPLACEMENT_CERT_FEE_PENCE in
// .env.local.example. TODO(TAG): confirm the real fee before go-live, this is a placeholder.
const REPLACEMENT_CERT_FEE_PENCE = Number(process.env.REPLACEMENT_CERT_FEE_PENCE ?? 2500);

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
      awardingBody?: string;
      notes?: string;
    };

    if (!body.certificateNumber || !body.contactName?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: "Certificate number, name and email are required" }, { status: 400 });
    }

    const cert = await verifyCertificate(body.certificateNumber, body.lastName);
    if (!cert) {
      return NextResponse.json({ error: "We couldn't find a matching certificate" }, { status: 404 });
    }

    const orderId = crypto.randomUUID();
    const record: CertReplacementRequest = {
      id: orderId,
      type: "awarding_body",
      status: "pending_payment",
      certificateNumber: cert.certificateNumber,
      holderName: `${cert.holderFirstName} ${cert.holderLastName}`,
      course: cert.course,
      awardingBody: body.awardingBody?.trim() || cert.accreditedBy?.[0],
      contactName: body.contactName.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() ?? "",
      notes: body.notes?.trim() || undefined,
      amountPence: REPLACEMENT_CERT_FEE_PENCE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addCertReplacementRequest(record);

    const baseUrl = process.env.NEXT_PUBLIC_URL ?? "https://trainingadvantagegroup.co.uk";
    const locationId = process.env.SQUARE_LOCATION_ID ?? "";
    const client = getSquareClient();

    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: orderId,
      quickPay: {
        name: `Replacement Awarding Body Certificate — ${cert.course} (${record.certificateNumber})`,
        priceMoney: {
          amount: BigInt(REPLACEMENT_CERT_FEE_PENCE),
          currency: "GBP",
        },
        locationId,
      },
      checkoutOptions: {
        redirectUrl: `${baseUrl}/verify-certificate/replacement-success?orderId=${orderId}`,
        merchantSupportEmail: "office@trainingadvantagegroup.co.uk",
      },
      prePopulatedData: {
        buyerEmail: record.email,
      },
    });

    const checkoutUrl = response.paymentLink?.url;
    const squareOrderId = response.paymentLink?.orderId;

    if (!checkoutUrl) {
      throw new Error("Square did not return a checkout URL");
    }

    if (squareOrderId) {
      await updateCertReplacementRequest(orderId, { squareOrderId });
    }

    return NextResponse.json({ checkoutUrl, orderId });
  } catch (err) {
    console.error("Certificate replacement checkout error:", err);
    return NextResponse.json(
      { error: "Could not create payment link. Please call us on 0141 258 2024." },
      { status: 500 }
    );
  }
}
