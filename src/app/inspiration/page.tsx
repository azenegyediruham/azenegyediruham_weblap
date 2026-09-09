import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { InspirationGallery } from "@/components/shop/InspirationGallery";

export const metadata: Metadata = {
  title: "Inspiráció",
  description: "Elkészült hímzett ruhák és minták – inspiráció a saját designodhoz.",
};

export default function InspirationPage() {
  return (
    <PageShell wide eyebrow="Inspiráció" title="Elkészült darabok" lead="Valódi elhelyezések, valódi méretek. Bármelyiket használhatod kiindulásnak: a Studióban ugyanaz a ruha és zóna nyílik meg. Később: közösségi galéria, like, saját design megosztása.">
      <InspirationGallery />
    </PageShell>
  );
}
