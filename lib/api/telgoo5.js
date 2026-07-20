/**
 * Telgoo5 — mobile availability / order provisioning API.
 *
 * NOTE: This integration is disabled until credentials are provisioned.
 * When enabled, wire it up here and remove the `throw` in `checkTelgoo5Availability`.
 *
 * Enable via env:
 *   FEATURE_TELGOO5=true
 *   TELGOO5_BASE_URL=...
 *   TELGOO5_AGENT_ID=...
 */

import { env } from "../config/env.js";

export function isTelgoo5Enabled() {
  return env.telgoo5.enabled && env.telgoo5.isConfigured;
}

export async function checkTelgoo5Availability({ zipCode, serviceType }) {
  if (!isTelgoo5Enabled()) {
    return {
      available: null,
      provider: "telgoo5",
      disabled: true,
      reason: "Telgoo5 integration is not configured yet.",
    };
  }

  const endpoint = `${env.telgoo5.baseUrl.replace(/\/$/, "")}/check_service_availability`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agent_id: env.telgoo5.agentId,
      zip_code: zipCode,
      enrollment_type: "NON_LIFELINE",
      service_type: serviceType,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      available: false,
      provider: "telgoo5",
      error: `HTTP ${res.status}: ${text.slice(0, 200)}`,
    };
  }

  const data = await res.json().catch(() => null);
  const available =
    data?.data?.service_available === true ||
    data?.service_available === true ||
    data?.available === true ||
    data?.status === "success";

  return {
    available: !!available,
    provider: "telgoo5",
  };
}
