"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";
import { confirmDonationConfirmation, deleteDonationConfirmation } from "../actions";
import { CheckCircle2, Eye, Trash2, Inbox } from "lucide-react";
import { Button, Card, Modal, ConfirmDialog, EmptyState } from "@/components/admin/ui";

interface Confirmation {
  id: number;
  name: string;
  amount: number;
  message: string | null;
  isAnonymous: boolean;
  proofUrl: string;
  status: string;
  createdAt: Date;
}

export default function ConfirmationsClient({
  confirmations: initial,
}: {
  confirmations: Confirmation[];
}) {
  const router = useRouter();
  const [confirmations, setConfirmations] = useState(initial);
  const [proof, setProof] = useState<Confirmation | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => setConfirmations(initial), [initial]);

  const handleConfirm = async () => {
    if (confirmId == null) return;
    setWorking(true);
    try {
      await confirmDonationConfirmation(confirmId);
      toast.success("Donasi dikonfirmasi & ditambahkan ke daftar donatur");
      setConfirmId(null);
      router.refresh();
    } catch {
      toast.error("Gagal mengonfirmasi");
    } finally {
      setWorking(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    setWorking(true);
    try {
      await deleteDonationConfirmation(deleteId);
      setConfirmations((c) => c.filter((x) => x.id !== deleteId));
      toast.success("Konfirmasi dihapus");
      setDeleteId(null);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-white font-semibold">Konfirmasi Donasi Masuk</h2>
        <p className="text-white/40 text-xs mt-0.5">
          Donasi yang dikonfirmasi otomatis masuk ke daftar donatur di atas.
        </p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 text-white/40 text-xs">
                <th className="text-left font-medium px-4 py-3">Nama</th>
                <th className="text-right font-medium px-4 py-3">Nominal</th>
                <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Kata-kata</th>
                <th className="text-center font-medium px-4 py-3">Bukti</th>
                <th className="text-center font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {confirmations.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white text-sm">
                    {c.name}
                    {c.isAnonymous && (
                      <span className="ml-2 text-[10px] text-white/30 border border-white/15 rounded px-1.5 py-0.5">
                        Anonim
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#f5c842] text-sm text-right whitespace-nowrap">
                    {formatRupiah(c.amount)}
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs hidden md:table-cell max-w-xs truncate">
                    {c.message}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <Button variant="ghost" size="sm" onClick={() => setProof(c)}>
                        <Eye size={14} /> Lihat
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {c.status === "confirmed" ? (
                      <span className="text-[11px] text-green-400 border border-green-400/30 bg-green-400/10 rounded-full px-2.5 py-1">
                        Terkonfirmasi
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded-full px-2.5 py-1">
                        Menunggu
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {c.status !== "confirmed" && (
                        <Button size="sm" onClick={() => setConfirmId(c.id)}>
                          <CheckCircle2 size={14} /> Konfirmasi
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(c.id)}
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
          {confirmations.length === 0 && (
            <EmptyState
              icon={Inbox}
              title="Belum ada konfirmasi"
              description="Konfirmasi donasi yang dikirim pendukung lewat halaman utama akan muncul di sini."
            />
          )}
        </div>
      </Card>

      <Modal
        open={proof != null}
        onClose={() => setProof(null)}
        title="Bukti Transfer"
        description={proof ? `${proof.name} — ${formatRupiah(proof.amount)}` : undefined}
        size="md"
      >
        {proof && (
          <div className="space-y-4">
            <a href={proof.proofUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Image
                src={proof.proofUrl}
                alt="Bukti transfer"
                width={600}
                height={800}
                className="w-full h-auto rounded-xl border border-white/10"
              />
            </a>
            {proof.message && (
              <p className="text-white/60 text-sm italic">&ldquo;{proof.message}&rdquo;</p>
            )}
            <a
              href={proof.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f5c842] text-xs underline"
            >
              Buka di tab baru
            </a>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        onConfirm={handleConfirm}
        loading={working}
        title="Konfirmasi donasi ini?"
        description="Data akan otomatis ditambahkan ke daftar donatur (nama, nominal, dan kata-kata)."
        confirmText="Konfirmasi"
      />

      <ConfirmDialog
        open={deleteId != null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={working}
        title="Hapus konfirmasi?"
        description="Konfirmasi donasi ini akan dihapus permanen."
      />
    </div>
  );
}
