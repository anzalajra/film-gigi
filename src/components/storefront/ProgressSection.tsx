import { formatRupiah } from "@/lib/utils";

interface Props {
  totalRaised: number;
  target: number;
}

export default function ProgressSection({ totalRaised, target }: Props) {
  const percentage = Math.min(100, Math.round((totalRaised / target) * 100));

  return (
    <section id="progress" className="py-24 px-4 bg-[#0f0f0f]">
      <div className="max-w-3xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-4 font-medium">Progress Dana</p>
        <div className="w-12 h-px bg-[#f5c842] mb-10" />

        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-3xl font-bold text-white">{formatRupiah(totalRaised)}</p>
            <p className="text-white/50 text-sm">terkumpul dari {formatRupiah(target)}</p>
          </div>
          <p className="text-4xl font-bold text-[#f5c842]">{percentage}%</p>
        </div>

        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#f5c842] to-[#f59e0b] rounded-full transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </section>
  );
}
