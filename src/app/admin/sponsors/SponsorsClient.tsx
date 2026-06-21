"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSponsor, updateSponsor, deleteSponsor } from "../actions";
import ImageUpload from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, Camera } from "lucide-react";
import {
  Button,
  Card,
  Field,
  Input,
  Toggle,
  Modal,
  ConfirmDialog,
  EmptyState,
} from "@/components/admin/ui";

interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  website: string | null;
  sortOrder: number;
  active: boolean;
}

const empty = { name: "", logoUrl: "", website: "" };

export default function SponsorsClient({ sponsors: initial }: { sponsors: Sponsor[] }) {
  const router = useRouter();
  const [sponsors, setSponsors] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setSponsors(initial), [initial]);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
  };

  const openEdit = (s: Sponsor) => {
    setEditing(s);
    setForm({ name: s.name, logoUrl: s.logoUrl, website: s.website ?? "" });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.logoUrl) {
      toast.error("Nama dan logo wajib");
      return;
    }
    setSaving(true);
    try {
      const data = { name: form.name, logoUrl: form.logoUrl, website: form.website || undefined, sortOrder: sponsors.length };
      if (editing) {
        await updateSponsor(editing.id, data);
        toast.success("Sponsor diperbarui");
      } else {
        await createSponsor(data);
        toast.success("Sponsor ditambahkan");
      }
      setShowForm(false);
      router.refresh();
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (confirmId == null) return;
    setDeleting(true);
    try {
      await deleteSponsor(confirmId);
      setSponsors((s) => s.filter((x) => x.id !== confirmId));
      toast.success("Sponsor dihapus");
      setConfirmId(null);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (s: Sponsor) => {
    const val = !s.active;
    setSponsors((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: val } : x)));
    try {
      await updateSponsor(s.id, { active: val });
    } catch {
      setSponsors((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: !val } : x)));
      toast.error("Gagal mengubah");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}>
          <Plus size={16} /> Tambah Sponsor
        </Button>
      </div>

      {sponsors.length === 0 ? (
        <Card>
          <EmptyState
            icon={Camera}
            title="Belum ada sponsor"
            description="Tambahkan logo sponsor untuk ditampilkan di halaman publik."
            action={
              <Button onClick={openAdd} size="sm">
                <Plus size={15} /> Tambah Sponsor
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sponsors.map((s) => (
            <Card key={s.id} hover className={s.active ? "" : "opacity-50"}>
              <div className="relative h-16 mb-3">
                <Image src={s.logoUrl} alt={s.name} fill className="object-contain" />
              </div>
              <p className="text-white font-medium text-sm text-center">{s.name}</p>
              {s.website && <p className="text-white/30 text-xs text-center truncate">{s.website}</p>}
              <div className="flex justify-between items-center mt-4 border-t border-white/8 pt-3">
                <Toggle checked={s.active} onChange={() => toggleActive(s)} label="Aktif" />
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)} aria-label="Edit">
                    <Pencil size={15} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setConfirmId(s.id)}
                    aria-label="Hapus"
                    className="hover:text-red-400"
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Sponsor" : "Tambah Sponsor"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowForm(false)} disabled={saving}>
              Batal
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Nama Sponsor">
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nama brand / sponsor"
            />
          </Field>
          <ImageUpload value={form.logoUrl} onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))} label="Logo Sponsor" />
          <Field label="Website (opsional)">
            <Input
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              placeholder="https://..."
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus sponsor?"
        description="Sponsor ini akan dihapus permanen."
      />
    </div>
  );
}
