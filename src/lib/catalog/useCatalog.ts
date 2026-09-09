"use client";

import { useEffect, useState } from "react";
import { mockCatalog } from "@/data/mock-catalog";
import type { Catalog } from "./types";
import { loadCatalog } from "./repo";

interface CatalogState {
  catalog: Catalog;
  source: "supabase" | "mock" | "loading";
  loading: boolean;
}

/**
 * Katalógus hook: azonnal a mock adatot adja (statikus prerenderhez),
 * majd kliensen Supabase-ből frissít, ha elérhető.
 */
export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({ catalog: mockCatalog, source: "loading", loading: true });
  useEffect(() => {
    let cancelled = false;
    loadCatalog().then(({ catalog, source }) => {
      if (!cancelled) setState({ catalog, source, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}
