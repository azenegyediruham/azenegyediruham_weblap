import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { ADMIN_RESOURCES, getResource } from "@/lib/admin/resources";

export const dynamicParams = false;

export function generateStaticParams() {
  return ADMIN_RESOURCES.map((r) => ({ resource: r.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ resource: string }> }): Promise<Metadata> {
  const { resource } = await params;
  return { title: `Admin · ${getResource(resource)?.title ?? resource}` };
}

export default async function AdminResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const def = getResource(resource);
  if (!def) notFound();
  return (
    <PageShell eyebrow="Admin" wide>
      <AdminShell active={def.key}>
        <ResourceManager resource={def} />
      </AdminShell>
    </PageShell>
  );
}
