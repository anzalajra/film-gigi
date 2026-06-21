import { db } from "@/lib/db";
import PackagesClient from "./PackagesClient";
import { PageHeader } from "@/components/admin/ui";

export default async function PackagesPage() {
  const packages = await db.supportPackage.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6">
      <PageHeader title="Paket Dukungan" subtitle="Kelola tier donasi yang ditampilkan" />
      <PackagesClient packages={packages} />
    </div>
  );
}
