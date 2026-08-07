import { NextResponse } from "next/server";
import { getPlanListServer } from "@/lib/api/telgoo";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { zipCode, zip_code } = body;
    const targetZip = (zipCode || zip_code || "").toString().trim();

    if (!targetZip || targetZip.length !== 5 || !/^\d{5}$/.test(targetZip)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid 5-digit ZIP code." },
        { status: 400 }
      );
    }
console.log("targetZip", targetZip);
    const result = await getPlanListServer(targetZip);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error || "Unable to load plans for your area." },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[API Route /api/telgoo/plans Error]:", err);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred while loading mobile plans." },
      { status: 500 }
    );
  }
}
