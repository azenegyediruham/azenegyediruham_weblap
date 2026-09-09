import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import "@/concepts/01-premium-minimal/styles.css";

const sans = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-c01-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-c01-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "01 · Premium Minimal",
  description: "Prémium minimál design koncepció – Az én egyedi ruhám",
};

export default function ConceptLayout({ children }: { children: ReactNode }) {
  return <div className={`c01 ${sans.variable} ${serif.variable}`}>{children}</div>;
}
