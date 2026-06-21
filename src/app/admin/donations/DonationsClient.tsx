"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";
import { createDonation, updateDonation, deleteDonation } from "../actions";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

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

const emptyForm = { name: "", amount: "", message: "", isPublic: true, showAmount: true, isAnonymous: false, donatedAt: new Date().toISOString().slice(0, 10) };

export default function DonationsClient({ donations: initial }: { donations: Donation[] }) {
  const [donations, setDonations] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Donation | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (d: Donation) => {
    setEditing(d);
    setForm({ name: d.name, amount: d.amount.toString(), message: d.message ?? "", isPublic: d.isPublic, showAmount: d.showAmount, isAnonymous: d.isAnonymous, donatedAt: new Date(d.donatedAt).toISOString().slice(0, 10) });
    setShowForm(true);
  };

  const handleSave = async () => {
    const amount = parseInt(form.amount.replace(/\D/g, ""));
    if (!form.name || !amount) { toast.error("Nama dan nominal wajib diisi"); return; }
    setSaving(true);
    try {
      const data = { name: form.name, amount, message: form.message || undefined, isPublic: form.isPublic, showAmount: form.showAmount, isAnonymous: form.isAnonymous, donatedAt: new Date(form.donatedAt) };
      if (editing) {
        await updateDonation(editing.id, data);
        toast.success("Donasi diperbarui");
      } else {
        await createDonation(data);
        toast.success("Donasi ditambahkan");
      }
      setShowForm(false);
      window.location.reload();
    } catch { toast.error("Gagal menyimpan"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus donasi ini?")) return;
    try {
      await deleteDonation(id);
      setDonations((d) => d.filter((x) => x.id !== id));
      toast.success("Donasi dihapus");
    } catch { toast.error("Gagal menghapus"); }
  };

  const toggle = async (d: Donation, field: "isPublic" | "showAmount" | "isAnonymous") => {
    const val = !d[field];
    try {
      await updateDonation(d.id, { [field]: val });
      setDonations((prev) => prev.map((x) => x.id === d.id ? { ...x, [field]: val } : x));
    } catch { toast.error("Gagal mengubah"); }
  };

  return (
    <div className="space-y-4">
      <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#f5c842] text-black font-semibold rounded-xl text-sm hover:bg-[#f5c842]/90">
        <Plus size={16} /> Tambah Donasi
      </button>

      {showForm && (
        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-semibold">{editing ? "Edit Donasi" : "Tambah Donasi"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1">Nama Donatur</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842]" />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Nominal (Rp)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842]" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1">Ucapan / Pesan</label>
              <input value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842]" />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Tanggal Donasi</label>
              <input type="date" value={form.donatedAt} onChange={(e) => setForm((f) => ({ ...f, donatedAt: e.target.value }))} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842]" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {(["isPublic", "showAmount", "isAnonymous"] as const).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input type="checkbox" checked={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))} className="rounded" />
                {key === "isPublic" ? "Tampilkan di publik" : key === "showAmount" ? "Tampilkan nominal" : "Sembunyikan nama (Anonim)"}
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#f5c842] text-black font-semibold rounded-xl text-sm disabled:opacity-50">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 border border-white/20 text-white/60 rounded-xl text-sm hover:text-white">
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 text-white/40 text-xs">
                <th className="text-left px-4 py-3">Nama</th>
                <th className="text-right px-4 py-3">Nominal</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Pesan</th>
                <th className="text-center px-4 py-3">Publik</th>
                <th className="text-center px-4 py-3">Nominal</th>
                <th className="text-center px-4 py-3">Anonim</th>
                <th className="text-right px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                  <td className="px-4 py-3 text-white text-sm">{d.name}</td>
                  <td className="px-4 py-3 text-[#f5c842] text-sm text-right whitespace-nowrap">{formatRupiah(d.amount)}</td>
                  <td className="px-4 py-3 text-white/40 text-xs hidden sm:table-cell max-w-xs truncate">{d.message}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggle(d, "isPublic")} className={`text-xs ${d.isPublic ? "text-green-400" : "text-white/30"}`}>
                      {d.isPublic ? <Eye size={14} className="mx-auto" /> : <EyeOff size={14} className="mx-auto" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggle(d, "showAmount")} className={`text-xs ${d.showAmount ? "text-green-400" : "text-white/30"}`}>
                      {d.showAmount ? "Ya" : "Tidak"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggle(d, "isAnonymous")} className={`text-xs ${d.isAnonymous ? "text-amber-400" : "text-white/30"}`}>
                      {d.isAnonymous ? "Ya" : "Tidak"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(d)} className="text-white/40 hover:text-white"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(d.id)} className="text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-white/30 text-sm">Belum ada donasi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
