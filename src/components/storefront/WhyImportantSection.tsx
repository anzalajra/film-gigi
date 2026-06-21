import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function WhyImportantSection({ content }: { content: string }) {
  if (!content) return null;
  return (
    <section id="mengapa" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-4 font-medium">Mengapa Film Ini Penting</p>
        <div className="w-12 h-px bg-[#f5c842] mb-10" />
        <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
