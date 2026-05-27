import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Training Advantage Group Ltd",
  description:
    "Get in touch with Training Advantage Group. Call 0141 258 2024, email us, or visit one of our three training centres across Scotland.",
};

export default function ContactPage() {
  return <ContactClient />;
}
