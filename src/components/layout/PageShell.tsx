import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

interface PageShellProps {
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: ReactNode;
  wide?: boolean;
}

/** Egységes oldalkeret a semleges shellhez (fejléc, cím, tartalom, lábléc). */
export function PageShell({ eyebrow, title, lead, children, wide = false }: PageShellProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className={`mx-auto px-4 py-12 sm:px-6 ${wide ? "max-w-7xl" : "max-w-4xl"}`}>
          {title ? (
            <header className="mb-10">
              {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">{eyebrow}</p> : null}
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
              {lead ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{lead}</p> : null}
            </header>
          ) : null}
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
