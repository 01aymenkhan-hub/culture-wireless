"use client";

import { useAuth } from "@clerk/nextjs";

/**
 * A shared client-side checkout gate for both public wizards. It is only a
 * UX gate; the hosted-checkout Route Handler independently verifies auth.
 */
export function useCheckoutAuth() {
  const { isLoaded, isSignedIn, redirectToSignIn } = useAuth();

  async function requireCheckoutAuthentication() {
    if (!isLoaded) {
      return { allowed: false, pending: true };
    }

    if (isSignedIn) {
      return { allowed: true };
    }

    // Both wizard contexts persist their complete state to localStorage, so
    // returning to the current URL restores the customer at review step 6.
    await redirectToSignIn({ redirectUrl: window.location.href });
    return { allowed: false, redirecting: true };
  }

  return { isAuthLoaded: isLoaded, isSignedIn, requireCheckoutAuthentication };
}
