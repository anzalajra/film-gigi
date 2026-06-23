"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { updateSiteConfig } from "../actions";
import ImageUpload from "@/components/admin/ImageUpload";
import PdfUpload from "@/components/admin/PdfUpload";
import { Button, Card, Field, Input, Textarea, Label } from "@/components/admin/ui";

interface WhyPoint {
  icon: string;
  title: string;
  text: string;
}

interface Config {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  logoUrl: string;
  synopsis: string;
  videoUrl: string;
  videoThumb: string;
  whyImportant: string;
  whyPoints: string;
  parallaxImage: string;
  parallaxQuote: string;
  parallaxAttr: string;
  donateParallax: string;
  pdfUrl: string;
  producerName: string;
  producerImageUrl: string;
  producerQuote: string;
  directorName: string;
  directorImageUrl: string;
  directorQuote: string;
}

const ICON_OPTIONS = [
  { value: "users", label: "👥 Untuk anak muda (users)" },
  { value: "sparkles", label: "✨ Diputar gratis (sparkles)" },
  { value: "heart", label: "❤ Karya lokal (heart)" },
  { value: "message", label: "💬 Membuka obrolan (message)" },
];

function parsePoints(raw: string): WhyPoint[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((p) => ({
        icon: typeof p?.icon === "string" ? p.icon : "sparkles",
        title: typeof p?.title === "string" ? p.title : "",
        text: typeof p?.text === "string" ? p.text : "",
      }));
    }
  } catch {}
  return [];
}

export default function ContentForm({ config }: { config: Config | null }) {
  const [form, setForm] = useState<Config>({
    heroEyebrow: config?.heroEyebrow ?? "Crowdfunding · Final Project",
    heroTitle: config?.heroTitle ?? "",
    heroSubtitle: config?.heroSubtitle ?? "",
    heroImageUrl: config?.heroImageUrl ?? "",
    logoUrl: config?.logoUrl ?? "",
    synopsis: config?.synopsis ?? "",
    videoUrl: config?.videoUrl ?? "",
    videoThumb: config?.videoThumb ?? "",
    whyImportant: config?.whyImportant ?? "",
    whyPoints: config?.whyPoints ?? "[]",
    parallaxImage: config?.parallaxImage ?? "",
    parallaxQuote: config?.parallaxQuote ?? "",
    parallaxAttr: config?.parallaxAttr ?? "",
    donateParallax: config?.donateParallax ?? "",
    pdfUrl: config?.pdfUrl ?? "",
    producerName: config?.producerName ?? "",
    producerImageUrl: config?.producerImageUrl ?? "",
    producerQuote: config?.producerQuote ?? "",
    directorName: config?.directorName ?? "",
    directorImageUrl: config?.directorImageUrl ?? "",
    directorQuote: config?.directorQuote ?? "",
  });
  const [points, setPoints] = useState<WhyPoint[]>(parsePoints(config?.whyPoints ?? "[]"));
  const [saving, setSaving] = useState(false);

  const bind = (key: keyof Config) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const setImg = (key: keyof Config) => (url: string) => setForm((f) => ({ ...f, [key]: url }));

  const addPoint = () => setPoints((p) => [...p, { icon: "sparkles", title: "", text: "" }]);
  const removePoint = (i: number) => setPoints((p) => p.filter((_, idx) => idx !== i));
  const updatePoint = (i: number, patch: Partial<WhyPoint>) =>
    setPoints((p) => p.map((pt, idx) => (idx === i ? { ...pt, ...patch } : pt)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanPoints = points.filter((p) => p.title.trim() || p.text.trim());
      await updateSiteConfig({ ...form, whyPoints: JSON.stringify(cleanPoints) });
      toast.success("Konten berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const selectClass =
    "w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842]/70";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Hero ─────────────────────────────────────────── */}
      <Card className="p-6 space-y-5">
        <div>
          <h3 className="text-white font-semibold text-sm">Hero (Bagian Atas)</h3>
          <p className="text-white/40 text-xs mt-0.5">Logo film tampil besar di tengah hero. Latar adalah foto/still film.</p>
        </div>
        <Field label="Sub-teks di atas logo" hint="Teks kecil emas di atas logo, mis. “Crowdfunding · Final Project”.">
          <Input {...bind("heroEyebrow")} placeholder="Crowdfunding · Final Project" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Judul Film" hint="Dipakai sebagai teks alternatif logo / fallback bila logo kosong.">
            <Input {...bind("heroTitle")} />
          </Field>
          <Field label="Subtitle Hero">
            <Input {...bind("heroSubtitle")} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUpload value={form.logoUrl} onChange={setImg("logoUrl")} label="Logo Film Gigi (hero + navbar)" />
          <ImageUpload value={form.heroImageUrl} onChange={setImg("heroImageUrl")} label="Latar Film Gigi (still hero)" />
        </div>
      </Card>

      {/* ── Sinopsis & Trailer ───────────────────────────── */}
      <Card className="p-6 space-y-5">
        <Field label="Sinopsis" hint="Pisahkan paragraf dengan baris kosong. **teks** untuk tebal.">
          <Textarea {...bind("synopsis")} rows={6} placeholder="Tulis sinopsis film..." />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="URL Video (YouTube/Vimeo)">
            <Input {...bind("videoUrl")} placeholder="https://youtu.be/..." />
          </Field>
          <ImageUpload value={form.videoThumb} onChange={setImg("videoThumb")} label="Thumbnail Trailer" />
        </div>
      </Card>

      {/* ── Producer ─────────────────────────────────────── */}
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-white font-semibold text-sm">Producer Statement</h3>
          <p className="text-white/40 text-xs mt-0.5">Foto dan kutipan dari produser. Tampil setelah trailer.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUpload value={form.producerImageUrl} onChange={setImg("producerImageUrl")} label="Foto Producer" />
          <div className="space-y-4">
            <Field label="Nama Producer">
              <Input {...bind("producerName")} placeholder="Nama produser" />
            </Field>
            <Field label="Kutipan">
              <Textarea {...bind("producerQuote")} rows={5} placeholder="Tulis kutipan/statement produser..." />
            </Field>
          </div>
        </div>
      </Card>

      {/* ── Director ─────────────────────────────────────── */}
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-white font-semibold text-sm">Director Statement</h3>
          <p className="text-white/40 text-xs mt-0.5">Foto dan kutipan dari sutradara. Tampil setelah Producer Statement.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUpload value={form.directorImageUrl} onChange={setImg("directorImageUrl")} label="Foto Director" />
          <div className="space-y-4">
            <Field label="Nama Director">
              <Input {...bind("directorName")} placeholder="Nama sutradara" />
            </Field>
            <Field label="Kutipan">
              <Textarea {...bind("directorQuote")} rows={5} placeholder="Tulis kutipan/statement sutradara..." />
            </Field>
          </div>
        </div>
      </Card>

      {/* ── Parallax kutipan ─────────────────────────────── */}
      <Card className="p-6 space-y-5">
        <div>
          <h3 className="text-white font-semibold text-sm">Parallax di Latar (Kutipan)</h3>
          <p className="text-white/40 text-xs mt-0.5">Still film bergerak parallax di belakang sebuah kutipan besar.</p>
        </div>
        <ImageUpload value={form.parallaxImage} onChange={setImg("parallaxImage")} label="Gambar Parallax" />
        <Field label="Kutipan Parallax">
          <Textarea {...bind("parallaxQuote")} rows={3} placeholder="Kutipan yang muncul di atas gambar parallax..." />
        </Field>
        <Field label="Atribusi" hint="Mis. “Latar Film Gigi” atau nama orang.">
          <Input {...bind("parallaxAttr")} placeholder="Latar Film Gigi" />
        </Field>
      </Card>

      {/* ── Kenapa film penting ──────────────────────────── */}
      <Card className="p-6 space-y-5">
        <Field label="Kenapa Film Ini Penting" hint="Paragraf pembuka di bagian ini.">
          <Textarea {...bind("whyImportant")} rows={5} placeholder="Kenapa film ini layak didukung..." />
        </Field>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="mb-0">Poin-poin Kenapa Film Penting</Label>
              <p className="text-white/30 text-xs mt-0.5">Kartu-kartu kecil dengan ikon, judul, dan deskripsi.</p>
            </div>
            <Button type="button" variant="secondary" onClick={addPoint}>
              <Plus size={14} className="mr-1.5" />
              Tambah Poin
            </Button>
          </div>

          {points.length === 0 && (
            <p className="text-white/30 text-xs py-4 text-center border border-dashed border-white/10 rounded-xl">
              Belum ada poin. Klik “Tambah Poin”.
            </p>
          )}

          <div className="space-y-4">
            {points.map((pt, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-white/40 text-xs">
                    <GripVertical size={14} /> Poin {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePoint(i)}
                    className="text-red-400/70 hover:text-red-400 p-1"
                    aria-label="Hapus poin"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Ikon">
                    <select
                      className={selectClass}
                      value={pt.icon}
                      onChange={(e) => updatePoint(i, { icon: e.target.value })}
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#141414]">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Judul">
                    <Input value={pt.title} onChange={(e) => updatePoint(i, { title: e.target.value })} placeholder="Untuk anak muda" />
                  </Field>
                </div>
                <Field label="Deskripsi">
                  <Textarea value={pt.text} onChange={(e) => updatePoint(i, { text: e.target.value })} rows={2} placeholder="Penjelasan singkat poin ini..." />
                </Field>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Proposal & Donasi ────────────────────────────── */}
      <Card className="p-6 space-y-5">
        <PdfUpload value={form.pdfUrl} onChange={setImg("pdfUrl")} label="PDF Rincian Proyek" />
        <ImageUpload value={form.donateParallax} onChange={setImg("donateParallax")} label="Parallax di Bagian Donasi (latar)" />
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
