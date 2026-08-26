export const dynamic = "force-dynamic";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { FileText, ExternalLink, Download, MonitorCheck } from "lucide-react";
import { PORTAL_COOKIE, validatePortalSessionToken, PORTAL_USER_TYPES, type PortalUserType } from "@/lib/portal-auth";
import { getPortalUserById, getPortalResourcesForAreas } from "@/lib/storage";
import PortalHeader from "@/components/portal/PortalHeader";
import AdHocUploadCard from "@/components/portal/AdHocUploadCard";

interface Props {
  params: Promise<{ type: string }>;
}

const TYPE_LABELS: Record<PortalUserType, string> = {
  staff: "Staff Portal",
  instructor: "Instructor / Assessor Portal",
  supplier: "Supplier / Subcontractor Portal",
  candidate: "Candidate Secure Resources",
};

export default async function PortalAreaPage({ params }: Props) {
  const { type } = await params;
  if (!PORTAL_USER_TYPES.includes(type as PortalUserType)) notFound();

  // Middleware already gates this route (session must exist, be active, and match `type`)
  // — re-checked here too since this is the actual point resources get listed.
  const cookieStore = await cookies();
  const session = validatePortalSessionToken(cookieStore.get(PORTAL_COOKIE)?.value);
  if (!session || session.type !== type) redirect("/portal/login");

  const user = await getPortalUserById(session.userId);
  if (!user || !user.active) redirect("/portal/login");

  const allowedAreas = [user.type, ...user.extraAreas];
  const resources = await getPortalResourcesForAreas(allowedAreas);

  return (
    <div className="min-h-screen bg-gray-light">
      <PortalHeader title={TYPE_LABELS[type as PortalUserType]} tagId={user.tagId} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {resources.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center shadow-sm">
            <FileText size={40} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-black text-gray-700 mb-2">No resources allocated yet</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              TAG hasn&apos;t added any documents or forms for you yet. Check back soon, or contact{" "}
              <a href="mailto:office@trainingadvantagegroup.co.uk" className="text-blue-brand font-semibold hover:underline">
                office@trainingadvantagegroup.co.uk
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {resources.map((r) => {
              if (r.resourceType === "online_form") {
                return (
                  <div key={r.id} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-card p-4">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <MonitorCheck size={18} className="text-orange-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-navy text-sm">{r.title}</div>
                      {r.description && <div className="text-xs text-gray-500 mt-0.5">{r.description}</div>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-brand hover:text-blue-brand transition-colors"
                        >
                          <Download size={13} /> PDF
                        </a>
                      )}
                      <Link
                        href={`/portal/${type}/forms/${r.id}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-orange-brand rounded-lg px-3 py-2 hover:bg-orange-dark transition-colors"
                      >
                        Complete Online
                      </Link>
                    </div>
                  </div>
                );
              }
              const Icon = r.resourceType === "document" ? FileText : ExternalLink;
              const href = r.resourceType === "document" ? `/api/portal/resources/${r.id}/download` : r.url;
              return (
                <a
                  key={r.id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-card p-4 hover:border-blue-brand transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-brand transition-colors">
                    <Icon size={18} className="text-orange-brand group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-navy text-sm">{r.title}</div>
                    {r.description && <div className="text-xs text-gray-500 mt-0.5">{r.description}</div>}
                  </div>
                  {r.resourceType === "document" ? (
                    <Download size={16} className="text-gray-300 group-hover:text-blue-brand transition-colors flex-shrink-0" />
                  ) : (
                    <ExternalLink size={16} className="text-gray-300 group-hover:text-blue-brand transition-colors flex-shrink-0" />
                  )}
                </a>
              );
            })}
          </div>
        )}

        {type === "instructor" && (
          <div className="mt-6">
            <AdHocUploadCard />
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-10">
          Only submit information using the secure forms above — never by ordinary email.{" "}
          Need help?{" "}
          <a href="mailto:office@trainingadvantagegroup.co.uk" className="text-blue-brand hover:underline">
            office@trainingadvantagegroup.co.uk
          </a>
        </p>
      </div>
    </div>
  );
}
