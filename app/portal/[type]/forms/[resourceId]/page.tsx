export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { PORTAL_COOKIE, validatePortalSessionToken, PORTAL_USER_TYPES, type PortalUserType } from "@/lib/portal-auth";
import { getPortalUserById, getPortalResourceById } from "@/lib/storage";
import PortalHeader from "@/components/portal/PortalHeader";
import PortalFormClient from "@/components/portal/PortalFormClient";

interface Props {
  params: Promise<{ type: string; resourceId: string }>;
}

const TYPE_LABELS: Record<PortalUserType, string> = {
  staff: "Staff Portal",
  instructor: "Instructor / Assessor Portal",
  supplier: "Supplier / Subcontractor Portal",
  candidate: "Candidate Secure Resources",
};

export default async function PortalFormPage({ params }: Props) {
  const { type, resourceId } = await params;
  if (!PORTAL_USER_TYPES.includes(type as PortalUserType)) notFound();

  const cookieStore = await cookies();
  const session = validatePortalSessionToken(cookieStore.get(PORTAL_COOKIE)?.value);
  if (!session || session.type !== type) redirect("/portal/login");

  const user = await getPortalUserById(session.userId);
  if (!user || !user.active) redirect("/portal/login");

  const allowedAreas = [user.type, ...user.extraAreas];
  const resource = await getPortalResourceById(resourceId);
  if (
    !resource ||
    !resource.active ||
    resource.resourceType !== "online_form" ||
    !allowedAreas.includes(resource.area)
  ) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-light">
      <PortalHeader title={TYPE_LABELS[type as PortalUserType]} tagId={user.tagId} />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <PortalFormClient
          resourceId={resource.id}
          title={resource.title}
          description={resource.description}
          fields={resource.formFields ?? []}
          pdfUrl={resource.url || undefined}
          backHref={`/portal/${type}`}
          tagId={user.tagId}
          name={user.name}
        />
      </div>
    </div>
  );
}
