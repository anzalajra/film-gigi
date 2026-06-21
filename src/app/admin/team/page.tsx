import { db } from "@/lib/db";
import TeamClient from "./TeamClient";
import { PageHeader } from "@/components/admin/ui";

export default async function TeamPage() {
  const team = await db.productionTeam.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6">
      <PageHeader title="Tim Produksi" subtitle="Kelola anggota tim yang ditampilkan" />
      <TeamClient team={team} />
    </div>
  );
}
