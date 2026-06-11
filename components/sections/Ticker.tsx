import { TICKER_ITEMS } from "@/lib/data";

export function Ticker() {
  // Duplicate items for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="bg-bg-panel border-t border-border border-b py-[14px] overflow-hidden"
      role="marquee"
      aria-label="DZen services ticker"
    >
      <div
        className="flex whitespace-nowrap animate-ticker"
        aria-hidden="true"
      >
        {items.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="inline-flex items-center gap-6 px-8 flex-shrink-0"
          >
            <span className="font-mono text-[12px] tracking-[0.16em] uppercase text-stone-500">
              {item}
            </span>
            <div className="w-[3px] h-[3px] bg-accent flex-shrink-0" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
