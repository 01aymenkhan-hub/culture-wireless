import { NextResponse } from "next/server";
import {
  fetchFreshToken,
  checkServiceAvailabilityServer,
  getPlanListServer,
} from "@/lib/api/telgoo";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, zip_code, zipCode } = body;
    const targetZip = (zip_code || zipCode || "").toString().trim();

    if (!action) {
      return NextResponse.json({ ok: false, error: "Action parameter is required" }, { status: 400 });
    }

    if (action === "authenticate") {
      const token = await fetchFreshToken();
      return NextResponse.json({ ok: true, token, msg_code: "RESTAPI000" });
    }

    if (action === "check_service_availability") {
      if (!targetZip) {
        return NextResponse.json({ ok: false, error: "zip_code is required" }, { status: 400 });
      }
      const result = await checkServiceAvailabilityServer(targetZip);
      if (!result.ok) {
        return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        ok: true,
        enrollment_id: result.enrollmentId,
        city: result.city,
        state: result.state,
        zip_code: result.zipCode,
      });
    }

    if (action === "plan_list") {
      console.log("action")
      if (!targetZip) {
        return NextResponse.json({ ok: false, error: "zip_code is required" }, { status: 400 });
      }
      const result = await getPlanListServer(targetZip);
      if (!result.ok) {
        return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        ok: true,
        plans: result.plans,
      });
    }

    return NextResponse.json({ ok: false, error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (err) {
    console.error("[Telgoo5 Signup Route Error]:", err);
    return NextResponse.json({ ok: false, error: err.message || "Telgoo API Request Failed" }, { status: 500 });
  }
}
