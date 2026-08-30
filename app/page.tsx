import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ServiceCards from "@/components/home/ServiceCards";
import StatsSection from "@/components/home/StatsSection";
import LocationsSection from "@/components/home/LocationsSection";
import GoogleReviewsSection from "@/components/home/GoogleReviewsSection";
import CTASection from "@/components/home/CTASection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import UpcomingCoursesSection from "@/components/home/UpcomingCoursesSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceCards />
      <UpcomingCoursesSection />
      <StatsSection />
      <GoogleReviewsSection />
      <WhyChooseSection />
      <LocationsSection />
      <CTASection />
    </>
  );
}
