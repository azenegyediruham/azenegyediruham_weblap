"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { tryGetSupabase } from "@/lib/supabase/client";
import { pricingFromSettings, setPricingStrategy } from "@/lib/pricing";

export interface SiteSettings {
  brand: { name: string; shortName: string; tagline: string };
  contact: { email: string; phone: string; address: string; openingHours: string };
  social: Record<string, string>;
  hero: { title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string };
  featured: { productSlug: string; categorySlugs: string[] };
  creatorProgram: { programName: string; minFollowers: Record<string, number>; benefit: string };
  production: { leadTimeDays: { min: number; max: number }; maxUploadMb: number; acceptedFormats: string[] };
  legal: { notice: string; reviewed: boolean };
  loaded: boolean;
}

const DEFAULTS: SiteSettings = {
  brand: { name: siteConfig.name, shortName: siteConfig.shortName, tagline: siteConfig.tagline },
  contact: { ...siteConfig.contact },
  social: { ...siteConfig.social },
  hero: { ...siteConfig.hero },
  featured: { productSlug: siteConfig.featuredProductSlug, categorySlugs: [...siteConfig.featuredCategorySlugs] },
  creatorProgram: { programName: siteConfig.creatorProgram.programName, minFollowers: { ...siteConfig.creatorProgram.minFollowers }, benefit: siteConfig.creatorProgram.benefit },
  production: { leadTimeDays: { ...siteConfig.production.leadTimeDays }, maxUploadMb: siteConfig.production.maxUploadMb, acceptedFormats: [...siteConfig.production.acceptedFormats] },
  legal: { notice: siteConfig.legalNotice, reviewed: false },
  loaded: false,
};

const Ctx = createContext<SiteSettings>(DEFAULTS);

/** site_settings tábla -> központi konfiguráció (alapértékekkel), kliensen betöltve. */
export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);

  useEffect(() => {
    const supabase = tryGetSupabase();
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from("site_settings")
      .select("key,value")
      .then(({ data }) => {
        if (cancelled || !data) return;
        const map = Object.fromEntries(data.map((r) => [r.key, r.value as Record<string, unknown>]));
        const merged: SiteSettings = {
          brand: { ...DEFAULTS.brand, ...(map.brand as Partial<SiteSettings["brand"]>) },
          contact: { ...DEFAULTS.contact, ...(map.contact as Partial<SiteSettings["contact"]>) },
          social: { ...DEFAULTS.social, ...(map.social as Record<string, string>) },
          hero: { ...DEFAULTS.hero, ...(map.hero as Partial<SiteSettings["hero"]>) },
          featured: { ...DEFAULTS.featured, ...(map.featured as Partial<SiteSettings["featured"]>) },
          creatorProgram: { ...DEFAULTS.creatorProgram, ...(map.creator_program as Partial<SiteSettings["creatorProgram"]>) },
          production: { ...DEFAULTS.production, ...(map.production as Partial<SiteSettings["production"]>) },
          legal: { ...DEFAULTS.legal, ...(map.legal as Partial<SiteSettings["legal"]>) },
          loaded: true,
        };
        setSettings(merged);
        if (map.pricing) setPricingStrategy(pricingFromSettings(map.pricing));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => settings, [settings]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSiteSettings(): SiteSettings {
  return useContext(Ctx);
}
