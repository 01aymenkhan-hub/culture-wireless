"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui-style Button — mapped to Culture Wireless design tokens.
 * The existing `.btn` classes in globals.css remain the primary way pages
 * render buttons. This primitive is available for new components and forms
 * that want Tailwind-flavoured composition (e.g. inside shadcn Card/Dialog).
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cw-purple)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--cw-purple)] text-white hover:opacity-90 shadow-[var(--cw-shadow-1)]",
        primary:
          "bg-[var(--cw-navy)] text-white hover:opacity-90 shadow-[var(--cw-shadow-1)]",
        ghost:
          "bg-transparent text-[var(--cw-fg-1)] border border-[var(--cw-border-2)] hover:border-[var(--cw-purple)] hover:text-[var(--cw-purple)]",
        yellow:
          "bg-[var(--cw-yellow)] text-[var(--cw-navy)] hover:opacity-90",
        outline:
          "border border-[var(--cw-border-2)] bg-transparent text-[var(--cw-fg-1)] hover:bg-[var(--cw-bg-2)]",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const Button = React.forwardRef(function Button(
  { className, variant, size, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

export { Button, buttonVariants };
