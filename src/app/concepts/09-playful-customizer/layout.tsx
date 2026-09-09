import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Outfit } from "next/font/google";
import "@/concepts/09-playful-customizer/styles.css";

const font = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-c09",
  display: "swap",
});

export const metadata: Metadata = {
  title: "09 · Playful Customizer",
  description: "Játékos customizer design koncepció – Az én egyedi ruhám",
};

export default function ConceptLayout({ children }: { children: ReactNode }) {
  return <div className={`c09 ${font.variable}`}>{children}</div>;
}
