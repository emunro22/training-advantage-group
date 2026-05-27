export interface Course {
  id: string;
  name: string;
  category: CourseCategory;
  duration?: string;
  price?: number;
  priceLabel?: string;
  description?: string;
  url?: string;
}

export type CourseCategory =
  | "driver-cpc"
  | "tm-cpc"
  | "hgv-training"
  | "adr"
  | "plant-training"
  | "e-learning"
  | "consultancy"
  | "instructor-training"
  | "other";

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  courseId: string;
  courseName: string;
  preferredDate: string;
  delegates: number;
  message?: string;
  location: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

export interface Location {
  name: string;
  address: string[];
  postcode: string;
  icon: string;
  color: string;
}

export interface Testimonial {
  name: string;
  company: string;
  role: string;
  text: string;
  rating: number;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  image: string;
}
