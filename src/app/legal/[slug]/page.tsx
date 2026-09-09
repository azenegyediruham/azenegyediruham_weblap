import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { siteConfig } from "@/config/site";

export const dynamicParams = false;

const PAGES: Record<string, { title: string; sections: { h: string; p: string }[] }> = {
  aszf: {
    title: "Általános Szerződési Feltételek",
    sections: [
      { h: "1. A szolgáltató", p: `${siteConfig.name} – ${siteConfig.contact.address} – ${siteConfig.contact.email}. (Placeholder: cégnév, adószám, cégjegyzékszám kitöltendő.)` },
      { h: "2. A szerződés tárgya", p: "Egyedi, a vásárló által feltöltött grafika alapján hímzett ruházati termékek gyártása és értékesítése. Az egyedi termékek a vásárló megrendelése alapján készülnek." },
      { h: "3. Megrendelés menete", p: "Ruha kiválasztása, minta feltöltése és elhelyezése, előnézet, kosár, adatok megadása, fizetés, visszaigazolás e-mailben." },
      { h: "4. Árak és fizetés", p: "Az árak forintban, bruttó összegben értendők. Fizetési módok: lásd a Fizetés oldalt. (Placeholder.)" },
      { h: "5. Szellemi tulajdon", p: "A vásárló kijelenti, hogy a feltöltött grafika felhasználására jogosult. A szolgáltató a grafikát kizárólag a megrendelés teljesítésére használja." },
    ],
  },
  adatkezeles: {
    title: "Adatkezelési tájékoztató",
    sections: [
      { h: "Adatkezelő", p: `${siteConfig.name}, ${siteConfig.contact.email}. (Placeholder.)` },
      { h: "Kezelt adatok", p: "Regisztrációs adatok (e-mail, név), rendelési és szállítási adatok, feltöltött grafikák, Creator Program jelentkezési adatok (közösségi profil, követőszám, képernyőkép)." },
      { h: "Adatkezelés célja és jogalapja", p: "Szerződés teljesítése (megrendelés), jogos érdek (csalásmegelőzés), hozzájárulás (hírlevél, Creator Program)." },
      { h: "Adatfeldolgozók", p: "Supabase (adatbázis, hitelesítés, tárhely – EU régió), GitHub Pages (statikus kiszolgálás). Fizetési és szállítási szolgáltatók bevezetéskor kerülnek felsorolásra." },
      { h: "Érintetti jogok", p: "Hozzáférés, helyesbítés, törlés, korlátozás, adathordozhatóság, tiltakozás. Kérelem: e-mailben." },
    ],
  },
  cookie: {
    title: "Cookie (süti) tájékoztató",
    sections: [
      { h: "Szükséges tárolás", p: "Bejelentkezési munkamenet (Supabase Auth), kosár és tervezési munkamenet a böngésző helyi tárolójában (localStorage, IndexedDB). Ezek a szolgáltatás működéséhez szükségesek." },
      { h: "Analitika", p: "Jelenleg nem használunk analitikai vagy marketing sütiket. Bevezetés esetén hozzájárulást kérünk." },
    ],
  },
  fizetes: {
    title: "Fizetés",
    sections: [
      { h: "Fizetési módok", p: "Bankkártya (Stripe – bevezetés alatt), banki átutalás, utánvét. A prototípusban a fizetés szimulált (mock)." },
      { h: "Számla", p: "Elektronikus számlát küldünk a megadott e-mail címre." },
    ],
  },
  szallitas: {
    title: "Szállítás",
    sections: [
      { h: "Szállítási módok", p: "FOXPOST csomagautomata (bevezetés alatt), házhozszállítás futárral, személyes átvétel Budapesten. A díjak a pénztárban jelennek meg." },
      { h: "Átfutási idő", p: `Gyártás ${siteConfig.production.leadTimeDays.min}–${siteConfig.production.leadTimeDays.max} munkanap, plusz a szállítás 1–2 munkanap.` },
    ],
  },
  elallas: {
    title: "Elállási jog",
    sections: [
      { h: "Egyedi termékek", p: "A vásárló egyedi igényei alapján gyártott (személyre szabott) termékek esetén a 45/2014. (II. 26.) Korm. rendelet szerint az elállási jog nem gyakorolható. (Placeholder – jogi ellenőrzés szükséges.)" },
      { h: "Nem egyedi termékek", p: "Minta nélküli ruhák esetén 14 napon belül elállhatsz." },
    ],
  },
  visszakuldes: {
    title: "Visszaküldés és garancia",
    sections: [
      { h: "Hibás teljesítés", p: "Ha a hímzés eltér a jóváhagyott előnézettől, vagy gyártási hiba van, díjmentesen újragyártjuk vagy visszatérítjük az árat." },
      { h: "Visszaküldés menete", p: "Írj a kapcsolat oldalon a rendelési számmal és fotóval, 2 munkanapon belül válaszolunk." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: PAGES[slug]?.title ?? "Információ" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  return (
    <PageShell eyebrow="Jogi és információs oldalak" title={page.title}>
      <p className="mb-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Placeholder tartalom.</strong> {siteConfig.legalNotice}
      </p>
      <div className="space-y-6">
        {page.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-semibold">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.p}</p>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
