import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactDetails } from "@/components/forms/ContactDetails";

export const metadata: Metadata = {
  title: "Kapcsolat",
  description: "Írj nekünk céges rendelés, saját ruha vagy bármilyen kérdés kapcsán.",
};

export default function ContactPage() {
  return (
    <PageShell eyebrow="Kapcsolat" title="Írj nekünk" lead="Céges rendelés, saját ruha hímzése, kérdés a mintádról – 1 munkanapon belül válaszolunk." wide>
      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <ContactDetails />
        <div className="rounded-2xl border border-line bg-surface p-6">
          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}
