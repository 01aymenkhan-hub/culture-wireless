"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="clerk-auth-page">
      <SignIn />
    </main>
  );
}
