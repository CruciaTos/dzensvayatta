import { Fragment, type ReactNode } from "react";

/**
 * Renders a Rich string: *words* become the italic-serif accent (its own
 * colour), **words** a key phrase (full ink, a touch heavier), ~words~ an
 * aside (muted), and "\n" a line break.
 * "Products *we've shipped*" → Products <em>we've shipped</em>.
 * Prose that uses key phrases or asides sets its base one step softer (text-ink-2).
 */
export function em(text: string): ReactNode {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {richLine(line)}
    </Fragment>
  ));
}

function richLine(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|~([^~]+)~/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index} className="key">{m[1]}</strong>);
    else if (m[2]) out.push(<em key={m.index} className="em">{m[2]}</em>);
    else out.push(<span key={m.index} className="aside">{m[3]}</span>);
    last = re.lastIndex;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/** The same string as plain text, for alt text, metadata and JSON-LD. */
export function plain(text: string): string {
  return text.replace(/[*~]/g, "").replace(/\s*\n\s*/g, " ").trim();
}
