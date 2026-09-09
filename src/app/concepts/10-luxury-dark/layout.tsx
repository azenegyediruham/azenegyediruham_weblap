import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "@/concepts/10-luxury-dark/styles.css";

const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-c10-serif",
  display: "swap",
});

const sans = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-c10-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "10 · Luxury Dark",
  description: "Prémium sötét design koncepció – Az én egyedi ruhám",
};

export default function ConceptLayout({ children }: { children: ReactNode }) {
  return <div className={`c10 ${serif.variable} ${sans.variable}`}>{children}</div>;
}
