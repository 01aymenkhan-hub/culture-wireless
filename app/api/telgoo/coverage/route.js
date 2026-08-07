import { NextResponse } from "next/server";
import { checkServiceAvailabilityServer } from "@/lib/api/telgoo";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { zipCode, zip_code } = body;
    const targetZip = (zipCode || zip_code || "").toString().trim();

    if (!targetZip || targetZip.length !== 5 || !/^\d{5}$/.test(targetZip)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid 5-digit ZIP code." },
        { status: 400 }
      );
    }

    const result = await checkServiceAvailabilityServer(targetZip);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error || "Sorry, we don't have coverage in this area yet." },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[API Route /api/telgoo/coverage Error]:", err);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred while checking coverage." },
      { status: 500 }
    );
  }
}
