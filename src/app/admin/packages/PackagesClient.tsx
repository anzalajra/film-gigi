"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";
import { createPackage, updatePackage, deletePackage } from "../actions";
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";

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
  const [packages, setPackages] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (p: Package) => {
    let benefits: string[] = [];
    try { benefits = JSON.parse(p.benefits); } catch {}
    setEditing(p);
    setForm({ name: p.name, amount: p.amount.toString(), description: p.description, benefits: benefits.length ? benefits : [""] });
    setShowForm(true);
  };

  const handleSave = async () => {
    const amount = parseInt(form.amount.replace(/\D/g, ""));
    if (!form.name || !amount) { toast.error("Nama dan nominal wajib"); return; }
    const benefits = JSON.stringify(form.benefits.filter(Boolean));
    setSaving(true);
    try {
      const data = { name: form.name, amount, description: form.description, benefits, sortOrder: packages.length };
      if (editing) { await updatePackage(editing.id, data); toast.success("Diperbarui"); }
      else { await createPackage(data); toast.success("Ditambahkan"); }
      setShowForm(false);
      window.location.reload();
    } catch { toast.error("Gagal"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus paket ini?")) return;
    try { await deletePackage(id); setPackages((p) => p.filter((x) => x.id !== id)); toast.success("Dihapus"); }
    catch { toast.error("Gagal"); }
  };

  const toggleActive = async (p: Package) => {
    try { await updatePackage(p.id, { active: !p.active }); setPackages((prev) => prev.map((x) => x.id === p.id ? { ...x, active: !x.active } : x)); }
    catch { toast.error("Gagal"); }
  };

  return (
    <div className="space-y-4">
      <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#f5c842] text-black font-semibold rounded-xl text-sm">
        <Plus size={16} /> Tambah Paket
      </button>

      {showForm && (
        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-semibold">{editing ? "Edit Paket" : "Tambah Paket"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1">Nama Paket</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842]" />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Nominal (Rp)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842]" />
            </div>
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1">Deskripsi</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842] resize-none" />
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1">Benefits</label>
            {form.benefits.map((b, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={b}
                  onChange={(e) => { const arr = [...form.benefits]; arr[i] = e.target.value; setForm((f) => ({ ...f, benefits: arr })); }}
                  placeholder={`Benefit ${i + 1}`}
                  className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842]"
                />
                <button type="button" onClick={() => setForm((f) => ({ ...f, benefits: f.benefits.filter((_, j) => j !== i) }))} className="text-white/30 hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setForm((f) => ({ ...f, benefits: [...f.benefits, ""] }))} className="text-[#f5c842] text-xs hover:underline">
              + Tambah benefit
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#f5c842] text-black font-semibold rounded-xl text-sm">{saving ? "..." : "Simpan"}</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 border border-white/20 text-white/60 rounded-xl text-sm">Batal</button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {packages.map((p) => {
          let benefits: string[] = [];
          try { benefits = JSON.parse(p.benefits); } catch {}
          return (
            <div key={p.id} className={`bg-[#141414] border rounded-2xl p-4 ${p.active ? "border-white/8" : "border-white/4 opacity-50"}`}>
              <p className="text-[#f5c842] font-bold text-lg">{formatRupiah(p.amount)}</p>
              <p className="text-white font-medium mt-1">{p.name}</p>
              <p className="text-white/50 text-xs mt-1">{p.description}</p>
              {benefits.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {benefits.map((b, i) => <li key={i} className="text-white/40 text-xs">• {b}</li>)}
                </ul>
              )}
              <div className="flex justify-between mt-3 border-t border-white/8 pt-3">
                <button onClick={() => toggleActive(p)} className={p.active ? "text-green-400" : "text-white/30"}>
                  {p.active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-white/40 hover:text-white"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
        {packages.length === 0 && <p className="col-span-full text-white/30 text-sm py-8 text-center">Belum ada paket</p>}
      </div>
    </div>
  );
}
