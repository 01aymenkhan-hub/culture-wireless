import { NextResponse } from "next/server";
import { checkTelgoo5Availability, isTelgoo5Enabled } from "@/lib/api/telgoo5";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isTelgoo5Enabled()) {
    return NextResponse.json(
      {
        available: null,
        disabled: true,
        reason: "Telgoo5 integration is not configured yet.",
      },
      { status: 501 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { available: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const zipCode = body.zipCode || body.zip_code;
  const serviceType = body.serviceType || body.service_type;

  if (!zipCode) {
    return NextResponse.json(
      { available: false, error: "zipCode is required" },
      { status: 400 },
    );
  }

  const result = await checkTelgoo5Availability({ zipCode, serviceType });
  return NextResponse.json(result);
}
