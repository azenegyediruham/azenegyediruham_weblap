"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_PATH } from "@/lib/asset-url";

/**
 * GitHub Pages a nem létező útvonalakra a 404.html-t adja vissza.
 * A "szép" URL-eket (/shop/<slug>/, /design/<kód>/) kliensoldalon irányítjuk
 * a query-paraméteres, statikusan létező oldalakra.
 */
export function PrettyUrlRedirect() {
  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname.replace(BASE_PATH, "").replace(/\/+$/, "");
    const product = path.match(/^\/shop\/([^/]+)$/);
    if (product && product[1] !== "product") {
      router.replace(`/shop/product/?slug=${encodeURIComponent(product[1])}`);
      return;
    }
    const design = path.match(/^\/design\/([^/]+)$/);
    if (design) {
      router.replace(`/design/?code=${encodeURIComponent(design[1])}`);
    }
  }, [router]);

  return null;
}
