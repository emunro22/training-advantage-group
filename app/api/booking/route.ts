import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendBookingConfirmation } from "@/lib/email";

const bookingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().optional(),
  courseId: z.string().min(1),
  courseName: z.string().min(1),
  preferredDate: z.string().min(1),
  delegates: z.number().min(1).max(100),
  location: z.string().min(1),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    await sendBookingConfirmation(data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: err.errors },
        { status: 400 }
      );
    }

    console.error("Booking API error:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't process your booking right now. Please call us on 0141 258 2024 or email office@trainingadvantagegroup.co.uk",
      },
      { status: 500 }
    );
  }
}
