import { NextResponse } from "next/server";
import { getPlans, isZohoEnabled } from "@/lib/api/zoho";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isZohoEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        disabled: true,
        reason: "Zoho integration is not configured yet.",
      },
      { status: 501 },
    );
  }

  try {
    const result = await getPlans();
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status || 500 },
      );
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 },
    );
  }
}
