import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageUrl?: string | null;
}

export default function ProductionTeamSection({ team }: { team: TeamMember[] }) {
  if (!team.length) return null;
  return (
    <section id="tim" className="py-24 px-4 bg-[#0f0f0f]">
      <div className="max-w-5xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-4 font-medium">Tim Produksi</p>
        <div className="w-12 h-px bg-[#f5c842] mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.id} className="flex flex-col items-center text-center gap-3">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white/5 border border-white/10">
                {member.imageUrl ? (
                  <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/30">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{member.name}</p>
                <p className="text-white/50 text-xs">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
