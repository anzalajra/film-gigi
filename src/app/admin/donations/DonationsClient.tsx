"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";
import { createDonation, updateDonation, deleteDonation } from "../actions";
import { Plus, Pencil, Trash2, Heart } from "lucide-react";
import {
  Button,
  Card,
  Field,
  Input,
  Toggle,
  ToggleRow,
  Modal,
  ConfirmDialog,
  EmptyState,
} from "@/components/admin/ui";

interface Donation {
  id: number;
  name: string;
  amount: number;
  message: string | null;
  isPublic: boolean;
  showAmount: boolean;
  isAnonymous: boolean;
  donatedAt: Date;
}

const emptyForm = {
  name: "",
  amount: "",
  message: "",
  isPublic: true,
  showAmount: true,
  isAnonymous: false,
  donatedAt: new Date().toISOString().slice(0, 10),
};

export default function DonationsClient({ donations: initial }: { donations: Donation[] }) {
  const router = useRouter();
  const [donations, setDonations] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Donation | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Keep local list in sync with server data after router.refresh().
  useEffect(() => setDonations(initial), [initial]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (d: Donation) => {
    setEditing(d);
    setForm({
      name: d.name,
      amount: d.amount.toString(),
      message: d.message ?? "",
      isPublic: d.isPublic,
      showAmount: d.showAmount,
      isAnonymous: d.isAnonymous,
      donatedAt: new Date(d.donatedAt).toISOString().slice(0, 10),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    const amount = parseInt(form.amount.replace(/\D/g, ""));
    if (!form.name || !amount) {
      toast.error("Nama dan nominal wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const data = {
        name: form.name,
        amount,
        message: form.message || undefined,
        isPublic: form.isPublic,
        showAmount: form.showAmount,
        isAnonymous: form.isAnonymous,
        donatedAt: new Date(form.donatedAt),
      };
      if (editing) {
        await updateDonation(editing.id, data);
        toast.success("Donasi diperbarui");
      } else {
        await createDonation(data);
        toast.success("Donasi ditambahkan");
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
      await deleteDonation(confirmId);
      setDonations((d) => d.filter((x) => x.id !== confirmId));
      toast.success("Donasi dihapus");
      setConfirmId(null);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const toggle = async (d: Donation, field: "isPublic" | "showAmount" | "isAnonymous") => {
    const val = !d[field];
    setDonations((prev) => prev.map((x) => (x.id === d.id ? { ...x, [field]: val } : x)));
    try {
      await updateDonation(d.id, { [field]: val });
    } catch {
      setDonations((prev) => prev.map((x) => (x.id === d.id ? { ...x, [field]: !val } : x)));
      toast.error("Gagal mengubah");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}>
          <Plus size={16} /> Tambah Donasi
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 text-white/40 text-xs">
                <th className="text-left font-medium px-4 py-3">Nama</th>
                <th className="text-right font-medium px-4 py-3">Nominal</th>
                <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Pesan</th>
                <th className="text-center font-medium px-4 py-3">Publik</th>
                <th className="text-center font-medium px-4 py-3">Nominal</th>
                <th className="text-center font-medium px-4 py-3">Anonim</th>
                <th className="text-right font-medium px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white text-sm">{d.name}</td>
                  <td className="px-4 py-3 text-[#f5c842] text-sm text-right whitespace-nowrap">
                    {formatRupiah(d.amount)}
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs hidden md:table-cell max-w-xs truncate">
                    {d.message}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <Toggle checked={d.isPublic} onChange={() => toggle(d, "isPublic")} label="Publik" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <Toggle checked={d.showAmount} onChange={() => toggle(d, "showAmount")} label="Tampilkan nominal" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <Toggle checked={d.isAnonymous} onChange={() => toggle(d, "isAnonymous")} label="Anonim" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(d)} aria-label="Edit">
                        <Pencil size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setConfirmId(d.id)}
                        aria-label="Hapus"
                        className="hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {donations.length === 0 && (
            <EmptyState
              icon={Heart}
              title="Belum ada donasi"
              description="Tambahkan donasi pertama untuk mulai melacak dukungan."
              action={
                <Button onClick={openAdd} size="sm">
                  <Plus size={15} /> Tambah Donasi
                </Button>
              }
            />
          )}
        </div>
      </Card>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Donasi" : "Tambah Donasi"}
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
            <Field label="Nama Donatur">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nama lengkap"
              />
            </Field>
            <Field label="Nominal (Rp)">
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="100000"
              />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Ucapan / Pesan">
              <Input
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Opsional"
              />
            </Field>
            <Field label="Tanggal Donasi">
              <Input
                type="date"
                value={form.donatedAt}
                onChange={(e) => setForm((f) => ({ ...f, donatedAt: e.target.value }))}
              />
            </Field>
          </div>
          <div className="space-y-3 pt-1">
            <ToggleRow
              title="Tampilkan di publik"
              checked={form.isPublic}
              onChange={(v) => setForm((f) => ({ ...f, isPublic: v }))}
            />
            <ToggleRow
              title="Tampilkan nominal"
              checked={form.showAmount}
              onChange={(v) => setForm((f) => ({ ...f, showAmount: v }))}
            />
            <ToggleRow
              title="Sembunyikan nama (Anonim)"
              checked={form.isAnonymous}
              onChange={(v) => setForm((f) => ({ ...f, isAnonymous: v }))}
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus donasi?"
        description="Donasi ini akan dihapus permanen dan tidak bisa dikembalikan."
      />
    </div>
  );
}
