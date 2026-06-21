"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateSiteConfig } from "../actions";
import ImageUpload from "@/components/admin/ImageUpload";

interface Config {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  logoUrl: string;
  synopsis: string;
  videoUrl: string;
  whyImportant: string;
  pdfUrl: string;
}

export default function ContentForm({ config }: { config: Config | null }) {
  const [form, setForm] = useState<Config>({
    heroTitle: config?.heroTitle ?? "",
    heroSubtitle: config?.heroSubtitle ?? "",
    heroImageUrl: config?.heroImageUrl ?? "",
    logoUrl: config?.logoUrl ?? "",
    synopsis: config?.synopsis ?? "",
    videoUrl: config?.videoUrl ?? "",
    whyImportant: config?.whyImportant ?? "",
    pdfUrl: config?.pdfUrl ?? "",
  });
  const [saving, setSaving] = useState(false);

  const field = (key: keyof Config) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteConfig(form);
      toast.success("Konten berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#141414] border border-white/8 rounded-2xl p-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/60 text-sm mb-1.5">Judul Film</label>
          <input {...field("heroTitle")} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842]" />
        </div>
        <div>
          <label className="block text-white/60 text-sm mb-1.5">Subtitle Hero</label>
          <input {...field("heroSubtitle")} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842]" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <ImageUpload
          value={form.heroImageUrl}
          onChange={(url) => setForm((f) => ({ ...f, heroImageUrl: url }))}
          label="Foto Hero"
        />
        <ImageUpload
          value={form.logoUrl}
          onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
          label="Logo"
        />
      </div>

      <div>
        <label className="block text-white/60 text-sm mb-1.5">URL Video (YouTube/Vimeo)</label>
        <input {...field("videoUrl")} placeholder="https://youtu.be/..." className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842] placeholder:text-white/30" />
      </div>

      <div>
        <label className="block text-white/60 text-sm mb-1.5">Sinopsis</label>
        <textarea
          {...field("synopsis")}
          rows={6}
          placeholder="Dukung markdown..."
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842] placeholder:text-white/30 resize-y"
        />
      </div>

      <div>
        <label className="block text-white/60 text-sm mb-1.5">Alasan Film Penting</label>
        <textarea
          {...field("whyImportant")}
          rows={6}
          placeholder="Dukung markdown..."
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842] placeholder:text-white/30 resize-y"
        />
      </div>

      <div>
        <label className="block text-white/60 text-sm mb-1.5">Link PDF Rincian Proyek</label>
        <input {...field("pdfUrl")} placeholder="https://..." className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842] placeholder:text-white/30" />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 bg-[#f5c842] text-black font-semibold rounded-xl hover:bg-[#f5c842]/90 transition-colors text-sm disabled:opacity-50"
      >
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
