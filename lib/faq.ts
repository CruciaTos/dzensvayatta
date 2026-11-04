import type { FaqItem } from "@/types/content";

export const HOME_FAQ: FaqItem[] = [
  {
    q: "How much does a *custom system* cost?",
    short: "It depends on scope. You'll get a range after one call.",
    a: "We price **per milestone**, never as an open-ended hourly bill. After the workflow audit you get **a fixed scope and quote** for the first version.",
    needsConfirm: true, // [confirm: optionally add "first versions typically start at ₹__"]
  },
  {
    q: "How long does a *project* take?",
    short: "Weeks, not months, for a first version.",
    a: "The audit takes **1–2 weeks**. A first usable version usually follows in **4–8 weeks**, ~and then we improve it in small releases.~",
    needsConfirm: true, // [confirm delivery timeframe]
  },
  {
    q: "Do you work with *small businesses*?",
    short: "Yes. Most of our clients are owner-run.",
    a: "Our software runs payroll, sales and clinic operations for **teams that don't have an IT department**, and we design for that.",
  },
  {
    q: "Where does *our data* live?",
    short: "On your machines or your cloud, encrypted.",
    a: "Our products are **local-first**, with **encrypted local storage and automatic backups** ~(true of CruSam and Growmont today)~. We sign an NDA on request.",
  },
  {
    q: "Can it work in *Hindi or Marathi*?",
    short: "Yes, for chat and voice assistants.",
    a: "We build assistants on **Indian-language AI models**, so your customers can talk to them *in the language they use*.",
    needsConfirm: true, // [confirm before publishing Indian language support capabilities]
  },
  {
    q: "What happens *after launch*?",
    short: "We stay on.",
    a: "Our desktop apps **update themselves**, we **monitor what we deploy**, ~and support plans are available.~",
    needsConfirm: true, // [confirm AMC/support terms]
  },
];

export const ABOUT_FAQ: FaqItem[] = [
  {
    q: "Who is behind *Svayatta*?",
    short: "Two founders based in Mumbai, working directly on every build.",
    a: "*Svayatta* was founded by **Soham Boridkar and Smit Mhatre**. We work directly with every client on ~architecture, engineering, and rollout.~",
    needsConfirm: true, // [confirm founder roles and team description]
  },
  {
    q: "Where are you based and do you *work remotely*?",
    short: "Based in Mumbai, working with clients across India.",
    a: "Our studio is headquartered in **Mumbai**. We work on-site with teams across Mumbai and **collaborate remotely with businesses across India**.",
    needsConfirm: true, // [confirm remote collaboration scope]
  },
  {
    q: "Do you *sign NDAs*?",
    short: "Yes, standard mutual NDAs are available on request.",
    a: "We treat all operational data and proprietary workflows with **strict confidentiality** and provide **a mutual non-disclosure agreement** prior to discovery.",
    needsConfirm: true, // [confirm standard NDA terms]
  },
];

