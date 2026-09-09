"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { CartProvider } from "@/lib/store/cart";
import { DesignSessionProvider } from "@/lib/store/design-session";
import { SiteSettingsProvider } from "@/lib/settings/SiteSettingsProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <CartProvider>
          <DesignSessionProvider>{children}</DesignSessionProvider>
        </CartProvider>
      </SiteSettingsProvider>
    </AuthProvider>
  );
}
