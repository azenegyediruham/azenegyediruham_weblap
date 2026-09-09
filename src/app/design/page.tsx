import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { SharedDesignView } from "@/components/account/SharedDesignView";

export const metadata: Metadata = { title: "Megosztott design" };

export default function DesignPage() {
  return (
    <PageShell eyebrow="Megosztott design" title="Design" wide>
      <Suspense fallback={<p className="text-sm text-muted">Betöltés…</p>}>
        <SharedDesignView />
      </Suspense>
    </PageShell>
  );
}
