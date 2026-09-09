import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/AuthForms";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Belépés" };

export default function Page() {
  return (
    <PageShell eyebrow="Fiók" title="Belépés" lead="Lépj be a profilodhoz, mentett designjaidhoz és rendeléseidhez.">
      <div className="max-w-md rounded-2xl border border-line bg-surface p-6">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </PageShell>
  );
}
