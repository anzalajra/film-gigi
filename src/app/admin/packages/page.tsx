import { db } from "@/lib/db";
import PackagesClient from "./PackagesClient";

export default async function PackagesPage() {
  const packages = await db.supportPackage.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6 pt-8 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Paket Dukungan</h1>
        <p className="text-white/40 text-sm mt-1">Kelola tier donasi yang ditampilkan</p>
      </div>
      <PackagesClient packages={packages} />
    </div>
  );
}
