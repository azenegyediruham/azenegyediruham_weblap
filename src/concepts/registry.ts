export interface ConceptMeta {
  number: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  palette: [string, string, string, string];
  fonts: string;
  mood: string;
  threeD: string;
}

export const concepts: ConceptMeta[] = [
  {
    number: "01",
    slug: "01-premium-minimal",
    name: "Premium Minimal",
    tagline: "Kevés elem, sok levegő, precíz tipográfia.",
    description:
      "High-fashion minimalizmus: törtfehér felületek, nagy betűk, 3D póló mint hero. Apple-szerű precizitás, elegáns átmenetek.",
    palette: ["#F4F2EC", "#111111", "#8A8A83", "#D9D5CB"],
    fonts: "Inter Tight + Instrument Serif",
    mood: "prémium, nyugodt, letisztult",
    threeD: "hero elem",
  },
  {
    number: "02",
    slug: "02-streetwear-lab",
    name: "Streetwear Lab",
    tagline: "Kreatív ruhalabor, matricák, moduláris grid.",
    description:
      "Fiatalos streetwear: erős kontraszt, sav-sárga akcent, egymásra csúszó modulok, címkék és matricák, dinamikus headline-ok.",
    palette: ["#0F0F0F", "#E8FF3A", "#FFFFFF", "#7C7C7C"],
    fonts: "Archivo Black + Space Grotesk",
    mood: "energikus, játékos, urban",
    threeD: "kiegészítő",
  },
  {
    number: "03",
    slug: "03-immersive-3d",
    name: "Immersive 3D",
    tagline: "A póló a főszereplő, a scroll a rendező.",
    description:
      "Fullscreen 3D hero, scroll-vezérelt kamera: forgás, közelítés, háttérváltás, a hímzés megjelenése. Cinematic storytelling.",
    palette: ["#0B0C10", "#1C2333", "#E6E1D6", "#C9A66B"],
    fonts: "Syne + Inter",
    mood: "filmszerű, magával ragadó",
    threeD: "főszereplő",
  },
  {
    number: "04",
    slug: "04-modern-atelier",
    name: "Modern Atelier",
    tagline: "Szabóság és hímzőműhely, modern kézműves hangulat.",
    description:
      "Meleg tónusok, textilközelik, cérna és szabásminta motívumok, varratok. Modern butik és műhely kombinációja, vintage nélkül.",
    palette: ["#F3EBDD", "#B5533C", "#2E2A26", "#D9B99B"],
    fonts: "Fraunces + DM Sans",
    mood: "meleg, kézműves, prémium",
    threeD: "kiegészítő",
  },
  {
    number: "05",
    slug: "05-future-fashion",
    name: "Future Fashion",
    tagline: "Fashion-tech: sötét színpad, precíz fény, finom glow.",
    description:
      "Grafit háttér, fényrig a 3D modell körül, holografikus jellegű, visszafogott akcentek, HUD-szerű specifikációk. Nem gamer, hanem prémium technológia.",
    palette: ["#0E1014", "#E9ECF1", "#8F7CFF", "#2A2F3A"],
    fonts: "Manrope + IBM Plex Mono",
    mood: "futurisztikus, precíz, prémium",
    threeD: "színpad",
  },
  {
    number: "06",
    slug: "06-editorial",
    name: "Editorial Magazine",
    tagline: "Divatmagazin tördelés, lookbook storytelling.",
    description:
      "Vogue-szerű editorial: masthead, aszimmetrikus grid, serif + sans kombináció, pull quote-ok, számozott lookbook szekciók, hosszú vertikális történet.",
    palette: ["#FFFFFF", "#151515", "#B23A3A", "#E8E4DC"],
    fonts: "Playfair Display + Inter",
    mood: "elegáns, editorial, narratív",
    threeD: "kiegészítő",
  },
  {
    number: "07",
    slug: "07-color-block",
    name: "Bold Color Block",
    tagline: "Nagy színfelületek, kategóriánként más háttér.",
    description:
      "Erős színblokkok, scrollra váltó teljes háttérszín, óriás betűk, vízszintes termékszalag. Minden kategóriának saját színe.",
    palette: ["#F2C230", "#E04E39", "#2F6BFF", "#111111"],
    fonts: "Unbounded + Bricolage Grotesque",
    mood: "merész, vidám, kontrasztos",
    threeD: "kiegészítő",
  },
  {
    number: "08",
    slug: "08-industrial",
    name: "Raw Industrial",
    tagline: "Gyártóműhely, spec-lapok, technikai címkék.",
    description:
      "Nyers grid, monospaced kiegészítő tipográfia, gyártási számok, méretvonalzók, varrási információk, a gyártási folyamat mint vizuális elem. Fashion marad.",
    palette: ["#EDEDEA", "#1A1A1A", "#FF5A1F", "#B8B8B2"],
    fonts: "IBM Plex Mono + IBM Plex Sans",
    mood: "technikai, őszinte, strukturált",
    threeD: "kiegészítő",
  },
  {
    number: "09",
    slug: "09-playful-customizer",
    name: "Playful Customizer",
    tagline: "Azonnal tervezhetsz: a hero maga a szerkesztő.",
    description:
      "Barátságos, színes, intuitív. Színválasztó, „Add your design” drag-and-drop demo és 3D váltó rögtön a hero szekcióban, rugós microinteractionökkel.",
    palette: ["#FFF7E8", "#FF6B4A", "#2BB3A3", "#1F1F1F"],
    fonts: "Outfit",
    mood: "játékos, barátságos, interaktív",
    threeD: "customizer",
  },
  {
    number: "10",
    slug: "10-luxury-dark",
    name: "Luxury Dark",
    tagline: "Charcoal, krém, egy csepp bronz. Filmszerű fény.",
    description:
      "Prémium sötét design nagy 3D modellel, rim-fénnyel, lassú elegáns átmenetekkel és minimális UI-jal. Luxus ruhamárka érzés, gamer esztétika nélkül.",
    palette: ["#141414", "#232323", "#EDE6D8", "#A8865A"],
    fonts: "Cormorant Garamond + Montserrat",
    mood: "luxus, sötét, elegáns",
    threeD: "hero elem",
  },
];

export function getConcept(slug: string): ConceptMeta | undefined {
  return concepts.find((c) => c.slug === slug);
}
