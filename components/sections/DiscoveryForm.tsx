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

// ── Design tokens (matching TargetMarkets theme) ──
const C = {
  textPrimary: "#e5f3e5ff",
  textMuted: "rgba(229,243,229,0.65)",
  textSubtle: "rgba(229,243,229,0.40)",
  textFaint: "rgba(229,243,229,0.25)",
  textGhost: "rgba(229,243,229,0.20)",
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  cardBorder: "rgba(178,213,229,0.10)",
} as const;

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
      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Unable to schedule the discovery call.");
      }

      setStep("success");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
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
            style={{ border: `1px solid rgba(126,195,226,0.35)` }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke={C.accent}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-sans text-3xl" style={{ color: C.textPrimary }}>
            You&apos;re booked.
          </h1>
          <p className="text-sm leading-relaxed max-w-[340px]" style={{ color: C.textMuted }}>
            A confirmation has been sent to{" "}
            <strong style={{ color: "rgba(229,243,229,0.7)" }}>{form.email}</strong>{" "}
            and the meeting has been added to your calendar.
          </p>
          <Link
            href="/"
            className="mt-2 font-mono text-[11px] tracking-[0.14em] uppercase hover:opacity-70 transition-opacity no-underline"
            style={{ color: C.accent }}
          >
            Back to home
          </Link>
        </div>
      )}

      {step === "error" && (
        <div className="flex flex-col items-center text-center py-12 gap-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ border: "1px solid rgba(220,38,38,0.3)" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 8v4m0 4h.01"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="font-sans text-3xl" style={{ color: C.textPrimary }}>
            Something went wrong.
          </h1>
          <p style={{ color: C.textMuted }} className="text-sm max-w-[360px]">
            {errorMsg || "Please try again or email us directly."}
          </p>
          <button
            onClick={() => {
              setErrorMsg("");
              setStep("form");
            }}
            className="font-mono text-[11px] tracking-[0.14em] uppercase hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
            style={{ color: C.accent }}
          >
            Try again
          </button>
        </div>
      )}

      {step === "sending" && (
        <div className="flex flex-col items-center text-center py-16 gap-5">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{
              borderColor: `${C.accent}4d`,
              borderTopColor: C.accent,
            }}
          />
          <p style={{ color: C.textMuted }} className="text-sm">
            Scheduling your call & sending confirmation…
          </p>
        </div>
      )}

      {step === "form" && (
        <>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase hover:transition-colors no-underline mb-10"
            style={{ color: "rgba(229,243,229,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(229,243,229,0.35)")}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </Link>

          {/* Rounded box with accent blue border */}
          <div
            className="rounded-2xl p-6 bg-transparent"
            style={{ border: `1px solid rgba(126,195,226,0.22)` }}
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-px" style={{ backgroundColor: C.accent }} />
                <span
                  className="font-mono text-[10px] tracking-[0.16em] uppercase"
                  style={{ color: C.accent }}
                >
                  Discovery Call
                </span>
              </div>
              <h1
                className="font-sans text-[clamp(28px,5vw,36px)] font-normal leading-tight"
                style={{ color: C.textPrimary }}
              >
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

              <Field
                label="What does your company do?"
                htmlFor="description"
                hint={`${wordCount} / 120 words`}
              >
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Briefly describe your product, team, and the problem you're solving…"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full bg-transparent text-sm outline-none resize-none leading-relaxed"
                  style={{
                    color: C.textPrimary,
                    border: `1px solid ${C.cardBorder}`,
                    borderRadius: "10px",
                    padding: "12px 14px",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(126,195,226,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = C.cardBorder)}
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
                  background: "transparent",
                  border: `1px solid ${C.accent}`,
                  color: C.accent,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${C.accent}1a`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Schedule Discovery Call →
              </button>

              <p
                className="text-center text-[11px] mt-1"
                style={{ color: C.textFaint }}
              >
                You&apos;ll receive a Gmail confirmation + Google Calendar invite
                instantly.
              </p>
            </div>
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
        <label
          htmlFor={htmlFor}
          className="font-mono text-[10px] tracking-[0.12em] uppercase"
          style={{ color: "rgba(229,243,229,0.40)" }}
        >
          {label}
        </label>
        {hint && (
          <span
            className="font-mono text-[10px]"
            style={{ color: "rgba(229,243,229,0.25)" }}
          >
            {hint}
          </span>
        )}
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
      className="w-full bg-transparent text-sm outline-none"
      style={{
        color: "#e5f3e5ff",
        border: "1px solid rgba(178,213,229,0.10)",
        borderRadius: "10px",
        padding: "10px 14px",
        transition: "border-color 0.2s",
        colorScheme: "dark",
      }}
      onFocus={(e) => (e.target.style.borderColor = "rgba(126,195,226,0.5)")}
      onBlur={(e) => (e.target.style.borderColor = "rgba(178,213,229,0.10)")}
    />
  );
}