export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import {
  getPricingData,
  addSpecialOffer,
  updateSpecialOffer,
  deleteSpecialOffer,
  addPriceOverride,
  updatePriceOverride,
  deletePriceOverride,
  type SpecialOffer,
  type PriceOverride,
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
  const data = await getPricingData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { type: "offer" | "override" } & Record<string, unknown>;

    if (body.type === "offer") {
      const offer: SpecialOffer = {
        id: `offer-${Date.now()}`,
        title: (body.title as string) ?? "",
        description: (body.description as string) ?? "",
        discountType: (body.discountType as "percentage" | "fixed") ?? "percentage",
        discountValue: (body.discountValue as number) ?? 0,
        courseId: body.courseId as string | undefined,
        courseName: body.courseName as string | undefined,
        validUntil: body.validUntil as string | undefined,
        active: (body.active as boolean) ?? true,
        promoCode: body.promoCode as string | undefined,
        createdAt: new Date().toISOString(),
      };
      await addSpecialOffer(offer);
      return NextResponse.json({ offer }, { status: 201 });
    }

    if (body.type === "override") {
      const override: PriceOverride = {
        id: `override-${Date.now()}`,
        courseId: (body.courseId as string) ?? "",
        courseName: (body.courseName as string) ?? "",
        originalPrice: (body.originalPrice as string) ?? "",
        overridePrice: (body.overridePrice as string) ?? "",
        label: body.label as string | undefined,
        active: (body.active as boolean) ?? true,
      };
      await addPriceOverride(override);
      return NextResponse.json({ override }, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { type: "offer" | "override"; id: string } & Record<string, unknown>;

    if (body.type === "offer") {
      const ok = await updateSpecialOffer(body.id, body as Partial<SpecialOffer>);
      if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }

    if (body.type === "override") {
      const ok = await updatePriceOverride(body.id, body as Partial<PriceOverride>);
      if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { type, id } = (await request.json()) as { type: "offer" | "override"; id: string };

    if (type === "offer") {
      await deleteSpecialOffer(id);
    } else if (type === "override") {
      await deletePriceOverride(id);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
