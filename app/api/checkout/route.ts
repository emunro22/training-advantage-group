import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSquareClient } from "@/lib/square";
import { getDb, ensureSchema } from "@/lib/db";
import { computeDeposit, generateOrderRef, splitVat, isPromoApplicable, computePromoDiscountPence } from "@/lib/order-contract";
import { getWebsiteProductById, getPricingData } from "@/lib/storage";

const checkoutSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().optional().default(""),
  courseId: z.string().min(1),
  courseName: z.string().min(1),
  preferredDate: z.string().min(1),
  delegates: z.number().min(1).max(50),
  location: z.string().min(1),
  notes: z.string().optional().default(""),
  paymentType: z.enum(["full", "deposit"]),
  totalAmountPence: z.number().min(1),
  // Optional — set when the customer booked via a TAG-approved Website Product (CourseProductTable).
  // When present it MUST resolve to a Published row; a stale/invalid link fails closed rather than
  // silently taking payment for an unapproved or since-withdrawn product.
  websiteProductId: z.string().optional(),
  sourcePage: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, "You must accept the Terms and Privacy Notice"),
  discountCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    await ensureSchema();
    const sql = getDb();

    // Discount codes are re-validated and re-computed server-side — the client-sent totalAmountPence
    // is only ever a display figure, never trusted for what Square actually charges.
    let discountCode: string | null = null;
    let discountAmountPence = 0;
    if (data.discountCode) {
      const { specialOffers } = await getPricingData();
      const offer = specialOffers.find(
        (o) => o.promoCode && o.promoCode.toLowerCase() === data.discountCode!.trim().toLowerCase()
      );
      if (!offer || !isPromoApplicable(offer, data.courseId, data.courseName)) {
        return NextResponse.json(
          { error: "That promo code is not valid for this course, or has expired." },
          { status: 400 }
        );
      }
      discountCode = offer.promoCode ?? data.discountCode;
      discountAmountPence = computePromoDiscountPence(offer, data.totalAmountPence);
    }
    const discountedTotalPence = data.totalAmountPence - discountAmountPence;

    // TAG-WEB-REQ-001 §4 deposit tiering: ≤£250 → £50 (or full if <£50); >£250 → 20%;
    // within 7 calendar days of the course → full payment. Applied to the discounted total.
    const deposit = computeDeposit(discountedTotalPence, data.preferredDate);
    const amountPence =
      data.paymentType === "deposit" && !deposit.isFullPayment ? deposit.depositPence : discountedTotalPence;
    const remainingPence = discountedTotalPence - amountPence;

    let websiteProductId: string | null = null;
    let tagPriceId: string | null = null;
    let vatTreatment = "Standard 20%";
    let joiningPackCode: string | null = null;
    let issuePackCode: string | null = null;

    if (data.websiteProductId) {
      const product = await getWebsiteProductById(data.websiteProductId);
      if (!product || product.publishDecision !== "Published") {
        return NextResponse.json(
          { error: "This item is not currently available for online purchase. Please contact us on 0141 258 2024." },
          { status: 409 }
        );
      }
      websiteProductId = product.websiteProductId ?? product.id;
      tagPriceId = product.priceId;
      vatTreatment = product.vatTreatment;
      joiningPackCode = product.joiningPackCode ?? null;
      issuePackCode = product.issuePackCode ?? null;
    }

    const { netExVatPence, vatAmountPence } = splitVat(discountedTotalPence, vatTreatment);
    const orderRef = generateOrderRef();
    const orderId = crypto.randomUUID();

    await sql`
      INSERT INTO orders (
        id, status, payment_type, amount_paid_pence, total_amount_pence,
        remaining_balance_pence, first_name, last_name, email, phone, company,
        course_id, course_name, preferred_date, delegates, location, notes,
        order_ref, website_product_id, tag_price_id, net_ex_vat_pence, vat_amount_pence,
        vat_treatment, terms_version, privacy_notice_version, candidate_registration_required,
        joining_pack_code, issue_pack_code, validation_status, source_page, consent_given, consent_given_at,
        discount_code, discount_amount_pence
      ) VALUES (
        ${orderId}, 'pending', ${data.paymentType}, ${amountPence},
        ${discountedTotalPence}, ${remainingPence},
        ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone},
        ${data.company}, ${data.courseId}, ${data.courseName},
        ${data.preferredDate}, ${data.delegates}, ${data.location}, ${data.notes},
        ${orderRef}, ${websiteProductId}, ${tagPriceId}, ${netExVatPence}, ${vatAmountPence},
        ${vatTreatment}, ${process.env.TERMS_VERSION ?? null}, ${process.env.PRIVACY_NOTICE_VERSION ?? null}, TRUE,
        ${joiningPackCode}, ${issuePackCode}, 'received', ${data.sourcePage ?? null}, TRUE, NOW(),
        ${discountCode}, ${discountAmountPence}
      )
    `;

    const baseUrl =
      process.env.NEXT_PUBLIC_URL ?? "https://trainingadvantagegroup.co.uk";
    const locationId = process.env.SQUARE_LOCATION_ID ?? "";
    const client = getSquareClient();

    const itemName =
      data.paymentType === "deposit"
        ? `Deposit: ${data.courseName} (${data.delegates} delegate${data.delegates > 1 ? "s" : ""})`
        : `${data.courseName} (${data.delegates} delegate${data.delegates > 1 ? "s" : ""})`;

    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: orderId,
      quickPay: {
        name: itemName,
        priceMoney: {
          amount: BigInt(amountPence),
          currency: "GBP",
        },
        locationId,
      },
      checkoutOptions: {
        redirectUrl: `${baseUrl}/booking/success?orderId=${orderId}`,
        merchantSupportEmail: "office@trainingadvantagegroup.co.uk",
      },
      prePopulatedData: {
        buyerEmail: data.email,
      },
    });

    const checkoutUrl = response.paymentLink?.url;
    const squareOrderId = response.paymentLink?.orderId;

    if (!checkoutUrl) {
      throw new Error("Square did not return a checkout URL");
    }

    if (squareOrderId) {
      await sql`
        UPDATE orders SET square_order_id = ${squareOrderId}, updated_at = NOW()
        WHERE id = ${orderId}
      `;
    }

    return NextResponse.json({ checkoutUrl, orderId });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: err.errors },
        { status: 400 }
      );
    }
    console.error("Checkout API error:", err);
    return NextResponse.json(
      { error: "Could not create payment link. Please call us on 0141 258 2024." },
      { status: 500 }
    );
  }
}
