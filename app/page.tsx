import HeroSection from "@/components/home/HeroSection";
import ServiceCards from "@/components/home/ServiceCards";
import StatsSection from "@/components/home/StatsSection";
import LocationsSection from "@/components/home/LocationsSection";
import AccreditationsSection from "@/components/home/AccreditationsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import UpcomingCoursesSection from "@/components/home/UpcomingCoursesSection";
import { getTestimonials } from "@/lib/storage";

export default async function HomePage() {
  const dbTestimonials = await getTestimonials(true);
  const featured = dbTestimonials.filter((t) => t.featured).slice(0, 4);
  const testimonialsForHome =
    featured.length > 0
      ? featured.map((t) => ({
          name: t.name,
          company: t.company,
          role: t.role,
          text: t.text,
          rating: t.rating,
          initial: t.name.charAt(0).toUpperCase(),
        }))
      : undefined;

  return (
    <>
      <HeroSection />
      <ServiceCards />
      <UpcomingCoursesSection />
      <StatsSection />
      <WhyChooseSection />
      <TestimonialsSection testimonials={testimonialsForHome} />
      <LocationsSection />
      <AccreditationsSection />
      <CTASection />
    </>
  );
}
