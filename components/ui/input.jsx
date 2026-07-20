"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-[var(--cw-border-2)] bg-[var(--cw-bg-1)] px-4 py-2 text-sm text-[var(--cw-fg-1)] outline-none transition-shadow placeholder:text-[var(--cw-fg-4)] focus-visible:border-[var(--cw-purple)] focus-visible:ring-2 focus-visible:ring-[var(--cw-purple)]/30 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});

export { Input };
