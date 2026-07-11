import type {
  NavLink,
  Stat,
  Service,
  CaseStudy,
  SystemCategory,
  ProcessStep,
  SecurityPillar,
  Testimonial,
  WorkflowNode,
  TargetArea,
  ComparisonRow,
  ContactDetail,
} from "@/types";

// ─── Navigation ──────────────────────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "Platform",    href: "#hero"         },
  { label: "Services",    href: "#areas"        },
  { label: "Methodology", href: "#capabilities" },
  { label: "Contact",     href: "#contact"      },
];

// "Projects" is a full standalone route (not a same-page anchor), so it's
// handled separately from NAV_LINKS in the Navbar component.
export const PROJECTS_LINK: NavLink = { label: "Projects", href: "/projects" };

// ─── Ticker items ─────────────────────────────────────────────────────────────
export const TICKER_ITEMS: string[] = [
  "ERP Integration",
  "Process Automation",
  "Workflow Intelligence",
  "CRM Orchestration",
  "Finance Operations",
  "Data Architecture",
  "Enterprise AI",
  "Governance Frameworks",
  "Operational Analytics",
  "System Orchestration",
];

// ─── Founding principles ─────────────────────────
export const STATS: Stat[] = [
  {
    value: "Robust",
    accent: "",
    label: "Unified workflows across all your systems with absolute operational stability.",
    description: "System Reliability",
  },
  {
    value: "Agentic",
    accent: "",
    label: "Autonomous process bridges to remove friction and manual handoffs.",
    description: "Efficiency Gain",
  },
  {
    value: "Control",
    accent: "",
    label: "Reactive workflows that guard your business data with strict human-in-the-loop oversight.",
    description: "Human Authority",
  },
  {
    value: "Built to Scale",
    accent: "",
    label: "Extensible system integrations with long term maintenance and support.",
    description: "Scalability",
  },
];

// ─── Workflow Nodes ──────────────────────────────────────────────────────────
export const WORKFLOW_SOURCES: WorkflowNode[] = [
  { label: "Source", name: "ERP System" },
  { label: "Source", name: "CRM Platform" },
  { label: "Source", name: "Finance Tools" },
  { label: "Source", name: "HRIS Portal" },
  { label: "Source", name: "Comms & Email" },
  { label: "Source", name: "Internal DBs" },
];

export const WORKFLOW_INTELLIGENCE: string[] = [
  "Core Orchestrator",
  "AI Verification",
  "Exception Assessor",
  "Approval Routing",
  "Compliance Audit",
];

export const WORKFLOW_OUTPUTS: WorkflowNode[] = [
  { label: "Output", name: "Clean Records" },
  { label: "Output", name: "Auto-Approvals" },
  { label: "Output", name: "SLA Alerts" },
  { label: "Output", name: "Forecast Decks" },
  { label: "Output", name: "Audit Ledger" },
  { label: "Output", name: "Activity Feed" },
];

// ─── Services ────────────────────────────────────────────────────────────────
export const SERVICES: Service[] = [
  {
    num: "01",
    title: "Operational Discovery",
    description:
      "We trace your active systems, interview key operators, map existing data gaps, and design a custom, high-impact tactical integration roadmap with absolute mathematical clarity.",
    scope: "Fixed Price",
    duration: "5 Days",
  },
  {
    num: "02",
    title: "Custom AI Agent Dev",
    description:
      "We design custom business agents reading directly from your active tools. These agents perform data reconciliations, draft reports, route exception queries, and automate repetitive checklists.",
    scope: "Milestoned",
    duration: "4–6 Weeks",
  },
  {
    num: "03",
    title: "System Orchestration",
    description:
      "We assemble direct event pipeline bridges between your silos (ERP to CRM to BI). This acts as a robust network layer that makes legacy systems communicate smoothly.",
    scope: "Milestoned",
    duration: "3–8 Weeks",
  },
  {
    num: "04",
    title: "Control Panel & UI Engine",
    description:
      "We build customized internal interfaces (via frameworks like Retool or fully custom React pages) allowing your managers to audit, override, and verify all automated decisions in one place.",
    scope: "Fixed Scope",
    duration: "2-4 Weeks",
  },
  {
    num: "05",
    title: "Data Pipelines & Sync",
    description:
      "We implement robust, secure, real-time data ingestion models utilizing secure warehouses like Snowflake and BigQuery to feed real-time reporting metrics directly to stakeholders.",
    scope: "Per Pipeline",
    duration: "2-3 Weeks",
  },
  {
    num: "06",
    title: "Governance & Hardening",
    description:
      "We implement audit ledgers, role-based single-sign-on protocols (SSO), data residency safeguards, and system-wide monitoring feeds to adhere perfectly to SOC 2 and ISO 27001 standards.",
    scope: "Ongoing Service",
    duration: "Continuous",
  },
];

// ─── Case Studies — empty until real work exists ─────────────────────────────
// This array intentionally has no entries.
// Add real case studies here once engagements are complete.
export const CASE_STUDIES: CaseStudy[] = [];

// ─── Systems ─────────────────────────────────────────────────────────────────
export const SYSTEM_CATEGORIES: SystemCategory[] = [
  {
    icon: "rect-grid",
    name: "ERP & Finance",
    items: [
      "SAP S/4HANA",
      "Oracle NetSuite",
      "Microsoft Dynamics 365",
      "Sage Intacct",
      "QuickBooks Enterprise",
      "Custom ERPs",
    ],
  },
  {
    icon: "clock-circle",
    name: "CRM & Sales",
    items: [
      "Salesforce",
      "HubSpot CRM",
      "Microsoft Dynamics CRM",
      "Pipedrive Integration",
      "Zoho CRM Link",
      "Custom Client Portals",
    ],
  },
  {
    icon: "envelope",
    name: "Communication & Collaboration",
    items: [
      "Microsoft Exchange / Outlook",
      "Google Workspace Suite",
      "Slack Channels",
      "Microsoft Teams",
      "Asana Project Boards",
      "Monday.com Workflows",
    ],
  },
  {
    icon: "bar-chart",
    name: "HR & People Operations",
    items: [
      "Workday",
      "BambooHR Portal",
      "ADP Workforce Now",
      "Rippling Directory",
      "Greenhouse Recruiter",
      "Lattice Performance",
    ],
  },
  {
    icon: "line-chart",
    name: "Data & Data Lakes",
    items: [
      "Snowflake Data Warehouse",
      "Databricks Engine",
      "Google BigQuery Engine",
      "Tableau & Power BI",
      "Looker BI Connect",
      "PostgreSQL / MySQL Clusters",
    ],
  },
  {
    icon: "layers",
    name: "Internal Custom Systems",
    items: [
      "Retool UI Panels",
      "Legacy database adapters",
      "REST & Webhook endpoints",
      "Apache Kafka event buses",
      "Custom internal apps",
      "Cron-based data jobs",
    ],
  },
];

// ─── Process ─────────────────────────────────────────────────────────────────
export const PROCESS_STEPS: ProcessStep[] = [
  {
    index: "01",
    title: "Discover & Model",
    description:
      "We shadow active workflows, build process sequence diagrams, and calculate potential automation return on investments (ROI) under a fixed NDA.",
    duration: "Days 1–5",
  },
  {
    index: "02",
    title: "System Mapping",
    description:
      "We construct schema blueprints, document API fields, write data contracts, and design exception flow fallback procedures.",
    duration: "Week 2",
  },
  {
    index: "03",
    title: "Architect & Verify",
    description:
      "We specify exact trigger events and data filters. The completed visual integration plan is reviewed and signed off.",
    duration: "Weeks 3–4",
  },
  {
    index: "04",
    title: "Deploy & Harden",
    description:
      "We release modules inside secure staging setups, verify failover triggers, run automated tests, and deploy to production with zero downtime.",
    duration: "Weeks 5–12",
  },
  {
    index: "05",
    title: "Audit & Adapt",
    description:
      "Post-release support begins. We trace model drift, check queue response latency, refine prompt contexts, and continuously optimize data structures.",
    duration: "Continuous",
  },
];

// ─── Security Pillars ────────────────────────────────────────────────────────
export const SECURITY_PILLARS: SecurityPillar[] = [
  {
    icon: "shield",
    title: "Immutable Decision Ledgers",
    description:
      "Every document matched, API triggered, or record synced is recorded with cryptographically signed tracking data for audit transparency.",
    badge: "Auditable",
  },
  {
    icon: "clock",
    title: "Granular Active Guards",
    description:
      "Direct authorization tags mapped inside each workflow. Restricts unauthorized agents from triggering operations, with SSO integration.",
    badge: "Standard",
  },
  {
    icon: "arrow",
    title: "Human Authority overrides",
    description:
      "Thresholds trigger automatic escalation to human administrators. Machinery processes clean events, whilst humans resolve ambiguities.",
    badge: "Configurable",
  },
  {
    icon: "lock",
    title: "Zero Leakage Policy",
    description:
      "Client data is never saved by external LLM models for general training. Your secrets and system keys are encrypted and isolated.",
    badge: "Enterprise",
  },
  {
    icon: "chat",
    title: "SOC 2 & ISO Compatible",
    description:
      "Automated access logs, change management records, and threat event warnings generated continuously to keep your compliance auditors satisfied.",
    badge: "Certified",
  },
  {
    icon: "monitor",
    title: "24/7 Pipeline Watchdogs",
    description:
      "Active uptime loops and exception alerting. Detects silent API changes, formatting updates, and network disconnects before disasters happen.",
    badge: "SLA Managed",
  },
];

// ─── Testimonials — empty until real clients exist ────────────────────────────
// This array intentionally has no entries.
// Add real testimonials here once engagements are complete.
export const TESTIMONIALS: Testimonial[] = [];

// ─── Compliance badges ────────────────────────────────────────────────────────
export const COMPLIANCE_BADGES = ["SOC 2", "ISO 27001", "GDPR"];
export const SECURITY_COMPLIANCE_BADGES = [
  "SOC 2 Type II Compatible",
  "ISO/IEC 27001 Prepared",
  "GDPR Privacy Protected",
  "HIPAA Ready Isolation",
];

// ─── Footer columns ───────────────────────────────────────────────────────────
export const FOOTER_LINKS = {
  Platform: [
    "Workflow Orchestrations",
    "Direct Integrations",
    "Governance Console",
    "System Map",
    "Integration Ticker",
  ],
  Methodology: [
    "The DZen Strategy",
    "Operational Discovery",
    "RFP Questionnaire",
    "Founders",
  ],
  Resources: [
    "Uptime Monitors",
    "Compliance Ledger",
    "Documentation Guides",
    "Client Portal",
  ],
  Contact: [
    "hello@DZen.io",
    "Briefing Booking",
    "DZen LinkedIn",
    "Briefing Configurator",
  ],
};

// ─── Target Areas ("Areas we can target") ─────────────────────────────────────
export const TARGET_AREAS: TargetArea[] = [
  {
    icon: "bar-chart",
    title: "Finance & Accounting",
    description:
      "Invoice processing, reconciliation, and reporting cycles that run on spreadsheets and manual review.",
    painPoints: [
      "Manual invoice matching",
      "Month-end close delays",
      "Disconnected ledgers across systems",
    ],
    potential: 92,
  },
  {
    icon: "envelope",
    title: "Sales & CRM Operations",
    description:
      "Lead routing, follow-ups, and pipeline hygiene that fall through the cracks between tools.",
    painPoints: [
      "Manual lead handoffs",
      "Inconsistent follow-up timing",
      "CRM data entry backlog",
    ],
    potential: 85,
  },
  {
    icon: "chat",
    title: "Customer Support",
    description:
      "Ticket triage, response drafting, and escalation routing across support channels.",
    painPoints: [
      "Slow first-response times",
      "Repetitive ticket triage",
      "Knowledge scattered across tools",
    ],
    potential: 88,
  },
  {
    icon: "clock-circle",
    title: "HR & People Operations",
    description:
      "Onboarding, payroll prep, and compliance tracking spread across disconnected systems.",
    painPoints: [
      "Manual onboarding checklists",
      "Payroll data re-entry",
      "Compliance deadline tracking",
    ],
    potential: 80,
  },
  {
    icon: "layers",
    title: "Operations & Supply Chain",
    description:
      "Order tracking, vendor coordination, and exception handling across operational systems.",
    painPoints: [
      "Manual order status updates",
      "Vendor coordination by email",
      "Exception handling backlog",
    ],
    potential: 83,
  },
  {
    icon: "line-chart",
    title: "Data & Reporting",
    description:
      "Recurring reports assembled by hand from multiple sources, every week, on a deadline.",
    painPoints: [
      "Manual data pulls",
      "Recurring report assembly",
      "Delayed anomaly detection",
    ],
    potential: 94,
  },
];

// ─── Optimisation Comparison ("Before / After DZen") ───────────────────────────
export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Invoice Reconciliation",
    before: { value: "14 hrs / week", percent: 100 },
    after:  { value: "1 hr / week",   percent: 7 },
    improvement: "93% time saved",
  },
  {
    label: "Cross-Department Approvals",
    before: { value: "4 days",  percent: 100 },
    after:  { value: "6 hours", percent: 6 },
    improvement: "94% faster",
  },
  {
    label: "Weekly Finance Reports",
    before: { value: "6 hours",    percent: 100 },
    after:  { value: "12 minutes", percent: 3 },
    improvement: "97% faster",
  },
  {
    label: "Support Ticket First Response",
    before: { value: "24 hours", percent: 100 },
    after:  { value: "2 hours",  percent: 8 },
    improvement: "92% faster",
  },
  {
    label: "Manual Data Entry Errors",
    before: { value: "8% error rate",   percent: 100 },
    after:  { value: "0.3% error rate", percent: 4 },
    improvement: "96% reduction",
  },
];

// ─── Contact Details ────────────────────────────────────────────────────────
export const CONTACT_DETAILS: ContactDetail[] = [
  {
    label: "General Enquiries",
    value: "hello@DZen.io",
    href: "mailto:hello@DZen.io",
  },
  {
    label: "Response Time",
    value: "Within 24 hours",
    note: "Mon–Fri, 9am–6pm IST",
  },
  {
    label: "Location",
    value: "Maharashtra, India",
    note: "Remote-first · engagements worldwide",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/company/DZen",
    href: "https://linkedin.com/company/DZen",
  },
];