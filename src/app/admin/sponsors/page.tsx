import { db } from "@/lib/db";
import SponsorsClient from "./SponsorsClient";
import { PageHeader } from "@/components/admin/ui";

export default async function SponsorsPage() {
  const sponsors = await db.sponsor.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6">
      <PageHeader title="Manajemen Sponsor" subtitle="Kelola logo dan link sponsor" />
      <SponsorsClient sponsors={sponsors} />
    </div>
  );
}
