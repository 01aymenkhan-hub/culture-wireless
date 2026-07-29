/**
 * Reusable email sending utility.
 *
 * All emails go through this single entry point.
 * Server-only — never import this in client components.
 */

import { getTransporter, isEmailConfigured } from "./transporter.js";
import { env } from "../config/env.js";

/**
 * Sends an email using the configured SMTP transporter.
 *
 * @param {Object} options
 * @param {string} options.to        — Recipient email address
 * @param {string} options.subject   — Email subject line
 * @param {string} options.html      — HTML body content
 * @param {string} [options.text]    — Plain-text fallback (auto-generated if omitted)
 * @param {string} [options.from]    — Override sender (defaults to SMTP_FROM env)
 * @returns {Promise<{ok: boolean, messageId?: string, error?: string}>}
 */
export async function sendEmail({ to, subject, html, text, from }) {
  if (!isEmailConfigured()) {
    console.warn("[Email] SMTP is not configured — skipping email send.");
    return {
      ok: false,
      error: "SMTP is not configured. Set SMTP_USER and SMTP_PASSWORD.",
    };
  }

  if (!to || !subject || !html) {
    return {
      ok: false,
      error: "Missing required email fields: to, subject, and html are required.",
    };
  }

  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: from || env.smtp.from,
      to,
      subject,
      html,
      // Plain text fallback: strip HTML tags if no explicit text provided
      text: text || html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim(),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `[Email] Sent successfully to ${to} — MessageID: ${info.messageId}`,
    );

    return {
      ok: true,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error(`[Email] Failed to send email to ${to}:`, err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
}
