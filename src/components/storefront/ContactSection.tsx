import { Mail, MessageCircle } from "lucide-react";

interface Props {
  whatsapp: string;
  instagram: string;
  email: string;
}

export default function ContactSection({ whatsapp, instagram, email }: Props) {
  const hasAny = whatsapp || instagram || email;
  if (!hasAny) return null;

  const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : null;
  const igLink = instagram ? `https://instagram.com/${instagram.replace("@", "")}` : null;

  return (
    <section id="kontak" className="py-24 px-4 bg-[#0f0f0f]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-4 font-medium">Kontak</p>
        <div className="w-12 h-px bg-[#f5c842] mb-10 mx-auto" />
        <h2 className="text-2xl font-bold text-white mb-4">Ada pertanyaan?</h2>
        <p className="text-white/50 text-sm mb-10">Hubungi kami melalui salah satu platform berikut.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors text-sm font-medium"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          )}
          {igLink && (
            <a
              href={igLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/15 text-white rounded-xl hover:border-white/30 transition-colors text-sm font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              Instagram
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/15 text-white rounded-xl hover:border-white/30 transition-colors text-sm font-medium"
            >
              <Mail size={16} />
              Email
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
