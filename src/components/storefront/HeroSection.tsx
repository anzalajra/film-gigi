import Image from "next/image";

interface Props {
  title: string;
  subtitle: string;
  heroImageUrl: string;
}

export default function HeroSection({ title, subtitle, heroImageUrl }: Props) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 overflow-hidden"
    >
      {heroImageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageUrl}
            alt="Hero"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]" />
        </div>
      )}

      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-6 font-medium">
          Crowdfunding · Final Project
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">{subtitle}</p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#donasi"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#f5c842] text-black font-semibold rounded-full hover:bg-[#f5c842]/90 transition-colors text-sm"
          >
            Dukung Sekarang
          </a>
          <a
            href="#synopsis"
            className="inline-flex items-center justify-center px-8 py-3 border border-white/20 text-white rounded-full hover:border-white/40 transition-colors text-sm"
          >
            Pelajari Film
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 z-10">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 10l6 6 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
