import type { Testimonial } from "@/types/content";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "bharat-boridkar",
    name: "Mr. Bharat Boridkar",
    role: "Senior Accountant",
    company: "Aarti Enterprises", // [confirm official name]
    quote:
      "We don't have to think about the little things anymore. *Everything just works the way it should.*",
    avatar: "/images/Testimonials/BharatBoridkar.png",
    logo: "/images/Testimonials/aarti_logo.png",
    outcome: "Full operational visibility",
    consentConfirmed: false,
  },
  {
    id: "praful-thakre",
    name: "Mr. Praful Thakre",
    role: "CEO",
    company: "Aarti Enterprises", // [confirm official name]
    quote:
      "Overall CruSam and this new workflow makes it work so efficient. *It saves us time every day*, and everything is easier to keep track of.",
    avatar: "/images/Testimonials/PrafulThakre.png",
    logo: "/images/Testimonials/aarti_logo.png",
    outcome: "Company-wide operational alignment",
    consentConfirmed: false,
  },
  {
    id: "dr-rutuja-nilgunkar",
    name: "Dr. Rutuja Nilgunkar",
    role: "Physiotherapist",
    company: "Clinic", // [confirm real clinic name]
    quote:
      "I don't have to think about where things are anymore. *The AI takes care of the calls*, and the app keeps our patients, appointments, records, and everything else in one place. It has made our work much smoother.",
    avatar: "/images/Testimonials/DrRutujaNilgunkar.png",
    logo: "/images/Testimonials/doctorlogo.png",
    outcome: "24/7 call handling",
    consentConfirmed: false,
  },
  {
    id: "dr-neeta-save",
    name: "Dr. Neeta Save",
    role: "Clinic Owner & BHMS",
    company: "Aarogya Clinic",
    quote:
      "Patients can now book appointments and get answers to common questions without waiting on hold. *It took real pressure off our front desk.*",
    avatar: "/images/Testimonials/doctorlogo.png", // [asset] Dr. Neeta Save portrait photo
    logo: "/images/Testimonials/doctorlogo.png",
    outcome: "Higher staff capacity",
    consentConfirmed: false,
  },
];

export function getTestimonial(id: string): Testimonial | undefined {
  return TESTIMONIALS.find((t) => t.id === id);
}

