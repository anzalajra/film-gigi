import { FileText } from "lucide-react";

export default function PdfLinkSection({ pdfUrl }: { pdfUrl: string }) {
  if (!pdfUrl) return null;
  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10 rounded-2xl p-6">
        <div>
          <p className="font-semibold text-white mb-1">Rincian Proyek Film</p>
          <p className="text-white/50 text-sm">Unduh proposal lengkap untuk detail anggaran dan timeline produksi.</p>
        </div>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-xl text-white text-sm hover:border-[#f5c842] hover:text-[#f5c842] transition-colors whitespace-nowrap"
        >
          <FileText size={16} />
          Unduh PDF
        </a>
      </div>
    </section>
  );
}
