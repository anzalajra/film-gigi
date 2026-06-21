"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "../actions";
import ImageUpload from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import {
  Button,
  Card,
  Field,
  Input,
  Modal,
  ConfirmDialog,
  EmptyState,
} from "@/components/admin/ui";

interface Member {
  id: number;
  name: string;
  role: string;
  imageUrl: string | null;
  sortOrder: number;
}

const empty = { name: "", role: "", imageUrl: "" };

export default function TeamClient({ team: initial }: { team: Member[] }) {
  const router = useRouter();
  const [team, setTeam] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setTeam(initial), [initial]);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
  };

  const openEdit = (m: Member) => {
    setEditing(m);
    setForm({ name: m.name, role: m.role, imageUrl: m.imageUrl ?? "" });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role) {
      toast.error("Nama dan jabatan wajib");
      return;
    }
    setSaving(true);
    try {
      const data = { name: form.name, role: form.role, imageUrl: form.imageUrl || undefined, sortOrder: team.length };
      if (editing) {
        await updateTeamMember(editing.id, data);
        toast.success("Anggota diperbarui");
      } else {
        await createTeamMember(data);
        toast.success("Anggota ditambahkan");
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
      await deleteTeamMember(confirmId);
      setTeam((t) => t.filter((x) => x.id !== confirmId));
      toast.success("Anggota dihapus");
      setConfirmId(null);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}>
          <Plus size={16} /> Tambah Anggota
        </Button>
      </div>

      {team.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="Belum ada anggota tim"
            description="Tambahkan tim produksi yang akan ditampilkan di halaman publik."
            action={
              <Button onClick={openAdd} size="sm">
                <Plus size={15} /> Tambah Anggota
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {team.map((m) => (
            <Card key={m.id} hover className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-3 relative overflow-hidden border border-white/10">
                {m.imageUrl ? (
                  <Image src={m.imageUrl} alt={m.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white/30">
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="text-white font-medium text-sm">{m.name}</p>
              <p className="text-white/50 text-xs">{m.role}</p>
              <div className="flex justify-center gap-1 mt-3 border-t border-white/8 pt-3">
                <Button variant="ghost" size="icon" onClick={() => openEdit(m)} aria-label="Edit">
                  <Pencil size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setConfirmId(m.id)}
                  aria-label="Hapus"
                  className="hover:text-red-400"
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Anggota" : "Tambah Anggota"}
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
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nama">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nama lengkap"
              />
            </Field>
            <Field label="Jabatan / Role">
              <Input
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="Sutradara, DOP, dll"
              />
            </Field>
          </div>
          <ImageUpload value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} label="Foto (opsional)" />
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus anggota?"
        description="Anggota tim ini akan dihapus permanen."
      />
    </div>
  );
}
