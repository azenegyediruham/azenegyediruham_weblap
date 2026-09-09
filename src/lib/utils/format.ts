const hufFormatter = new Intl.NumberFormat("hu-HU", {
  style: "currency",
  currency: "HUF",
  maximumFractionDigits: 0,
});

export function formatHuf(amount: number): string {
  return hufFormatter.format(amount);
}

export function formatCm(value: number, digits = 1): string {
  return `${value.toFixed(digits).replace(".", ",")} cm`;
}

export function formatSizeCm(widthCm: number, heightCm: number): string {
  return `${widthCm.toFixed(1).replace(".", ",")} × ${heightCm.toFixed(1).replace(".", ",")} cm`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
