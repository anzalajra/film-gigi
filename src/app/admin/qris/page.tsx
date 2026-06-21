import { db } from "@/lib/db";
import QrisForm from "./QrisForm";
import { PageHeader } from "@/components/admin/ui";

export default async function QrisAdminPage() {
  const config = await db.siteConfig.findUnique({ where: { id: 1 } });
  return (
    <div className="space-y-6">
      <PageHeader title="Manajemen QRIS" subtitle="Upload QRIS statis dan atur pengaturan pembayaran" />
      <QrisForm
        qrisString={config?.qrisString ?? ""}
        qrisActive={config?.qrisActive ?? false}
        qrisMinAmount={config?.qrisMinAmount ?? 10000}
      />
    </div>
  );
}
