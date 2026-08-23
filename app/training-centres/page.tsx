import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import { MapPin, Phone, Car, Clock, CheckCircle2, Bus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TRAINING_CENTRES as CENTRES } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Training Centres | Bothwell, Motherwell & Glasgow | TAG",
  description:
    "Training Advantage Group Ltd operates three fully equipped training centres across central Scotland — Bothwell, Motherwell and Glasgow — plus remote delivery nationwide.",
};

export default function TrainingCentresPage() {
  return (
    <>
      <PageHero
        title="Our Training Centres"
        subtitle="Three fully equipped professional training centres across central Scotland — plus remote and on-site delivery available nationwide."
        tag="Training Centres"
        breadcrumbs={[{ label: "About TAG", href: "/about" }, { label: "Training Centres" }]}
        cta={{ label: "Get Directions", href: "/contact" }}
      />

      {/* Centres */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          {CENTRES.map((centre, i) => (
            <AnimatedSection key={centre.id} direction={i % 2 === 0 ? "left" : "right"}>
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className={i % 2 === 0 ? "" : "lg:order-2"}>
                  <div className={`bg-gradient-to-br ${centre.gradient} rounded-2xl p-6 text-white mb-4`}>
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
                </div>

                <div className={i % 2 === 0 ? "" : "lg:order-1"}>
                  <p className="text-gray-600 leading-relaxed mb-5">{centre.description}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {centre.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={15} className="text-blue-brand flex-shrink-0" />
                        {feat}
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/training-centres/${centre.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-brand hover:text-navy transition-colors mt-4"
                  >
                    Full {centre.addressLocality} centre details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {i < CENTRES.length - 1 && <hr className="mt-12 border-gray-100" />}
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Shuttle section */}
      <section className="py-16 bg-navy">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection className="text-center">
            <div className="text-4xl mb-4">🚐</div>
            <h2 className="text-2xl font-black text-white mb-3">Free Shuttle Service — Bothwell HQ</h2>
            <p className="text-blue-light/80 mb-6">
              During peak training periods, all candidates at our Bothwell HQ must use the designated candidate shuttle service. Visitors are welcome to park on site.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { icon: Clock, title: "Every 10 Minutes", desc: "Shuttle runs throughout the course window" },
                { icon: Car, title: "Free for Candidates", desc: "No charge for training candidates" },
                { icon: MapPin, title: "St Bride's Church", desc: "Pick-up at Fallside Road, Bothwell" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white/10 rounded-xl p-4 text-white text-center">
                  <Icon size={20} className="text-orange-brand mx-auto mb-2" />
                  <div className="font-bold text-sm">{title}</div>
                  <div className="text-xs text-blue-light/70 mt-1">{desc}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-light/60">
              Shuttle operates from 40 minutes before course start until 40 minutes after course end. Please allow extra time and do not park on site during peak periods.
            </p>
          </AnimatedSection>

          {/* Parking & Shuttle Info Document */}
          <AnimatedSection className="mt-10">
            <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center gap-4">
              <p className="text-white font-bold text-sm uppercase tracking-wider">Full Parking &amp; Shuttle Guide</p>
              <Image
                src="/images/parking-shuttle-info.png"
                alt="Section 22 – Training Centre Parking & Shuttle Service Information"
                width={700}
                height={990}
                className="rounded-xl w-full max-w-2xl object-contain"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Remote & on-site */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="section-heading mb-4">Can&apos;t Travel? We Come to You.</h2>
            <p className="text-gray-600 mb-6">
              On-site training delivery is available at your premises anywhere in the UK. We also offer fully remote online delivery for Driver CPC, TM CPC and e-learning courses.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/fleet-training" className="btn-primary">
                Fleet & On-Site Training
              </Link>
              <Link href="/contact" className="btn-outline">
                Get a Quote
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}
