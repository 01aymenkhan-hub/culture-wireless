/**
 * eBOSS / eFiberBoss — fiber availability API.
 *
 * Docs: referenceFiles/EBOSS Documentation.pdf
 * Endpoint used: GET {baseUrl}/api/v2/getbizpremstatus_api.php
 *
 * iStatus values:
 *   0 = Off-Net       (not serviceable)
 *   1 = Connected     (active customer)
 *   2 = Near-Net      (construction required)
 *   3 = On-Net        (serviceable & available)
 */

import { env } from "../config/env.js";

/**
 * Query eBOSS for the fiber status of a premise.
 * Accepts a normalized address (see lib/validation/availability.js).
 *
 * Returns a normalized response:
 *   { available, provider: "eboss", status, statusLabel, raw? }
 */
export async function checkFiberAvailability(address, { includeRaw = false } = {}) {
  if (!env.eboss.isConfigured) {
    if (env.enableAvailabilityMocks) {
      return {
        available: false,
        provider: "eboss",
        status: null,
        statusLabel: "eBOSS not configured (mock)",
        mock: true,
      };
    }
    return {
      available: false,
      provider: "eboss",
      status: null,
      statusLabel: "eBOSS not configured",
      error: "eBOSS API key not configured",
    };
  }

  const params = new URLSearchParams({
    request_type: "premise_check",
    carrier: env.eboss.carrier,
    premiseaddress: address.streetAddress,
    premisecity: address.city,
    premisestate: address.state,
    premisezipcode: address.zipCode,
    vSuitAptUnit: address.unit || "NULL",
  });

  const endpoint = `${env.eboss.baseUrl.replace(/\/$/, "")}/api/v2/getbizpremstatus_api.php?${params.toString()}`;

  let res;
  try {
    res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apiKey: env.eboss.apiKey,
      },
      cache: "no-store",
    });
  } catch (err) {
    return {
      available: false,
      provider: "eboss",
      status: null,
      statusLabel: "Network error",
      error: err.message,
    };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.log('error eboss', text)
    return {
      available: false,
      provider: "eboss",
      status: null,
      statusLabel: `HTTP ${res.status}`,
      error: text.slice(0, 200) || `HTTP ${res.status}`,
      httpStatus: res.status,
    };
  }

  const data = await res.json().catch(() => null);
  // console.log('eboss data', data)
  const premise = data?.Data?.[0];
  const rawStatus = premise?.iStatus;
  const status =
    rawStatus === undefined || rawStatus === null ? null : parseInt(rawStatus, 10);

  const available = data?.Code === 200 && status !== null && status !== 0;

  return {
    available,
    provider: "eboss",
    status,
    statusLabel: premise?.["Premise Status"] || labelForStatus(status),
    ...(includeRaw ? { raw: data } : {}),
  };
}

function labelForStatus(status) {
  switch (status) {
    case 0:
      return "Off-Net";
    case 1:
      return "Connected";
    case 2:
      return "Near-Net";
    case 3:
      return "On-Net";
    default:
      return "Unknown";
  }
}
