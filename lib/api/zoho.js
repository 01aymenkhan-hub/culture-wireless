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

export async function getPlans() {
  if (!isZohoEnabled()) {
    return { ok: false, disabled: true, reason: "Zoho is not configured yet." };
  }
  try {
    const res = await zohoFetch("/billing/v1/plans?product_id=3390400000001023053");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Zoho API Error: HTTP ${res.status} - ${text.slice(0, 200)}`,
        status: res.status,
      };
    }
    const data = await res.json();
    return { ok: true, plans: data.plans || [] };
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


