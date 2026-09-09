import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { TextileTexture } from "@/components/ui/TextileTexture";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Rólunk",
  description: "Miért jött létre az Az én egyedi ruhám: hímzés, személyre szabás, minőség, kreativitás.",
};

const SECTIONS = [
  {
    title: "Miért jött létre?",
    text: "Mert a legtöbb „egyedi” póló egy nyomtatott PNG egy sablonon. Mi azt akartuk, hogy a saját rajzod, logód vagy feliratod valóban a ruha része legyen: cérnával, a szövetbe varrva – és hogy rendelés előtt pontosan lásd, hol és mekkora lesz.",
  },
  {
    title: "Miért egyedi?",
    text: "Egy darabtól gyártunk. Nincs minimum rendelés, nincs sablonminta-kényszer. Te választod a ruhát, a fazont, a színt, a méretet – és te teszed rá a mintát, oda, ahová szeretnéd, a megengedett zónákon belül.",
  },
  {
    title: "Személyre szabás, valós méretben",
    text: "A szerkesztő centiméterben dolgozik: ha 11,5 × 7,2 cm-t mutat a képernyőn, akkora lesz a hímzés a pólón is. Ugyanezekből az adatokból készül a gyártási fájl, ezért nincs meglepetés.",
  },
  {
    title: "Hímzés és minőség",
    text: "A hímzés nem fakul, nem reped, nem pereg le. Sűrű szövésű pamut alapanyagot használunk, amely tartja a cérnát. Minden darab kézbe kerül mielőtt feladjuk: méret, szálvégek, mosáspróba.",
  },
  {
    title: "Kreativitás",
    text: "A minták nagy része tőletek jön: rajzok, gyerekfirkák, csapatemblémák, monogramok. Az inspirációs galériában ezekből mutatunk – és később bárki megoszthatja a saját designját.",
  },
  {
    title: "Gyártás Budapesten",
    text: "Digitizálás, hímzés, minőségellenőrzés, csomagolás – egy helyen. Átfutás jellemzően 5–10 munkanap. A hímzőgép és a fájlformátum részleteit a gyártási dokumentációban vezetjük, a webshop ettől független.",
  },
];

export default function AboutPage() {
  return (
    <PageShell eyebrow="Rólunk" title="Egy műhely, ami a te rajzodból indul ki" lead={siteConfig.tagline}>
      <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-2xl">
        <TextileTexture variant="weave" color="#E7E1D3" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 flex items-end p-6">
          <p className="max-w-md text-sm text-foreground/70">Textil, cérna, fény. Amit itt látsz, azt a gép is így varrja.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {SECTIONS.map((s) => (
          <section key={s.title} className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          </section>
        ))}
      </div>
      <div className="mt-10 rounded-2xl bg-foreground p-8 text-background">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-70">Márkatörténet</p>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed">
          2026-ban indultunk egy hímzőgéppel, egy szabóasztallal és egy kérdéssel: mi lenne, ha bárki – tervezői tudás nélkül – pontosan látná, hogyan fog kinézni a saját rajza egy ruhán, mielőtt megrendeli? Ebből lett a Design Studio. A többi a galériában van.
        </p>
        <Link href="/studio/" className="mt-6 inline-block rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground">
          Tervezd meg a sajátod
        </Link>
      </div>
    </PageShell>
  );
}
