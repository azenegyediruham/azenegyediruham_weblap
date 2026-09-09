import Link from "next/link";
import { siteConfig } from "@/config/site";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Vásárlás",
    links: [
      { href: "/shop/", label: "Összes ruha" },
      { href: "/studio/", label: "Saját ruhám tervezése" },
      { href: "/inspiration/", label: "Inspiráció" },
      { href: "/how-it-works/", label: "Hogyan működik?" },
    ],
  },
  {
    title: "Rólunk",
    links: [
      { href: "/about/", label: "Rólunk" },
      { href: "/creator/", label: "Creator Program" },
      { href: "/faq/", label: "GYIK" },
      { href: "/contact/", label: "Kapcsolat" },
    ],
  },
  {
    title: "Információk",
    links: [
      { href: "/legal/aszf/", label: "ÁSZF" },
      { href: "/legal/adatkezeles/", label: "Adatkezelési tájékoztató" },
      { href: "/legal/cookie/", label: "Cookie tájékoztató" },
      { href: "/legal/fizetes/", label: "Fizetés" },
      { href: "/legal/szallitas/", label: "Szállítás" },
      { href: "/legal/elallas/", label: "Elállás" },
      { href: "/legal/visszakuldes/", label: "Visszaküldés" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="text-lg font-semibold tracking-tight">{siteConfig.name}</p>
          <p className="mt-3 max-w-sm text-sm text-muted">{siteConfig.tagline}</p>
          <address className="mt-6 text-sm not-italic text-muted">
            <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-foreground">
              {siteConfig.contact.email}
            </a>
            <br />
            {siteConfig.contact.address}
          </address>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{col.title}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-foreground/80 transition hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Minden jog fenntartva.</p>
          <p>{siteConfig.legalNotice}</p>
        </div>
      </div>
    </footer>
  );
}
