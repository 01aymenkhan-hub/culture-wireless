"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/mobile/signup");
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--cw-bg-2)] flex items-center justify-center text-sm text-[var(--cw-fg-3)]">
      Redirecting to Culture Mobile Signup…
    </div>
  );
}
