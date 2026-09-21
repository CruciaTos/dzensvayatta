import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/**
 * Code-drawn device mockups for the product carousel, composed like the
 * pre-rendered CruSam slides: tilted tablets floating on a dark canvas lit by
 * two brand-coloured glows. A screen shows its screenshot once `src` is set
 * and a sketch of the app until then, so a product page can ship before its
 * screenshots exist — dropping them in later is a one-line change per screen.
 */

export type MockupLayout = "overlap" | "staggered" | "single" | "desktop-phone";
export type ScreenSketch = "dashboard" | "table" | "analytics";

export interface MockupScreen {
  /** Names the screen: the sketch's header, and the slide's accessible label. */
  label: string;
  /** Screenshot under /public. Leave unset to draw the sketch instead. */
  src?: string;
  /** Which sketch to draw while `src` is unset. Defaults to "dashboard". */
  sketch?: ScreenSketch;
}

export interface MockupTheme {
  /** Canvas glows, [primary, secondary]. */
  glow: [string, string];
  /** Sketch sidebar gradient, [top, bottom]. */
  sidebar: [string, string];
  accent: string;
  accentAlt: string;
}

export interface MockupSlide {
  layout: MockupLayout;
  /** Back to front. In "desktop-phone" the second screen is the phone. */
  screens: MockupScreen[];
  theme: MockupTheme;
}

type Device = "tablet" | "phone";

interface Placement {
  device: Device;
  left: string;
  top: string;
  width: string;
  transform: string;
}

// Positions are percentages of a 3:4 canvas, the same frame as the 1080×1440
// CruSam renders, so the compositions match theirs.
const TILT_BACK = "perspective(2000px) rotateX(10deg) rotateY(-16deg) rotateZ(-5deg)";
const TILT_FRONT = "perspective(2000px) rotateX(10deg) rotateY(-10deg) rotateZ(4deg)";
const TILT_SOFT = "perspective(2000px) rotateX(8deg) rotateY(-12deg) rotateZ(-3deg)";

const LAYOUTS: Record<MockupLayout, { frames: Placement[]; glowAt: [string, string] }> = {
  overlap: {
    frames: [
      { device: "tablet", left: "3%", top: "34%", width: "52%", transform: TILT_BACK },
      { device: "tablet", left: "43%", top: "43%", width: "51%", transform: TILT_FRONT },
    ],
    glowAt: ["88% 96%", "8% 100%"],
  },
  staggered: {
    frames: [
      { device: "tablet", left: "4%", top: "46%", width: "45%", transform: TILT_SOFT },
      { device: "tablet", left: "52%", top: "32%", width: "45%", transform: TILT_FRONT },
    ],
    glowAt: ["96% 22%", "0% 92%"],
  },
  single: {
    frames: [{ device: "tablet", left: "9%", top: "34%", width: "82%", transform: TILT_SOFT }],
    glowAt: ["50% 108%", "100% 0%"],
  },
  "desktop-phone": {
    frames: [
      { device: "tablet", left: "4%", top: "36%", width: "62%", transform: TILT_BACK },
      { device: "phone", left: "68%", top: "37%", width: "22%", transform: TILT_FRONT },
    ],
    glowAt: ["92% 88%", "0% 8%"],
  },
};

// Light UI, matching the apps being mocked rather than the site around them,
// so the sketches read the same as the screenshots that replace them.
const UI = {
  surface: "#F1F5F9",
  card: "#FFFFFF",
  cardHead: "#F8FAFC",
  line: "#E2E8F0",
  bar: "#CBD5E1",
  ink: "#0F172A",
} as const;

export function DeviceMockup({ slide }: { slide: MockupSlide }) {
  const { frames, glowAt } = LAYOUTS[slide.layout];
  const { theme } = slide;

  return (
    <div
      role="img"
      aria-label={`${slide.screens.map((s) => s.label).join(" and ")} screens`}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        containerType: "size",
        background: [
          `radial-gradient(ellipse 75% 50% at ${glowAt[0]}, ${theme.glow[0]}, transparent 70%)`,
          `radial-gradient(ellipse 65% 45% at ${glowAt[1]}, ${theme.glow[1]}, transparent 70%)`,
          "#050607",
        ].join(", "),
      }}
    >
      {/* Unlike a cover-fitted image, the canvas tracks the card's width so a
          tall card never crops the frames at the sides; the height cap keeps a
          short, wide card (mobile) from pushing them past top and bottom. The
          frames sit in its middle band, so the vertical overflow is empty. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "min(100cqw, 130cqh)",
          aspectRatio: "3 / 4",
          transform: "translate(-50%, -50%)",
          containerType: "inline-size",
        }}
      >
        {frames.map((placement, i) => {
          const screen = slide.screens[i];
          if (!screen) return null;
          return <Frame key={i} placement={placement} screen={screen} theme={theme} />;
        })}
      </div>
    </div>
  );
}

function Frame({
  placement,
  screen,
  theme,
}: {
  placement: Placement;
  screen: MockupScreen;
  theme: MockupTheme;
}) {
  const phone = placement.device === "phone";

  return (
    <div
      style={{
        position: "absolute",
        left: placement.left,
        top: placement.top,
        width: placement.width,
        aspectRatio: phone ? "9 / 19" : "16 / 10.5",
        transform: placement.transform,
        borderRadius: phone ? "3.4cqw" : "1.8cqw",
        background: "linear-gradient(150deg, #30343d 0%, #16181d 55%, #0d0e11 100%)",
        boxShadow: [
          "0 0 0 1px rgba(255,255,255,0.14)",
          "inset 0 1px 0 rgba(255,255,255,0.12)",
          "0 3cqw 6cqw -2cqw rgba(0,0,0,0.9)",
          `0 0 7cqw -2cqw ${theme.glow[0]}`,
        ].join(", "),
      }}
    >
      {/* The screen is its own container: sketch sizes are in its cqw, so the
          same sketch reads right on a phone and on a full-width tablet. */}
      <div
        style={{
          position: "absolute",
          inset: phone ? "0.9cqw" : "0.8cqw",
          borderRadius: phone ? "2.6cqw" : "1.1cqw",
          overflow: "hidden",
          background: UI.surface,
          containerType: "inline-size",
        }}
      >
        {screen.src ? (
          <Image
            src={screen.src}
            alt=""
            fill
            sizes="(max-width: 900px) 70vw, 30vw"
            style={{ objectFit: "cover", objectPosition: "top left" }}
          />
        ) : phone ? (
          <PhoneSketch screen={screen} theme={theme} />
        ) : (
          <DesktopSketch screen={screen} theme={theme} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sketches                                                          */
/* ------------------------------------------------------------------ */

function Bar({ w, h = "1.2cqw", c = UI.bar }: { w: string; h?: string; c?: string }) {
  return (
    <span
      style={{ display: "block", width: w, height: h, borderRadius: 999, background: c, flexShrink: 0 }}
    />
  );
}

function Card({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: UI.card,
        border: `1px solid ${UI.line}`,
        borderRadius: "1.2cqw",
        padding: "1.8cqw",
        display: "flex",
        flexDirection: "column",
        gap: "1.2cqw",
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Row({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ display: "flex", gap: "1.8cqw", minHeight: 0, ...style }}>{children}</div>;
}

function Stat({ theme, tint }: { theme: MockupTheme; tint: string }) {
  return (
    <Card style={{ flex: 1 }}>
      <span style={{ width: "3cqw", height: "3cqw", borderRadius: "0.8cqw", background: tint }} />
      <Bar w="70%" />
      <Bar w="45%" h="2cqw" c={theme.accentAlt} />
    </Card>
  );
}

function DesktopSketch({ screen, theme }: { screen: MockupScreen; theme: MockupTheme }) {
  const sketch = screen.sketch ?? "dashboard";

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      <div
        style={{
          width: "19%",
          background: `linear-gradient(180deg, ${theme.sidebar[0]}, ${theme.sidebar[1]})`,
          padding: "3cqw 2cqw",
          display: "flex",
          flexDirection: "column",
          gap: "2.4cqw",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.2cqw", marginBottom: "1.6cqw" }}>
          <span
            style={{ width: "3cqw", height: "3cqw", borderRadius: "0.8cqw", background: theme.accent, flexShrink: 0 }}
          />
          <Bar w="55%" h="1.4cqw" c="rgba(255,255,255,0.75)" />
        </div>
        {["82%", "64%", "74%", "58%", "70%", "62%", "52%"].map((w, i) => (
          <Bar key={i} w={w} h="1.3cqw" c={i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.28)"} />
        ))}
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: "3cqw 3.2cqw",
          display: "flex",
          flexDirection: "column",
          gap: "2.4cqw",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "2.6cqw",
              fontWeight: 700,
              color: UI.ink,
              whiteSpace: "nowrap",
            }}
          >
            {screen.label}
          </span>
          <span style={{ width: "3.4cqw", height: "3.4cqw", borderRadius: "50%", background: theme.accentAlt }} />
        </div>

        {sketch === "dashboard" && <DashboardBody theme={theme} />}
        {sketch === "table" && <TableBody theme={theme} />}
        {sketch === "analytics" && <AnalyticsBody theme={theme} />}
      </div>
    </div>
  );
}

function DashboardBody({ theme }: { theme: MockupTheme }) {
  return (
    <>
      <Row>
        {[theme.accent, theme.accentAlt, theme.accent, theme.accentAlt].map((tint, i) => (
          <Stat key={i} theme={theme} tint={tint} />
        ))}
      </Row>
      <Row style={{ flex: 1 }}>
        <Card style={{ flex: 2 }}>
          <Bar w="30%" c={UI.ink} />
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "1.4cqw", paddingTop: "1cqw" }}>
            {[45, 62, 38, 70, 55, 82, 60, 74, 90].map((h, i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: "0.6cqw 0.6cqw 0 0",
                  background: i === 8 ? theme.accent : theme.accentAlt,
                  opacity: i === 8 ? 1 : 0.55,
                }}
              />
            ))}
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <Bar w="50%" c={UI.ink} />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "1.2cqw" }}>
              <span
                style={{ width: "2.4cqw", height: "2.4cqw", borderRadius: "50%", background: theme.accent, opacity: 0.8, flexShrink: 0 }}
              />
              <Bar w={["70%", "55%", "64%", "48%"][i]} />
            </div>
          ))}
        </Card>
      </Row>
    </>
  );
}

function TableBody({ theme }: { theme: MockupTheme }) {
  const cols = ["22%", "18%", "16%", "14%"];

  return (
    <>
      <Row style={{ alignItems: "center", gap: "1.2cqw" }}>
        {["10%", "9%", "11%", "8%"].map((w, i) => (
          <span
            key={i}
            style={{
              width: w,
              height: "2.8cqw",
              borderRadius: 999,
              background: i === 0 ? theme.accent : UI.card,
              border: `1px solid ${i === 0 ? theme.accent : UI.line}`,
            }}
          />
        ))}
        <span style={{ flex: 1 }} />
        <span style={{ width: "14%", height: "3cqw", borderRadius: "0.8cqw", background: theme.accentAlt }} />
      </Row>
      <Card style={{ flex: 1, padding: 0, gap: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.6cqw 2cqw",
            background: UI.cardHead,
            borderBottom: `1px solid ${UI.line}`,
          }}
        >
          {cols.map((w, i) => (
            <Bar key={i} w={w} h="1.1cqw" c={UI.ink} />
          ))}
          <Bar w="10%" h="1.1cqw" c={UI.ink} />
        </div>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
          <div
            key={row}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5cqw 2cqw",
              borderBottom: `1px solid ${UI.line}`,
            }}
          >
            {cols.map((w, i) => (
              <Bar key={i} w={`calc(${w} - ${(row * 7 + i * 3) % 6}%)`} h="1.1cqw" />
            ))}
            <span
              style={{
                width: "10%",
                height: "2.2cqw",
                borderRadius: 999,
                background: row % 3 === 0 ? theme.accent : theme.accentAlt,
                opacity: 0.25,
              }}
            />
          </div>
        ))}
      </Card>
    </>
  );
}

function AnalyticsBody({ theme }: { theme: MockupTheme }) {
  const line = "0,32 12,28 24,30 36,21 48,24 60,15 72,18 84,9 100,6";

  return (
    <>
      <Row>
        {[theme.accent, theme.accentAlt, theme.accent].map((tint, i) => (
          <Stat key={i} theme={theme} tint={tint} />
        ))}
      </Row>
      <Card style={{ flex: 1 }}>
        <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
          <Bar w="28%" c={UI.ink} />
          <Bar w="16%" c={UI.line} h="2.2cqw" />
        </Row>
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ width: "100%", flex: 1, minHeight: 0, overflow: "visible" }}
        >
          {[10, 20, 30].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke={UI.line} strokeWidth="0.4" />
          ))}
          <polygon points={`${line} 100,40 0,40`} fill={theme.accent} fillOpacity="0.14" />
          <polyline
            points={line}
            fill="none"
            stroke={theme.accent}
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
        </svg>
      </Card>
    </>
  );
}

function PhoneSketch({ screen, theme }: { screen: MockupScreen; theme: MockupTheme }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          background: `linear-gradient(180deg, ${theme.sidebar[0]}, ${theme.sidebar[1]})`,
          padding: "9cqw 6cqw 6cqw",
          display: "flex",
          flexDirection: "column",
          gap: "3cqw",
        }}
      >
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "6.5cqw",
            fontWeight: 700,
            color: "#FFFFFF",
            whiteSpace: "nowrap",
          }}
        >
          {screen.label}
        </span>
        <Bar w="45%" h="3cqw" c="rgba(255,255,255,0.35)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4cqw", padding: "5cqw" }}>
        {[theme.accent, theme.accentAlt, theme.accentAlt, theme.accent].map((tint, i) => (
          <div
            key={i}
            style={{
              background: UI.card,
              border: `1px solid ${UI.line}`,
              borderRadius: "3.5cqw",
              padding: "4cqw",
              display: "flex",
              flexDirection: "column",
              gap: "3cqw",
            }}
          >
            <span style={{ width: "7cqw", height: "7cqw", borderRadius: "2cqw", background: tint }} />
            <Bar w="70%" h="2.6cqw" />
            <Bar w="50%" h="4cqw" c={theme.accentAlt} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "3.5cqw", padding: "0 5cqw" }}>
        {["72%", "58%", "66%", "50%"].map((w, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3.5cqw",
              background: UI.card,
              border: `1px solid ${UI.line}`,
              borderRadius: "3.5cqw",
              padding: "3.5cqw",
            }}
          >
            <span
              style={{ width: "8cqw", height: "8cqw", borderRadius: "50%", background: theme.accent, opacity: 0.8, flexShrink: 0 }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.4cqw" }}>
              <Bar w={w} h="2.6cqw" c={UI.ink} />
              <Bar w="40%" h="2.2cqw" />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "4.5cqw 6cqw 6cqw",
          background: UI.card,
          borderTop: `1px solid ${UI.line}`,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{ width: "6cqw", height: "6cqw", borderRadius: "2cqw", background: i === 0 ? theme.accent : UI.bar }}
          />
        ))}
      </div>
    </div>
  );
}
