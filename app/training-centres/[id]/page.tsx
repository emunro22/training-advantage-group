import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import StructuredData from "@/components/seo/StructuredData";
import { MapPin, Phone, Bus, CheckCircle2, ArrowRight } from "lucide-react";
import { TRAINING_CENTRES, getTrainingCentre } from "@/lib/locations";
import { buildLocationSchema } from "@/lib/schema";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return TRAINING_CENTRES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const centre = getTrainingCentre(id);
  if (!centre) return {};
  return {
    title: `${centre.name} | ${centre.addressLocality} | Training Advantage Group`,
    description: `${centre.intro} DVSA/NPORS accredited transport and industrial training at our ${centre.addressLocality} training centre, ${centre.address}.`,
  };
}

export default async function TrainingCentreDetailPage({ params }: Props) {
  const { id } = await params;
  const centre = getTrainingCentre(id);
  if (!centre) notFound();

  return (
    <>
      <StructuredData data={buildLocationSchema(centre)} />
      <PageHero
        title={centre.name}
        subtitle={centre.intro}
        tag={centre.addressLocality}
        breadcrumbs={[
          { label: "Training Centres", href: "/training-centres" },
          { label: centre.addressLocality },
        ]}
        cta={{ label: "Get Directions", href: `https://maps.google.com/?q=${encodeURIComponent(centre.address)}` }}
      />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
          <AnimatedSection direction="left">
            <div className={`bg-gradient-to-br ${centre.gradient} rounded-2xl p-6 text-white mb-6`}>
              <div className="text-4xl mb-3">{centre.emoji}</div>
              <h2 className="font-black text-2xl mb-1">{centre.name}</h2>
              <div className="flex items-start gap-2 text-white/80 text-sm mt-2">
                <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                <span>{centre.address}</span>
              </div>
              <div className="mt-3 flex gap-3">
                <a href="tel:01412582024" className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 rounded-lg text-sm">
                  <Phone size={13} />
                  0141 258 2024
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(centre.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 rounded-lg text-sm"
                >
                  <MapPin size={13} />
                  Directions
                </a>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <Bus size={16} className="text-blue-brand flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">{centre.transport}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <p className="text-gray-600 leading-relaxed mb-5">{centre.description}</p>
            <div className="grid grid-cols-1 gap-2 mb-6">
              {centre.features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={15} className="text-blue-brand flex-shrink-0" />
                  {feat}
                </div>
              ))}
            </div>

            <h3 className="font-bold text-navy text-sm uppercase tracking-wide mb-2">Areas we serve near {centre.addressLocality}</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {centre.areasServed.map((area) => (
                <span key={area} className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {area}
                </span>
              ))}
            </div>

            <Link href="/upcoming-courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-brand hover:text-navy transition-colors">
              View course dates at this centre <ArrowRight size={14} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-10 bg-gray-light text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/training-centres" className="text-sm font-semibold text-blue-brand hover:underline">
            ← View all TAG training centres
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
