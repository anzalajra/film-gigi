"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "../actions";
import ImageUpload from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Member {
  id: number;
  name: string;
  role: string;
  imageUrl: string | null;
  sortOrder: number;
}

const empty = { name: "", role: "", imageUrl: "" };

export default function TeamClient({ team: initial }: { team: Member[] }) {
  const [team, setTeam] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (m: Member) => { setEditing(m); setForm({ name: m.name, role: m.role, imageUrl: m.imageUrl ?? "" }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name || !form.role) { toast.error("Nama dan jabatan wajib"); return; }
    setSaving(true);
    try {
      const data = { name: form.name, role: form.role, imageUrl: form.imageUrl || undefined, sortOrder: team.length };
      if (editing) { await updateTeamMember(editing.id, data); toast.success("Diperbarui"); }
      else { await createTeamMember(data); toast.success("Ditambahkan"); }
      setShowForm(false);
      window.location.reload();
    } catch { toast.error("Gagal"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus anggota ini?")) return;
    try { await deleteTeamMember(id); setTeam((t) => t.filter((x) => x.id !== id)); toast.success("Dihapus"); }
    catch { toast.error("Gagal"); }
  };

  return (
    <div className="space-y-4">
      <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#f5c842] text-black font-semibold rounded-xl text-sm">
        <Plus size={16} /> Tambah Anggota
      </button>

      {showForm && (
        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-semibold">{editing ? "Edit Anggota" : "Tambah Anggota"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1">Nama</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842]" />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Jabatan / Role</label>
              <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Sutradara, DOP, dll" className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5c842] placeholder:text-white/30" />
            </div>
          </div>
          <ImageUpload value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} label="Foto (opsional)" />
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#f5c842] text-black font-semibold rounded-xl text-sm">{saving ? "..." : "Simpan"}</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 border border-white/20 text-white/60 rounded-xl text-sm">Batal</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {team.map((m) => (
          <div key={m.id} className="bg-[#141414] border border-white/8 rounded-2xl p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-3 relative overflow-hidden border border-white/10">
              {m.imageUrl ? (
                <Image src={m.imageUrl} alt={m.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white/30">{m.name.charAt(0)}</div>
              )}
            </div>
            <p className="text-white font-medium text-sm">{m.name}</p>
            <p className="text-white/50 text-xs">{m.role}</p>
            <div className="flex justify-center gap-3 mt-3 border-t border-white/8 pt-3">
              <button onClick={() => openEdit(m)} className="text-white/40 hover:text-white"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(m.id)} className="text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {team.length === 0 && <p className="col-span-full text-white/30 text-sm py-8 text-center">Belum ada anggota tim</p>}
      </div>
    </div>
  );
}
