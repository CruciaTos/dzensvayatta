"use client";

import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FadeIn } from "@/components/ui/FadeIn";

/* ─────────────────────────────────────────────────────────────────────────────
   SVG logo definitions — inline, brand-accurate, original aspect ratios
   Each logo is normalised to a 40px height; width scales from its native ratio.
───────────────────────────────────────────────────────────────────────────── */

function SAPLogo() {
  return (
    <svg height="28" viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SAP">
      <path d="M0 0h80v28H0z" fill="#0070F2"/>
      <path d="M8 19.5c0 .83.67 1.5 1.5 1.5h5.17c2.09 0 3.33-1.17 3.33-2.83 0-1.33-.75-2.17-2-2.5l-2.83-.67c-.58-.17-.83-.5-.83-.92 0-.58.5-.92 1.25-.92h4.5v-2.16H9.5c-2 0-3.17 1.08-3.17 2.75 0 1.33.75 2.08 1.83 2.42l2.84.66c.66.17.91.5.91.92 0 .58-.41.92-1.16.92H8.5a.5.5 0 00-.5.5v1.33zm11.5 1.5h2.5v-5.83l3.5 5.83H28V9h-2.5v5.92L22 9h-2.5v12zm10.5 0h2.58l.84-2.33h4.08l.83 2.33H40.5L36.75 9h-3L22 21zm4.42-4.5l1.33-3.75 1.33 3.75h-2.66zm10.08 4.5h2.5v-4.5h2c2.5 0 4-1.5 4-3.75S51 9 48.5 9H44.5v12zm2.5-6.83V11.5h1.83c.92 0 1.5.5 1.5 1.58s-.58 1.59-1.5 1.59H47zm8 6.83h2.5v-5l4.5-7h-2.83L56.5 13.5 54 9h-2.83l4.5 7-4.5 5.83 2.83.17z" fill="white"/>
    </svg>
  );
}

function OracleLogo() {
  return (
    <svg height="22" viewBox="0 0 120 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Oracle NetSuite">
      <path d="M11 0C4.925 0 0 4.925 0 11s4.925 11 11 11h98c6.075 0 11-4.925 11-11S115.075 0 109 0H11zm0 5.5h98c3.038 0 5.5 2.462 5.5 5.5s-2.462 5.5-5.5 5.5H11c-3.038 0-5.5-2.462-5.5-5.5S7.962 5.5 11 5.5z" fill="#C74634"/>
    </svg>
  );
}

function MicrosoftDynamicsLogo() {
  return (
    <svg height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft Dynamics 365">
      <path d="M0 0h14v14H0V0z" fill="#0078D4"/>
      <path d="M16 0h14v14H16V0z" fill="#50B0F0"/>
      <path d="M0 16h14v14H0V16z" fill="#50B0F0"/>
      <path d="M16 16h14v14H16V16z" fill="#0078D4"/>
    </svg>
  );
}

function SageLogo() {
  return (
    <svg height="28" viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Sage Intacct">
      <rect width="90" height="28" rx="4" fill="#00DC82"/>
      <path d="M12 18.5c0 1.1 1.2 2.5 3.8 2.5 2.4 0 4-1.3 4-3.2 0-1.6-1-2.5-2.6-3l-1.4-.4c-.8-.2-1.2-.6-1.2-1.2 0-.7.6-1.2 1.6-1.2h3.3V10h-3.5c-2.3 0-3.8 1.2-3.8 3 0 1.5.9 2.4 2.3 2.8l1.5.4c.8.2 1.3.6 1.3 1.3 0 .7-.5 1.2-1.5 1.2h-3V19a.5.5 0 01-.5-.5H12zm10-1c0 2.3 1.8 3.5 3.8 3.5 1.6 0 2.6-.7 3.2-1.5v1.3h2.5V14c0-2.5-1.6-4-4-4-2.2 0-3.8 1.2-4 3h2.4c.2-.8.8-1.2 1.7-1.2 1 0 1.6.6 1.6 1.7v.5h-1.8c-2.4 0-3.9 1.2-3.9 3zm2.5-.2c0-.9.7-1.5 1.8-1.5H30v.6c0 1.4-.8 2.3-2 2.3-1 0-1.5-.6-1.5-1.4zM36 22.5c0 1.7 1.5 2.5 3.5 2.5 2.3 0 4-1.3 4-3.8V10h-2.5v1.3c-.6-.9-1.6-1.5-2.8-1.5-2.3 0-4 1.8-4 4.8s1.7 4.7 4 4.7c1.2 0 2.2-.5 2.8-1.4v.8c0 1.2-.7 1.8-1.7 1.8-1 0-1.5-.5-1.5-1H36zm1 -8c0-1.7.8-2.7 2-2.7s2 1 2 2.7-.8 2.7-2 2.7-2-1-2-2.7zm10.5 4.7c.6.9 1.7 1.8 3.4 1.8 2.5 0 4.2-1.8 4.2-5s-1.7-5-4.2-5c-1.7 0-2.8.9-3.4 1.8V10H45V25h2.5v-5.8zm.2-3.2c0-1.8.9-2.8 2.2-2.8s2.2 1 2.2 2.8-.9 2.8-2.2 2.8-2.2-1-2.2-2.8z" fill="white"/>
    </svg>
  );
}

function QuickBooksLogo() {
  return (
    <svg height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="QuickBooks">
      <circle cx="16" cy="16" r="16" fill="#2CA01C"/>
      <path d="M8 16c0-3.31 2.69-6 6-6h1v2h-1c-2.21 0-4 1.79-4 4s1.79 4 4 4h1v2h-1c-3.31 0-6-2.69-6-6zm16 0c0 3.31-2.69 6-6 6h-1v-2h1c2.21 0 4-1.79 4-4s-1.79-4-4-4h-1V10h1c3.31 0 6 2.69 6 6zm-9 0a1 1 0 112 0 1 1 0 01-2 0z" fill="white"/>
    </svg>
  );
}

function SalesforceLogo() {
  return (
    <svg height="32" viewBox="0 0 60 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Salesforce">
      <path d="M24.8 6.2a12.2 12.2 0 0122 4.1 10 10 0 0112.6 9.6 10 10 0 01-10 10H11.5a11 11 0 01-11-11 11 11 0 0111-11 10.9 10.9 0 0113.3-1.7z" fill="#00A1E0"/>
    </svg>
  );
}

function HubSpotLogo() {
  return (
    <svg height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="HubSpot">
      <path d="M19.5 11.2V8.5a2 2 0 001.2-1.8V6.6a2 2 0 00-4 0v.1a2 2 0 001.2 1.8v2.7a5.7 5.7 0 00-2.7 1.2L7.6 7.2a2.2 2.2 0 10-.9 1.5l7.4 5.1a5.7 5.7 0 00-.8 2.9 5.7 5.7 0 00.8 2.9l-2.3 2.3a1.8 1.8 0 10.9.9l2.3-2.3a5.7 5.7 0 003.5 1.2 5.7 5.7 0 005.7-5.7 5.7 5.7 0 00-4.7-5.8zm-1 9.8a3.8 3.8 0 110-7.6 3.8 3.8 0 010 7.6z" fill="#FF7A59"/>
    </svg>
  );
}

function PipedriveLogo() {
  return (
    <svg height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Pipedrive">
      <circle cx="15" cy="15" r="15" fill="#1D9F53"/>
      <path d="M10.5 8v14M10.5 12a4.5 4.5 0 100 6 4.5 4.5 0 000-6z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function ZohoLogo() {
  return (
    <svg height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Zoho CRM">
      <path d="M0 20L12 4h8L8 20H0zm14 0V4h6v16h-6zm8 0V4h6l4 8 4-8h6v16h-5.5V10l-4.5 8h-1l-4.5-8V20H22zm24-8a8 8 0 1116 0 8 8 0 01-16 0zm5.5 0a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z" fill="#E42527"/>
    </svg>
  );
}

function Microsoft365Logo() {
  return (
    <svg height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft 365">
      <rect width="14" height="14" fill="#F25022"/>
      <rect x="16" width="14" height="14" fill="#7FBA00"/>
      <rect y="16" width="14" height="14" fill="#00A4EF"/>
      <rect x="16" y="16" width="14" height="14" fill="#FFB900"/>
    </svg>
  );
}

function TeamsLogo() {
  return (
    <svg height="30" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft Teams">
      <path d="M29 12h8a3 3 0 013 3v7a3 3 0 01-3 3h-8V12z" fill="#5059C9"/>
      <circle cx="36" cy="7" r="4" fill="#5059C9"/>
      <circle cx="20" cy="7" r="5.5" fill="#7B83EB"/>
      <path d="M4 14h26a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2z" fill="#7B83EB"/>
      <path d="M20 14H7v12h13a2 2 0 002-2v-8a2 2 0 00-2-2z" fill="#4B53BC"/>
    </svg>
  );
}

function OutlookLogo() {
  return (
    <svg height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Outlook">
      <path d="M2 8l13-5 13 5v14l-13 5L2 22V8z" fill="#0078D4"/>
      <path d="M15 3L28 8v14L15 27V3z" fill="#005CA7"/>
      <rect x="13" y="12" width="11" height="9" rx="1" fill="white"/>
      <path d="M13 12h11l-5.5 5L13 12z" fill="#0078D4"/>
      <circle cx="8" cy="16" r="4.5" fill="white"/>
      <circle cx="8" cy="16" r="2.5" fill="#0078D4"/>
    </svg>
  );
}

function GoogleWorkspaceLogo() {
  return (
    <svg height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google Workspace">
      <path d="M25 14.3c0-.8-.1-1.5-.2-2.3H14v4.3h6.2a5.3 5.3 0 01-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.4z" fill="#4285F4"/>
      <path d="M14 26c3.2 0 5.8-1 7.7-2.8l-3.7-2.9c-1 .7-2.4 1.1-4 1.1-3 0-5.6-2-6.5-4.8H3.7v3C5.6 23.6 9.5 26 14 26z" fill="#34A853"/>
      <path d="M7.5 16.6A7.9 7.9 0 017.2 14c0-.9.2-1.8.4-2.6V8.4H3.7A13.9 13.9 0 002 14c0 2.3.5 4.4 1.7 6.4l3.8-3.8z" fill="#FBBC05"/>
      <path d="M14 6.6c1.7 0 3.2.6 4.4 1.7l3.3-3.3C19.8 3.2 17.2 2 14 2 9.5 2 5.6 4.4 3.7 8l3.8 3c.9-2.8 3.5-4.4 6.5-4.4z" fill="#EA4335"/>
    </svg>
  );
}

function SlackLogo() {
  return (
    <svg height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Slack">
      <path d="M5.8 17.5a2.9 2.9 0 110 5.8 2.9 2.9 0 010-5.8zm0-1.8H15V23h-9.2a2.9 2.9 0 010-5.8H5.8V15.7z" fill="#E01E5A"/>
      <path d="M17.5 22.2a2.9 2.9 0 015.8 0 2.9 2.9 0 01-5.8 0zm1.8 0V12.8H27v9.4a2.9 2.9 0 01-5.8 0h-1.8z" fill="#ECB22E"/>
      <path d="M22.2 5.8a2.9 2.9 0 110-5.8 2.9 2.9 0 010 5.8zm0 1.8H13V0h9.2a2.9 2.9 0 010 5.8H22.2V7.6z" fill="#2EB67D"/>
      <path d="M10.5 5.8a2.9 2.9 0 01-5.8 0 2.9 2.9 0 015.8 0zM8.7 5.8v9.4H0V5.8a2.9 2.9 0 015.8 0v.1H8.7z" fill="#36C5F0"/>
    </svg>
  );
}

function AsanaLogo() {
  return (
    <svg height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Asana">
      <circle cx="14" cy="8" r="5.5" fill="#FF5263"/>
      <circle cx="5.5" cy="20" r="5.5" fill="#FF5263"/>
      <circle cx="22.5" cy="20" r="5.5" fill="#FF5263"/>
    </svg>
  );
}

function MondayLogo() {
  return (
    <svg height="28" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="monday.com">
      <rect x="0" y="7" width="14" height="14" rx="7" fill="#FF3750"/>
      <rect x="21" y="7" width="14" height="14" rx="7" fill="#FFCB00"/>
      <rect x="42" y="7" width="14" height="14" rx="7" fill="#00CA72"/>
    </svg>
  );
}

function WorkdayLogo() {
  return (
    <svg height="28" viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Workday">
      <path d="M14 0a14 14 0 100 28A14 14 0 0014 0zm0 6.5a7.5 7.5 0 110 15 7.5 7.5 0 010-15z" fill="#F5B700"/>
      <circle cx="14" cy="14" r="4" fill="#F5B700"/>
      <path d="M36 21l-4-14h3.5l2.3 9.2L40.3 7h3L45.8 16.2 48 7h3.5l-4 14h-3.5l-2.2-8.5L39.5 21H36zm20 0V7h3.5v14H56zm5.5 0V7h3.3l7 8.8V7h3.5v14H72l-7-8.8V21h-3.5zm16.5 0V7h5.5c4.5 0 7.5 2.8 7.5 7s-3 7-7.5 7H78zm3.5-3.2h2c2.3 0 4-1.5 4-3.8s-1.7-3.8-4-3.8h-2v7.6z" fill="#1F286F"/>
    </svg>
  );
}

function BambooHRLogo() {
  return (
    <svg height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="BambooHR">
      <circle cx="16" cy="16" r="16" fill="#73AC34"/>
      <path d="M16 6c-1 0-1.5.7-1.5 1.5v4.7c-1-.7-2.5-1.2-4-1.2-1 0-1.5.7-1.5 1.5s.5 1.5 1.5 1.5c2 0 3.5 1.2 4 3H10a1.5 1.5 0 000 3h4.5v4.5a1.5 1.5 0 003 0V20H22a1.5 1.5 0 000-3h-4.5c.5-1.8 2-3 4-3 1 0 1.5-.7 1.5-1.5s-.5-1.5-1.5-1.5c-1.5 0-3 .5-4 1.2V7.5C17.5 6.7 17 6 16 6z" fill="white"/>
    </svg>
  );
}

function ADPLogo() {
  return (
    <svg height="24" viewBox="0 0 70 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ADP">
      <path d="M8 4L0 20h5l1.5-3.5h7L15 20h5L12 4H8zm2 4.5l2.2 5H7.8L10 8.5zM20 4v16h8c5 0 8-3 8-8s-3-8-8-8h-8zm5 4h3c2 0 3.3 1.5 3.3 4s-1.3 4-3.3 4h-3V8zm15-4v16h5v-5h3c3.8 0 6-2 6-5.5S51.8 4 48 4h-8zm5 4h3c1.3 0 2 .8 2 1.5s-.7 1.5-2 1.5h-3V8z" fill="#D82424"/>
    </svg>
  );
}

function RipplingLogo() {
  return (
    <svg height="24" viewBox="0 0 90 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Rippling">
      <rect y="8" width="8" height="8" rx="1.5" fill="#FF6B35"/>
      <rect x="10" y="4" width="8" height="16" rx="1.5" fill="#FF6B35"/>
      <rect x="20" width="8" height="24" rx="1.5" fill="#FF6B35"/>
      <path d="M36 6h4v12h-4V6zm0-3.5h4V6h-4V2.5zm6 3.5h3.5v1.7c.8-1.2 2-1.9 3.5-1.9 2.8 0 4.5 2 4.5 5v7.2H50v-7c0-1.5-.7-2.3-2-2.3-1.4 0-2.5 1-2.5 2.7V18H42V6zm14 0h4v12h-4V6zm0-3.5h4V6h-4V2.5zm6 0h4V18h-4V2.5zm6 3.5h3.5v1.7c.8-1.2 2-1.9 3.5-1.9 2.8 0 4.5 2 4.5 5v7.2H86v-7c0-1.5-.7-2.3-2-2.3-1.4 0-2.5 1-2.5 2.7V18H78V6z" fill="#1A1A2E"/>
    </svg>
  );
}

function GreenhouseLogo() {
  return (
    <svg height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Greenhouse">
      <circle cx="14" cy="14" r="14" fill="#24A47F"/>
      <path d="M19 11h-2V9a3 3 0 00-6 0v2H9a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1v-8a1 1 0 00-1-1zm-6-2a1 1 0 012 0v2h-2V9zm3 8h-4v-2h4v2z" fill="white"/>
    </svg>
  );
}

function LatticeLogo() {
  return (
    <svg height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Lattice">
      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" fill="#995BFF"/>
    </svg>
  );
}

function SnowflakeLogo() {
  return (
    <svg height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Snowflake">
      <path d="M16 2v28M16 2l-3 5m3-5l3 5M16 30l-3-5m3 5l3-5M2 16h28M2 16l5-3m-5 3l5 3M30 16l-5-3m5 3l-5 3M6.3 6.3l19.4 19.4M6.3 6.3l.6 5.7m-.6-5.7l5.7.6M25.7 25.7l-.6-5.7m.6 5.7l-5.7-.6M25.7 6.3L6.3 25.7M25.7 6.3l-5.7.6m5.7-.6l-.6 5.7M6.3 25.7l.6-5.7m-.6 5.7l5.7-.6" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function DatabricksLogo() {
  return (
    <svg height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Databricks">
      <path d="M20 0L40 11.5v5L20 28 0 16.5v-5L20 0z" fill="#FF3621"/>
      <path d="M20 3.5L37 13.5v4L20 27.5 3 17.5v-4L20 3.5z" fill="#FF3621"/>
      <path d="M1 13.5L20 24l19-10.5-19-10L1 13.5z" fill="white" fillOpacity=".2"/>
      <path d="M20 14l-11-6.5v4L20 18l11-6.5v-4L20 14z" fill="white"/>
    </svg>
  );
}

function BigQueryLogo() {
  return (
    <svg height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google BigQuery">
      <path d="M15 1L1 8.5v13L15 29l14-7.5v-13L15 1z" fill="#4285F4"/>
      <path d="M15 1v28L1 21.5v-13L15 1z" fill="#669DF6"/>
      <circle cx="15" cy="14" r="5" fill="white"/>
      <path d="M18.5 18.5l3.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="15" cy="14" r="3" fill="#4285F4"/>
    </svg>
  );
}

function TableauLogo() {
  return (
    <svg height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Tableau">
      <path d="M13 5h2v18h-2V5z" fill="#E8762D"/>
      <path d="M5 13h18v2H5v-2z" fill="#E8762D"/>
      <path d="M7.5 9.5h13v1.5h-13V9.5z" fill="#59879B"/>
      <path d="M7.5 17h13v1.5h-13V17z" fill="#59879B"/>
      <path d="M9.5 7.5h1.5v13H9.5v-13z" fill="#59879B"/>
      <path d="M17 7.5h1.5v13H17v-13z" fill="#59879B"/>
      <rect x="2" y="2" width="5" height="5" fill="#E8762D"/>
      <rect x="21" y="2" width="5" height="5" fill="#E8762D"/>
      <rect x="2" y="21" width="5" height="5" fill="#E8762D"/>
      <rect x="21" y="21" width="5" height="5" fill="#E8762D"/>
    </svg>
  );
}

function PowerBILogo() {
  return (
    <svg height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Power BI">
      <rect x="2" y="12" width="5" height="13" rx="1" fill="#F2C811"/>
      <rect x="9" y="8" width="5" height="17" rx="1" fill="#F2C811"/>
      <rect x="16" y="4" width="5" height="21" rx="1" fill="#F2C811"/>
      <rect x="23" y="16" width="3" height="9" rx="1" fill="#F2C811" opacity=".6"/>
    </svg>
  );
}

function LookerLogo() {
  return (
    <svg height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Looker">
      <circle cx="14" cy="14" r="13" fill="#4285F4"/>
      <circle cx="14" cy="11" r="5" fill="white"/>
      <path d="M14 16c-3 0-5 1.5-5 3.5C9 21.5 11.2 23 14 23s5-1.5 5-3.5c0-2-2-3.5-5-3.5z" fill="white"/>
    </svg>
  );
}

function PostgreSQLLogo() {
  return (
    <svg height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PostgreSQL">
      <path d="M21 2C14 2 8 7.6 8 14.5c0 4.2 2.2 8 5.8 10.4l-.5 4.6h5.4l.3-3a13 13 0 002 .5c7 0 11-5.6 11-12.5S28 2 21 2zM11 14.5c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10a10 10 0 01-10-10z" fill="#336791"/>
      <path d="M16 8v9l5-4.5L16 8z" fill="white"/>
    </svg>
  );
}

function MySQLLogo() {
  return (
    <svg height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MySQL">
      <path d="M0 4h4v12l7-12h4v16h-4V8L4 20H0V4zm18 0h4l4 6 4-6h4L26 14v6h-4v-6L18 4zm18 0h4v13h8v3H36V4zm14 0h12v3H56v4h7v3h-7v4h9v3H50V4z" fill="#00618A"/>
      <path d="M62 4l6 10V4h4v16h-4L62 10v10h-4V4h4z" fill="#00618A"/>
    </svg>
  );
}

function RetoolLogo() {
  return (
    <svg height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Retool">
      <rect width="24" height="24" rx="5" fill="#1C1C1C"/>
      <path d="M7 7h10v3H7V7zm0 4h6v3H7v-3zm0 4h8v3H7v-3z" fill="#FFB700"/>
    </svg>
  );
}

function AppsmithLogo() {
  return (
    <svg height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Appsmith">
      <rect width="24" height="24" rx="5" fill="#FF6D2A"/>
      <path d="M12 6L6 9v6l6 3 6-3V9l-6-3z" fill="white"/>
      <path d="M12 6v12M6 9l6 3 6-3" stroke="#FF6D2A" strokeWidth="1"/>
    </svg>
  );
}

function NotionLogo() {
  return (
    <svg height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Notion">
      <path d="M4 5l1.5-.5L20 3l4.5-.5c1 0 1.5.5 1.5 1.3v19.4c0 .8-.5 1.3-1.5 1.3L8 25.5c-.8 0-1.3-.3-1.7-.8L4.3 7c-.3-.7-.3-1.5-.3-2z" fill="white"/>
      <path d="M4 5l1.5-.5 4 20-1.5.5L4 5zm16-2L22 3.5c.8.3 1 .8 1 1.5v15.5c0 .8-.4 1.3-1.2 1.3l-2 .2L20 3z" fill="#E8E8E8"/>
      <path d="M9 9.5h10M9 13h10M9 16.5h6" stroke="#1B1B1B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ConfluenceLogo() {
  return (
    <svg height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Confluence">
      <path d="M2.5 20c-.4.7-.8 1.4-.4 2.2.4.7 1.2.8 2 .8h8c.7 0 1.4-.1 1.8-.8l.6-1.2C10 19.2 5.5 18.2 2.5 20z" fill="#0052CC"/>
      <path d="M25.5 8c.4-.7.8-1.4.4-2.2-.4-.7-1.2-.8-2-.8h-8c-.7 0-1.4.1-1.8.8l-.6 1.2c4.5 1.8 9 2.8 12 1z" fill="#0052CC"/>
      <path d="M14 14c-3.5-2-6-3-8-2.5l-3.5 6.5C5.5 19 10 20 14 18l.5-4z" fill="url(#cfl1)"/>
      <path d="M14 14c3.5 2 6 3 8 2.5l3.5-6.5C22.5 9 18 8 14 10l-.5 4z" fill="url(#cfl2)"/>
      <defs>
        <linearGradient id="cfl1" x1="14" y1="11.5" x2="2.5" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0052CC"/>
          <stop offset="1" stopColor="#2684FF"/>
        </linearGradient>
        <linearGradient id="cfl2" x1="14" y1="16.5" x2="25.5" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0052CC"/>
          <stop offset="1" stopColor="#2684FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function AtlassianLogo() {
  return (
    <svg height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Atlassian">
      <path d="M9.5 13.5C8.3 12 7.2 9.2 6.7 7c-.2-.9-1.3-1-1.7-.3L1.5 13.5c-.2.4-.1.9.3 1.2 3 2.3 7 3.8 12.2 3.8 5.2 0 9.2-1.5 12.2-3.8.4-.3.5-.8.3-1.2l-3.5-6.8c-.4-.7-1.5-.6-1.7.3-.5 2.2-1.6 5-2.8 6.5H9.5z" fill="#0052CC"/>
      <path d="M14 1.5C14 1.5 11 7 11 10a3 3 0 006 0c0-3-3-8.5-3-8.5z" fill="#2684FF"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Logo set — all brands, one row
───────────────────────────────────────────────────────────────────────────── */

interface LogoEntry {
  id: string;
  label: string;
  component: React.FC;
}

const LOGOS: LogoEntry[] = [
  { id: "sap",         label: "SAP",                component: SAPLogo },
  { id: "oracle",      label: "Oracle NetSuite",     component: OracleLogo },
  { id: "dynamics",    label: "Microsoft Dynamics",  component: MicrosoftDynamicsLogo },
  { id: "sage",        label: "Sage Intacct",        component: SageLogo },
  { id: "quickbooks",  label: "QuickBooks",          component: QuickBooksLogo },
  { id: "salesforce",  label: "Salesforce",          component: SalesforceLogo },
  { id: "hubspot",     label: "HubSpot",             component: HubSpotLogo },
  { id: "pipedrive",   label: "Pipedrive",           component: PipedriveLogo },
  { id: "zoho",        label: "Zoho CRM",            component: ZohoLogo },
  { id: "m365",        label: "Microsoft 365",       component: Microsoft365Logo },
  { id: "teams",       label: "Microsoft Teams",     component: TeamsLogo },
  { id: "outlook",     label: "Outlook",             component: OutlookLogo },
  { id: "google",      label: "Google Workspace",    component: GoogleWorkspaceLogo },
  { id: "slack",       label: "Slack",               component: SlackLogo },
  { id: "asana",       label: "Asana",               component: AsanaLogo },
  { id: "monday",      label: "monday.com",          component: MondayLogo },
  { id: "workday",     label: "Workday",             component: WorkdayLogo },
  { id: "bamboohr",    label: "BambooHR",            component: BambooHRLogo },
  { id: "adp",         label: "ADP",                 component: ADPLogo },
  { id: "rippling",    label: "Rippling",            component: RipplingLogo },
  { id: "greenhouse",  label: "Greenhouse",          component: GreenhouseLogo },
  { id: "lattice",     label: "Lattice",             component: LatticeLogo },
  { id: "snowflake",   label: "Snowflake",           component: SnowflakeLogo },
  { id: "databricks",  label: "Databricks",          component: DatabricksLogo },
  { id: "bigquery",    label: "BigQuery",            component: BigQueryLogo },
  { id: "tableau",     label: "Tableau",             component: TableauLogo },
  { id: "powerbi",     label: "Power BI",            component: PowerBILogo },
  { id: "looker",      label: "Looker",              component: LookerLogo },
  { id: "postgresql",  label: "PostgreSQL",          component: PostgreSQLLogo },
  { id: "mysql",       label: "MySQL",               component: MySQLLogo },
  { id: "retool",      label: "Retool",              component: RetoolLogo },
  { id: "appsmith",    label: "Appsmith",            component: AppsmithLogo },
  { id: "notion",      label: "Notion",              component: NotionLogo },
  { id: "confluence",  label: "Confluence",          component: ConfluenceLogo },
  { id: "atlassian",   label: "Atlassian",           component: AtlassianLogo },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Logo item — padded slot, vertically centred, hover opacity lift
   NOTE: `[&>svg]:!h-10` forces all SVGs to 40px height (increase by at least 8px)
───────────────────────────────────────────────────────────────────────────── */

function LogoItem({ label, component: Logo }: Omit<LogoEntry, "id">) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center px-10 opacity-40 hover:opacity-90 transition-opacity duration-800 [&>svg]:!h-16"
      aria-label={label}
      title={label}
    >
      <Logo />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Marquee track — CSS animation, pause-on-hover via group
───────────────────────────────────────────────────────────────────────────── */

function MarqueeTrack() {
  const set = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <div className="group overflow-hidden">
      <div
        className="dzen-marquee-track flex w-max group-hover:[animation-play-state:paused]"
        style={{
          animation: "dzen-marquee 100s linear infinite",
          willChange: "transform",
        }}
      >
        {set.map((logo, i) => (
          <LogoItem key={`${logo.id}-${i}`} label={logo.label} component={logo.component} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   IntegrationLogoMarquee — constrained to the same width as the content by
   default. Use `maxWidth` to make the marquee horizontally smaller and centered,
   `bleed` to extend it equally left/right, and `fade` to adjust edge crop.
───────────────────────────────────────────────────────────────────────────── */

interface IntegrationLogoMarqueeProps {
  /** Max width of the visible marquee viewport. Use this to make it smaller. */
  maxWidth?: number | string;
  /** Pixels to extend the marquee beyond the container on both left and right. */
  bleed?: number;
  /** Percentage used for the left/right CSS mask fade. */
  fade?: number;
}

export function IntegrationLogoMarquee({
  maxWidth = "100%",
  bleed = 0,
  fade = 15,
}: IntegrationLogoMarqueeProps) {
  const safeBleed = Math.max(0, bleed);
  const safeFade = Math.min(Math.max(fade, 0), 49);
  const resolvedMaxWidth = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes dzen-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dzen-marquee-track {
            animation: none !important;
          }
        }
      `}</style>

      {/* Container width matches content; inner viewport can be narrowed or bled outward. */}
      <Container className="overflow-visible !px-0">
        <div
          className="relative overflow-hidden"
          style={{
            width: `calc(100% + ${safeBleed * 2}px)`,
            maxWidth: `calc(${resolvedMaxWidth} + ${safeBleed * 2}px)`,
            marginLeft: `-${safeBleed}px`,
            marginRight: `-${safeBleed}px`,
            marginInline: safeBleed === 0 ? "auto" : undefined,
            WebkitMaskImage: `linear-gradient(to right, transparent, black ${safeFade}%, black ${100 - safeFade}%, transparent)`,
            maskImage: `linear-gradient(to right, transparent, black ${safeFade}%, black ${100 - safeFade}%, transparent)`,
          }}
        >
          <MarqueeTrack />
        </div>
      </Container>
    </>
  );
}

export function IntegrationMarquee() {
  return (
    <section
      id="integrations"
      aria-label="Systems we connect"
      className="py-[80px] bg-bg-secondary border-t border-border overflow-hidden"
    >
      {/* Heading still uses the regular Container with padding */}
      <Container className="mb-12">
        <FadeIn>
          <SectionIndex number="05" tag="Integration Catalogue" className="mb-4" />
          <p className="font-sans text-body font-light text-stone-400 leading-[1.7] max-w-[440px]">
            Pre-built connectors across every major enterprise platform.
          </p>
        </FadeIn>
      </Container>

      <IntegrationLogoMarquee />
    </section>
  );
}