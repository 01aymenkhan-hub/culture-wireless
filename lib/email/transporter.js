/**
 * Nodemailer SMTP transporter — Microsoft Office 365 / Outlook.
 *
 * Creates a single cached transporter instance to avoid re-creating
 * connections on every serverless invocation. Uses STARTTLS on port 587.
 */

import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let cachedTransporter = null;

/**
 * Returns true if SMTP credentials are configured in env.
 */
export function isEmailConfigured() {
  return env.smtp.isConfigured;
}

/**
 * Creates (or returns cached) Nodemailer transporter for Office 365 SMTP.
 */
export function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  if (!isEmailConfigured()) {
    throw new Error(
      "[Email] SMTP is not configured. Set SMTP_USER and SMTP_PASSWORD environment variables.",
    );
  }

  cachedTransporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: false, // STARTTLS — upgraded after connection on port 587
    auth: {
      user: env.smtp.user,
      pass: env.smtp.password,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: true,
    },
    // Pool connections for better performance in serverless environments
    pool: false,
    // Reasonable timeouts
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  return cachedTransporter;
}

/**
 * Verifies the SMTP connection is working. Returns { ok, error }.
 * Useful for health checks — does NOT need to be called before every send.
 */
export async function verifyConnection() {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    console.error("[Email] SMTP connection verification failed:", err.message);
    return { ok: false, error: err.message };
  }
}
