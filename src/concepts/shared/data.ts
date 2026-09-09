import { categories, colors, designAssets, gallery, products } from "@/data/mock-catalog";
import type { Product } from "@/lib/catalog/types";

export const STEPS = [
  { n: 1, title: "Válassz ruhát", text: "Póló, pulóver, trikó, nadrág, ruha vagy szoknya. Fazon, szín, méret." },
  { n: 2, title: "Válassz színt és méretet", text: "Kilenc alapszín, XS-től XXL-ig, termékenként saját mérettáblázattal." },
  { n: 3, title: "Töltsd fel a grafikát", text: "PNG, JPG, WebP vagy SVG. Logó, rajz, felirat – ami neked fontos." },
  { n: 4, title: "Helyezd el", text: "Húzd, forgasd, méretezd a megengedett hímzési zónákon belül. Valós centiméterben." },
  { n: 5, title: "Nézd meg 3D-ben", text: "Forgasd meg a ruhát, nézd meg közelről a hímzés textúráját." },
  { n: 6, title: "Rendeld meg", text: "Mentsd el a designt, tedd kosárba, fizess." },
  { n: 7, title: "Mi elkészítjük", text: "Kihímezzük, ellenőrizzük, becsomagoljuk. 5–10 munkanap." },
] as const;

export const BENEFITS = [
  { title: "Hímzés, nem nyomat", text: "Cérna, fény, mélység. Mosás után is ugyanolyan." },
  { title: "Valós méret", text: "A szerkesztő centiméterben mutatja, mekkora lesz a minta." },
  { title: "3D előnézet", text: "Rendelés előtt látod a ruhát minden oldalról." },
  { title: "Egy darabtól", text: "Nincs minimum rendelés. Céges mennyiség is." },
] as const;

export const FAQ_SHORT = [
  { q: "Mennyi idő alatt készül el?", a: "Általában 5–10 munkanap a rendelés visszaigazolásától." },
  { q: "Saját ruhát is küldhetek?", a: "Igen, egyeztetés után a saját ruhádra is hímzünk." },
  { q: "Milyen képet tölthetek fel?", a: "PNG, JPG, WebP vagy SVG, legfeljebb 10 MB." },
  { q: "Mekkora lehet a hímzés?", a: "Zónánként eltér: a mellkason legfeljebb 12 cm, a háton 28 cm széles." },
] as const;

export const featuredProducts: Product[] = products.filter((p) => p.isFeatured);
export const shirtProducts: Product[] = products.filter((p) => p.categorySlug === "polo");

export { categories, colors, designAssets, gallery, products };

export function colorHex(slug: string): string {
  return colors.find((c) => c.slug === slug)?.hex ?? "#F4F2EC";
}

export function colorName(slug: string): string {
  return colors.find((c) => c.slug === slug)?.name ?? slug;
}

export function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function assetUrl(slug: string): string {
  return designAssets.find((a) => a.slug === slug)?.url ?? "";
}
