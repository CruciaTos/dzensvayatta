import type { ReactNode } from "react";

export interface LegalPageProps {
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <article className="pt-40 pb-24 max-w-[720px] mx-auto px-5">
      <div className="font-mono text-meta uppercase text-ink-3 mb-4 tracking-wider">
        LAST UPDATED · {updated.toUpperCase()}
      </div>

      <h1 className="text-display-m font-light text-ink mb-12">{title}</h1>

      <div className="text-body text-ink-2 leading-relaxed [&_h2]:text-title-s [&_h2]:text-ink [&_h2]:mt-12 [&_h2]:mb-4 [&_p]:mb-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-5 [&_li]:mb-2 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </div>
    </article>
  );
}

