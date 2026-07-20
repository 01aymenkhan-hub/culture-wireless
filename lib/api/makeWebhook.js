/**
 * Make.com webhook helper for the support form.
 * Server-side only. Never call the webhook from the browser.
 */

import { env } from "../config/env.js";

const RECIPIENT_MAX_LEN = 5000;

export async function sendSupportInquiry({ name, email, type, message }) {
  const payload = {
    name: String(name || "").slice(0, 200),
    email: String(email || "").slice(0, 200),
    type: String(type || "").slice(0, 100),
    message: String(message || "").slice(0, RECIPIENT_MAX_LEN),
    submittedAt: new Date().toISOString(),
    source: "culturewireless.com/support",
  };

  if (!env.supportWebhookUrl) {
    // Development / not yet configured — treat as success but flag as no-op.
    return { ok: true, delivered: false, reason: "Support webhook not configured" };
  }

  let res;
  try {
    res = await fetch(env.supportWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (err) {
    return { ok: false, delivered: false, error: err.message };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      delivered: false,
      error: `HTTP ${res.status}: ${text.slice(0, 200)}`,
    };
  }

  return { ok: true, delivered: true };
}
