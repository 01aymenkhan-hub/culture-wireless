/**
 * Zoho CRM / Billing / Books integration — SCAFFOLD ONLY.
 *
 * Full Zoho APIs will be wired in later. This module gives you a stable surface
 * so you can call `zoho.createLead(...)`, `zoho.createSubscription(...)`, etc.
 * from route handlers without changing consumer code once real credentials are
 * provided.
 *
 * To enable:
 *   1. Populate env vars in .env.local (see .env.example).
 *   2. Set FEATURE_ZOHO=true.
 *   3. Implement each `not-yet-implemented` function below by:
 *      a) Calling `getAccessToken()` to obtain a short-lived OAuth token, and
 *      b) POST/GET the appropriate Zoho REST endpoint under {apiDomain}.
 *
 * Docs (once you're ready):
 *   https://www.zoho.com/crm/developer/docs/api/v6/
 *   https://www.zoho.com/billing/api/v1/
 */

import { env } from "../config/env.js";

let cachedToken = null;
let cachedTokenExpiresAt = 0;

export function isZohoEnabled() {
  return env.zoho.enabled && env.zoho.isConfigured;
}

async function getAccessToken() {
  if (!isZohoEnabled()) throw new Error("Zoho is not configured.");
  const now = Date.now();
  if (cachedToken && cachedTokenExpiresAt > now + 30_000) return cachedToken;

  const url = `${env.zoho.accountsUrl.replace(/\/$/, "")}/oauth/v2/token`;
  const params = new URLSearchParams({
    refresh_token: env.zoho.refreshToken,
    client_id: env.zoho.clientId,
    client_secret: env.zoho.clientSecret,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${url}?${params.toString()}`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Zoho token exchange failed: HTTP ${res.status}`);
  }
  const data = await res.json();
  cachedToken = data.access_token;
  // Zoho tokens are typically valid for 1 hour.
  cachedTokenExpiresAt = now + (data.expires_in ?? 3600) * 1000;
  return cachedToken;
}

/**
 * Authenticated fetch against a Zoho product API (CRM, Billing, Books, etc.).
 * Consumers pass an absolute path such as "/crm/v6/Leads" — this prefixes
 * apiDomain and injects `Authorization: Zoho-oauthtoken {token}`.
 */
export async function zohoFetch(path, init = {}) {
  const token = await getAccessToken();
  const url = `${env.zoho.apiDomain.replace(/\/$/, "")}${path}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Zoho-oauthtoken ${token}`,
    ...(init.headers || {}),
  };
  return fetch(url, { ...init, headers, cache: "no-store" });
}

/* -------------------------------------------------------------------------- */
/* Scaffolded high-level operations. Implement as needed.                     */
/* -------------------------------------------------------------------------- */

export async function getRouterAddon(addonCode = "CWG-GSpire") {
  if (!isZohoEnabled()) {
    return { ok: false, disabled: true, reason: "Zoho is not configured yet." };
  }
  try {
    const res = await zohoFetch(`/billing/v1/addons/${addonCode}`);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Zoho Addon API Error: HTTP ${res.status} - ${text.slice(0, 200)}`,
        status: res.status,
      };
    }
    const data = await res.json();
    const rawPrice = data?.addon?.price_brackets?.[0]?.price;
    const price = typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice) || 0;
    return { ok: true, addon: data.addon, price };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function getPlans() {
  if (!isZohoEnabled()) {
    return { ok: false, disabled: true, reason: "Zoho is not configured yet." };
  }
  try {
    const res = await zohoFetch("/billing/v1/plans");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Zoho API Error: HTTP ${res.status} - ${text.slice(0, 200)}`,
        status: res.status,
      };
    }
    const data = await res.json();
    let plans = data.plans || [];

    if (plans.length > 0) {
      // Fetch Fiber Router Add-on (CWG-GSpire)
      let fiberAddonPrice = 0;
      let fiberAddonCode = null;
      try {
        const addonRes = await getRouterAddon("CWG-GSpire");
        if (addonRes.ok) {
          fiberAddonPrice = addonRes.price;
          fiberAddonCode = addonRes.addon?.addon_code || "CWG-GSpire";
        }
      } catch (err) {
        console.error("Failed to fetch Fiber router addon:", err.message);
      }

      // Fetch 5G Home Internet Router Add-on (5GHR)
      let wirelessAddonPrice = 0;
      let wirelessAddonCode = null;
      try {
        const wAddonRes = await getRouterAddon("5GHR");
        if (wAddonRes.ok) {
          wirelessAddonPrice = wAddonRes.price;
          wirelessAddonCode = wAddonRes.addon?.addon_code || "5GHR";
        }
      } catch (err) {
        console.error("Failed to fetch 5G Home router addon:", err.message);
      }

      plans = plans.map((p) => {
        const originalPrice = p.recurring_price;
        let addonPrice = 0;
        let addonCode = null;

        if (
          p.product_id === "3390400000001023053" ||
          (p.plan_code || "").startsWith("CWG100") ||
          (p.plan_code || "").startsWith("CWG500") ||
          (p.plan_code || "").startsWith("CWG1000")
        ) {
          addonPrice = fiberAddonPrice;
          addonCode = fiberAddonCode;
        } else if (p.plan_code === "CWG5GHI") {
          addonPrice = wirelessAddonPrice;
          addonCode = wirelessAddonCode;
        }

        const displayPrice = originalPrice + addonPrice;
        return {
          ...p,
          original_price: originalPrice,
          addon_price: addonPrice,
          addon_code: addonCode,
          display_price: displayPrice,
        };
      });
    }

    return { ok: true, plans };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function createLead(leadData) {
  if (!isZohoEnabled()) {
    return { ok: false, disabled: true, reason: "Zoho is not configured yet." };
  }
  throw new Error("zoho.createLead not-yet-implemented");
}


