"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-[var(--cw-border-1)] bg-[var(--cw-bg-1)] p-6 shadow-[var(--cw-shadow-2)]",
        className,
      )}
      {...props}
    />
  );
});

const CardHeader = React.forwardRef(function CardHeader({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("flex flex-col gap-1.5 pb-4", className)} {...props} />
  );
});

const CardTitle = React.forwardRef(function CardTitle({ className, ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={cn(
        "font-[var(--cw-font-display)] text-lg font-semibold tracking-wide uppercase text-[var(--cw-fg-1)]",
        className,
      )}
      {...props}
    />
  );
});

const CardDescription = React.forwardRef(function CardDescription({ className, ...props }, ref) {
  return (
    <p ref={ref} className={cn("text-sm text-[var(--cw-fg-3)]", className)} {...props} />
  );
});

const CardContent = React.forwardRef(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn("pt-2", className)} {...props} />;
});

const CardFooter = React.forwardRef(function CardFooter({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("flex items-center pt-4", className)} {...props} />
  );
});

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
