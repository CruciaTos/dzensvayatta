import type { SiteConfig } from "@/types/content";

export const SITE: SiteConfig = {
  name: "Svayatta",
  legalName: "Svayatta Intelligence Private Limited",
  cin: null, // [confirm CIN once incorporation certificate is issued]
  url: "https://svayatta.in",
  city: "Mumbai",
  email: "info@svayatta.in",
  founders: [
    {
      name: "Soham Boridkar",
      role: "Co-founder", // [confirm both roles]
      email: "sohamboridkar@svayatta.in",
      linkedin: "https://www.linkedin.com/in/soham-boridkar/",
    },
    {
      name: "Smit Mhatre",
      role: "Co-founder", // [confirm both roles]
      email: "smitmhatre@svayatta.in",
      linkedin: "https://linkedin.com/in/smit-mhatre",
    },
  ],
  whatsapp: {
    display: "+91 93215 59182",
    e164: "919321559182",
    href: "https://wa.me/919321559182",
    chatHref:
      "https://wa.me/919321559182?text=Hi%20Svayatta%2C%20I%27d%20like%20to%20talk%20about%20a%20project.",
  },
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/dzen-svayatta/",
    },
    {
      label: "Instagram",
      href: "https://instagram.com/dzensvayatta", // [confirm which handle]
    },
  ],
  hours: {
    open: "10:00",
    close: "22:00",
    timeZone: "Asia/Kolkata",
    label: "Open 10:00–22:00 IST",
  },
  callMinutes: 30,
};

