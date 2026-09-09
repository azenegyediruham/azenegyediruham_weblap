import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "@/concepts/05-future-fashion/styles.css";

const body = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-c05-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-c05-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "05 · Future Fashion",
  description: "Futurisztikus fashion-tech design koncepció – Az én egyedi ruhám",
};

export default function ConceptLayout({ children }: { children: ReactNode }) {
  return <div className={`c05 ${body.variable} ${mono.variable}`}>{children}</div>;
}
