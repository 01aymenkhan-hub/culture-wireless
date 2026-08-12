"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="clerk-auth-page">
      <SignUp />
    </main>
  );
}
