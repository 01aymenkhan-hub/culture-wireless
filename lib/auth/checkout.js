import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import CheckoutSession from "@/lib/db/models/CheckoutSession";

export async function requireAuthenticatedCheckout() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated || !userId) {
    return { userId: null, response: NextResponse.json({ ok: false, error: "Authentication is required." }, { status: 401 }) };
  }
  return { userId, response: null };
}

export async function requireOwnedCheckout(hostedPageId) {
  const result = await requireAuthenticatedCheckout();
  if (result.response) return result;

  await connectToDatabase();
  const checkout = await CheckoutSession.findOne({ hostedPageId, clerkUserId: result.userId }).lean();
  if (!checkout) {
    // A 404 does not disclose whether a different customer owns this order.
    return { userId: result.userId, response: NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 }) };
  }
  return { userId: result.userId, response: null, checkout };
}
