/**
 * CoverageMap enterprise API — cellular signal strength & coverage.
 *
 * Docs: referenceFiles/coverage-api-guide.md
 * Endpoint: GET {apiUrl}/signal-strength/lookup
 *
 * Auth: Bearer token via Authorization header.
 */

import { env } from "../config/env.js";

// Signal thresholds (dBm) — everything above these counts as "usable".
const THRESHOLDS = {
  home_internet: -95, // 5G home requires stronger signal
  mobile: -115, // Cellular mobile tolerates weaker signal
};

/**
 * Query CoverageMap for signal strength at a location.
 * Accepts a normalized address + serviceType ("home_internet" | "mobile").
 *
 * Returns:
 *   { available, provider, technology, signal, coverage, raw? }
 */
export async function checkCellularCoverage(
  address,
  serviceType = "mobile",
  { includeRaw = false } = {},
) {
  if (!env.coverage.isConfigured) {
    if (env.enableAvailabilityMocks) {
      const mockSignal = serviceType === "home_internet" ? -82 : -78;
      return {
        available: true,
        provider: "coveragemap",
        technology: "5G",
        signal: mockSignal,
        coverage: serviceType === "home_internet" ? 0.95 : 0.98,
        mock: true,
        serviceType,
      };
    }
    return {
      available: false,
      provider: "coveragemap",
      technology: null,
      signal: null,
      coverage: null,
      error: "CoverageMap API key not configured",
      serviceType,
    };
  }

  const hasCoords =
    typeof address.latitude === "number" && typeof address.longitude === "number";

  const base = env.coverage.apiUrl.replace(/\/$/, "");
  const url = new URL(`${base}/signal-strength/lookup`);
  url.searchParams.set("providers", "TMO");
  url.searchParams.set("technologies", "4G,5G");

  if (hasCoords) {
    url.searchParams.set("latitude", String(address.latitude));
    url.searchParams.set("longitude", String(address.longitude));
  } else {
    // Build a clean address string — never use POI names/formattedAddress as-is.
    const addrString = [
      address.streetAddress,
      address.city,
      address.state,
    ]
      .filter(Boolean)
      .join(", ");
    const full = address.zipCode ? `${addrString} ${address.zipCode}` : addrString;
    if (!full) {
      return {
        available: false,
        provider: "coveragemap",
        technology: null,
        signal: null,
        coverage: null,
        error: "No coordinates or address components provided",
        serviceType,
      };
    }
    url.searchParams.set("address", full);
  }

  let res;
  try {
    res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.coverage.apiKey}`,
      },
      cache: "no-store",
    });
  } catch (err) {
    return {
      available: false,
      provider: "coveragemap",
      technology: null,
      signal: null,
      coverage: null,
      error: err.message,
      serviceType,
    };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      available: false,
      provider: "coveragemap",
      technology: null,
      signal: null,
      coverage: null,
      error: `HTTP ${res.status}: ${text.slice(0, 200)}`,
      httpStatus: res.status,
      serviceType,
    };
  }

  const data = await res.json().catch(() => null);
  // Response is either a bare array or wrapped in { data: [...] }
  const results = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

  const tmo5g = results.find(
    (row) => row.provider?.code === "TMO" && row.technology?.code === "5G",
  );
  const tmo4g = results.find(
    (row) => row.provider?.code === "TMO" && row.technology?.code === "4G",
  );

  const threshold = THRESHOLDS[serviceType] ?? THRESHOLDS.mobile;
  const sig5g = tmo5g?.signal?.signal;
  const sig4g = tmo4g?.signal?.signal;
  const has5g = typeof sig5g === "number" && sig5g >= threshold;
  const has4g = typeof sig4g === "number" && sig4g >= threshold;

  let available = false;
  let technology = null;
  let signal = null;
  let coverage = null;

  if (serviceType === "home_internet") {
    if (has5g) {
      available = true;
      technology = "5G";
      signal = sig5g;
      coverage = tmo5g.coverage?.quarterMile ?? null;
    }
  } else if (has5g || has4g) {
    available = true;
    technology = has5g ? "5G" : "4G";
    signal = has5g ? sig5g : sig4g;
    coverage = has5g
      ? (tmo5g.coverage?.quarterMile ?? null)
      : (tmo4g.coverage?.quarterMile ?? null);
  }

  return {
    available,
    provider: "coveragemap",
    technology,
    signal,
    coverage,
    serviceType,
    ...(includeRaw ? { raw: data } : {}),
  };
}
