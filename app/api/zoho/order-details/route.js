import { NextResponse } from "next/server";
import { getHostedPage, createDeskTicket, isZohoEnabled } from "@/lib/api/zoho";
import { sendEmail } from "@/lib/email/sendEmail";
import { buildOrderConfirmationEmail } from "@/lib/email/templates/orderConfirmation";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const hostedpageId = searchParams.get("hostedpage_id");

  if (!hostedpageId) {
    return NextResponse.json(
      { ok: false, error: "Missing required query parameter: hostedpage_id" },
      { status: 400 },
    );
  }

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
    const result = await getHostedPage(hostedpageId);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status || 500 },
      );
    }

    // Fire-and-forget background tasks — neither blocks the response
    // nor prevents the other from running if one fails.

    // 1. Create Zoho Desk ticket
    createDeskTicket(result.data, hostedpageId).catch((err) => {
      console.error(
        "[Order Details] Background Zoho Desk ticket creation error:",
        err,
      );
    });

    // 2. Send order confirmation email
    const customerEmail = result.data?.subscription?.customer?.email;
    console.log("email", result.data?.subscription?.customer?.email);
    if (customerEmail) {
      const html = buildOrderConfirmationEmail(result.data);
      const subNumber =
        result.data?.subscription?.subscription_number || "New Order";

      sendEmail({
        to: customerEmail,
        subject: `Order Confirmed — ${subNumber} | Culture Wireless`,
        html,
      }).catch((err) => {
        console.error("[Order Details] Background email sending error:", err);
      });
    } else {
      console.warn(
        "[Order Details] No customer email found in hosted page response — skipping confirmation email.",
      );
    }
    return NextResponse.json({
      ok: true,
      hostedpage_id: hostedpageId,
      details: result.data,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 },
    );
  }
}
