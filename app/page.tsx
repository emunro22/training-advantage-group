  import HeroSection from "@/components/home/HeroSection";
  import ServiceCards from "@/components/home/ServiceCards";
  import StatsSection from "@/components/home/StatsSection";
  import LocationsSection from "@/components/home/LocationsSection";
  import AccreditationsSection from "@/components/home/AccreditationsSection";
  import TestimonialsSection from "@/components/home/TestimonialsSection";
  import CTASection from "@/components/home/CTASection";
  import WhyChooseSection from "@/components/home/WhyChooseSection";
  import UpcomingCoursesSection from "@/components/home/UpcomingCoursesSection";

  export default function HomePage() {
    return (
      <>
        <HeroSection />
        <ServiceCards />
        <UpcomingCoursesSection />
        <StatsSection />
        <WhyChooseSection />
        <TestimonialsSection />
        <LocationsSection />
        <AccreditationsSection />
        <CTASection />
      </>
    );
  }