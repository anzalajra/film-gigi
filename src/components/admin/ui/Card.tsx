import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  hover,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "bg-[#141414] border border-white/8 rounded-2xl p-5",
        hover && "transition-colors hover:border-white/15",
        className
      )}
      {...props}
    />
  );
}
