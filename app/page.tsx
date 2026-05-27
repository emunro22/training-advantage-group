import HeroSection from "@/components/home/HeroSection";
import ServiceCards from "@/components/home/ServiceCards";
import StatsSection from "@/components/home/StatsSection";
import LocationsSection from "@/components/home/LocationsSection";
import AccreditationsSection from "@/components/home/AccreditationsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import WhyChooseSection from "@/components/home/WhyChooseSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceCards />
      <StatsSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <LocationsSection />
      <AccreditationsSection />
      <CTASection />
    </>
  );
}
