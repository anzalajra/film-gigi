"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function PdfUpload({ value, onChange, label = "PDF" }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("File harus berformat PDF");
      return;
    }
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.url);
      toast.success("PDF berhasil diupload");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-white/60 text-xs font-medium">{label}</label>
      {value ? (
        <div className="flex items-center gap-3 border border-white/12 bg-white/[0.02] rounded-xl p-3">
          <FileText size={20} className="text-[#f5c842] shrink-0" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 truncate text-white/70 text-xs hover:text-[#f5c842] underline"
          >
            {value.split("/").pop()}
          </a>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-white/40 hover:text-red-400 shrink-0"
            aria-label="Hapus PDF"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className="relative border-2 border-dashed border-white/12 bg-white/[0.02] rounded-xl p-4 text-center cursor-pointer hover:border-[#f5c842]/40 hover:bg-white/[0.03] transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <div className="py-4">
            <Upload size={24} className="mx-auto text-white/30 mb-2" />
            <p className="text-white/40 text-xs">{uploading ? "Mengupload..." : "Klik atau drag file PDF ke sini"}</p>
            <p className="text-white/20 text-xs mt-1">PDF — Maks. 20MB</p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
