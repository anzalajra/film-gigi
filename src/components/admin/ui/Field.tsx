import * as React from "react";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/25 transition-colors focus:outline-none focus:border-[#f5c842]/70 focus:bg-white/[0.05] disabled:opacity-50";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-white/60 text-xs font-medium mb-1.5", className)}
      {...props}
    />
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(inputBase, className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(inputBase, "resize-y", className)} {...props} />
));
Textarea.displayName = "Textarea";

/** Label + control + optional hint/error, with consistent spacing. */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  className,
  children,
}: {
  label?: string;
  hint?: React.ReactNode;
  error?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error ? (
        <p className="text-red-400 text-xs mt-1.5">{error}</p>
      ) : hint ? (
        <p className="text-white/30 text-xs mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}
