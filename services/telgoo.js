/**
 * Frontend Telgoo API Service Module
 *
 * All API communication goes strictly through internal Next.js API routes (/api/telgoo/*).
 * Zero direct calls to Telgoo (vcareapi.com) are made from the browser.
 * Zero mock data or hardcoded fallback plans are used.
 */

/**
 * Check mobile service availability for a given 5-digit ZIP code.
 * Sends request to internal Next.js route: /api/telgoo/coverage
 */
export async function checkServiceAvailability(zipCode) {
  try {
    const cleanZip = (zipCode || "").toString().trim();
    if (!cleanZip || cleanZip.length !== 5 || !/^\d{5}$/.test(cleanZip)) {
      return { ok: false, error: "Please enter a valid 5-digit ZIP code." };
    }

    const res = await fetch("/api/telgoo/coverage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zipCode: cleanZip }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok) {
      return {
        ok: true,
        enrollmentId: data.enrollmentId,
        city: data.city || "",
        state: data.state || "",
        zipCode: cleanZip,
      };
    } else {
      return {
        ok: false,
        error: data.error || "Sorry, we don't have coverage in this area yet.",
      };
    }
  } catch (err) {
    console.error("[Telgoo Client Service Error]:", err);
    return {
      ok: false,
      error: "Unable to verify coverage right now. Please try again.",
    };
  }
}

/**
 * Fetch available mobile plans for a given ZIP code.
 * Sends request to internal Next.js route: /api/telgoo/plans
 * Returns real plans or error if API fails (NO mock fallbacks).
 */
export async function getPlanList(zipCode) {
  try {
    const cleanZip = (zipCode || "").toString().trim();
    if (!cleanZip || cleanZip.length !== 5 || !/^\d{5}$/.test(cleanZip)) {
      return { ok: false, error: "Please provide a valid 5-digit ZIP code." };
    }

    const res = await fetch("/api/telgoo/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zipCode: cleanZip }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok && Array.isArray(data.plans) && data.plans.length > 0) {
      return { ok: true, plans: data.plans };
    } else {
      return {
        ok: false,
        error: data.error || "Unable to load plans for your area. Please try again in a few moments.",
      };
    }
  } catch (err) {
    console.error("[Telgoo Client Service Error]:", err);
    return {
      ok: false,
      error: "Something went wrong while contacting our service. Please try again.",
    };
  }
}
