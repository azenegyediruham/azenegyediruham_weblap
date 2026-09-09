import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <PageShell eyebrow="Admin" title="Áttekintés" wide>
      <AdminShell>
        <AdminDashboard />
      </AdminShell>
    </PageShell>
  );
}
