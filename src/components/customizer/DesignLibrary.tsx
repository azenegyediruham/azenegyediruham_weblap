"use client";

import { useState } from "react";
import type { DesignAsset } from "@/lib/catalog/types";
import { asset } from "@/lib/asset-url";
import { sourceFromAsset, type DesignSource } from "@/lib/customizer/upload";

interface Props {
  assets: DesignAsset[];
  onSource: (source: DesignSource) => void;
}

/** Beépített minták (design_assets) – kattintásra forrásként hozzáadva. */
export function DesignLibrary({ assets, onSource }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {assets.map((a) => (
        <button
          key={a.slug}
          type="button"
          disabled={busy === a.slug}
          onClick={async () => {
            setBusy(a.slug);
            try {
              onSource(await sourceFromAsset(a));
            } finally {
              setBusy(null);
            }
          }}
          className="group rounded-xl border border-line bg-surface p-2 transition hover:border-foreground disabled:opacity-50"
          title={a.name}
          aria-label={`${a.name} hozzáadása`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(a.url)} alt="" className="aspect-square w-full object-contain" />
          <span className="mt-1 block truncate text-[11px] text-muted group-hover:text-foreground">{a.name}</span>
        </button>
      ))}
    </div>
  );
}
