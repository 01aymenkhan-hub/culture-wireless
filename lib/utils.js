/**
 * `cn(...)` — merge Tailwind class names safely.
 * Standard shadcn/ui utility.
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
