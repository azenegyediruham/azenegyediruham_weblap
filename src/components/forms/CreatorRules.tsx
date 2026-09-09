"use client";

import { useSiteSettings } from "@/lib/settings/SiteSettingsProvider";

const PLATFORM_LABELS: Record<string, string> = { instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube", facebook: "Facebook" };

export function CreatorRules() {
  const s = useSiteSettings();
  return (
    <div className="rounded-2xl bg-foreground p-6 text-background">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-70">{s.creatorProgram.programName}</p>
      <p className="mt-3 text-sm leading-relaxed">{s.creatorProgram.benefit}</p>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Minimum követőszám</p>
      <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
        {Object.entries(s.creatorProgram.minFollowers).map(([k, v]) => (
          <li key={k} className="flex justify-between rounded-lg bg-background/10 px-3 py-2">
            <span>{PLATFORM_LABELS[k] ?? k}</span>
            <span className="font-semibold">{v.toLocaleString("hu-HU")}+</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs opacity-70">A küszöbök adminból módosíthatók (site_settings → creator_program).</p>
    </div>
  );
}
