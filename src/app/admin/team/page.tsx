import { db } from "@/lib/db";
import TeamClient from "./TeamClient";

export default async function TeamPage() {
  const team = await db.productionTeam.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6 pt-8 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Tim Produksi</h1>
        <p className="text-white/40 text-sm mt-1">Kelola anggota tim yang ditampilkan</p>
      </div>
      <TeamClient team={team} />
    </div>
  );
}
