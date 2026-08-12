import { NextResponse } from "next/server";
import { getHostedPage, createDeskTicket, isZohoEnabled } from "@/lib/api/zoho";
import { createTelgooCustomerServer, formatTelgooError } from "@/lib/api/telgoo";
import QRCode from "qrcode";
import { requireOwnedCheckout } from "@/lib/auth/checkout";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const hostedpageId = body.hostedpage_id || body.hostedpageId;
    const enrollmentId = body.enrollmentId || body.enrollment_id;

    if (!hostedpageId) {
      return NextResponse.json(
        { ok: false, error: "Missing required parameter: hostedpage_id" },
        { status: 400 }
      );
    }

    const { response } = await requireOwnedCheckout(hostedpageId);
    if (response) return response;

    if (!isZohoEnabled()) {
      return NextResponse.json(
        { ok: false, disabled: true, reason: "Zoho integration is not configured." },
        { status: 501 }
      );
    }

    // Step 1: Retrieve Zoho Hosted Page details (source of truth for payment & order)
    const hostedPageResult = await getHostedPage(hostedpageId);

    if (!hostedPageResult.ok || !hostedPageResult.data) {
      console.error("[Telgoo Activation Error]: Failed to retrieve Hosted Page:", hostedPageResult.error);
      return NextResponse.json(
        {
          ok: false,
          error: "We couldn't retrieve your payment receipt. Please check your order details or contact support.",
        },
        { status: 500 }
      );
    }

    const hostedPageData = hostedPageResult.data;
    const sub = hostedPageData?.subscription || {};
    const cust = sub.customer || {};
    const plan = sub.plan || {};
    const billingAddr = cust.billing_address || {};

    const firstName = cust.first_name || cust.display_name?.split(" ")[0] || "Valued";
    const lastName = cust.last_name || cust.display_name?.split(" ").slice(1).join(" ") || "Customer";
    const email = cust.email || "";
    const phone = cust.phone || hostedPageData.subscription?.contactpersons?.[0]?.phone || "";
    const zipCode = billingAddr.zip || "30274";
    const streetAddress = billingAddr.street || "Service Address";
    const city = billingAddr.city || "";
    const state = billingAddr.state || "";
    const planCode = plan.plan_code || plan.code || "CW15GB";
    const subscriptionId = sub.subscription_id || hostedpageId;

    // Step 2: Call Telgoo /customer API to provision service & eSIM
    const customerPayload = {
      enrollment_id: enrollmentId,
      parent_enrollment_id: enrollmentId,
      order_id: subscriptionId,
      plan_id: planCode,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      contact_number: phone,
      service_address: streetAddress,
      address1: streetAddress,
      city: city,
      state: state,
      zip_code: zipCode,
      zip: zipCode,
      billing_address: streetAddress,
      billing_city: city,
      billing_state: state,
      billing_zip: zipCode,
      carrier: "T-Mobile",
      is_esim: "Y",
      sim_type: "eSIM",
    };

    const telgooResult = await createTelgooCustomerServer(customerPayload);

    // If /customer API fails: DO NOT create a Zoho Desk ticket, return error to client
    if (!telgooResult.ok || !telgooResult.data) {
      console.error("[Telgoo Activation Error]: Customer creation failed:", telgooResult.error);
      return NextResponse.json(
        {
          ok: false,
          error:
            formatTelgooError(telgooResult.error) ||
            "We couldn't complete your activation at the moment. Please try again or contact support if the issue continues.",
        },
        { status: 500 }
      );
    }

    const activationData = telgooResult.data;
    activationData.customerName = `${firstName} ${lastName}`.trim();
    activationData.customerEmail = email;
    activationData.planName = plan.name || planCode;
    activationData.amount = sub.amount !== undefined ? sub.amount : plan.price;

    // Step 3: Generate base64 QR Code image string from activation string
    const qrSourceString =
      activationData.qrActivationCode ||
      activationData.activationCode ||
      activationData.qrCode ||
      "";

    if (qrSourceString) {
      try {
        const qrDataUrl = await QRCode.toDataURL(qrSourceString, {
          margin: 2,
          width: 280,
          color: { dark: "#0F172A", light: "#FFFFFF" },
        });
        activationData.qrDataUrl = qrDataUrl;
      } catch (qrErr) {
        console.error("[Telgoo Activation] QR Generation Error:", qrErr);
      }
    }

    // Step 4: ONLY after /customer succeeds, create Zoho Desk Ticket (background / non-blocking)
    createDeskTicket(hostedPageData, hostedpageId, {
      enrollmentId: activationData.enrollmentId,
      iccid: activationData.iccid,
      activationCode: activationData.activationCode || activationData.qrActivationCode,
      msisdn: activationData.msisdn,
    }).catch((err) => {
      console.error("[Telgoo Activation] Zoho Desk Ticket Error:", err?.message || err);
    });

    // Return successful activation result to client
    return NextResponse.json({
      ok: true,
      activationData,
      hostedpage_id: hostedpageId,
    });
  } catch (err) {
    console.error("[API Route /api/telgoo/activation Exception]:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't complete your activation at the moment. Please try again or contact support if the issue continues.",
      },
      { status: 500 }
    );
  }
}
