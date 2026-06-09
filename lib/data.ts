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
} from "@/types";

// ─── Navigation ──────────────────────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "Platform",  href: "#workflow"  },
  { label: "Services",  href: "#services"  },
  { label: "Approach",  href: "#process"   },
  { label: "Security",  href: "#security"  },
];

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

// ─── Founding principles (replaces fabricated stats) ─────────────────────────
export const STATS: Stat[] = [
  {
    value: "14",
    accent: "d",
    label: "Target time from discovery to first production deployment",
    description: "Time to value",
  },
  {
    value: "Zero",
    accent: "",
    label: "Downtime deployments — staged rollout with full rollback capability",
    description: "Deployment standard",
  },
  {
    value: "100",
    accent: "%",
    label: "Of automated decisions are logged, auditable, and human-reviewable",
    description: "Auditability",
  },
  {
    value: "SOC 2",
    accent: "",
    label: "Security and governance baseline for every engagement, from day one",
    description: "Compliance standard",
  },
];

// ─── Workflow Nodes ──────────────────────────────────────────────────────────
export const WORKFLOW_SOURCES: WorkflowNode[] = [
  { label: "Source", name: "ERP System"    },
  { label: "Source", name: "CRM Platform"  },
  { label: "Source", name: "Finance Tools" },
  { label: "Source", name: "HRIS"          },
  { label: "Source", name: "Email / Comms" },
  { label: "Source", name: "Knowledge Base"},
];

export const WORKFLOW_INTELLIGENCE = [
  "Workflow Orchestration",
  "AI Decision Engine",
  "Anomaly Detection",
  "Approval Routing",
  "Audit & Governance",
];

export const WORKFLOW_OUTPUTS: WorkflowNode[] = [
  { label: "Output", name: "Auto-Approvals"   },
  { label: "Output", name: "Forecast Reports" },
  { label: "Output", name: "Exception Alerts" },
  { label: "Output", name: "Synced Records"   },
  { label: "Output", name: "Audit Log"        },
  { label: "Output", name: "Analytics"        },
];

// ─── Services ────────────────────────────────────────────────────────────────
export const SERVICES: Service[] = [
  {
    num: "01",
    title: "Discovery & Audit",
    description:
      "We map your existing systems, identify integration points, quantify automation opportunities, and produce a prioritized transformation roadmap with business-case modeling. Delivered in 5 business days.",
    scope: "Fixed",
    duration: "5 days",
  },
  {
    num: "02",
    title: "Architecture Design",
    description:
      "We design the integration architecture — data models, API contracts, event flows, and system topology — before a single line of code is written. Designed for auditability and future extensibility.",
    scope: "Fixed",
    duration: "2–3 weeks",
  },
  {
    num: "03",
    title: "Integration & Deployment",
    description:
      "We build, test, and deploy the integration layer across your systems. All work follows enterprise change management protocols with rollback capabilities and zero-downtime deployments.",
    scope: "Milestoned",
    duration: "4–12 weeks",
  },
  {
    num: "04",
    title: "Automation Engineering",
    description:
      "We automate decision workflows using AI — routing approvals, flagging exceptions, generating reports, and eliminating manual process steps. Every automation is documented, auditable, and human-reviewable.",
    scope: "Per-workflow",
    duration: "Variable",
  },
  {
    num: "05",
    title: "Governance & Controls",
    description:
      "We implement the access controls, audit trails, approval policies, and compliance reporting frameworks required for AI operating in mission-critical environments. SOC 2, ISO 27001, and custom frameworks supported.",
    scope: "Retainer",
    duration: "Ongoing",
  },
  {
    num: "06",
    title: "Optimization & Scale",
    description:
      "Post-deployment, we monitor performance, identify new automation opportunities, tune models, and expand coverage across additional systems and business units. Continuous measurable improvement.",
    scope: "Retainer",
    duration: "Ongoing",
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
      "HubSpot",
      "Microsoft Dynamics CRM",
      "Pipedrive",
      "Zoho CRM",
      "Custom CRM systems",
    ],
  },
  {
    icon: "envelope",
    name: "Communication & Collaboration",
    items: [
      "Microsoft 365 / Exchange",
      "Google Workspace",
      "Slack",
      "Teams",
      "Outlook Calendar",
      "Asana / Monday.com",
    ],
  },
  {
    icon: "bar-chart",
    name: "HR & People Operations",
    items: [
      "Workday",
      "BambooHR",
      "ADP Workforce Now",
      "Rippling",
      "Greenhouse ATS",
      "Lattice",
    ],
  },
  {
    icon: "line-chart",
    name: "Data & Analytics",
    items: [
      "Snowflake",
      "Databricks",
      "BigQuery",
      "Tableau / Power BI",
      "Looker",
      "PostgreSQL / MySQL",
    ],
  },
  {
    icon: "layers",
    name: "Internal Tools & Infrastructure",
    items: [
      "Custom internal apps",
      "Retool / Appsmith",
      "Notion / Confluence",
      "REST APIs / Webhooks",
      "Legacy system connectors",
      "Custom data pipelines",
    ],
  },
];

// ─── Process ─────────────────────────────────────────────────────────────────
export const PROCESS_STEPS: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    description:
      "We audit your existing systems, document current-state workflows, and identify friction points, manual handoffs, and automation opportunities. Structured, time-bound, and non-disruptive.",
    duration: "Days 1–5",
  },
  {
    index: "02",
    title: "Map",
    description:
      "We translate operational requirements into a technical integration map. Every data flow, decision point, approval chain, and system dependency is documented before architecture begins.",
    duration: "Week 2",
  },
  {
    index: "03",
    title: "Design",
    description:
      "We design the integration architecture, automation logic, and governance framework. Client-reviewed and signed off before development begins. No scope surprises.",
    duration: "Weeks 3–4",
  },
  {
    index: "04",
    title: "Deploy",
    description:
      "We deploy in staged environments with comprehensive testing, rollback protocols, and zero-downtime production releases. Full handover documentation provided at each milestone.",
    duration: "Weeks 5–12+",
  },
  {
    index: "05",
    title: "Monitor",
    description:
      "Post-deployment, we provide SLA-backed monitoring, performance reporting, and continuous optimization. Every automated decision is logged and reviewable by your team at any time.",
    duration: "Ongoing",
  },
];

// ─── Security Pillars ────────────────────────────────────────────────────────
export const SECURITY_PILLARS: SecurityPillar[] = [
  {
    icon: "shield",
    title: "Full Audit Trail",
    description:
      "Every automated action, decision, data access, and system modification is logged with full attribution. Immutable audit logs available for compliance review at any time.",
    badge: "Standard",
  },
  {
    icon: "clock",
    title: "Granular Access Controls",
    description:
      "Role-based access controls at the workflow, data, and system level. Integrates with your existing identity provider (Azure AD, Okta, Google SSO).",
    badge: "Standard",
  },
  {
    icon: "arrow",
    title: "Human-in-the-Loop Controls",
    description:
      "Configurable approval gates at any point in any workflow. Automation handles the routine; humans review the exceptions. Thresholds are yours to set.",
    badge: "Configurable",
  },
  {
    icon: "lock",
    title: "Data Residency & Isolation",
    description:
      "Your data never leaves your environment for training or model improvement. Strict data isolation between client environments. Deployable in your own cloud tenancy.",
    badge: "Enterprise",
  },
  {
    icon: "chat",
    title: "Compliance Reporting",
    description:
      "Automated compliance reports for SOX, GDPR, and custom regulatory frameworks. Scheduled or on-demand, formatted for your auditors.",
    badge: "Automated",
  },
  {
    icon: "monitor",
    title: "24/7 Monitoring & Alerting",
    description:
      "Continuous monitoring of all integration health, data quality, and anomalous activity. Proactive alerting to your operations team before issues become incidents.",
    badge: "Standard",
  },
];

// ─── Testimonials — empty until real clients exist ────────────────────────────
// This array intentionally has no entries.
// Add real testimonials here once engagements are complete.
export const TESTIMONIALS: Testimonial[] = [];

// ─── Compliance badges ────────────────────────────────────────────────────────
export const COMPLIANCE_BADGES = ["SOC 2", "ISO 27001", "GDPR"];
export const SECURITY_COMPLIANCE_BADGES = ["SOC 2 Type II", "ISO 27001", "GDPR Ready", "HIPAA Compatible"];

// ─── Footer columns ───────────────────────────────────────────────────────────
export const FOOTER_LINKS = {
  Platform: [
    "Workflow Intelligence",
    "Integration Layer",
    "Automation Engine",
    "Governance Console",
    "Integration Catalogue",
  ],
  Company: [
    "About DZen",
    "Our Methodology",
    "Careers",
    "Press",
  ],
  Resources: [
    "Security Overview",
    "Integration Guides",
    "ROI Calculator",
    "Contact",
  ],
  Contact: [
    "hello@DZen.io",
    "+1 (000) 000-0000",
    "LinkedIn",
    "Schedule a Call",
  ],
};