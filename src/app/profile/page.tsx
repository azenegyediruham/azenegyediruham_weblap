import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ProfileView } from "@/components/account/ProfileView";

export const metadata: Metadata = { title: "Profil" };

export default function ProfilePage() {
  return (
    <PageShell eyebrow="Fiók" title="Profilom" wide>
      <ProfileView />
    </PageShell>
  );
}
