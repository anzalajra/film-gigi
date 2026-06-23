"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSlideImage, updateSlideImage, deleteSlideImage } from "../actions";
import ImageUpload from "@/components/admin/ImageUpload";
import { Trash2, Eye, EyeOff, Plus, Images } from "lucide-react";
import {
  Button,
  Card,
  Field,
  Input,
  Modal,
  ConfirmDialog,
  EmptyState,
} from "@/components/admin/ui";

interface Slide {
  id: number;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  active: boolean;
}

export default function SlideshowClient({ images: initial }: { images: Slide[] }) {
  const router = useRouter();
  const [images, setImages] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setImages(initial), [initial]);

  const closeAdd = () => {
    setShowAdd(false);
    setNewUrl("");
    setNewCaption("");
  };

  const handleAdd = async () => {
    if (!newUrl) {
      toast.error("Upload gambar terlebih dahulu");
      return;
    }
    setSaving(true);
    try {
      await createSlideImage({ imageUrl: newUrl, caption: newCaption || undefined, sortOrder: images.length });
      toast.success("Gambar ditambahkan");
      closeAdd();
      router.refresh();
    } catch {
      toast.error("Gagal menambahkan");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (confirmId == null) return;
    setDeleting(true);
    try {
      await deleteSlideImage(confirmId);
      setImages((prev) => prev.filter((i) => i.id !== confirmId));
      toast.success("Gambar dihapus");
      setConfirmId(null);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (img: Slide) => {
    const val = !img.active;
    setImages((prev) => prev.map((x) => (x.id === img.id ? { ...x, active: val } : x)));
    try {
      await updateSlideImage(img.id, { active: val });
    } catch {
      setImages((prev) => prev.map((x) => (x.id === img.id ? { ...x, active: !val } : x)));
      toast.error("Gagal mengubah");
    }
  };

  const setCaptionLocal = (id: number, caption: string) =>
    setImages((prev) => prev.map((x) => (x.id === id ? { ...x, caption } : x)));

  const saveCaption = async (img: Slide) => {
    const value = img.caption ?? "";
    if (value === (initial.find((i) => i.id === img.id)?.caption ?? "")) return;
    try {
      await updateSlideImage(img.id, { caption: value });
      toast.success("Caption disimpan");
      router.refresh();
    } catch {
      toast.error("Gagal menyimpan caption");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Tambah Gambar
        </Button>
      </div>

      {images.length === 0 ? (
        <Card>
          <EmptyState
            icon={Images}
            title="Belum ada gambar"
            description="Upload gambar untuk galeri/slideshow di halaman publik."
            action={
              <Button onClick={() => setShowAdd(true)} size="sm">
                <Plus size={15} /> Tambah Gambar
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`rounded-2xl overflow-hidden border bg-[#141414] transition-colors ${
                img.active ? "border-white/10" : "border-white/5 opacity-50"
              }`}
            >
              <div className="aspect-video relative">
                <Image src={img.imageUrl} alt={img.caption ?? ""} fill className="object-cover" />
              </div>
              <div className="px-2.5 pt-2.5 pb-1">
                <Input
                  value={img.caption ?? ""}
                  onChange={(e) => setCaptionLocal(img.id, e.target.value)}
                  onBlur={() => saveCaption(img)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                  placeholder="Caption (pojok kiri bawah foto)"
                  className="text-xs px-2.5 py-1.5"
                />
              </div>
              <div className="flex justify-between items-center px-2 py-1.5 border-t border-white/8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActive(img)}
                  aria-label={img.active ? "Sembunyikan" : "Tampilkan"}
                  className={img.active ? "text-green-400 hover:text-green-300" : ""}
                >
                  {img.active ? <Eye size={15} /> : <EyeOff size={15} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setConfirmId(img.id)}
                  aria-label="Hapus"
                  className="hover:text-red-400"
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showAdd}
        onClose={closeAdd}
        title="Tambah Gambar"
        footer={
          <>
            <Button variant="secondary" onClick={closeAdd} disabled={saving}>
              Batal
            </Button>
            <Button onClick={handleAdd} loading={saving}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <ImageUpload value={newUrl} onChange={setNewUrl} label="Upload Gambar" />
          <Field label="Caption (opsional)">
            <Input value={newCaption} onChange={(e) => setNewCaption(e.target.value)} placeholder="Keterangan gambar" />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus gambar?"
        description="Gambar ini akan dihapus permanen dari slideshow."
      />
    </div>
  );
}
