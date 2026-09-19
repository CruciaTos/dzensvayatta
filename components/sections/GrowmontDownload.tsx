"use client";

import { useState } from "react";

// Mirrors the palette in ProjectsShowcase, since this renders inside its card.
const C = {
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#e5f3e5",
  textMuted: "rgba(229,243,229,0.65)",
  divider: "rgba(178,213,229,0.10)",
  danger: "#E4948B",
  success: "#8FD6A8",
} as const;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string };

/**
 * Gated download for the Growmont installer, rendered in the product card's
 * action slot. The server mails a signed, time-limited link — see
 * lib/growmont/access.ts for why the check cannot live in the browser.
 */
export function GrowmontDownload() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const sending = status.kind === "sending";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;

    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/growmont/request-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus({
          kind: "error",
          message: data?.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setStatus({ kind: "sent", email });
      setEmail("");
    } catch {
      setStatus({ kind: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <div style={{ maxWidth: "560px" }}>
      <p
        className="font-sans font-light"
        style={{ fontSize: "14px", color: C.textMuted, lineHeight: 1.8 }}
      >
        Available to{" "}
        <span style={{ color: C.accentSoft, fontWeight: 500 }}>@growmont.com</span>{" "}
        addresses. Enter your work email and we will send the download link
        straight to your inbox.
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="growmont-email" className="sr-only">
          Work email address
        </label>
        <input
          id="growmont-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@growmont.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={sending}
          className="min-w-0 flex-1 px-5 py-3 font-sans text-[14px] outline-none transition-colors duration-200 disabled:opacity-60"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: `2px solid ${C.divider}`,
            borderRadius: "10px",
            color: C.textPrimary,
          }}
          onFocus={(event) => {
            event.currentTarget.style.borderColor = C.accent;
          }}
          onBlur={(event) => {
            event.currentTarget.style.borderColor = C.divider;
          }}
        />
        <button
          type="submit"
          disabled={sending}
          className="cursor-pointer whitespace-nowrap rounded-full px-6 py-3 font-sans text-[12px] uppercase tracking-[0.1em] transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: "linear-gradient(180deg, #C6E1EE 0%, #A5CCDE 100%)",
            color: "#04131c",
            border: "none",
            fontWeight: 500,
          }}
        >
          {sending ? "Sending…" : "Send link"}
        </button>
      </form>

      {/* aria-live so the outcome is announced, not just painted. */}
      <div aria-live="polite" className="mt-3 min-h-[22px]">
        {status.kind === "sent" && (
          <p className="font-sans text-[13px]" style={{ color: C.success }}>
            Link sent to {status.email}. It expires in 30 minutes.
          </p>
        )}
        {status.kind === "error" && (
          <p className="font-sans text-[13px]" style={{ color: C.danger }}>
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}
