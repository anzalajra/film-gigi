import * as React from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Icon size={22} className="text-white/30" />
        </div>
      )}
      <p className="text-white/70 text-sm font-medium">{title}</p>
      {description && (
        <p className="text-white/35 text-xs mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
