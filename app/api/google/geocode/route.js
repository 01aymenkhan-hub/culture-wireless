import { NextResponse } from "next/server";
import { resolveAddressWithGoogleMaps } from "@/lib/api/googleGeocode";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const zipCode = body.zipCode || body.zip || body.address;

    if (!zipCode) {
      return NextResponse.json(
        { ok: false, error: "Missing required parameter: zipCode" },
        { status: 400 }
      );
    }

    const result = await resolveAddressWithGoogleMaps(zipCode);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[API Route /api/google/geocode Exception]:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to resolve address with Google Maps API." },
      { status: 500 }
    );
  }
}
