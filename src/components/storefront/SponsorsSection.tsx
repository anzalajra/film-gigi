import Image from "next/image";

interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  website?: string | null;
}

export default function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  if (!sponsors.length) return null;
  return (
    <section id="sponsor" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-4 font-medium">Sponsor</p>
        <div className="w-12 h-px bg-[#f5c842] mb-10" />
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id}>
              {sponsor.website ? (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block opacity-60 hover:opacity-100 transition-opacity"
                  title={sponsor.name}
                >
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    width={140}
                    height={60}
                    className="h-12 w-auto object-contain filter brightness-0 invert"
                  />
                </a>
              ) : (
                <div className="opacity-60">
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    width={140}
                    height={60}
                    className="h-12 w-auto object-contain filter brightness-0 invert"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
