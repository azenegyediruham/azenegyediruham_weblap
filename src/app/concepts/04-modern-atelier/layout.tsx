import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Fraunces } from "next/font/google";
import "@/concepts/04-modern-atelier/styles.css";

const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-c04-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const body = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-c04-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "04 · Modern Atelier",
  description: "Modern atelier design koncepció – Az én egyedi ruhám",
};

export default function ConceptLayout({ children }: { children: ReactNode }) {
  return <div className={`c04 ${display.variable} ${body.variable}`}>{children}</div>;
}
