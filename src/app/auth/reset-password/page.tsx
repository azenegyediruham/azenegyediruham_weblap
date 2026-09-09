import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/AuthForms";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Új jelszó" };

export default function Page() {
  return (
    <PageShell eyebrow="Fiók" title="Új jelszó" lead="Adj meg egy új jelszót a fiókodhoz.">
      <div className="max-w-md rounded-2xl border border-line bg-surface p-6">
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </PageShell>
  );
}
