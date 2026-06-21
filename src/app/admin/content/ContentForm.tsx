"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateSiteConfig } from "../actions";
import ImageUpload from "@/components/admin/ImageUpload";
import { Button, Card, Field, Input, Textarea } from "@/components/admin/ui";

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

  const bind = (key: keyof Config) => ({
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Judul Film">
            <Input {...bind("heroTitle")} />
          </Field>
          <Field label="Subtitle Hero">
            <Input {...bind("heroSubtitle")} />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUpload value={form.heroImageUrl} onChange={(url) => setForm((f) => ({ ...f, heroImageUrl: url }))} label="Foto Hero" />
          <ImageUpload value={form.logoUrl} onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))} label="Logo" />
        </div>

        <Field label="URL Video (YouTube/Vimeo)">
          <Input {...bind("videoUrl")} placeholder="https://youtu.be/..." />
        </Field>
      </Card>

      <Card className="p-6 space-y-5">
        <Field label="Sinopsis" hint="Mendukung format markdown.">
          <Textarea {...bind("synopsis")} rows={6} placeholder="Tulis sinopsis film..." />
        </Field>
        <Field label="Alasan Film Penting" hint="Mendukung format markdown.">
          <Textarea {...bind("whyImportant")} rows={6} placeholder="Kenapa film ini layak didukung..." />
        </Field>
        <Field label="Link PDF Rincian Proyek">
          <Input {...bind("pdfUrl")} placeholder="https://..." />
        </Field>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
