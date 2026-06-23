import { type CSSProperties } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { Section, Button } from "./ds";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface Props {
  whatsapp: string;
  instagram: string;
  email: string;
}

export default function ContactSection({ whatsapp, instagram, email }: Props) {
  if (!whatsapp && !instagram && !email) return null;

  const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : null;
  const igLink = instagram ? `https://instagram.com/${instagram.replace("@", "")}` : null;

  return (
    <Section id="kontak" eyebrow="Kontak" band center narrow>
      <h2 style={{ font: "var(--type-h2)", color: "var(--ink)", margin: "0 0 var(--space-4)" } as CSSProperties}>
        Ada pertanyaan?
      </h2>
      <p style={{ color: "var(--ink-50)", fontSize: "var(--text-sm)", margin: "0 0 var(--space-10)" }}>
        Hubungi kami lewat salah satu kanal berikut. Kami senang ngobrol.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", justifyContent: "center" }}>
        {waLink && (
          <Button variant="whatsapp" href={waLink} icon={<MessageCircle size={16} />}>
            WhatsApp
          </Button>
        )}
        {igLink && (
          <Button variant="secondary" pill={false} href={igLink} icon={<InstagramIcon />}>
            Instagram
          </Button>
        )}
        {email && (
          <Button variant="secondary" pill={false} href={`mailto:${email}`} icon={<Mail size={16} />}>
            Email
          </Button>
        )}
      </div>
    </Section>
  );
}
