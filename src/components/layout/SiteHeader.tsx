import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CartBadge, ProfileLink } from "./CartBadge";

const NAV = [
  { href: "/shop/", label: "Ruhák" },
  { href: "/studio/", label: "Design Studio" },
  { href: "/how-it-works/", label: "Hogyan működik?" },
  { href: "/inspiration/", label: "Inspiráció" },
  { href: "/creator/", label: "Creator Program" },
  { href: "/concepts/", label: "Design koncepciók" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="text-base font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav aria-label="Fő navigáció" className="hidden items-center gap-6 text-sm text-muted md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <CartBadge />
          <ProfileLink />
        </div>
      </div>
    </header>
  );
}
