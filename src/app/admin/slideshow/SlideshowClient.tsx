"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { createSlideImage, updateSlideImage, deleteSlideImage } from "../actions";
import ImageUpload from "@/components/admin/ImageUpload";
import { Trash2, Eye, EyeOff, Plus } from "lucide-react";

interface Slide {
  id: number;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  active: boolean;
}

export default function SlideshowClient({ images: initial }: { images: Slide[] }) {
  const [images, setImages] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!newUrl) { toast.error("Upload gambar terlebih dahulu"); return; }
    setSaving(true);
    try {
      await createSlideImage({ imageUrl: newUrl, caption: newCaption || undefined, sortOrder: images.length });
      toast.success("Gambar ditambahkan");
      setNewUrl(""); setNewCaption(""); setShowAdd(false);
      window.location.reload();
    } catch { toast.error("Gagal menambahkan"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus gambar ini?")) return;
    try {
      await deleteSlideImage(id);
      setImages((prev) => prev.filter((i) => i.id !== id));
      toast.success("Gambar dihapus");
    } catch { toast.error("Gagal menghapus"); }
  };

  const toggleActive = async (img: Slide) => {
    try {
      await updateSlideImage(img.id, { active: !img.active });
      setImages((prev) => prev.map((x) => x.id === img.id ? { ...x, active: !x.active } : x));
    } catch { toast.error("Gagal mengubah"); }
  };

  return (
    <div className="space-y-4">
      <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2.5 bg-[#f5c842] text-black font-semibold rounded-xl text-sm hover:bg-[#f5c842]/90">
        <Plus size={16} /> Tambah Gambar
      </button>

      {showAdd && (
        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6 space-y-4">
          <ImageUpload value={newUrl} onChange={setNewUrl} label="Upload Gambar" />
          <div>
            <label className="block text-white/60 text-xs mb-1">Caption (opsional)</label>
            <input value={newCaption} onChange={(e) => setNewCaption(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842]" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={saving} className="px-5 py-2 bg-[#f5c842] text-black font-semibold rounded-xl text-sm">{saving ? "..." : "Simpan"}</button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2 border border-white/20 text-white/60 rounded-xl text-sm">Batal</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className={`relative rounded-xl overflow-hidden border ${img.active ? "border-white/15" : "border-white/5 opacity-50"}`}>
            <div className="aspect-video relative">
              <Image src={img.imageUrl} alt={img.caption ?? ""} fill className="object-cover" />
            </div>
            {img.caption && <p className="text-xs text-white/60 px-2 py-1.5 truncate">{img.caption}</p>}
            <div className="flex justify-between items-center px-2 py-1 border-t border-white/8">
              <button onClick={() => toggleActive(img)} className={`${img.active ? "text-green-400" : "text-white/30"}`}>
                {img.active ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button onClick={() => handleDelete(img.id)} className="text-white/30 hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="col-span-full text-white/30 text-sm py-8 text-center">Belum ada gambar</p>}
      </div>
    </div>
  );
}
