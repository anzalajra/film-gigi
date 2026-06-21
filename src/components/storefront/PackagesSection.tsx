import { Check } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface Package {
  id: number;
  name: string;
  amount: number;
  description: string;
  benefits: string;
}

export default function PackagesSection({ packages }: { packages: Package[] }) {
  if (!packages.length) return null;
  return (
    <section id="paket" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-4 font-medium">Paket Dukungan</p>
        <div className="w-12 h-px bg-[#f5c842] mb-10" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, i) => {
            let benefits: string[] = [];
            try { benefits = JSON.parse(pkg.benefits); } catch {}
            return (
              <div
                key={pkg.id}
                className={`rounded-2xl border p-6 flex flex-col gap-4 ${i === 0 ? "border-[#f5c842]/50 bg-[#f5c842]/5" : "border-white/10 bg-white/2"}`}
              >
                {i === 0 && (
                  <span className="self-start text-xs bg-[#f5c842] text-black px-3 py-1 rounded-full font-semibold">Populer</span>
                )}
                <div>
                  <h3 className="font-bold text-white text-lg">{pkg.name}</h3>
                  <p className="text-[#f5c842] font-semibold text-xl mt-1">{formatRupiah(pkg.amount)}</p>
                </div>
                <p className="text-white/60 text-sm">{pkg.description}</p>
                {benefits.length > 0 && (
                  <ul className="flex flex-col gap-2 mt-auto">
                    {benefits.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2 text-sm text-white/70">
                        <Check size={14} className="text-[#f5c842] mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <a
                  href="#donasi"
                  className="mt-4 block text-center py-2.5 border border-[#f5c842]/40 rounded-xl text-[#f5c842] text-sm hover:bg-[#f5c842] hover:text-black transition-colors font-medium"
                >
                  Pilih Paket
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
