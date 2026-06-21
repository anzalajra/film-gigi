"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: keyof typeof sizes;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full bg-[#141414] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150",
          sizes[size]
        )}
      >
        {title && (
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-white/8">
            <div>
              <h3 className="text-white font-semibold">{title}</h3>
              {description && (
                <p className="text-white/40 text-xs mt-0.5">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="text-white/40 hover:text-white transition-colors -mr-1.5 -mt-0.5 p-1.5 rounded-lg hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/8">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  description,
  confirmText = "Hapus",
  cancelText = "Batal",
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex gap-4">
        <div className="w-10 h-10 shrink-0 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle size={18} className="text-red-400" />
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-semibold">{title}</h3>
          {description && (
            <p className="text-white/50 text-sm mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
