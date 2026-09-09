"use client";

import Link from "next/link";
import { DesignOnGarment } from "@/components/garments/DesignOnGarment";
import { useCatalog } from "@/lib/catalog/useCatalog";

export function InspirationGallery() {
  const { catalog } = useCatalog();
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {catalog.gallery.map((g) => {
        const p = catalog.products.find((x) => x.slug === g.productSlug);
        const c = catalog.colors.find((x) => x.slug === g.colorSlug);
        const a = catalog.designAssets.find((x) => x.slug === g.designAssetSlug);
        if (!p || !a) return null;
        return (
          <li key={g.id} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex aspect-[4/5] items-center justify-center rounded-xl bg-background">
              <DesignOnGarment kind={p.silhouette} color={c?.hex ?? "#eee"} designUrl={a.url} position={g.zoneKey as "front_center"} widthCm={g.widthCm} heightCm={g.heightCm} className="h-[86%] w-auto" title={g.title} />
            </div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">{g.title}</h2>
                <p className="text-xs text-muted">
                  {p.name} · {g.widthCm} × {g.heightCm} cm
                </p>
              </div>
              <span className="text-xs text-muted">♥ {g.likes}</span>
            </div>
            <p className="mt-1 text-xs text-muted">{g.description}</p>
            <Link href={`/studio/?product=${p.slug}`} className="mt-3 inline-block text-xs font-medium underline underline-offset-4">
              Ezt használom kiindulásnak →
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
