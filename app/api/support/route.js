import { NextResponse } from "next/server";
import { sendSupportInquiry } from "@/lib/api/makeWebhook";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { name, email, type, message } = body || {};

  const errors = [];
  if (!name || typeof name !== "string" || !name.trim()) errors.push("name is required");
  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email))
    errors.push("valid email is required");
  if (!message || typeof message !== "string" || !message.trim())
    errors.push("message is required");

  if (errors.length) {
    return NextResponse.json({ ok: false, error: errors.join(", ") }, { status: 400 });
  }

  const result = await sendSupportInquiry({ name, email, type, message });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error || "Failed to send support inquiry" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    delivered: result.delivered,
    ...(result.reason ? { note: result.reason } : {}),
  });
}
