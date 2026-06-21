import { db } from "@/lib/db";
import SponsorsClient from "./SponsorsClient";

export default async function SponsorsPage() {
  const sponsors = await db.sponsor.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6 pt-8 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Manajemen Sponsor</h1>
        <p className="text-white/40 text-sm mt-1">Kelola logo dan link sponsor</p>
      </div>
      <SponsorsClient sponsors={sponsors} />
    </div>
  );
}
