import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/AuthForms";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Regisztráció" };

export default function Page() {
  return (
    <PageShell eyebrow="Fiók" title="Regisztráció" lead="Fiókkal elmentheted a designjaidat és követheted a rendeléseidet.">
      <div className="max-w-md rounded-2xl border border-line bg-surface p-6">
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </div>
    </PageShell>
  );
}
