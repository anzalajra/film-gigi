import { FileText } from "lucide-react";
import { uploadFileUrl } from "@/lib/utils";

export default function PdfLinkSection({ pdfUrl }: { pdfUrl: string }) {
  if (!pdfUrl) return null;

  const viewerUrl = uploadFileUrl(pdfUrl);
  const downloadUrl = uploadFileUrl(pdfUrl, { download: true });

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10 rounded-2xl p-6">
          <div>
            <p className="font-semibold text-white mb-1">Rincian Proyek Film</p>
            <p className="text-white/50 text-sm">Lihat atau unduh proposal lengkap untuk detail anggaran dan timeline produksi.</p>
          </div>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-xl text-white text-sm hover:border-[#f5c842] hover:text-[#f5c842] transition-colors whitespace-nowrap"
          >
            <FileText size={16} />
            Unduh PDF
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
          <iframe
            src={`${viewerUrl}#view=FitH`}
            title="Rincian Proyek Film"
            className="w-full h-[60vh] sm:h-[80vh]"
          />
        </div>
      </div>
    </section>
  );
}
