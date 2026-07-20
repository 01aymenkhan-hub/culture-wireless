import { NextResponse } from "next/server";
import { createLead, isZohoEnabled } from "@/lib/api/zoho";

export const dynamic = "force-dynamic";

export async function POST(request) {
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

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  try {
    const result = await createLead(body);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 },
    );
  }
}
