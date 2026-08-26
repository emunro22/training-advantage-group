export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, validateSessionToken } from "@/lib/admin-auth";
import {
  getPortalUsers,
  getPortalUserByTagId,
  addPortalUser,
  updatePortalUser,
  deletePortalUser,
  type PortalUser,
} from "@/lib/storage";
import { generateAccessCode, generateSalt, hashAccessCode } from "@/lib/portal-auth";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

// Never return the hash/salt to the client — only ever the plaintext code, and only
// once, immediately after it's generated (on create or reset).
function toPublicUser(u: PortalUser) {
  const { accessCodeHash: _accessCodeHash, accessCodeSalt: _accessCodeSalt, ...rest } = u;
  return rest;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await getPortalUsers();
  return NextResponse.json({ users: users.map(toPublicUser) });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<PortalUser>;
  if (!body.tagId || !body.type) {
    return NextResponse.json({ error: "TAG ID and type are required" }, { status: 400 });
  }
  if (await getPortalUserByTagId(body.tagId.trim())) {
    return NextResponse.json({ error: "That TAG ID is already in use" }, { status: 400 });
  }

  const accessCode = generateAccessCode();
  const accessCodeSalt = generateSalt();
  const user: PortalUser = {
    id: `pu-${Date.now()}`,
    tagId: body.tagId.trim(),
    name: body.name ?? "",
    type: body.type,
    accessCodeHash: hashAccessCode(accessCode, accessCodeSalt),
    accessCodeSalt,
    extraAreas: Array.isArray(body.extraAreas) ? body.extraAreas : [],
    active: body.active ?? true,
    createdAt: new Date().toISOString(),
  };
  await addPortalUser(user);
  return NextResponse.json({ user: toPublicUser(user), accessCode }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, resetCode, ...updates } = (await request.json()) as { id: string; resetCode?: boolean } & Partial<PortalUser>;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  let accessCode: string | undefined;
  if (resetCode) {
    accessCode = generateAccessCode();
    const accessCodeSalt = generateSalt();
    updates.accessCodeHash = hashAccessCode(accessCode, accessCodeSalt);
    updates.accessCodeSalt = accessCodeSalt;
  }

  const ok = await updatePortalUser(id, updates);
  return NextResponse.json({ ok, accessCode });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = (await request.json()) as { id: string };
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const ok = await deletePortalUser(id);
  return NextResponse.json({ ok });
}
