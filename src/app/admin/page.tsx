import { db } from "@/lib/db";
import { formatRupiah } from "@/lib/utils";
import { Heart, TrendingUp, Users, Target } from "lucide-react";

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
    { label: "Total Terkumpul", value: formatRupiah(totalRaised), icon: TrendingUp, color: "text-[#f5c842]" },
    { label: "Jumlah Donatur", value: donorCount.toString(), icon: Users, color: "text-blue-400" },
    { label: "Target Dana", value: formatRupiah(target), icon: Target, color: "text-green-400" },
    { label: "Progress", value: `${progress}%`, icon: Heart, color: "text-pink-400" },
  ];

  return (
    <div className="space-y-8 pt-8 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Ringkasan crowdfunding Film Gigi</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#141414] border border-white/8 rounded-2xl p-5">
            <stat.icon size={20} className={`${stat.color} mb-3`} />
            <p className="text-white/50 text-xs mb-1">{stat.label}</p>
            <p className="text-white font-bold text-xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#141414] border border-white/8 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-white/60 text-sm">Progress Dana</p>
          <p className="text-[#f5c842] font-bold">{progress}%</p>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="h-full bg-[#f5c842] rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-white/40 text-xs">{formatRupiah(totalRaised)}</p>
          <p className="text-white/40 text-xs">{formatRupiah(target)}</p>
        </div>
      </div>

      {recentDonations.length > 0 && (
        <div className="bg-[#141414] border border-white/8 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Donasi Terbaru</h2>
          <div className="space-y-3">
            {recentDonations.map((d) => (
              <div key={d.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{d.isAnonymous ? "Anonim" : d.name}</p>
                  {d.message && <p className="text-white/40 text-xs truncate max-w-xs">{d.message}</p>}
                </div>
                <div className="text-right">
                  <p className="text-[#f5c842] text-sm font-medium">{formatRupiah(d.amount)}</p>
                  <p className="text-white/30 text-xs">
                    {new Date(d.donatedAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
