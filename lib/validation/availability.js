/**
 * Client-safe validation helpers for availability requests.
 *
 * Contract we normalize everything to (used by both the address entry component
 * and the API routes):
 *
 *   {
 *     formattedAddress: string,   // "1247 Lakeview Drive, Riverdale, GA 30274, USA"
 *     streetAddress:    string,   // "1247 Lakeview Drive"
 *     unit:             string,   // "Apt 4B"           (optional)
 *     city:             string,   // "Riverdale"
 *     state:            string,   // "GA"
 *     zipCode:          string,   // "30274"
 *     latitude:         number|null,
 *     longitude:        number|null,
 *     serviceType?:     "home_internet" | "mobile" | null,
 *   }
 */

const STATE_REGEX = /^[A-Z]{2}$/i;
const ZIP_REGEX = /^\d{5}$/;

/**
 * Coerce whatever the frontend sent into the normalized shape.
 * Accepts a handful of legacy field names (zip, zip_code, lat, lng, etc.)
 * for a smoother refactor.
 */
export function normalizeAddress(input = {}) {
  const formattedAddress = input.formattedAddress ?? input.address ?? "";
  const streetAddress = input.streetAddress ?? input.street ?? "";
  const unit = input.unit ?? "";
  const city = input.city ?? "";
  const state = (input.state ?? "").toUpperCase();
  const zipCode = input.zipCode ?? input.zip_code ?? input.zip ?? "";

  const lat = input.latitude ?? input.lat ?? null;
  const lng = input.longitude ?? input.lng ?? null;
  const latitude = typeof lat === "number" ? lat : lat ? Number(lat) : null;
  const longitude = typeof lng === "number" ? lng : lng ? Number(lng) : null;

  return {
    formattedAddress: String(formattedAddress).trim(),
    streetAddress: String(streetAddress).trim(),
    unit: String(unit).trim(),
    city: String(city).trim(),
    state: state && STATE_REGEX.test(state) ? state : "",
    zipCode: String(zipCode).trim(),
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    serviceType: input.serviceType ?? input.service_type ?? null,
  };
}

/**
 * Validate a normalized address. Returns { ok, errors }.
 * At minimum we need either coordinates or (street + city + state + zip).
 */
export function validateAddress(addr) {
  const errors = [];
  if (!addr) {
    errors.push("Address is required.");
    return { ok: false, errors };
  }

  const hasCoords =
    typeof addr.latitude === "number" && typeof addr.longitude === "number";
  const hasFullText =
    addr.streetAddress && addr.city && addr.state && addr.zipCode;

  if (!hasCoords && !hasFullText) {
    errors.push(
      "Provide either latitude/longitude or a full streetAddress, city, state, and zipCode.",
    );
  }

  if (addr.zipCode && !ZIP_REGEX.test(addr.zipCode)) {
    errors.push("zipCode must be a 5-digit US ZIP.");
  }
  if (addr.state && !STATE_REGEX.test(addr.state)) {
    errors.push("state must be a 2-letter US state code.");
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Convenience: parse + validate in one pass. Throws on validation failure.
 */
export function parseAndValidateAddress(input) {
  const normalized = normalizeAddress(input);
  const { ok, errors } = validateAddress(normalized);
  if (!ok) {
    const err = new Error(errors.join(" "));
    err.status = 400;
    err.details = errors;
    throw err;
  }
  return normalized;
}
