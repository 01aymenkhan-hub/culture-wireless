import { NextResponse } from "next/server";
import { createHostedPage, isZohoEnabled } from "@/lib/api/zoho";
import { resolveAddressWithGoogleMaps } from "@/lib/api/googleGeocode";

export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!isZohoEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        disabled: true,
        reason: "Zoho integration is not configured yet.",
      },
      { status: 501 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { address, selectedPlan, customerInfo, currentServiceInfo, redirectUrl, immediateBilling } = body;

    if (!selectedPlan) {
      return NextResponse.json(
        { ok: false, error: "No plan selected." },
        { status: 400 }
      );
    }

    // Ensure full address details come from Google Maps API
    let resolvedAddress = address;

    const needsGeocode =
      !address?.city ||
      !address?.state ||
      !address?.streetAddress ||
      address?.streetAddress.startsWith("Service ZIP");

    if (needsGeocode && (address?.zipCode || address?.zip)) {
      const zipToResolve = address?.zipCode || address?.zip;
      const geocodeResult = await resolveAddressWithGoogleMaps(zipToResolve);

      if (!geocodeResult.ok || !geocodeResult.address) {
        return NextResponse.json(
          {
            ok: false,
            error:
              geocodeResult.error ||
              `Google Maps API could not resolve an address for ZIP code "${zipToResolve}". Please verify your ZIP code.`,
          },
          { status: 400 }
        );
      }

      resolvedAddress = geocodeResult.address;
    }

    const result = await createHostedPage({
      address: resolvedAddress,
      selectedPlan,
      customerInfo,
      currentServiceInfo,
      redirectUrl,
      immediateBilling,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status || 500 }
      );
    }

    return NextResponse.json({
      ...result,
      resolvedAddress,
    });
  } catch (err) {
    console.error("[API Route /api/zoho/hostedpage Exception]:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to generate Zoho Hosted Checkout page." },
      { status: 500 }
    );
  }
}
