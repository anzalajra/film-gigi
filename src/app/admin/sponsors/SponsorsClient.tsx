"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { createSponsor, updateSponsor, deleteSponsor } from "../actions";
import ImageUpload from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

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
  const [sponsors, setSponsors] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (s: Sponsor) => { setEditing(s); setForm({ name: s.name, logoUrl: s.logoUrl, website: s.website ?? "" }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name || !form.logoUrl) { toast.error("Nama dan logo wajib"); return; }
    setSaving(true);
    try {
      const data = { name: form.name, logoUrl: form.logoUrl, website: form.website || undefined, sortOrder: sponsors.length };
      if (editing) { await updateSponsor(editing.id, data); toast.success("Diperbarui"); }
      else { await createSponsor(data); toast.success("Ditambahkan"); }
      setShowForm(false);
      window.location.reload();
    } catch { toast.error("Gagal"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus sponsor ini?")) return;
    try { await deleteSponsor(id); setSponsors((s) => s.filter((x) => x.id !== id)); toast.success("Dihapus"); }
    catch { toast.error("Gagal"); }
  };

  const toggleActive = async (s: Sponsor) => {
    try { await updateSponsor(s.id, { active: !s.active }); setSponsors((prev) => prev.map((x) => x.id === s.id ? { ...x, active: !x.active } : x)); }
    catch { toast.error("Gagal"); }
  };

  return (
    <div className="space-y-4">
      <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#f5c842] text-black font-semibold rounded-xl text-sm">
        <Plus size={16} /> Tambah Sponsor
      </button>

      {showForm && (
        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-semibold">{editing ? "Edit Sponsor" : "Tambah Sponsor"}</h3>
          <div>
            <label className="block text-white/60 text-xs mb-1">Nama Sponsor</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842]" />
          </div>
          <ImageUpload value={form.logoUrl} onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))} label="Logo Sponsor" />
          <div>
            <label className="block text-white/60 text-xs mb-1">Website (opsional)</label>
            <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://..." className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842] placeholder:text-white/30" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#f5c842] text-black font-semibold rounded-xl text-sm">{saving ? "..." : "Simpan"}</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 border border-white/20 text-white/60 rounded-xl text-sm">Batal</button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sponsors.map((s) => (
          <div key={s.id} className={`bg-[#141414] border rounded-2xl p-4 ${s.active ? "border-white/8" : "border-white/4 opacity-50"}`}>
            <div className="relative h-16 mb-3">
              <Image src={s.logoUrl} alt={s.name} fill className="object-contain" />
            </div>
            <p className="text-white font-medium text-sm text-center">{s.name}</p>
            {s.website && <p className="text-white/30 text-xs text-center truncate">{s.website}</p>}
            <div className="flex justify-between mt-3 border-t border-white/8 pt-3">
              <button onClick={() => toggleActive(s)} className={s.active ? "text-green-400" : "text-white/30"}>
                {s.active ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} className="text-white/40 hover:text-white"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(s.id)} className="text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {sponsors.length === 0 && <p className="col-span-full text-white/30 text-sm py-8 text-center">Belum ada sponsor</p>}
      </div>
    </div>
  );
}
