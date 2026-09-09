import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Syne } from "next/font/google";
import "@/concepts/03-immersive-3d/styles.css";

const display = Syne({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700", "800"],
  variable: "--font-c03-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-c03-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "03 · Immersive 3D",
  description: "Immersive 3D design koncepció – Az én egyedi ruhám",
};

export default function ConceptLayout({ children }: { children: ReactNode }) {
  return <div className={`c03 ${display.variable} ${body.variable}`}>{children}</div>;
}
