import { Download } from "lucide-react";
import { uploadFileUrl } from "@/lib/utils";
import { Section, Button } from "./ds";

export default function PdfLinkSection({ pdfUrl }: { pdfUrl: string }) {
  if (!pdfUrl) return null;

  const viewerUrl = uploadFileUrl(pdfUrl);
  const downloadUrl = uploadFileUrl(pdfUrl, { download: true });

  return (
    <Section id="proposal" eyebrow="Proposal Film Gigi" narrow center>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-5)",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p style={{ color: "var(--ink-60)", fontSize: "var(--text-sm)", margin: 0, textAlign: "left" }}>
          Lihat ringkasan proposal kami — detail anggaran dan timeline produksi.
        </p>
        <Button variant="ghostGold" size="sm" pill={false} href={downloadUrl} icon={<Download size={14} />}>
          Unduh PDF
        </Button>
      </div>

      <div
        style={{
          borderRadius: "var(--radius-2xl)",
          overflow: "hidden",
          border: "1px solid var(--line)",
          background: "var(--fg-card-soft)",
        }}
      >
        <iframe
          src={`${viewerUrl}#view=FitH`}
          title="Proposal Film Gigi"
          style={{ width: "100%", height: "70vh", border: 0, display: "block" }}
        />
      </div>
    </Section>
  );
}
