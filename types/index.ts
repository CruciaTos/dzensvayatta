// ─── Navigation ──────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
  // Optional, used by the Projects dropdown in the Navbar: a one-line gloss
  // under the label and a small status chip beside it.
  description?: string;
  badge?: string;
  badgeTone?: "live" | "wip";
}
