"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface FormData {
  companyName: string;
  companyField: string;
  description: string;
  email: string;
  contactNo: string;
  meetDate: string;
  meetTime: string;
}

const EMPTY: FormData = {
  companyName: "",
  companyField: "",
  description: "",
  email: "",
  contactNo: "",
  meetDate: "",
  meetTime: "",
};

export function DiscoveryForm() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [wordCount, setWordCount] = useState(0);
  const [step, setStep] = useState<"form" | "sending" | "success" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(field: keyof FormData, value: string) {
    if (field === "description") {
      const words = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
      if (words > 120) return;
      setWordCount(words);
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.companyName || !form.email || !form.meetDate || !form.meetTime) {
      setErrorMsg("Please fill in Company Name, Email, and choose a date & time.");
      return;
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setErrorMsg("");
    setStep("sending");

    try {
      const startISO = new Date(`${form.meetDate}T${form.meetTime}:00`).toISOString();
      const endDate = new Date(`${form.meetDate}T${form.meetTime}:00`);
      endDate.setMinutes(endDate.getMinutes() + 60);
      const endISO = endDate.toISOString();

      const emailBody = `
New Discovery Call Request — DZen

Company: ${form.companyName}
Industry: ${form.companyField}
Description: ${form.description}
Email: ${form.email}
Contact: ${form.contactNo}
Requested Meeting: ${form.meetDate} at ${form.meetTime}
      `.trim();

      const gmailRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          mcp_servers: [
            { type: "url", url: "https://gmailmcp.googleapis.com/mcp/v1", name: "gmail" },
          ],
          messages: [
            {
              role: "user",
              content: `Send an email using Gmail with:
- To: dzen.ai.platform@gmail.com
- Subject: [Discovery Call] ${form.companyName} — ${form.meetDate} ${form.meetTime}
- Body: ${emailBody}

After sending, reply with just: SENT`,
            },
          ],
        }),
      });

      if (!gmailRes.ok) throw new Error("Gmail send failed");

      const calRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          mcp_servers: [
            { type: "url", url: "https://calendarmcp.googleapis.com/mcp/v1", name: "gcal" },
          ],
          messages: [
            {
              role: "user",
              content: `Create a Google Calendar event with these details:
- Title: Discovery Call — ${form.companyName}
- Start: ${startISO}
- End: ${endISO}
- Description: ${emailBody}
- Attendee email: ${form.email}

After creating, reply with just: CREATED`,
            },
          ],
        }),
      });

      if (!calRes.ok) throw new Error("Calendar event creation failed");

      setStep("success");
    } catch (err) {
      console.error(err);
      setStep("error");
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {step === "success" && (
        <div className="flex flex-col items-center text-center py-12 gap-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.35)" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-[#FAF6EF]">You&apos;re booked.</h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-[340px]">
            A confirmation has been sent to <strong className="text-white/70">{form.email}</strong> and the meeting has been added to your calendar.
          </p>
          <Link
            href="/"
            className="mt-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[#C9A96E] hover:opacity-70 transition-opacity no-underline"
          >
            Back to home
          </Link>
        </div>
      )}

      {step === "error" && (
        <div className="flex flex-col items-center text-center py-12 gap-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v4m0 4h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-[#FAF6EF]">Something went wrong.</h1>
          <p className="text-white/50 text-sm">Please try again or email us directly.</p>
          <button
            onClick={() => setStep("form")}
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#C9A96E] hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {step === "sending" && (
        <div className="flex flex-col items-center text-center py-16 gap-5">
          <div className="w-10 h-10 rounded-full border-2 border-[#C9A96E]/30 border-t-[#C9A96E] animate-spin" />
          <p className="text-white/50 text-sm">Scheduling your call & sending confirmation…</p>
        </div>
      )}

      {step === "form" && (
        <>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-white/35 hover:text-[#C9A96E] transition-colors no-underline mb-10"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-[#C9A96E]" />
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#C9A96E]">Discovery Call</span>
            </div>
            <h1 className="font-serif text-[clamp(28px,5vw,36px)] font-normal text-[#FAF6EF] leading-tight">
              Tell us about your business.
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field label="Company Name *" htmlFor="companyName">
                <Input
                  id="companyName"
                  placeholder="Acme Corp"
                  value={form.companyName}
                  onChange={(v) => handleChange("companyName", v)}
                />
              </Field>
              <Field label="Industry / Field" htmlFor="companyField">
                <Input
                  id="companyField"
                  placeholder="e.g. FinTech, SaaS…"
                  value={form.companyField}
                  onChange={(v) => handleChange("companyField", v)}
                />
              </Field>
            </div>

            <Field label="What does your company do?" htmlFor="description" hint={`${wordCount} / 120 words`}>
              <textarea
                id="description"
                rows={3}
                placeholder="Briefly describe your product, team, and the problem you're solving…"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full bg-transparent text-[#FAF6EF] text-sm placeholder:text-white/20 outline-none resize-none leading-relaxed"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field label="Email Address *" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(v) => handleChange("email", v)}
                />
              </Field>
              <Field label="Contact Number" htmlFor="contactNo">
                <Input
                  id="contactNo"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.contactNo}
                  onChange={(v) => handleChange("contactNo", v)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field label="Preferred Date *" htmlFor="meetDate">
                <Input
                  id="meetDate"
                  type="date"
                  min={today}
                  value={form.meetDate}
                  onChange={(v) => handleChange("meetDate", v)}
                />
              </Field>
              <Field label="Preferred Time *" htmlFor="meetTime">
                <Input
                  id="meetTime"
                  type="time"
                  value={form.meetTime}
                  onChange={(v) => handleChange("meetTime", v)}
                />
              </Field>
            </div>

            {errorMsg && <p className="text-red-400 text-xs mt-1">{errorMsg}</p>}

            <button
              onClick={handleSubmit}
              className="w-full mt-1 py-3.5 rounded-xl font-sans text-sm font-medium tracking-wide transition-all duration-200 active:scale-[0.98] cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #C9A96E 0%, #a8833a 100%)",
                color: "#1A1208",
                boxShadow: "0 4px 20px rgba(201,169,110,0.25)",
              }}
            >
              Schedule Discovery Call →
            </button>

            <p className="text-center text-white/25 text-[11px] mt-1">
              You&apos;ll receive a Gmail confirmation + Google Calendar invite instantly.
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/40">
          {label}
        </label>
        {hint && <span className="font-mono text-[10px] text-white/25">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Input({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  min,
}: {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      min={min}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent text-[#FAF6EF] text-sm placeholder:text-white/20 outline-none"
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "10px 14px",
        transition: "border-color 0.2s",
        colorScheme: "dark",
      }}
      onFocus={(e) => (e.target.style.borderColor = "rgba(201,169,110,0.5)")}
      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
    />
  );
}
