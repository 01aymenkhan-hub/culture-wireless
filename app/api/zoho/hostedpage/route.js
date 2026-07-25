import { NextResponse } from "next/server";
import { createHostedPage, isZohoEnabled } from "@/lib/api/zoho";

export const dynamic = "force-dynamic";

export async function POST(req) {
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
    const body = await req.json().catch(() => ({}));
    const { address, selectedPlan, customerInfo, currentServiceInfo, redirectUrl } = body;

    if (!selectedPlan) {
      return NextResponse.json(
        { ok: false, error: "No plan selected." },
        { status: 400 },
      );
    }

    const result = await createHostedPage({
      address,
      selectedPlan,
      customerInfo,
      currentServiceInfo,
      redirectUrl,
    });

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
