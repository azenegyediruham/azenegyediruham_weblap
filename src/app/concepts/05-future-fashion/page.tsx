import Link from "next/link";
import { getConcept } from "@/concepts/registry";

const concept = getConcept("05-future-fashion")!;

export const metadata = { title: concept.name };

export default function ConceptPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: concept.palette[0], color: concept.palette[1] }}>
      <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-70">Koncepció {concept.number}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{concept.name}</h1>
      <p className="mt-3 max-w-md opacity-80">{concept.tagline}</p>
      <p className="mt-8 text-sm opacity-60">Ez a koncepció még építés alatt áll.</p>
      <Link href="/concepts/" className="mt-6 underline underline-offset-4">Vissza a selectorhoz</Link>
    </main>
  );
}
