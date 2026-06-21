import { db } from "@/lib/db";
import QrisForm from "./QrisForm";

export default async function QrisAdminPage() {
  const config = await db.siteConfig.findUnique({ where: { id: 1 } });
  return (
    <div className="space-y-6 pt-8 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Manajemen QRIS</h1>
        <p className="text-white/40 text-sm mt-1">Upload QRIS statis dan atur pengaturan pembayaran</p>
      </div>
      <QrisForm
        qrisString={config?.qrisString ?? ""}
        qrisActive={config?.qrisActive ?? false}
        qrisMinAmount={config?.qrisMinAmount ?? 10000}
      />
    </div>
  );
}
