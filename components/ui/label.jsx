"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label = React.forwardRef(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "font-[var(--cw-font-display)] text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--cw-fg-3)]",
        className,
      )}
      {...props}
    />
  );
});

export { Label };
