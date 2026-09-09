"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { StoredPlacement } from "./design-session";

export interface CartDesignSnapshot {
  placements: StoredPlacement[];
  sourceMeta: Record<string, { name: string; mime: string; kind: "upload" | "asset"; assetSlug?: string }>;
  savedDesignCode: string | null;
  previewDataUrl?: string | null;
  embroideryTotalHuf: number;
}

export interface CartItem {
  id: string;
  productSlug: string;
  productName: string;
  silhouette: string;
  fitSlug: string;
  colorSlug: string;
  colorHex: string;
  sizeCode: string;
  quantity: number;
  /** ruha + hímzés egységára */
  unitPriceHuf: number;
  garmentPriceHuf: number;
  design: CartDesignSnapshot | null;
  addedAt: number;
}

interface CartApi {
  items: CartItem[];
  hydrated: boolean;
  count: number;
  subtotalHuf: number;
  add: (item: Omit<CartItem, "id" | "addedAt">) => string;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "aer.cart.v1";
const Ctx = createContext<CartApi | null>(null);

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw) as CartItem[]);
      } catch {
        /* üres kosár */
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* quota */
    }
  }, [items, hydrated]);

  const add = useCallback((item: Omit<CartItem, "id" | "addedAt">) => {
    const id = newId();
    setItems((list) => [...list, { ...item, id, addedAt: Date.now() }]);
    return id;
  }, []);
  const remove = useCallback((id: string) => setItems((list) => list.filter((i) => i.id !== id)), []);
  const setQuantity = useCallback((id: string, quantity: number) => setItems((list) => list.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(500, Math.floor(quantity))) } : i))), []);
  const clear = useCallback(() => setItems([]), []);

  const api = useMemo<CartApi>(
    () => ({
      items,
      hydrated,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotalHuf: items.reduce((n, i) => n + i.quantity * i.unitPriceHuf, 0),
      add,
      remove,
      setQuantity,
      clear,
    }),
    [items, hydrated, add, remove, setQuantity, clear],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart csak CartProvider alatt használható");
  return ctx;
}
