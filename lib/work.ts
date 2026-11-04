import type { WorkItem } from "@/types/content";

export const WORK: WorkItem[] = [
  {
    slug: "crusam",
    index: "01",
    name: "CruSam",
    title: "CruSam *Payroll & finance ERP*",
    headline: "CruSam\n*Payroll that runs itself.*",
    category: "ERP · PAYROLL & FINANCE",
    platform: "WINDOWS DESKTOP", // [confirm platform]
    filters: ["erp-finance"],
    status: "live",
    statusLabel: "LIVE · AARTI ENTERPRISES",
    client: "Aarti Enterprises", // [confirm official name]
    clientLogo: {
      src: "/images/Testimonials/aarti_logo.png",
      alt: "Aarti Enterprises logo",
    },
    year: 2026,
    description:
      "Replaced scattered spreadsheets with one desktop platform for employee records, salary processing, invoices and vouchers, with an AI assistant built in.",
    intro:
      "A unified ERP built to replace scattered spreadsheets and disconnected tools at Aarti Enterprises. CruSam centralises employee records, salary processing, invoices, vouchers, and reporting with an embedded AI assistant that streamlines daily operations.",
    tags: [
      "Agentic AI Assistant",
      "Encrypted Local Storage",
      "Self-Updating App",
    ],
    tech: [
      "Agentic AI Assistant",
      "Semantic Search Engine",
      "Multimodal AI Input",
      "Self-Updating Desktop App",
      "Automated Cloud Backup",
      "Deduplicated Sync",
      "Versioned Local Database",
      "Encrypted Local Storage",
      "Usage & Cost Governance",
    ],
    cover: {
      src: "/images/Crusam_Mockups/Dashboard_MD.png",
      alt: "CruSam payroll & finance ERP dashboard",
    },
    chapters: [
      {
        label: "01 / THE PROBLEM",
        title: "Spreadsheets *everywhere*",
        body: "Salary sheets, invoice files, and vouchers lived in separate tools with no single source of truth.",
        delivered: "Centralised data store replacing disconnected spreadsheets.",
      },
      {
        label: "02 / THE SYSTEM",
        title: "One place for *people & pay*",
        body: "Employee records, salary processing, invoices, vouchers, documents, and reports unified into one desktop workspace.",
        delivered: "Complete payroll and invoicing system running locally.",
      },
      {
        label: "03 / THE AI LAYER",
        title: "An assistant that *knows your data*",
        body: "An agentic AI assistant capable of semantic search and multimodal input to answer queries and draft entries directly.",
        delivered: "In-app AI assistant with local context.",
      },
      {
        label: "04 / RELIABILITY",
        title: "Built to *keep running*",
        body: "Self-updating desktop app with encrypted local storage, versioned local database, automated cloud backup, deduplicated sync, and usage governance.",
        delivered:
          "Zero-cloud-dependency local-first architecture with cloud backup.",
      },
    ],
    gallery: [
      {
        src: "/images/Crusam_Mockups/Invoice Creation.png",
        alt: "CruSam invoice creation workflow",
        caption: "Invoice creation",
      },
      {
        src: "/images/Crusam_Mockups/salaryentry-analytics.png",
        alt: "CruSam salary analytics and entry",
        caption: "Salary analytics",
      },
    ],
    testimonialId: "praful-thakre",
    stats: [], // [confirm] real numbers
    cta: {
      label: "Request a demo",
      kind: "demo",
    },
    published: true,
  },
  {
    slug: "growmont",
    index: "02",
    name: "Growmont CRM",
    title: "Growmont CRM *Local-first CRM*",
    headline: "Growmont CRM\n*Clients, sales & follow-ups in sync.*",
    category: "CRM · WEALTH MANAGEMENT",
    platform: "WINDOWS DESKTOP · ANDROID", // [confirm]
    filters: ["crm"],
    status: "live",
    statusLabel: "LIVE · GROWMONT",
    client: "Growmont",
    year: 2026,
    description:
      "Clients, sales and follow-ups for an advisory team, in sync across desktop and phone, and still working offline.",
    intro:
      "Growmont CRM replaces scattered spreadsheets and manual follow-ups with one app for the whole advisory team. Clients, sales, and reminders stay in sync across desktop and phone, work continues even offline, and no follow-up slips through. Advisors spend less time on admin and more time with clients.",
    tags: ["Works Offline", "Role-Based Access", "Revenue Analytics"],
    tech: [
      "Works Offline",
      "Cloud Sync",
      "Role-Based Access",
      "Admin Approvals",
      "Excel Import & Export",
      "Revenue Analytics",
      "Auto Updates",
      "Auto Backups",
    ],
    cover: {
      src: "/og-image.png", // [asset] Growmont CRM cover screenshot
      alt: "Growmont CRM interface preview",
    },
    chapters: [
      {
        label: "01 / THE CHALLENGE",
        title: "Scattered *client follow-ups*",
        body: "Advisory teams struggled with fragmented spreadsheets and missed follow-ups across advisors.",
        delivered: "Unified pipeline and client tracking.",
      },
      {
        label: "02 / THE ARCHITECTURE",
        title: "Local-first *and always in sync*",
        body: "Desktop and phone apps work seamlessly without an active connection, syncing data safely once reconnected.",
        delivered: "Offline-first sync engine.",
      },
      {
        label: "03 / THE OUTCOME",
        title: "Advisors spend *more time with clients*",
        body: "Role-based permissions, automated reminders, and revenue analytics keep leadership informed while freeing up advisors.",
        delivered: "Automated follow-up triggers and revenue dashboard.",
      },
    ],
    gallery: [], // [asset] Growmont screenshots
    stats: [], // [confirm] real numbers
    cta: {
      label: "Get access",
      kind: "download",
    },
    published: true,
  },
  {
    slug: "growmont-pms",
    index: "03",
    name: "Growmont PMS",
    title: "Growmont PMS *Fund analysis & scoring*",
    headline: "Growmont PMS\n*Performance, risk & peer ranking.*",
    category: "ANALYTICS · FUND RESEARCH",
    platform: "WEB PLATFORM", // [confirm]
    filters: ["ai"],
    status: "in-development",
    statusLabel: "IN DEVELOPMENT",
    client: "Growmont",
    year: 2026,
    description:
      "Fund analysis and scoring for wealth managers, turning twenty years of mutual fund data into risk metrics and peer rankings.", // [confirm the copy]
    intro:
      "Growmont PMS is an analysis platform for wealth managers and investment professionals, built to replace hours of manual research per client with a faster, data-driven view. It turns twenty years of AMFI NAV history across 8,500+ active Indian mutual funds into trailing returns, risk metrics such as Sharpe, Sortino, drawdown, and VaR, and a configurable score that ranks each fund against its SEBI category peers.",
    tags: ["20-Year NAV History", "Risk Metrics Engine", "Peer-Group Scoring"], // [confirm]
    tech: [
      "20-Year NAV History",
      "8,500+ Active Funds",
      "Returns & CAGR Engine",
      "Risk Metrics Engine",
      "Peer-Group Scoring",
      "Configurable Weights",
      "SEBI Category Mapping",
      "Searchable Fund Explorer",
      "Auditable Calculations",
    ],
    cover: {
      src: "/og-image.png", // [asset] Growmont PMS cover mockup
      alt: "Growmont PMS platform preview",
    },
    chapters: [
      {
        label: "01 / THE DATA",
        title: "Twenty years of *mutual fund history*",
        body: "Aggregating 8,500+ active Indian mutual funds and calculating trailing returns, CAGR, and volatility.",
        delivered: "Historical NAV database and automated ingestion pipeline.",
      },
      {
        label: "02 / RISK & RANKING",
        title: "Objective *peer-group scoring*",
        body: "Calculating Sharpe, Sortino, max drawdown, and VaR to objectively rank funds against category peers.",
        delivered:
          "Configurable scoring algorithm and SEBI benchmark comparison.",
      },
    ],
    gallery: [], // [asset] Growmont PMS screenshots
    stats: [], // [confirm] real numbers
    cta: {
      label: "Join the pilot",
      kind: "pilot",
    },
    published: true,
  },
  {
    slug: "crudoc",
    index: "04",
    name: "CruDoc",
    title: "CruDoc *Clinic management*",
    headline: "CruDoc\n*Healthcare operations that flow.*",
    category: "HEALTHCARE · CLINIC OPERATIONS",
    platform: "WEB & MOBILE", // [confirm]
    filters: ["healthcare", "ai"],
    status: "pilot",
    statusLabel: "PILOT", // [confirm]
    year: 2026,
    description:
      "Patients, appointments and records in one app, with an AI assistant that answers calls.",
    intro:
      "A clinic management platform designed for healthcare practitioners, consolidating appointments, patient records, and front-desk communication with an AI assistant that handles incoming patient queries.",
    tags: ["Patient Records", "Appointments", "AI Calls"],
    tech: [
      "Patient Records",
      "Appointment Scheduling",
      "AI Voice Assistant",
      "Local Database",
      "Encrypted Storage",
    ],
    cover: {
      src: "/og-image.png", // [asset] CruDoc screenshot
      alt: "CruDoc clinic management interface",
    },
    chapters: [],
    gallery: [],
    stats: [], // [confirm] real numbers
    cta: {
      label: "Request a demo",
      kind: "demo",
    },
    published: false, // Unpublished until ready
  },
];

export function getWork(slug: string): WorkItem | undefined {
  return WORK.find((w) => w.slug === slug);
}

export function publishedWork(): WorkItem[] {
  return WORK.filter((w) => w.published);
}

