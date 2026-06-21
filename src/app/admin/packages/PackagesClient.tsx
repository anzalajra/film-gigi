"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";
import { createPackage, updatePackage, deletePackage } from "../actions";
import { Plus, Pencil, Trash2, X, Package as PackageIcon } from "lucide-react";
import {
  Button,
  Card,
  Field,
  Input,
  Textarea,
  Toggle,
  Modal,
  ConfirmDialog,
  EmptyState,
} from "@/components/admin/ui";

interface Package {
  id: number;
  name: string;
  amount: number;
  description: string;
  benefits: string;
  sortOrder: number;
  active: boolean;
}

const empty = { name: "", amount: "", description: "", benefits: [""] };

export default function PackagesClient({ packages: initial }: { packages: Package[] }) {
  const router = useRouter();
  const [packages, setPackages] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setPackages(initial), [initial]);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
  };

  const openEdit = (p: Package) => {
    let benefits: string[] = [];
    try {
      benefits = JSON.parse(p.benefits);
    } catch {}
    setEditing(p);
    setForm({
      name: p.name,
      amount: p.amount.toString(),
      description: p.description,
      benefits: benefits.length ? benefits : [""],
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    const amount = parseInt(form.amount.replace(/\D/g, ""));
    if (!form.name || !amount) {
      toast.error("Nama dan nominal wajib");
      return;
    }
    const benefits = JSON.stringify(form.benefits.filter(Boolean));
    setSaving(true);
    try {
      const data = { name: form.name, amount, description: form.description, benefits, sortOrder: packages.length };
      if (editing) {
        await updatePackage(editing.id, data);
        toast.success("Paket diperbarui");
      } else {
        await createPackage(data);
        toast.success("Paket ditambahkan");
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
      await deletePackage(confirmId);
      setPackages((p) => p.filter((x) => x.id !== confirmId));
      toast.success("Paket dihapus");
      setConfirmId(null);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (p: Package) => {
    const val = !p.active;
    setPackages((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: val } : x)));
    try {
      await updatePackage(p.id, { active: val });
    } catch {
      setPackages((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !val } : x)));
      toast.error("Gagal mengubah");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}>
          <Plus size={16} /> Tambah Paket
        </Button>
      </div>

      {packages.length === 0 ? (
        <Card>
          <EmptyState
            icon={PackageIcon}
            title="Belum ada paket"
            description="Buat tier dukungan agar donatur bisa memilih paket."
            action={
              <Button onClick={openAdd} size="sm">
                <Plus size={15} /> Tambah Paket
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {packages.map((p) => {
            let benefits: string[] = [];
            try {
              benefits = JSON.parse(p.benefits);
            } catch {}
            return (
              <Card key={p.id} hover className={p.active ? "" : "opacity-50"}>
                <p className="text-[#f5c842] font-bold text-lg">{formatRupiah(p.amount)}</p>
                <p className="text-white font-medium mt-1">{p.name}</p>
                <p className="text-white/50 text-xs mt-1">{p.description}</p>
                {benefits.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {benefits.map((b, i) => (
                      <li key={i} className="text-white/40 text-xs">
                        • {b}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex justify-between items-center mt-4 border-t border-white/8 pt-3">
                  <Toggle checked={p.active} onChange={() => toggleActive(p)} label="Aktif" />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Edit">
                      <Pencil size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setConfirmId(p.id)}
                      aria-label="Hapus"
                      className="hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Paket" : "Tambah Paket"}
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
            <Field label="Nama Paket">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="mis. Produser Eksekutif"
              />
            </Field>
            <Field label="Nominal (Rp)">
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="500000"
              />
            </Field>
          </div>
          <Field label="Deskripsi">
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="resize-none"
            />
          </Field>
          <Field label="Benefits">
            <div className="space-y-2">
              {form.benefits.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={b}
                    onChange={(e) => {
                      const arr = [...form.benefits];
                      arr[i] = e.target.value;
                      setForm((f) => ({ ...f, benefits: arr }));
                    }}
                    placeholder={`Benefit ${i + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    aria-label="Hapus benefit"
                    className="hover:text-red-400 shrink-0"
                    onClick={() => setForm((f) => ({ ...f, benefits: f.benefits.filter((_, j) => j !== i) }))}
                  >
                    <X size={15} />
                  </Button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, benefits: [...f.benefits, ""] }))}
                className="text-[#f5c842] text-xs hover:underline"
              >
                + Tambah benefit
              </button>
            </div>
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus paket?"
        description="Paket dukungan ini akan dihapus permanen."
      />
    </div>
  );
}
