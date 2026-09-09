import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Unbounded } from "next/font/google";
import "@/concepts/07-color-block/styles.css";

const display = Unbounded({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700", "900"],
  variable: "--font-c07-display",
  display: "swap",
});

const body = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-c07-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "07 · Bold Color Block",
  description: "Színblokkos design koncepció – Az én egyedi ruhám",
};

export default function ConceptLayout({ children }: { children: ReactNode }) {
  return <div className={`c07 ${display.variable} ${body.variable}`}>{children}</div>;
}
