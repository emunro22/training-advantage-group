import { NextResponse } from "next/server";
import { getPricingData, savePricingData, type PricingStore, type SpecialOffer, type PriceOverride } from "@/lib/storage";
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
    const data = await getPricingData();

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
      data.specialOffers.push(offer);
      await savePricingData(data);
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
      data.priceOverrides.push(override);
      await savePricingData(data);
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
    const body = (await request.json()) as { type: "offer" | "override"; id: string } & Partial<PricingStore>;
    const data = await getPricingData();

    if (body.type === "offer") {
      const idx = data.specialOffers.findIndex((o) => o.id === body.id);
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
      data.specialOffers[idx] = { ...data.specialOffers[idx], ...(body as Partial<SpecialOffer>) };
      await savePricingData(data);
      return NextResponse.json({ ok: true });
    }

    if (body.type === "override") {
      const idx = data.priceOverrides.findIndex((o) => o.id === body.id);
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
      data.priceOverrides[idx] = { ...data.priceOverrides[idx], ...(body as Partial<PriceOverride>) };
      await savePricingData(data);
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
    const data = await getPricingData();

    if (type === "offer") {
      data.specialOffers = data.specialOffers.filter((o) => o.id !== id);
    } else if (type === "override") {
      data.priceOverrides = data.priceOverrides.filter((o) => o.id !== id);
    }

    await savePricingData(data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
