import { formatRupiah } from "@/lib/utils";
import { Heart } from "lucide-react";

interface Donor {
  id: number;
  name: string;
  amount: number;
  message?: string | null;
  isAnonymous: boolean;
  showAmount: boolean;
  donatedAt: Date;
}

export default function DonorsSection({ donors }: { donors: Donor[] }) {
  if (!donors.length) return null;
  return (
    <section id="donatur" className="py-24 px-4 bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-4 font-medium">Para Pendukung</p>
        <div className="w-12 h-px bg-[#f5c842] mb-10" />
        <div className="grid sm:grid-cols-2 gap-4">
          {donors.map((donor) => (
            <div key={donor.id} className="flex gap-4 p-4 rounded-xl border border-white/8 bg-white/2 hover:border-white/15 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#f5c842]/10 flex items-center justify-center shrink-0">
                <Heart size={16} className="text-[#f5c842]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className="font-semibold text-white text-sm truncate">
                    {donor.isAnonymous ? "Anonim" : donor.name}
                  </p>
                  {donor.showAmount && (
                    <p className="text-[#f5c842] text-sm font-medium shrink-0">{formatRupiah(donor.amount)}</p>
                  )}
                </div>
                {donor.message && (
                  <p className="text-white/50 text-xs mt-1 line-clamp-2">{donor.message}</p>
                )}
                <p className="text-white/30 text-xs mt-1">
                  {new Date(donor.donatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
