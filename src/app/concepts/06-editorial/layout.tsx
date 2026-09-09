import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "@/concepts/06-editorial/styles.css";

const serif = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-c06-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-c06-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "06 · Editorial Magazine",
  description: "Editorial magazin design koncepció – Az én egyedi ruhám",
};

export default function ConceptLayout({ children }: { children: ReactNode }) {
  return <div className={`c06 ${serif.variable} ${sans.variable}`}>{children}</div>;
}
