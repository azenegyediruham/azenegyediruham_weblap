import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "@/concepts/02-streetwear-lab/styles.css";

const display = Archivo_Black({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-c02-display",
  display: "swap",
});

const body = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-c02-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "02 · Streetwear Lab",
  description: "Streetwear lab design koncepció – Az én egyedi ruhám",
};

export default function ConceptLayout({ children }: { children: ReactNode }) {
  return <div className={`c02 ${display.variable} ${body.variable}`}>{children}</div>;
}
