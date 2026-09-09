"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { CustomizationZone } from "@/lib/catalog/types";
import { constrainToZone, initialPlacement, type PlacementTransform } from "@/lib/customizer/geometry";
import type { DesignPlacement } from "@/lib/customizer/texture-composer";
import { sourceFromBlob, type DesignSource } from "@/lib/customizer/upload";
import { idbDelete, idbGet, idbSet } from "./idb";

/** Egy elhelyezett design (kép nélkül, perzisztálható). */
export interface StoredPlacement extends PlacementTransform {
  id: string;
  sourceId: string;
  chartKey: string;
  zoneKey: string;
  viewKey: string;
  embroidery: boolean;
}

export interface DesignSessionState {
  productSlug: string | null;
  fitSlug: string | null;
  colorSlug: string | null;
  sizeCode: string | null;
  placements: StoredPlacement[];
  /** forrás metaadatok (a blob IndexedDB-ben) */
  sourceMeta: Record<string, { name: string; mime: string; kind: "upload" | "asset"; assetSlug?: string }>;
  savedDesignCode: string | null;
  updatedAt: number;
}

const EMPTY: DesignSessionState = {
  productSlug: null,
  fitSlug: null,
  colorSlug: null,
  sizeCode: null,
  placements: [],
  sourceMeta: {},
  savedDesignCode: null,
  updatedAt: 0,
};

const STORAGE_KEY = "aer.design-session.v1";

interface DesignSessionApi {
  state: DesignSessionState;
  sources: Record<string, DesignSource>;
  hydrated: boolean;
  selectProduct: (slug: string | null) => void;
  setVariant: (patch: Partial<Pick<DesignSessionState, "fitSlug" | "colorSlug" | "sizeCode">>) => void;
  addSource: (source: DesignSource) => Promise<void>;
  removeSource: (id: string) => void;
  addPlacement: (source: DesignSource, zone: CustomizationZone, chartKey: string) => StoredPlacement;
  updatePlacement: (id: string, patch: Partial<PlacementTransform>, zone: CustomizationZone) => void;
  replacePlacementSource: (id: string, source: DesignSource, zone: CustomizationZone) => void;
  removePlacement: (id: string) => void;
  setEmbroidery: (id: string, on: boolean) => void;
  setSavedDesignCode: (code: string | null) => void;
  reset: () => void;
  /** a 3D/textúra kompozícióhoz képekkel */
  resolvedPlacements: DesignPlacement[];
}

const Ctx = createContext<DesignSessionApi | null>(null);

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function DesignSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DesignSessionState>(EMPTY);
  const [sources, setSources] = useState<Record<string, DesignSource>>({});
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // betöltés localStorage + IndexedDB-ből
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let parsed: DesignSessionState | null = null;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) parsed = { ...EMPTY, ...(JSON.parse(raw) as DesignSessionState) };
      } catch {
        parsed = null;
      }
      const restored: Record<string, DesignSource> = {};
      if (parsed) {
        for (const [id, meta] of Object.entries(parsed.sourceMeta)) {
          if (meta.kind !== "upload") continue;
          const blob = await idbGet<Blob>(`src:${id}`);
          if (blob instanceof Blob) {
            try {
              restored[id] = await sourceFromBlob(id, meta.name, meta.mime, blob);
            } catch {
              /* sérült blob – kihagyjuk */
            }
          }
        }
      }
      if (cancelled) return;
      // csak azok az elhelyezések maradnak, amelyekhez van forrás (asset forrás később töltődik)
      if (parsed) {
        setState(parsed);
      }
      setSources(restored);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // mentés
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota / private mode */
    }
  }, [state, hydrated]);

  const update = useCallback((fn: (s: DesignSessionState) => DesignSessionState) => {
    setState((s) => ({ ...fn(s), updatedAt: Date.now() }));
  }, []);

  const selectProduct = useCallback(
    (slug: string | null) => {
      update((s) => (s.productSlug === slug ? s : { ...s, productSlug: slug, fitSlug: null, colorSlug: null, sizeCode: null, placements: [], savedDesignCode: null }));
    },
    [update],
  );

  const setVariant = useCallback((patch: Partial<Pick<DesignSessionState, "fitSlug" | "colorSlug" | "sizeCode">>) => update((s) => ({ ...s, ...patch })), [update]);

  const addSource = useCallback(
    async (source: DesignSource) => {
      setSources((m) => ({ ...m, [source.id]: source }));
      update((s) => ({ ...s, sourceMeta: { ...s.sourceMeta, [source.id]: { name: source.name, mime: source.mime, kind: source.kind, assetSlug: source.assetSlug } } }));
      if (source.kind === "upload" && source.blob) await idbSet(`src:${source.id}`, source.blob);
    },
    [update],
  );

  const removeSource = useCallback(
    (id: string) => {
      setSources((m) => {
        const next = { ...m };
        delete next[id];
        return next;
      });
      update((s) => {
        const meta = { ...s.sourceMeta };
        delete meta[id];
        return { ...s, sourceMeta: meta, placements: s.placements.filter((p) => p.sourceId !== id) };
      });
      void idbDelete(`src:${id}`);
    },
    [update],
  );

  const addPlacement = useCallback(
    (source: DesignSource, zone: CustomizationZone, chartKey: string) => {
      const aspect = source.widthPx / source.heightPx || 1;
      const t = initialPlacement(zone, aspect);
      const placement: StoredPlacement = { id: newId(), sourceId: source.id, chartKey, zoneKey: zone.key, viewKey: zone.viewKey, embroidery: true, ...t };
      update((s) => ({ ...s, placements: [...s.placements.filter((p) => p.zoneKey !== zone.key), placement] }));
      return placement;
    },
    [update],
  );

  const updatePlacement = useCallback(
    (id: string, patch: Partial<PlacementTransform>, zone: CustomizationZone) => {
      update((s) => ({
        ...s,
        placements: s.placements.map((p) => (p.id === id ? { ...p, ...constrainToZone({ ...p, ...patch }, zone) } : p)),
      }));
    },
    [update],
  );

  const replacePlacementSource = useCallback(
    (id: string, source: DesignSource, zone: CustomizationZone) => {
      const aspect = source.widthPx / source.heightPx || 1;
      update((s) => ({
        ...s,
        placements: s.placements.map((p) => (p.id === id ? { ...p, sourceId: source.id, ...constrainToZone({ ...p, heightCm: p.widthCm / aspect }, zone) } : p)),
      }));
    },
    [update],
  );

  const removePlacement = useCallback((id: string) => update((s) => ({ ...s, placements: s.placements.filter((p) => p.id !== id) })), [update]);
  const setEmbroidery = useCallback((id: string, on: boolean) => update((s) => ({ ...s, placements: s.placements.map((p) => (p.id === id ? { ...p, embroidery: on } : p)) })), [update]);
  const setSavedDesignCode = useCallback((code: string | null) => update((s) => ({ ...s, savedDesignCode: code })), [update]);
  const reset = useCallback(() => {
    for (const id of Object.keys(stateRef.current.sourceMeta)) void idbDelete(`src:${id}`);
    setSources({});
    setState({ ...EMPTY, updatedAt: Date.now() });
  }, []);

  const resolvedPlacements = useMemo<DesignPlacement[]>(
    () =>
      state.placements.map((p) => ({
        id: p.id,
        chartKey: p.chartKey,
        zoneKey: p.zoneKey,
        image: sources[p.sourceId]?.image ?? null,
        xCm: p.xCm,
        yCm: p.yCm,
        widthCm: p.widthCm,
        heightCm: p.heightCm,
        rotationDeg: p.rotationDeg,
        embroidery: p.embroidery,
      })),
    [state.placements, sources],
  );

  const api = useMemo<DesignSessionApi>(
    () => ({ state, sources, hydrated, selectProduct, setVariant, addSource, removeSource, addPlacement, updatePlacement, replacePlacementSource, removePlacement, setEmbroidery, setSavedDesignCode, reset, resolvedPlacements }),
    [state, sources, hydrated, selectProduct, setVariant, addSource, removeSource, addPlacement, updatePlacement, replacePlacementSource, removePlacement, setEmbroidery, setSavedDesignCode, reset, resolvedPlacements],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useDesignSession(): DesignSessionApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDesignSession csak DesignSessionProvider alatt használható");
  return ctx;
}
