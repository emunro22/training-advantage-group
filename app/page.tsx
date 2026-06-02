import HeroSection from "@/components/home/HeroSection";
import ServiceCards from "@/components/home/ServiceCards";
import StatsSection from "@/components/home/StatsSection";
import LocationsSection from "@/components/home/LocationsSection";
import GoogleReviewsSection from "@/components/home/GoogleReviewsSection";
import CTASection from "@/components/home/CTASection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import UpcomingCoursesSection from "@/components/home/UpcomingCoursesSection";
export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceCards />
      <UpcomingCoursesSection />
      <StatsSection />
      <WhyChooseSection />
      <GoogleReviewsSection />
      <LocationsSection />
      <CTASection />
    </>
  );
}
