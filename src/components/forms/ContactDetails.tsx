"use client";

import { useSiteSettings } from "@/lib/settings/SiteSettingsProvider";

export function ContactDetails() {
  const s = useSiteSettings();
  return (
    <div className="space-y-6 text-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">E-mail</p>
        <a href={`mailto:${s.contact.email}`} className="mt-1 block text-base font-medium underline-offset-4 hover:underline">
          {s.contact.email}
        </a>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Cím</p>
        <p className="mt-1 text-base">{s.contact.address}</p>
        <p className="mt-1 text-xs text-muted">Ideiglenes, fiktív cím – hamarosan frissül.</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Műhely</p>
        <p className="mt-1">{s.contact.openingHours}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Közösségi</p>
        <ul className="mt-1 flex gap-4">
          {Object.entries(s.social)
            .filter(([, url]) => url)
            .map(([k, url]) => (
              <li key={k}>
                <a href={url} target="_blank" rel="noreferrer" className="capitalize underline-offset-4 hover:underline">
                  {k}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
