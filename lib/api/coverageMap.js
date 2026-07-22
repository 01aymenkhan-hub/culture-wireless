/**
 * CoverageMap enterprise API — cellular signal strength & coverage.
 *
 * Docs: referenceFiles/coverage-api-guide.md
 * Endpoint: GET {apiUrl}/signal-strength/lookup
 *
 * Auth: Bearer token via Authorization header.
 */

import { env } from "../config/env.js";

// Signal thresholds (dBm) — mobile uses a single threshold.
const THRESHOLDS = {
  mobile: -115, // Cellular mobile tolerates weaker signal
};

// 5G Home Internet RSRP thresholds (client requirements)
const HOME_INTERNET_RSRP = {
  preferred: -100,       // >= -100 dBm = Good/Excellent → Available
  minimumAcceptable: -105, // >= -105 dBm = Fair → Qualified with Caution
  doNotQualify: -110,    // < -110 dBm = Poor → Not Available
};

// Surrounding coverage percentage thresholds (client requirements)
const HOME_INTERNET_COVERAGE = {
  available: {
    quarterMile: 0.90,
    halfMile: 0.85,
    oneMile: 0.80,
  },
  caution: {
    quarterMile: 0.80,
    halfMile: 0.75,
  },
};

// Signal pocket threshold — if exact-location is more than 15 dBm weaker
// than the quarter-mile average, the address is in an isolated signal pocket.
const SIGNAL_POCKET_VARIATION = 15;

/**
 * Qualify a 5G Home Internet address using the client's recommended model.
 *
 * Returns: { available: boolean, status: "available"|"caution"|"unavailable" }
 */
function qualifyHomeInternet(row) {
  if (!row) return { available: false, status: "unavailable" };

  const exactSignal = row.signal?.signal;
  const qmSignal = row.signal?.quarterMile;
  const qmCoverage = row.coverage?.quarterMile;
  const hmCoverage = row.coverage?.halfMile;
  const omCoverage = row.coverage?.oneMile;

  // Primary criterion: exact-location signal must exist
  if (typeof exactSignal !== "number") {
    return { available: false, status: "unavailable" };
  }

  // Do not qualify if exact-location signal is below minimum acceptable
  if (exactSignal < HOME_INTERNET_RSRP.doNotQualify) {
    return { available: false, status: "unavailable" };
  }

  // Signal pocket validation: reject if exact-location is significantly
  // weaker than surrounding quarter-mile signal average
  if (
    typeof qmSignal === "number" &&
    (exactSignal - qmSignal) < -SIGNAL_POCKET_VARIATION
  ) {
    return { available: false, status: "unavailable" };
  }

  // Check for "Available" tier
  if (
    exactSignal >= HOME_INTERNET_RSRP.preferred &&
    typeof qmCoverage === "number" && qmCoverage >= HOME_INTERNET_COVERAGE.available.quarterMile &&
    typeof hmCoverage === "number" && hmCoverage >= HOME_INTERNET_COVERAGE.available.halfMile &&
    typeof omCoverage === "number" && omCoverage >= HOME_INTERNET_COVERAGE.available.oneMile
  ) {
    return { available: true, status: "available" };
  }

  // Check for "Qualified with Caution" tier
  if (
    exactSignal >= HOME_INTERNET_RSRP.minimumAcceptable &&
    typeof qmCoverage === "number" && qmCoverage >= HOME_INTERNET_COVERAGE.caution.quarterMile &&
    typeof hmCoverage === "number" && hmCoverage >= HOME_INTERNET_COVERAGE.caution.halfMile
  ) {
    return { available: true, status: "caution" };
  }

  // Everything else is unavailable
  return { available: false, status: "unavailable" };
}

/**
 * Query CoverageMap for signal strength at a location.
 * Accepts a normalized address + serviceType ("home_internet" | "mobile").
 *
 * Returns:
 *   { available, status, provider, technology, signal, coverage, raw? }
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
        status: "available",
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
      status: "unavailable",
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
        status: "unavailable",
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
      status: "unavailable",
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
      status: "unavailable",
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

  // ── 5G Home Internet: multi-tier qualification ──
  if (serviceType === "home_internet") {
    const qualification = qualifyHomeInternet(tmo5g);
    return {
      available: qualification.available,
      status: qualification.status,
      provider: "coveragemap",
      technology: qualification.available ? "5G" : null,
      signal: tmo5g?.signal?.signal ?? null,
      coverage: tmo5g?.coverage?.quarterMile ?? null,
      serviceType,
      ...(includeRaw ? { raw: data } : {}),
    };
  }

  // ── Mobile: unchanged simple threshold logic ──
  const threshold = THRESHOLDS.mobile;
  const sig5g = tmo5g?.signal?.signal;
  const sig4g = tmo4g?.signal?.signal;
  const has5g = typeof sig5g === "number" && sig5g >= threshold;
  const has4g = typeof sig4g === "number" && sig4g >= threshold;

  let available = false;
  let technology = null;
  let signal = null;
  let coverage = null;
  let status = "unavailable";

  if (has5g || has4g) {
    available = true;
    status = "available";
    technology = has5g ? "5G" : "4G";
    signal = has5g ? sig5g : sig4g;
    coverage = has5g
      ? (tmo5g.coverage?.quarterMile ?? null)
      : (tmo4g.coverage?.quarterMile ?? null);
  }

  return {
    available,
    status,
    provider: "coveragemap",
    technology,
    signal,
    coverage,
    serviceType,
    ...(includeRaw ? { raw: data } : {}),
  };
}

