import { NextResponse } from "next/server";
import { checkFiberAvailability } from "@/lib/api/eboss";
import { parseAndValidateAddress } from "@/lib/validation/availability";

// Fresh network calls on every request — never cache availability responses.
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { available: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  let address;
  try {
    address = parseAndValidateAddress(body);
  } catch (err) {
    return NextResponse.json(
      { available: false, error: err.message, details: err.details },
      { status: err.status || 400 },
    );
  }

  const result = await checkFiberAvailability(address);
  
  return NextResponse.json(result);
}
