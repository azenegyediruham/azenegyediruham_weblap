import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { CreatorApplicationForm } from "@/components/forms/CreatorApplicationForm";
import { CreatorRules } from "@/components/forms/CreatorRules";

export const metadata: Metadata = {
  title: "Creator Program",
  description: "Alkotóknak: ingyenes vagy kedvezményes hímzés közösségi média megjelenésért cserébe.",
};

const NAME_IDEAS = ["Stitch & Share", "Creator Club", "Creator Program", "Wear & Share", "Creator Stitch", "Stitch Crew", "Wear It Forward", "Social Stitch", "Creator Drop", "Stitch Partner", "Thread Ambassadors", "Minta & Megosztás"];

const STATUSES = [
  ["submitted", "Beküldve", "Megkaptuk a jelentkezést."],
  ["reviewing", "Elbírálás alatt", "Megnézzük a profilod és a tartalomötletet."],
  ["approved", "Elfogadva", "Egyeztetjük a ruhát, a mintát és a poszt időzítését."],
  ["rejected", "Elutasítva", "Most nem tudunk együttműködni – de jelentkezhetsz később."],
  ["fulfilled", "Teljesítve", "A ruha elkészült, a poszt megjelent."],
] as const;

export default function CreatorPage() {
  return (
    <PageShell eyebrow="Creator Program" title="Stitch & Share" lead="Ha van közönséged valamelyik platformon, kaphatsz ingyenes vagy kedvezményes hímzést a választott (vagy beküldött) ruhára – cserébe egy őszinte közösségi média megjelenésért." wide>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          <CreatorRules />
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-base font-semibold">Hogyan zajlik?</h2>
            <ol className="mt-3 space-y-2 text-sm text-muted">
              <li>1. Jelentkezel az űrlapon (profil, követőszám, tartalomötlet).</li>
              <li>2. Manuálisan ellenőrizzük – MVP-ben nincs automata követőszám-lekérés.</li>
              <li>3. Elfogadás után megtervezed a ruhát a Studióban, mi kihímezzük.</li>
              <li>4. Megjelenik a posztod, mi megosztjuk.</li>
            </ol>
            <dl className="mt-4 grid gap-2 text-xs">
              {STATUSES.map(([code, label, text]) => (
                <div key={code} className="flex gap-3">
                  <dt className="w-24 shrink-0 font-mono text-muted">{code}</dt>
                  <dd>
                    <strong>{label}</strong> – {text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl border border-dashed border-line p-6">
            <h2 className="text-base font-semibold">Névjavaslatok a programra</h2>
            <p className="mt-1 text-xs text-muted">Munkanév: Stitch & Share. Alternatívák döntéshez:</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {NAME_IDEAS.map((n) => (
                <li key={n} className="rounded-full border border-line px-3 py-1 text-xs">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-base font-semibold">Jelentkezés</h2>
          <div className="mt-4">
            <CreatorApplicationForm />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
