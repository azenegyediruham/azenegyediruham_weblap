import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Gyakori kérdések",
  description: "Átfutási idő, saját ruha, képformátumok, hímzés mérete, mosás, méretválasztás, céges rendelés.",
};

const FAQ = [
  { q: "Mennyi idő alatt készül el?", a: "Jellemzően 5–10 munkanap a rendelés visszaigazolásától. A minta digitizálása (öltésterv) 1–2 nap, a hímzés és a minőségellenőrzés további 2–3 nap, a többi a csomagolás és a szállítás. Sürgős rendelést felár ellenében vállalunk – jelezd a megjegyzésben." },
  { q: "Saját ruhát is küldhetek?", a: "Igen. Egyeztetés után a saját ruhádra is hímzünk, ha az anyag alkalmas rá (sűrű szövésű pamut, pamut-poliészter, vászon). Ilyenkor a rendelésnél a „saját ruha” opciót válaszd, és mi elküldjük a postázási adatokat." },
  { q: "Milyen képformátumot tölthetek fel?", a: "PNG, JPG, WebP és SVG, legfeljebb 10 MB. A legjobb eredményt átlátszó hátterű PNG vagy vektoros SVG adja. JPG-nél a teljes téglalap a ruhára kerül (nincs átlátszóság)." },
  { q: "Mekkora lehet a hímzés?", a: "Zónánként eltér: a mellkasi zónában legfeljebb 12 × 12 cm, elöl-hátul középen legfeljebb 28 × 34 cm, az ujjon 10 × 10 cm. A szerkesztő valós centiméterben mutatja a méretet, és nem enged a zónán kívülre." },
  { q: "Mosógépben mosható?", a: "Igen, 30–40 °C-on, kifordítva. A hímzés nem fakul és nem reped – ez a fő különbség a nyomathoz képest. Szárítógépet nem javaslunk." },
  { q: "Hogyan választok méretet?", a: "Minden ruhához saját mérettáblázat tartozik (mellbőség, hossz, váll, ujj – vagy derék, csípő, hossz). A termékoldalon és a Studióban is látod. Ha két méret között vagy, a nagyobbat javasoljuk." },
  { q: "Mi történik rossz minőségű képnél?", a: "Feltöltéskor jelezzük, ha a felbontás alacsony (600 px alatt). A digitizálásnál minden képet ellenőrzünk; ha a minta nem hímezhető jól (túl apró részletek, vékony vonalak), felvesszük veled a kapcsolatot, mielőtt gyártanánk." },
  { q: "Tudtok logót hímezni?", a: "Igen – a logók a leggyakoribb minták. Vektoros SVG-t kérünk, ha van, mert abból pontosabb az öltésterv. Céges rendelésnél a színeket Pantone-hoz közeli cérnaszínekre egyeztetjük." },
  { q: "Több helyre is kérhetek hímzést?", a: "Igen. A Studióban minden zónába külön mintát tehetsz (pl. mellkas + hát + ujj). Az árban minden további pozíció külön tétel." },
  { q: "Van minimum rendelési mennyiség?", a: "Nincs. Egy darabtól gyártunk. 10 darab felett mennyiségi kedvezményt adunk (10 db: 10%, 25 db: 15%, 50 db: 20%)." },
  { q: "Kérhetek céges ruhát?", a: "Igen: céges, munka-, csapat- és eseményruhák egyedi ajánlattal. Írj a kapcsolat oldalon a mennyiséggel és a logóval, 1 munkanapon belül válaszolunk." },
];

export default function FaqPage() {
  return (
    <PageShell eyebrow="GYIK" title="Gyakori kérdések" lead="Ha nem találod a választ, írj nekünk a kapcsolat oldalon.">
      <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {FAQ.map((f) => (
          <details key={f.q} className="group px-6 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
              <dt>{f.q}</dt>
              <span className="text-muted transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <dd className="mt-3 text-sm leading-relaxed text-muted">{f.a}</dd>
          </details>
        ))}
      </dl>
      <p className="mt-8 text-sm text-muted">
        Más kérdésed van?{" "}
        <Link href="/contact/" className="underline underline-offset-4">
          Írj nekünk
        </Link>
        .
      </p>
    </PageShell>
  );
}
