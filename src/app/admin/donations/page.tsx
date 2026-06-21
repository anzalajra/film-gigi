import { db } from "@/lib/db";
import DonationsClient from "./DonationsClient";

export default async function DonationsPage() {
  const donations = await db.donation.findMany({ orderBy: { donatedAt: "desc" } });
  return (
    <div className="space-y-6 pt-8 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Manajemen Donasi</h1>
        <p className="text-white/40 text-sm mt-1">Input dan kelola daftar donatur</p>
      </div>
      <DonationsClient donations={donations} />
    </div>
  );
}
