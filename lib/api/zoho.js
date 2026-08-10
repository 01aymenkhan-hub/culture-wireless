/**
 * Zoho CRM / Billing / Books integration — SCAFFOLD ONLY.
 *
 * Full Zoho APIs will be wired in later. This module gives you a stable surface
 * so you can call `zoho.createLead(...)`, `zoho.createSubscription(...)`, etc.
 * from route handlers without changing consumer code once real credentials are
 * provided.
 *
 * To enable:
 *   1. Populate env vars in .env.local (see .env.example).
 *   2. Set FEATURE_ZOHO=true.
 *   3. Implement each `not-yet-implemented` function below by:
 *      a) Calling `getAccessToken()` to obtain a short-lived OAuth token, and
 *      b) POST/GET the appropriate Zoho REST endpoint under {apiDomain}.
 *
 * Docs (once you're ready):
 *   https://www.zoho.com/crm/developer/docs/api/v6/
 *   https://www.zoho.com/billing/api/v1/
 */

import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding.js";
import { env } from "../config/env.js";

let cachedToken = null;
let cachedTokenExpiresAt = 0;

export function isZohoEnabled() {
  return env.zoho.enabled && env.zoho.isConfigured;
}

async function getAccessToken() {
  if (!isZohoEnabled()) throw new Error("Zoho is not configured.");
  const now = Date.now();
  if (cachedToken && cachedTokenExpiresAt > now + 30_000) return cachedToken;

  const url = `${env.zoho.accountsUrl.replace(/\/$/, "")}/oauth/v2/token`;
  const params = new URLSearchParams({
    refresh_token: env.zoho.refreshToken,
    client_id: env.zoho.clientId,
    client_secret: env.zoho.clientSecret,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${url}?${params.toString()}`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Zoho token exchange failed: HTTP ${res.status}`);
  }
  const data = await res.json();
  cachedToken = data.access_token;
  // Zoho tokens are typically valid for 1 hour.
  cachedTokenExpiresAt = now + (data.expires_in ?? 3600) * 1000;
  return cachedToken;
}

/**
 * Authenticated fetch against a Zoho product API (CRM, Billing, Books, etc.).
 * Consumers pass an absolute path such as "/crm/v6/Leads" — this prefixes
 * apiDomain and injects `Authorization: Zoho-oauthtoken {token}`.
 */
export async function zohoFetch(path, init = {}) {
  const token = await getAccessToken();
  const url = `${env.zoho.apiDomain.replace(/\/$/, "")}${path}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Zoho-oauthtoken ${token}`,
    "X-com-zoho-subscriptions-organizationid": env.zoho.orginizationId,
    ...(init.headers || {}),
  };
  return fetch(url, { ...init, headers, cache: "no-store" });
}

export async function getRouterAddon(addonCode = "CWG-GSpire") {
  if (!isZohoEnabled()) {
    return { ok: false, disabled: true, reason: "Zoho is not configured yet." };
  }
  try {
    const res = await zohoFetch(`/billing/v1/addons/${addonCode}`);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Zoho Addon API Error: HTTP ${res.status} - ${text.slice(0, 200)}`,
        status: res.status,
      };
    }
    const data = await res.json();
    const rawPrice = data?.addon?.price_brackets?.[0]?.price;
    const price =
      typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice) || 0;
    return { ok: true, addon: data.addon, price };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function getPlans() {
  if (!isZohoEnabled()) {
    return { ok: false, disabled: true, reason: "Zoho is not configured yet." };
  }
  try {
    const res = await zohoFetch("/billing/v1/plans");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Zoho API Error: HTTP ${res.status} - ${text.slice(0, 200)}`,
        status: res.status,
      };
    }
    const data = await res.json();
    let plans = data.plans || [];

    if (plans.length > 0) {
      // Fetch Fiber Router Add-on (CWG-GSpire)
      let fiberAddonPrice = 0;
      let fiberAddonCode = null;
      try {
        const addonRes = await getRouterAddon("CWG-GSpire");
        if (addonRes.ok) {
          fiberAddonPrice = addonRes.price;
          fiberAddonCode = addonRes.addon?.addon_code || "CWG-GSpire";
        }
      } catch (err) {
        console.error("Failed to fetch Fiber router addon:", err.message);
      }

      // Fetch 5G Home Internet Router Add-on (5GHR)
      let wirelessAddonPrice = 0;
      let wirelessAddonCode = null;
      try {
        const wAddonRes = await getRouterAddon("5GHR");
        if (wAddonRes.ok) {
          wirelessAddonPrice = wAddonRes.price;
          wirelessAddonCode = wAddonRes.addon?.addon_code || "5GHR";
        }
      } catch (err) {
        console.error("Failed to fetch 5G Home router addon:", err.message);
      }

      plans = plans.map((p) => {
        const originalPrice = p.recurring_price;
        let addonPrice = 0;
        let addonCode = null;

        if (
          p.product_id === "3390400000001023053" ||
          (p.plan_code || "").startsWith("CWG100") ||
          (p.plan_code || "").startsWith("CWG500") ||
          (p.plan_code || "").startsWith("CWG1000")
        ) {
          addonPrice = fiberAddonPrice;
          addonCode = fiberAddonCode;
        } else if (p.plan_code === "CWG5GHI") {
          addonPrice = wirelessAddonPrice;
          addonCode = wirelessAddonCode;
        }

        const displayPrice = originalPrice + addonPrice;
        return {
          ...p,
          original_price: originalPrice,
          addon_price: addonPrice,
          addon_code: addonCode,
          display_price: displayPrice,
        };
      });
    }

    return { ok: true, plans };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// export const ADDON_TAX_MAPPING = Object.freeze({
//   //testing purpose
//   "CWG-GSpire": "1197674000000097616",
//   "5GHR": "1197674000000097624",
// });  // testing purpose

export const ADDON_TAX_MAPPING = Object.freeze({
  "CWG-GSpire": "3390400000001038408",
  "5GHR": "3390400000004232077",
});

export async function createHostedPage({
  address,
  selectedPlan,
  customerInfo,
  currentServiceInfo,
  redirectUrl,
  immediateBilling = false,
}) {
  if (!isZohoEnabled()) {
    return {
      ok: false,
      disabled: true,
      reason: "Zoho is not configured yet.",
    };
  }

  try {
    const planCode = selectedPlan?.plan_code || selectedPlan?.id;
    if (!planCode) {
      return { ok: false, error: "No plan selected or plan code is missing." };
    }
console.log(JSON.stringify(address))
    const customer = {
      display_name:
        `${customerInfo?.firstName || ""} ${customerInfo?.lastName || ""}`.trim() ||
        "Customer",
      first_name: customerInfo?.firstName || "",
      last_name: customerInfo?.lastName || "",
      email: customerInfo?.email || "",
      phone: customerInfo?.phone || "",
      billing_address: {
        street: address?.streetAddress || address?.formattedAddress || "",
        city: address?.city || "",
        state: address?.state || "",
        zip: address?.zipCode || "",
        country: "USA",
      },
    };

    const payload = {
      customer,
      plan: {
        plan_code: planCode,
        quantity: 1,
      },
    };

    // If immediateBilling is NOT requested (Check Availability flow), delay start date to 1st of next month
    if (!immediateBilling) {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      payload.starts_at = [
        startDate.getFullYear(),
        String(startDate.getMonth() + 1).padStart(2, "0"),
        String(startDate.getDate()).padStart(2, "0"),
      ].join("-");
    }

    if (redirectUrl) {
      payload.redirect_url = redirectUrl;
    }

    // Determine add-on code (CWG-GSpire for Fiber, 5GHR for Wireless, null for Mobile)
    let addonCode = selectedPlan?.addon_code || selectedPlan?.addonCode;
    if (!addonCode) {
      if (selectedPlan?.category === "home5g" || planCode === "CWG5GHI") {
        addonCode = "5GHR";
      } else if (
        selectedPlan?.category === "fiber" ||
        selectedPlan?.product_id === "3390400000001023053" ||
        planCode.startsWith("CWG100") ||
        planCode.startsWith("CWG500") ||
        planCode.startsWith("CWG1000")
      ) {
        addonCode = "CWG-GSpire";
      }
    }

    // Only include addons array if selected plan actually has an add-on
    if (addonCode) {
      const taxId = ADDON_TAX_MAPPING[addonCode];
      const addonObj = {
        addon_code: addonCode,
      };
      if (taxId) {
        addonObj.tax_id = taxId;
      }
      payload.addons = [addonObj];
    }

    console.log(JSON.stringify(payload));

    const res = await zohoFetch("/billing/v1/hostedpages/newsubscription", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // const res = await zohoFetch("/billing/v1/hostedpages/newsubscription", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     customer: {
    //       display_name: "Aymen Aymen",
    //       first_name: "Aymen",
    //       last_name: "Aymen",
    //       email: "01aymenkhan@gmail.com",
    //       billing_address: {
    //         attention: "Aymen Aymen",
    //         address: "123 Main Street",
    //         street2: "Suite 200",
    //         city: "New York",
    //         state: "NY",
    //         zip: "10001",
    //         country: "USA",
    //       },
    //     },
    //     plan: {
    //       plan_code: "5",
    //       quantity: 1,
    //     },

    //     redirect_url: "http://localhost:3000/mobile/activation",
    //     starts_at: "2026-08-01",
    //   }),
    // });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let errorMsg = `Zoho Hosted Page Error: HTTP ${res.status}`;
      try {
        const errJson = JSON.parse(text);
        if (errJson.message) errorMsg = errJson.message;
      } catch {}
      return { ok: false, error: errorMsg, status: res.status };
    }

    const data = await res.json();
    if (data.code === 0 && data.hostedpage?.url) {
      return {
        ok: true,
        url: data.hostedpage.url,
        hostedpage: data.hostedpage,
      };
    } else {
      return {
        ok: false,
        error: data.message || "Failed to generate Zoho Hosted Checkout page.",
      };
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function getHostedPage(hostedpageId) {
  if (!isZohoEnabled()) {
    return { ok: false, disabled: true, reason: "Zoho is not configured yet." };
  }

  try {
    const res = await zohoFetch(`/billing/v1/hostedpages/${hostedpageId}`);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Zoho Hosted Page API Error: HTTP ${res.status} - ${text.slice(0, 200)}`,
        status: res.status,
      };
    }

    const data = await res.json();

    if (data.code === 0 && data.data) {
      return { ok: true, data: data.data, raw: data };
    } else {
      return {
        ok: false,
        error:
          data.message || "Failed to retrieve hosted page details from Zoho.",
      };
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function createDeskTicket(
  hostedPageData,
  hostedpageId = "",
  extraDetails = {}
) {
  if (!isZohoEnabled()) {
    return { ok: false, disabled: true, reason: "Zoho is not configured yet." };
  }

  try {
    const token = await getAccessToken();
    const sub = hostedPageData?.subscription || {};
    const cust = sub.customer || {};
    const plan = sub.plan || {};
    const addons = sub.addons || [];
    const billingAddr = cust.billing_address || {};

    const subNumber = sub.subscription_number || "New Order";
    const custName =
      cust.display_name ||
      `${cust.first_name || ""} ${cust.last_name || ""}`.trim() ||
      "Customer";
    const custEmail = cust.email || "";
    const custPhone =
      hostedPageData.subscription?.contactpersons?.[0]?.phone || "";

    const streetCombined = [billingAddr.street, billingAddr.street2]
      .filter(Boolean)
      .join(", ");
    const fullAddressStr = [
      streetCombined,
      billingAddr.city,
      billingAddr.state,
      billingAddr.zip,
      billingAddr.country,
    ]
      .filter(Boolean)
      .join(", ");

    const addonsListText =
      addons.length > 0
        ? addons
            .map(
              (a) =>
                `  * ${a.name || a.addon_code} (Code: ${a.addon_code || ""}) - $${a.price}/mo (Qty: ${a.quantity || 1})`,
            )
            .join("\n")
        : "  None";

    const extraInfoText =
      extraDetails && (extraDetails.enrollmentId || extraDetails.iccid || extraDetails.msisdn)
        ? `<br><br><h4>TELGOO eSIM ACTIVATION DETAILS</h4>
<b>Enrollment ID:</b> ${extraDetails.enrollmentId || "N/A"}<br>
<b>MDN / Phone:</b> ${extraDetails.msisdn || "N/A"}<br>
<b>ICCID:</b> ${extraDetails.iccid || "N/A"}<br>
<b>Activation Code:</b> ${extraDetails.activationCode || "N/A"}<br>`
        : "";

    const description = `
<h3>NEW SUBSCRIPTION ORDER RECEIVED</h3>

<b>Subscription Number:</b> ${subNumber}<br>
<b>Subscription ID:</b> ${sub.subscription_id || "N/A"}<br>
<b>Status:</b> ${sub.status || "N/A"}<br>
<b>Start Date:</b> ${sub.start_date || "N/A"}<br><br>

<h4>CUSTOMER DETAILS</h4>

<b>Name:</b> ${custName}<br>
<b>Email:</b> ${custEmail}<br>
<b>Phone:</b> ${custPhone}<br>
<b>Customer ID:</b> ${cust.customer_id || "N/A"}<br><br>

<h4>SERVICE ADDRESS</h4>

${fullAddressStr || "N/A"}<br><br>

<h4>ORDER DETAILS</h4>

<b>Service Product:</b> ${sub.product_name || sub.name || "Culture Wireless Service"}<br>
<b>Plan:</b> ${plan.name || plan.plan_code || "N/A"} (${plan.plan_code || "N/A"})<br>
<b>Plan Price:</b> $${plan.price || 0}/mo<br><br>

<b>Add-ons:</b><br>
${addonsListText.replace(/\n/g, "<br>")}<br><br>

<b>Total Recurring Price:</b> $${sub.amount || sub.sub_total || 0}/mo
${extraInfoText}
`;

    const payload = {
      subject: `New Subscription Order: ${subNumber} - ${custName}`,

      departmentId: process.env.ZOHO_DESK_DEPARTMENT_ID,

      //   // Optional: ticket ko ek aur department ke sath share karna
      //    sharedDepartments: process.env.ZOHO_DESK_SHARED_DEPARTMENT_ID
      // ? [{ departmentId: process.env.ZOHO_DESK_SHARED_DEPARTMENT_ID }]
      // : [],

      channel: "Web",
      status: "Open",
      priority: "High",
      classification: "Request",
      language: "English",

      email: cust.email || "",
      phone: hostedPageData.subscription?.contactpersons[0]?.phone || "",

      contact: {
        firstName: cust.first_name || "",
        lastName: cust.last_name || "",
        email: cust.email || "",
        phone: hostedPageData.subscription?.contactpersons[0]?.phone || "",
      },

      description,
    };

    const deskUrl = "https://desk.zoho.com/api/v1/tickets";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Zoho-oauthtoken ${token}`,
      // orgId: "",
      // orgId: env.zoho.orginizationId || "933083011",
    };

    const res = await fetch(deskUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await res.text().catch(() => "");
    let resData = {};
    try {
      resData = JSON.parse(text);
    } catch {}

    if (!res.ok) {
      console.error(`Zoho Desk API Error HTTP ${res.status}:`, text);
      return {
        ok: false,
        error: `Zoho Desk API Error: HTTP ${res.status} - ${resData.message || text.slice(0, 200)}`,
        status: res.status,
      };
    }

    return { ok: true, ticket: resData };
  } catch (err) {
    console.error("Failed to create Zoho Desk ticket:", err);
    return { ok: false, error: err.message };
  }
}

export async function createLead(leadData) {
  if (!isZohoEnabled()) {
    return { ok: false, disabled: true, reason: "Zoho is not configured yet." };
  }
  throw new Error("zoho.createLead not-yet-implemented");
}
