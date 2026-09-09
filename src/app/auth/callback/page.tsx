import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCallback } from "@/components/auth/AuthForms";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Bejelentkezés" };

export default function Page() {
  return (
    <PageShell eyebrow="Fiók" title="Bejelentkezés" lead="Egy pillanat, feldolgozzuk a linket.">
      <div className="max-w-md rounded-2xl border border-line bg-surface p-6">
        <Suspense fallback={null}>
          <AuthCallback />
        </Suspense>
      </div>
    </PageShell>
  );
}
