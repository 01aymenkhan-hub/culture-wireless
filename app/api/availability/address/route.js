import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import AvailabilityAddress from "@/lib/db/models/AvailabilityAddress";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      formattedAddress,
      streetAddress,
      unit,
      city,
      state,
      zipCode,
      country,
      latitude,
      longitude,
      serviceType,
    } = body;

    if (!formattedAddress || formattedAddress.trim().length < 3) {
      return NextResponse.json(
        { ok: false, error: "A valid formatted address is required." },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Create address record in culture-wireless database
    const newAddressRecord = await AvailabilityAddress.create({
      formattedAddress: formattedAddress.trim(),
      streetAddress: (streetAddress || "").trim(),
      unit: (unit || "").trim(),
      city: (city || "").trim(),
      state: (state || "").trim(),
      zipCode: (zipCode || "").trim(),
      country: (country || "USA").trim(),
      latitude: latitude !== undefined ? latitude : null,
      longitude: longitude !== undefined ? longitude : null,
      serviceType: serviceType || "home_internet",
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Address saved successfully for marketing.",
        id: newAddressRecord._id,
        data: newAddressRecord,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to save availability address to MongoDB:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err.message || "Failed to record address in database.",
      },
      { status: 500 },
    );
  }
}
