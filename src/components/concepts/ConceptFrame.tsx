import Link from "next/link";
import { concepts } from "@/concepts/registry";

/**
 * Minden koncepció oldalon azonos, apró navigációs pill (nem a design része):
 * vissza a selectorhoz, előző / következő koncepció.
 */
export function ConceptFrame({ slug }: { slug: string }) {
  const index = concepts.findIndex((c) => c.slug === slug);
  const current = concepts[index];
  const prev = concepts[(index - 1 + concepts.length) % concepts.length];
  const next = concepts[(index + 1) % concepts.length];
  if (!current) return null;
  return (
    <nav
      aria-label="Koncepció navigáció"
      className="fixed bottom-4 left-4 z-[60] flex items-center gap-1 rounded-full border border-white/15 bg-black/80 px-2 py-1.5 font-mono text-[11px] text-white shadow-lg backdrop-blur"
    >
      <Link href={`/concepts/${prev.slug}/`} className="rounded-full px-2 py-1 hover:bg-white/10" aria-label={`Előző: ${prev.name}`}>
        ←
      </Link>
      <Link href="/concepts/" className="rounded-full px-2 py-1 hover:bg-white/10">
        {current.number} · {current.name}
      </Link>
      <Link href={`/concepts/${next.slug}/`} className="rounded-full px-2 py-1 hover:bg-white/10" aria-label={`Következő: ${next.name}`}>
        →
      </Link>
    </nav>
  );
}
