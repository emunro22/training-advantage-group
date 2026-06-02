import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSquareClient, DEPOSIT_AMOUNT_PENCE } from "@/lib/square";
import { getDb, ensureSchema } from "@/lib/db";

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
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    await ensureSchema();
    const sql = getDb();

    const amountPence =
      data.paymentType === "deposit" ? DEPOSIT_AMOUNT_PENCE : data.totalAmountPence;
    const remainingPence =
      data.paymentType === "deposit" ? data.totalAmountPence - DEPOSIT_AMOUNT_PENCE : 0;

    const orderId = crypto.randomUUID();

    await sql`
      INSERT INTO orders (
        id, status, payment_type, amount_paid_pence, total_amount_pence,
        remaining_balance_pence, first_name, last_name, email, phone, company,
        course_id, course_name, preferred_date, delegates, location, notes
      ) VALUES (
        ${orderId}, 'pending', ${data.paymentType}, ${amountPence},
        ${data.totalAmountPence}, ${remainingPence},
        ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone},
        ${data.company}, ${data.courseId}, ${data.courseName},
        ${data.preferredDate}, ${data.delegates}, ${data.location}, ${data.notes}
      )
    `;

    const baseUrl =
      process.env.NEXT_PUBLIC_URL ?? "https://trainingadvantagegroup.co.uk";
    const locationId = process.env.SQUARE_LOCATION_ID ?? "";
    const client = getSquareClient();

    const itemName =
      data.paymentType === "deposit"
        ? `Deposit — ${data.courseName} (${data.delegates} delegate${data.delegates > 1 ? "s" : ""})`
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
