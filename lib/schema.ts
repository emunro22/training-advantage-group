import { TRAINING_CENTRES, type TrainingCentre } from "./locations";
import type { GoogleReviewsData } from "./google-reviews";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.trainingadvantagegroup.co.uk";
const ORG_ID = `${SITE_URL}/#organization`;

function centreToLocalBusiness(centre: TrainingCentre) {
  return {
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/training-centres/${centre.id}#business`,
    name: `Training Advantage Group Ltd — ${centre.name}`,
    parentOrganization: { "@id": ORG_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: centre.streetAddress,
      addressLocality: centre.addressLocality,
      postalCode: centre.postcode,
      addressCountry: "GB",
    },
    telephone: "+44-141-258-2024",
    url: `${SITE_URL}/training-centres/${centre.id}`,
  };
}

/** Site-wide Organization schema — rendered once in the root layout. */
export function buildOrganizationSchema(reviews: GoogleReviewsData | null) {
  const hq = TRAINING_CENTRES[0];
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": ORG_ID,
    name: "Training Advantage Group Ltd",
    alternateName: "TAG",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    telephone: "+44-141-258-2024",
    email: "office@trainingadvantagegroup.co.uk",
    address: {
      "@type": "PostalAddress",
      streetAddress: hq.streetAddress,
      addressLocality: hq.addressLocality,
      postalCode: hq.postcode,
      addressCountry: "GB",
    },
    department: TRAINING_CENTRES.slice(1).map(centreToLocalBusiness),
    ...(reviews && reviews.totalReviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviews.rating,
            reviewCount: reviews.totalReviews,
          },
        }
      : {}),
  };
}

/** Per-location LocalBusiness schema — rendered on each /training-centres/[id] page. */
export function buildLocationSchema(centre: TrainingCentre) {
  return {
    "@context": "https://schema.org",
    ...centreToLocalBusiness(centre),
  };
}

/** FAQPage schema — rendered on any page with an on-screen FAQ section, so AI
 * answer engines and Google's AI Overviews can quote the answers directly. */
export function buildFAQSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

interface CourseForSchema {
  courseName: string;
  date: string;
  endDate?: string;
  location: string;
  price: string;
}

/** Course schema for upcoming course dates — rendered as a list on /upcoming-courses. */
export function buildCourseSchema(courses: CourseForSchema[]) {
  return courses.map((c) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.courseName,
    provider: { "@id": ORG_ID, name: "Training Advantage Group Ltd" },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      startDate: c.date,
      ...(c.endDate ? { endDate: c.endDate } : {}),
      location: {
        "@type": "Place",
        name: c.location,
      },
    },
    ...(c.price
      ? {
          offers: {
            "@type": "Offer",
            price: c.price.replace(/[^0-9.]/g, "") || undefined,
            priceCurrency: "GBP",
          },
        }
      : {}),
  }));
}
