import type {
  ServiceGroup,
  Service,
  BusinessFunction,
} from "@/types/content";

export const SERVICE_GROUPS: ServiceGroup[] = [
  { id: "ai", index: "01", label: "AI & AUTOMATION" },
  { id: "software", index: "02", label: "SOFTWARE" },
  { id: "growth", index: "03", label: "GROWTH" },
];

export const SERVICES: Service[] = [
  {
    slug: "ai-agents",
    index: "01",
    title: "Agentic AI Systems",
    group: "ai",
    tagline: ["multi-agent workflows", "tool integrations", "human handoff"],
    summary:
      "Autonomous agents that take on workflows across tools, with human review at key steps.",
    painPoints: [
      "Multi-Agent Orchestration",
      "Enterprise Tool Integration",
      "Continuous Learning Loops",
      "ROI-Driven Automation",
    ],
    href: "/services#ai-agents",
  },
  {
    slug: "conversational-ai",
    index: "02",
    title: "Conversational AI",
    group: "ai",
    tagline: ["WhatsApp", "voice", "booking & support"],
    summary:
      "Chat and voice assistants connected to the systems your team already runs.",
    painPoints: [
      "24/7 Intelligent Support Automation",
      "Natural Language Understanding",
      "CRM & Scheduling Integration",
      "Omnichannel Deployment",
    ],
    href: "/services#conversational-ai",
  },
  {
    slug: "ml-analytics",
    index: "03",
    title: "Machine Learning & Analytics",
    group: "ai",
    tagline: ["forecasting", "document AI", "dashboards"],
    summary:
      "Predictive models and reporting on your data to catch issues before they grow.",
    painPoints: [
      "Predictive Modeling & Forecasting",
      "NLP & Document Intelligence",
      "Anomaly Detection & Risk Signals",
      "Executive Dashboards",
    ],
    href: "/services#ml-analytics",
  },
  {
    slug: "custom-software",
    index: "04",
    title: "Custom Software & ERP",
    group: "software",
    tagline: ["payroll & finance", "CRMs", "internal tools"],
    summary:
      "Internal tools and enterprise software built to hold up long after launch day.",
    painPoints: [
      "Full-Stack Product Engineering",
      "API-First Architecture",
      "Cloud-Native Deployment",
      "QA Automation & CI/CD Pipelines",
    ],
    href: "/services#custom-software",
  },
  {
    slug: "web",
    index: "05",
    title: "Web & Digital Presence",
    group: "software",
    tagline: ["websites", "SEO", "e-commerce"],
    summary:
      "Fast websites and digital experiences designed for performance and search.",
    painPoints: [
      "Responsive UX Design",
      "SEO & Core Web Vitals",
      "Headless CMS Implementation",
      "E-Commerce & Payment Integration",
    ],
    href: "/services#web",
  },
  {
    slug: "growth",
    index: "06",
    title: "Content & Growth Marketing",
    group: "growth",
    tagline: ["brand", "video", "campaigns"],
    summary:
      "Design, video, and campaigns shaped by audience response, not templates.",
    painPoints: [
      "Brand Strategy & Positioning",
      "Social & Performance Content",
      "Professional Video Production",
      "Attribution & ROI Analytics",
    ],
    href: "/services#growth",
  },
];

export const BUSINESS_FUNCTIONS: BusinessFunction[] = [
  {
    title: "Finance & accounts",
    example: "payroll, invoicing, vouchers",
  },
  {
    title: "Sales & GTM",
    example: "CRM, follow-ups, pipeline reporting",
  },
  {
    title: "Customer engagement",
    example: "WhatsApp & voice assistants, booking",
  },
  {
    title: "People & HR",
    example: "records, attendance, salary",
  },
  {
    title: "Operations & logistics",
    example: "inventory, approvals, workflows",
  },
  {
    title: "Business intelligence",
    example: "dashboards, forecasting",
  },
];

