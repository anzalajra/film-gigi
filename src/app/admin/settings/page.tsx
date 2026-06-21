import { db } from "@/lib/db";
import SettingsForm from "./SettingsForm";
import { PageHeader } from "@/components/admin/ui";

export default async function SettingsPage() {
  const config = await db.siteConfig.findUnique({ where: { id: 1 } });
  return (
    <div className="space-y-6">
      <PageHeader title="Pengaturan" subtitle="Target dana, info kontak, dan link lainnya" />
      <SettingsForm config={config} />
    </div>
  );
}
