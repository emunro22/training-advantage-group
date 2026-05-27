import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    await sendContactEmail(data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: err.errors },
        { status: 400 }
      );
    }

    console.error("Contact API error:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't send your message. Please call 0141 258 2024 or email office@trainingadvantagegroup.co.uk directly.",
      },
      { status: 500 }
    );
  }
}
