"use client";

import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { useAuth } from "@/lib/auth/AuthProvider";

export function CartBadge() {
  const cart = useCart();
  return (
    <Link href="/cart/" className="rounded-full border border-line px-3 py-1.5 transition hover:border-foreground">
      Kosár{cart.hydrated && cart.count > 0 ? ` · ${cart.count}` : ""}
    </Link>
  );
}

export function ProfileLink() {
  const auth = useAuth();
  const label = auth.user ? (auth.profile?.display_name || "Profil") : "Belépés";
  return (
    <Link href={auth.user ? "/profile/" : "/auth/login/"} className="rounded-full bg-accent px-3 py-1.5 text-accent-foreground transition hover:opacity-90">
      {label}
    </Link>
  );
}
