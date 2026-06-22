import { db } from "@/lib/db";
import DonationsClient from "./DonationsClient";
import ConfirmationsClient from "./ConfirmationsClient";
import { PageHeader } from "@/components/admin/ui";

export default async function DonationsPage() {
  const [donations, confirmations] = await Promise.all([
    db.donation.findMany({ orderBy: { donatedAt: "desc" } }),
    db.donationConfirmation.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <PageHeader title="Manajemen Donasi" subtitle="Input dan kelola daftar donatur" />
        <DonationsClient donations={donations} />
      </div>
      <ConfirmationsClient confirmations={confirmations} />
    </div>
  );
}
