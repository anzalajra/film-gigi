import Image from "next/image";
import { Quote } from "lucide-react";

interface Props {
  sectionId: string;
  label: string;
  name?: string;
  imageUrl: string;
  quote: string;
  reverse?: boolean;
  dark?: boolean;
}

export default function StatementSection({
  sectionId,
  label,
  name,
  imageUrl,
  quote,
  reverse,
  dark,
}: Props) {
  if (!imageUrl && !quote) return null;

  return (
    <section id={sectionId} className={`py-24 px-4 ${dark ? "bg-[#0f0f0f]" : ""}`}>
      <div className="max-w-4xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-4 font-medium">{label}</p>
        <div className="w-12 h-px bg-[#f5c842] mb-10" />

        <div
          className={`flex flex-col gap-8 md:gap-12 items-center ${
            reverse ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          {imageUrl && (
            <div className="shrink-0">
              <Image
                src={imageUrl}
                alt={name || label}
                width={320}
                height={400}
                className="w-56 md:w-64 h-auto rounded-2xl object-cover border border-white/10"
              />
            </div>
          )}

          {quote && (
            <div className="flex-1">
              <Quote size={32} className="text-[#f5c842]/40 mb-4" />
              <blockquote className="text-xl md:text-2xl text-white/85 font-light leading-relaxed italic whitespace-pre-line">
                {quote}
              </blockquote>
              {name && <p className="mt-6 text-[#f5c842] font-semibold">{name}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
