/**
 * Order Confirmation HTML email template.
 *
 * Generates a responsive, branded HTML email populated entirely
 * from the Zoho Hosted Page API response — no hardcoded values.
 *
 * @param {Object} hostedPageData — The `data` object from the Hosted Page response
 * @returns {string} Compiled HTML string
 */
export function buildOrderConfirmationEmail(hostedPageData) {
  const sub = hostedPageData?.subscription || {};
  const cust = sub.customer || {};
  const plan = sub.plan || {};
  const addons = sub.addons || [];
  const billingAddr = cust.billing_address || {};

  const customerName =
    cust.display_name ||
    `${cust.first_name || ""} ${cust.last_name || ""}`.trim() ||
    "Valued Customer";

  const customerEmail = cust.email || "";
  const customerPhone =
    hostedPageData.subscription?.contactpersons[0]?.phone || "";

  const streetParts = [billingAddr.street, billingAddr.street2].filter(Boolean);
  const addressParts = [
    ...streetParts,
    billingAddr.city,
    billingAddr.state,
    billingAddr.zip,
    billingAddr.country,
  ].filter(Boolean);
  const fullAddress = addressParts.join(", ") || "To be confirmed";

  const planName = plan.name || plan.plan_code || "Culture Wireless Plan";
  const planPrice = plan.price !== undefined ? plan.price : 0;
  const productName =
    sub.product_name || sub.name || "Culture Wireless Internet";
  const totalAmount =
    sub.amount !== undefined ? sub.amount : sub.sub_total || planPrice;
  const subNumber = sub.subscription_number || "";
  const startDate = sub.start_date || "";

  const addonsHtml =
    addons.length > 0
      ? addons
          .map(
            (a) => `
              <tr>
                <td style="padding:10px 16px;font-size:14px;color:#475569;border-bottom:1px solid #e2e8f0;">
                  ${escapeHtml(a.name || a.addon_code || "Add-on")}
                </td>
                <td style="padding:10px 16px;font-size:14px;color:#1e293b;text-align:right;border-bottom:1px solid #e2e8f0;font-weight:600;">
                  $${Number(a.price || 0).toFixed(2)}/mo
                </td>
              </tr>`,
          )
          .join("")
      : "";

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <title>Order Confirmation — Culture Wireless</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; padding: 16px !important; }
      .email-content { padding: 28px 20px !important; }
      .responsive-table { width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

  <!-- Preheader text (hidden preview) -->
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    Your Culture Wireless order has been confirmed! Here are your subscription details.
  </div>

  <!-- Main wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f4f4f7;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Email container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width:600px;width:100%;">

          <!-- Main Card -->
          <tr>
            <td class="email-content" style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:20px;padding:44px 36px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">

              <!-- Success Icon -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,rgba(22,163,74,0.14),rgba(22,163,74,0.04));border:2px solid #16a34a;line-height:64px;text-align:center;font-size:28px;color:#16a34a;">
                      ✓
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <h1 style="margin:0;font-size:28px;font-weight:800;color:#1e293b;text-transform:uppercase;letter-spacing:0.02em;font-family:'Segoe UI',sans-serif;">
                      Order <span style="background:linear-gradient(135deg,#8b69c1,#6d4aaa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Confirmed!</span>
                    </h1>
                  </td>
                </tr>
              </table>

              <!-- Thank-you paragraph -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <p style="margin:0;font-size:15px;line-height:1.6;color:#64748b;max-width:480px;">
                      Thank you, <strong style="color:#1e293b;">${escapeHtml(customerName)}</strong>! Your subscription has been successfully processed. Below are the details of your order.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Order Details Table -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="responsive-table" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin-bottom:28px;">

                ${
                  subNumber
                    ? `
                <!-- Subscription Ref -->
                <tr>
                  <td colspan="2" style="padding:14px 16px 10px;border-bottom:1px solid #e2e8f0;">
                    <span style="font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#8b69c1;">
                      Ref: ${escapeHtml(subNumber)}
                    </span>
                  </td>
                </tr>
                `
                    : ""
                }

                <!-- Customer Name -->
                <tr>
                  <td style="padding:12px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Customer</td>
                  <td style="padding:12px 16px;font-size:14px;color:#1e293b;text-align:right;border-bottom:1px solid #e2e8f0;font-weight:600;">
                    ${escapeHtml(customerName)}
                  </td>
                </tr>

                ${
                  customerEmail
                    ? `
                <!-- Email -->
                <tr>
                  <td style="padding:10px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Email</td>
                  <td style="padding:10px 16px;font-size:14px;color:#1e293b;text-align:right;border-bottom:1px solid #e2e8f0;">
                    ${escapeHtml(customerEmail)}
                  </td>
                </tr>
                `
                    : ""
                }

                ${
                  customerPhone
                    ? `
                <!-- Customer Phone -->
                <tr>
                  <td style="padding:10px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Phone</td>
                  <td style="padding:10px 16px;font-size:14px;color:#1e293b;text-align:right;border-bottom:1px solid #e2e8f0;">
                    ${escapeHtml(customerPhone)}
                  </td>
                </tr>
                `
                    : ""
                }

                <!-- Service Address -->
                <tr>
                  <td style="padding:10px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;vertical-align:top;">Service Address</td>
                  <td style="padding:10px 16px;font-size:14px;color:#1e293b;text-align:right;border-bottom:1px solid #e2e8f0;">
                    ${escapeHtml(fullAddress)}
                  </td>
                </tr>

                <!-- Selected Service -->
                <tr>
                  <td style="padding:10px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Selected Service</td>
                  <td style="padding:10px 16px;font-size:14px;color:#1e293b;text-align:right;border-bottom:1px solid #e2e8f0;font-weight:600;">
                    ${escapeHtml(productName)}
                  </td>
                </tr>

                <!-- Purchased Plan -->
                <tr>
                  <td style="padding:10px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Purchased Plan</td>
                  <td style="padding:10px 16px;font-size:14px;color:#1e293b;text-align:right;border-bottom:1px solid #e2e8f0;font-weight:600;">
                    ${escapeHtml(planName)} — $${Number(planPrice).toFixed(2)}/mo
                  </td>
                </tr>

                ${
                  addonsHtml
                    ? `
                <!-- Add-ons Header -->
                <tr>
                  <td colspan="2" style="padding:12px 16px 6px;border-bottom:1px solid #e2e8f0;">
                    <span style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#8b69c1;">
                      Included Add-ons
                    </span>
                  </td>
                </tr>
                ${addonsHtml}
                `
                    : ""
                }

                <!-- Total -->
                <tr>
                  <td style="padding:14px 16px;font-size:15px;color:#1e293b;font-weight:700;">Total Monthly</td>
                  <td style="padding:14px 16px;font-size:20px;color:#16a34a;text-align:right;font-weight:800;">
                    $${Number(totalAmount).toFixed(2)}/mo
                  </td>
                </tr>

                ${
                  startDate
                    ? `
                <!-- Start Date -->
                <tr>
                  <td style="padding:10px 16px;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;">Start Date</td>
                  <td style="padding:10px 16px;font-size:13px;color:#334155;text-align:right;border-top:1px solid #e2e8f0;">
                    ${escapeHtml(startDate)}
                  </td>
                </tr>
                `
                    : ""
                }

              </table>

              <!-- What's Next -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:rgba(139,105,193,0.06);border:1px solid rgba(139,105,193,0.25);border-radius:14px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px;">
                    <div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#1e293b;margin-bottom:8px;font-family:'Segoe UI',sans-serif;">
                      What Happens Next?
                    </div>
                    <div style="font-size:13px;color:#64748b;line-height:1.6;">
                      A Culture Wireless specialist will reach out to you at <strong style="color:#1e293b;">${escapeHtml(customerEmail || "your email")}</strong> to confirm service activation, schedule installation, or arrange equipment shipping. Your billing begins on your subscription start date.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://culturewireless.net" target="_blank"
                       style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#8b69c1,#6d4aaa);color:#fff;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;text-transform:uppercase;letter-spacing:0.06em;">
                      Visit Culture Wireless
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 16px 0;">
              <p style="margin:0 0 6px;font-size:12px;color:#64748b;line-height:1.5;">
                Need help? Contact us at
                <a href="mailto:support@culturewireless.net" style="color:#8b69c1;text-decoration:none;">support@culturewireless.net</a>
              </p>
              <p style="margin:0;font-size:11px;color:#94a3b8;">
                © ${new Date().getFullYear()} Culture Wireless. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Escapes HTML entities to prevent XSS in email templates.
 */
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
