/**
 * Google Maps Geocoding API Server Module
 *
 * Resolves a ZIP code or address string into structured address components
 * (streetAddress, city, state, zipCode, country, formattedAddress, placeId)
 * using the official Google Maps Geocoding API.
 */

export async function resolveAddressWithGoogleMaps(zipOrAddress) {
  try {
    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("[Google Geocode Error]: Missing Google Maps API Key.");
      return {
        ok: false,
        error: "Google Maps API Key is not configured on the server.",
      };
    }

    const cleanInput = (zipOrAddress || "").toString().trim();
    if (!cleanInput) {
      return {
        ok: false,
        error: "A valid ZIP code or address string is required.",
      };
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      cleanInput
    )}&components=country:US&key=${apiKey}`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[Google Geocode Error]: HTTP ${res.status}`, text);
      return {
        ok: false,
        error: `Google Maps API request failed (HTTP ${res.status}).`,
      };
    }

    const data = await res.json().catch(() => ({}));
    if (data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) {
      console.error("[Google Geocode Error]: Geocoding status:", data.status, data.error_message);
      return {
        ok: false,
        error:
          data.error_message ||
          `Google Maps was unable to resolve an address for "${cleanInput}". Please verify your ZIP code.`,
      };
    }

    const result = data.results[0];
    const components = result.address_components || [];

    let streetNumber = "";
    let route = "";
    let city = "";
    let state = "";
    let zipCode = "";
    let country = "";

    components.forEach((c) => {
      const types = c.types || [];
      if (types.includes("street_number")) {
        streetNumber = c.long_name;
      }
      if (types.includes("route")) {
        route = c.long_name;
      }
      if (types.includes("locality") || types.includes("postal_town") || types.includes("sublocality")) {
        if (!city) city = c.long_name;
      }
      if (types.includes("administrative_area_level_1")) {
        state = c.short_name; // e.g. "GA"
      }
      if (types.includes("postal_code")) {
        zipCode = c.long_name;
      }
      if (types.includes("country")) {
        country = c.short_name === "US" ? "USA" : c.long_name;
      }
    });

    const streetAddress = `${streetNumber} ${route}`.trim() || result.formatted_address?.split(",")[0] || cleanInput;
    const formattedAddress = result.formatted_address || `${city}, ${state} ${zipCode}, USA`;

    if (!city || !state) {
      return {
        ok: false,
        error: `Google Maps could not determine the city and state for ZIP code ${cleanInput}.`,
      };
    }

    return {
      ok: true,
      address: {
        streetAddress,
        city,
        state,
        zipCode: zipCode || cleanInput,
        country: country || "USA",
        formattedAddress,
        placeId: result.place_id || null,
        rawGoogleResult: result,
      },
    };
  } catch (err) {
    console.error("[Google Geocode Exception]:", err.message);
    return {
      ok: false,
      error: err.message || "Failed to resolve address with Google Maps API.",
    };
  }
}
