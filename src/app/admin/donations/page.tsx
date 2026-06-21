import { db } from "@/lib/db";
import DonationsClient from "./DonationsClient";
import { PageHeader } from "@/components/admin/ui";

export default async function DonationsPage() {
  const donations = await db.donation.findMany({ orderBy: { donatedAt: "desc" } });
  return (
    <div className="space-y-6">
      <PageHeader title="Manajemen Donasi" subtitle="Input dan kelola daftar donatur" />
      <DonationsClient donations={donations} />
    </div>
  );
}
