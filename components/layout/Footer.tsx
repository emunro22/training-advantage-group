import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Globe, Facebook, Linkedin, Instagram } from "lucide-react";
import { getPublicAccreditationLogos } from "@/lib/accreditation-logos-public";

const FOOTER_LINKS = {
  training: [
    { label: "Driver CPC", href: "/driver-cpc" },
    { label: "Transport Manager CPC", href: "/tm-cpc" },
    { label: "HGV / PCV Training", href: "/hgv-training" },
    { label: "ADR Dangerous Goods", href: "/adr-training" },
    { label: "Plant & MHE Training", href: "/plant-training" },
    { label: "Instructor Training", href: "/instructor-training" },
  ],
  services: [
    { label: "E-Learning Academy", href: "/e-learning" },
    { label: "Consultancy & Compliance", href: "/consultancy" },
    { label: "External TM Services", href: "/consultancy#external-tm" },
    { label: "Fleet Compliance Audit", href: "/consultancy#audit" },
    { label: "OLAT Training", href: "/consultancy#olat" },
    { label: "Tachograph Analysis", href: "/consultancy#tacho" },
  ],
  learner: [
    { label: "Learner Hub", href: "/learner-hub" },
    { label: "Course Pricing", href: "/pricing" },
    { label: "Book Training", href: "/booking" },
    { label: "Forms, Portals & Secure Resources", href: "/forms-portals-resources" },
    { label: "Downloads & Documents", href: "/downloads" },
    { label: "Course FAQs", href: "/learner-hub#faqs" },
    { label: "Joining Instructions", href: "/learner-hub#joining" },
    { label: "Funding Information", href: "/learner-hub#funding" },
    { label: "Getting Here", href: "/learner-hub#directions" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Company Information", href: "/company-information" },
    { label: "Accreditations", href: "/accreditations" },
    { label: "Training Centres", href: "/training-centres" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "News & Updates", href: "/news" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact" },
    { label: "Policies", href: "/policies" },
  ],
};

export default async function Footer() {
  const accreditationLogos = await getPublicAccreditationLogos("footer");
  return (
    <footer>
      {/* Accreditations strip */}
      <div className="bg-white border-t-2 border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-7">
            Approved &amp; Accredited By
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {accreditationLogos.map((logo) => {
              const inner = (
                <div className="relative h-12 w-[120px]">
                  <Image src={logo.src} alt={logo.alt} fill sizes="120px" className="object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              );
              const cardClass =
                "group flex-shrink-0 bg-gray-light/60 hover:bg-white rounded-xl px-4 py-3 border border-transparent hover:border-gray-100 hover:shadow-sm transition-all duration-300";
              return logo.href ? (
                <a key={logo.name} href={logo.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                  {inner}
                </a>
              ) : (
                <div key={logo.name} className={cardClass}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-5 group">
                <div className="relative h-16 w-16 flex-shrink-0 bg-white rounded-xl p-1.5 group-hover:scale-105 transition-transform">
                  <Image
                    src="/images/logo.png"
                    alt="Training Advantage Group Ltd"
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="font-black text-white leading-tight text-base">
                    TRAINING <span className="text-blue-300">ADVANTAGE</span>
                  </div>
                  <div className="font-black text-white leading-tight text-base">GROUP LTD</div>
                  <div className="text-orange-brand text-[10px] font-bold tracking-[0.15em] mt-0.5">
                    TRAINING FOR THE FUTURE
                  </div>
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Scotland&apos;s leading transport and industrial training provider. Professional training
                delivered across Bothwell, Motherwell and Glasgow.
              </p>

              {/* Contact */}
              <div className="space-y-2.5">
                <a href="tel:01412582024" className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-brand transition-colors group">
                  <Phone size={14} className="text-orange-brand flex-shrink-0 group-hover:scale-110 transition-transform" />
                  0141 258 2024
                </a>
                <a href="mailto:office@trainingadvantagegroup.co.uk" className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-brand transition-colors">
                  <Mail size={14} className="text-orange-brand flex-shrink-0" />
                  office@trainingadvantagegroup.co.uk
                </a>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <MapPin size={14} className="text-orange-brand flex-shrink-0 mt-0.5" />
                  <span>1st Floor Training Suite, APC Depot, Coalburn Road, Bothwell, G71 8DA</span>
                </div>
                <a href="https://www.trainingadvantagegroup.co.uk" className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-brand transition-colors">
                  <Globe size={14} className="text-orange-brand flex-shrink-0" />
                  www.trainingadvantagegroup.co.uk
                </a>
              </div>

              {/* Social */}
              <div className="flex items-center gap-3 mt-6">
                {[
                  { href: "https://facebook.com/TrainingAdvantageGroup", icon: Facebook },
                  { href: "https://linkedin.com/company/training-advantage-group-ltd", icon: Linkedin },
                  { href: "https://instagram.com/trainingadvantagegroup", icon: Instagram },
                ].map(({ href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-orange-brand transition-all hover:scale-110"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <FooterColumn title="Training" links={FOOTER_LINKS.training} />
            <FooterColumn title="Services" links={FOOTER_LINKS.services} />
            <FooterColumn title="Learner" links={FOOTER_LINKS.learner} />
            <FooterColumn title="Company" links={FOOTER_LINKS.company} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>
              © {new Date().getFullYear()} Training Advantage Group Ltd | Registered in Scotland No. SC765674 | VAT No. 446609573
            </p>
            <div className="flex items-center gap-4">
              <Link href="/policies#privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link href="/policies#terms" className="hover:text-gray-300 transition-colors">Terms</Link>
              <Link href="/policies#complaints" className="hover:text-gray-300 transition-colors">Complaints</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-bold text-white text-sm mb-4 pb-2 border-b border-white/10">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-gray-400 hover:text-orange-brand transition-colors flex items-center gap-1.5 group">
              <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-orange-brand transition-colors flex-shrink-0" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
