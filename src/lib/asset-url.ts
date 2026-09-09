/**
 * A GitHub Pages subpath (basePath) miatt minden olyan hivatkozást,
 * amit a Next nem ír át automatikusan (GLB modellek, public/ képek,
 * fetch-elt JSON, next/image src), ezzel a helperrel kell prefixelni.
 */
export const BASE_PATH: string = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const ABSOLUTE = /^(?:[a-z]+:)?\/\//i;

export function asset(path: string): string {
  if (!path) return path;
  if (ABSOLUTE.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (BASE_PATH && normalized.startsWith(`${BASE_PATH}/`)) return normalized;
  return `${BASE_PATH}${normalized}`;
}

/** Abszolút site URL (email redirect, megosztás). Záró perjel nélkül. */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  if (typeof window !== "undefined") return `${window.location.origin}${BASE_PATH}`;
  return `http://localhost:3000${BASE_PATH}`;
}
