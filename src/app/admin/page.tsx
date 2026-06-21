import { db } from "@/lib/db";
import { formatRupiah } from "@/lib/utils";
import { Heart, TrendingUp, Users, Target } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";

export default async function AdminDashboard() {
  const [config, donationAgg, donorCount, recentDonations] = await Promise.all([
    db.siteConfig.findUnique({ where: { id: 1 } }),
    db.donation.aggregate({ _sum: { amount: true } }),
    db.donation.count(),
    db.donation.findMany({ orderBy: { donatedAt: "desc" }, take: 5 }),
  ]);

  const totalRaised = donationAgg._sum.amount ?? 0;
  const target = config?.targetAmount ?? 20000000;
  const progress = Math.min(100, Math.round((totalRaised / target) * 100));

  const stats = [
    { label: "Total Terkumpul", value: formatRupiah(totalRaised), icon: TrendingUp, color: "text-[#f5c842]", bg: "bg-[#f5c842]/10" },
    { label: "Jumlah Donatur", value: donorCount.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Target Dana", value: formatRupiah(target), icon: Target, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Progress", value: `${progress}%`, icon: Heart, color: "text-pink-400", bg: "bg-pink-400/10" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" subtitle="Ringkasan crowdfunding Film Gigi" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#141414] border border-white/8 rounded-2xl p-5 transition-colors hover:border-white/15"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} mb-3`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-white/50 text-xs mb-1">{stat.label}</p>
            <p className="text-white font-bold text-xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-3">
          <p className="text-white/60 text-sm font-medium">Progress Dana</p>
          <p className="text-[#f5c842] font-bold">{progress}%</p>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#f5c842]/80 to-[#f5c842] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2.5">
          <p className="text-white/40 text-xs">{formatRupiah(totalRaised)}</p>
          <p className="text-white/40 text-xs">{formatRupiah(target)}</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Donasi Terbaru</h2>
        {recentDonations.length > 0 ? (
          <div className="space-y-1">
            {recentDonations.map((d) => {
              const name = d.isAnonymous ? "Anonim" : d.name;
              return (
                <div
                  key={d.id}
                  className="flex justify-between items-center gap-4 py-2.5 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/50 text-xs font-semibold uppercase">
                      {name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{name}</p>
                      {d.message && (
                        <p className="text-white/40 text-xs truncate max-w-[12rem] sm:max-w-xs">{d.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[#f5c842] text-sm font-medium whitespace-nowrap">{formatRupiah(d.amount)}</p>
                    <p className="text-white/30 text-xs">
                      {new Date(d.donatedAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-white/30 text-sm py-6 text-center">Belum ada donasi tercatat</p>
        )}
      </div>
    </div>
  );
}
