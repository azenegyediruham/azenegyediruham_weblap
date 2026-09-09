/**
 * Központi, alapértelmezett oldalkonfiguráció.
 * Éles környezetben a `site_settings` tábla azonos kulcsú értékei felülírják
 * (lásd useSiteSettings()). Cím, email, social linkek – SOHA ne hardcode-old komponensbe.
 */
export const siteConfig = {
  name: "Az én egyedi ruhám",
  shortName: "AER",
  tagline: "Válassz ruhát, tedd rá a saját mintád, nézd meg 3D-ben, rendeld meg.",
  description:
    "Egyedi hímzett és mintás ruhák nőknek és férfiaknak. Töltsd fel a saját grafikád, helyezd el a ruhán, nézd meg 3D-ben, és mi elkészítjük.",
  locale: "hu-HU",
  currency: "HUF",
  contact: {
    email: "azenegyediruham@gmail.com",
    phone: "",
    /** Ideiglenes, fiktív cím – később változik. */
    address: "1111 Budapest, Fiktív út 1.",
    openingHours: "H–P 9:00–17:00",
  },
  social: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    facebook: "https://facebook.com/",
  },
  hero: {
    title: "A te mintád. A te ruhád.",
    subtitle:
      "Töltsd fel a grafikád, helyezd el a pólón, forgasd meg 3D-ben – mi pedig kihímezzük.",
    ctaPrimary: "Tervezd meg a sajátod",
    ctaSecondary: "Nézd meg a ruhákat",
  },
  featuredProductSlug: "classic-polo",
  featuredCategorySlugs: ["polo", "pulover", "ruha"],
  creatorProgram: {
    programName: "Stitch & Share",
    minFollowers: { instagram: 3000, tiktok: 5000, youtube: 2000, facebook: 3000 },
    benefit: "Ingyenes vagy kedvezményes hímzés a választott ruhára, közösségi média megjelenésért cserébe.",
  },
  legalNotice: "Élesítés előtt jogi ellenőrzés szükséges.",
  production: {
    leadTimeDays: { min: 5, max: 10 },
    maxUploadMb: 10,
    acceptedFormats: ["png", "jpg", "jpeg", "webp", "svg"],
  },
} as const;

export type SiteConfig = typeof siteConfig;
