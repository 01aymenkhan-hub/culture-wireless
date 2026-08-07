/**
 * Server-Side Telgoo API Service Module
 *
 * Handles server-to-server communication with Telgoo5 API (vcareapi.com).
 * This module runs exclusively on the Node server (Next.js API Route Handlers).
 *
 * Secrets and credentials remain on the server and are never exposed to the client.
 */

const TELGOO5_BASE_URL =
  process.env.TELGOO5_BASE_URL || "https://www.vcareapi.com:8080";

const TELGOO5_CREDENTIALS = Object.freeze({
  vendor_id: process.env.TELGOO5_VENDOR_ID || "CultureWirelessGroupIncClient",
  username:
    process.env.TELGOO5_USERNAME || "CultureWirelessGroupIncClientek7uUser",
  password: process.env.TELGOO5_PASSWORD || "CultureWy4pev7976564",
  pin: process.env.TELGOO5_PIN || "193577259273",
});

/**
 * Converts technical API error codes or raw messages into human-readable user messages.
 */
export function formatTelgooError(rawError) {
  if (!rawError) {
    return "We couldn't complete your activation at the moment. Please try again or contact support if the issue continues.";
  }

  const str = String(rawError).trim();

  if (
    str.includes("RESTAPI000") ||
    str.includes("RESTAPI110") ||
    str.includes("Invalid request") ||
    str.includes("Error occured")
  ) {
    return "We couldn't complete your activation at the moment. Please try again or contact support if the issue continues.";
  }

  return str;
}

/**
 * Server-side helper to authenticate with Telgoo5 and return a single-use JWT token.
 */
export async function fetchFreshToken() {
  try {
    const res = await fetch(`${TELGOO5_BASE_URL}/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TELGOO5_CREDENTIALS),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[Telgoo Server Auth Error]: HTTP ${res.status}`, text);
      throw new Error(`Telgoo Authentication Failed (HTTP ${res.status})`);
    }

    const data = await res.json().catch(() => ({}));
    if (data.token) {
      return data.token;
    } else {
      const errMsg =
        data.errors?.[0] ||
        data.msg ||
        "Invalid authentication response from Telgoo";
      console.error("[Telgoo Server Auth Error]:", errMsg);
      throw new Error(errMsg);
    }
  } catch (err) {
    console.error("[Telgoo Server Auth Exception]:", err.message);
    throw err;
  }
}

/**
 * Check mobile service availability for a 5-digit ZIP code.
 */
export async function checkServiceAvailabilityServer(zipCode) {
  try {
    const token = await fetchFreshToken();

    const response = await fetch(`${TELGOO5_BASE_URL}/enrollment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        action: "check_service_availability",
        zip_code: zipCode,
        agent_id: "ewebsiteapi",
        source: "API",
        enrollment_type: "NON_LIFELINE",
        is_enrollment: "Y",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[Telgoo Coverage Error]: HTTP ${response.status}`, text);
      return {
        ok: false,
        error: `Coverage check failed (HTTP ${response.status})`,
      };
    }

    const data = await response.json().catch(() => ({}));

    if (
      data.msg_code === "RESTAPI000" ||
      data.data?.city ||
      data.msg === "Success"
    ) {
      const enrollmentId = data.data?.enrollment_id || null;
      return {
        ok: true,
        enrollmentId,
        city: data.data?.city || "",
        state: data.data?.state || "",
        zipCode,
      };
    } else {
      const errorMsg =
        data.errors?.[0] ||
        data.msg ||
        "Sorry, we don't have coverage in this area yet.";
      return { ok: false, error: formatTelgooError(errorMsg) };
    }
  } catch (err) {
    console.error("[Telgoo Coverage Exception]:", err.message);
    return {
      ok: false,
      error: err.message || "Failed to verify coverage with Telgoo service.",
    };
  }
}

/**
 * Fetch mobile plans list for a given ZIP code from Telgoo API.
 * NO mock data or fallback plans.
 */
export async function getPlanListServer(zipCode) {
  try {
    const token = await fetchFreshToken();

    const response = await fetch(`${TELGOO5_BASE_URL}/plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        action: "plan_list",
        zip_code: zipCode,
        agent_id: "ewebsiteapi",
        source: "API",
        enrollment_type: "NON_LIFELINE",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[Telgoo Plan List Error]: HTTP ${response.status}`, text);
      return {
        ok: false,
        error: `Unable to load plans from service (HTTP ${response.status}).`,
      };
    }

    const data = await response.json().catch(() => ({}));

    if (
      data.msg_code === "RESTAPI000" &&
      Array.isArray(data.data) &&
      data.data.length > 0
    ) {
      const plans = data.data.map((p) => ({
        plan_id: p.plan_id || p.id || `CW_${p.plan_code}`,
        plan_name: p.plan_name || p.name || "Culture Mobile Plan",
        plan_code: p.plan_code || "CW-MOBILE",
        amount: parseFloat(p.plan_price || p.price || p.monthly_rate || 29),
        data_allowance: p.data_allowance || "5GB 5G Data",
        features: p.features || [
          "Unlimited Talk & Text",
          "5G Nationwide",
          "Wi-Fi Calling",
        ],
      }));
      return { ok: true, plans };
    }

    const errorMsg =
      data.errors?.[0] ||
      data.msg ||
      "No plans available for this ZIP code at this time.";
    return { ok: false, error: formatTelgooError(errorMsg) };
  } catch (err) {
    console.error("[Telgoo Plan List Exception]:", err.message);
    return {
      ok: false,
      error: err.message || "Failed to load plans from Telgoo service.",
    };
  }
}

/**
 * Call Telgoo /customer API to provision and activate customer service.
 * Preserves user's testing configurations (carrier: NEXUS, state fallbacks, omitted order_id).
 */
export async function createTelgooCustomerServer(customerPayload) {
  try {
    const token = await fetchFreshToken();

    const fullPayload = {
      action: "create_prepaid_postpaid_customer_v2",
      request_name: "customer",
      agent_id: "ewebsiteapi",
      source: "API",
      external_transaction_id: "",

      lines: [
        {
          enrollment_id: customerPayload.enrollment_id,
          parent_enrollment_id: customerPayload.enrollment_id,
          // order_id intentionally omitted per user directive for testing environment

          plan_id: customerPayload.plan_id,
          carrier: "NEXUS", // hardcoded per user directive

          // eSIM
          is_esim: "Y",
          enrollment_type: "SHIPMENT",

          // Customer info
          first_name: customerPayload.first_name,
          last_name: customerPayload.last_name,
          email: customerPayload.email,
          alternate_phone_number: customerPayload.phone || "",
          password: "",
          pin: null,

          // Service Address
          service_address_one:
            customerPayload.service_address_one ||
            customerPayload.service_address ||
            customerPayload.address1 ||
            "",
          service_address_two: customerPayload.service_address_two || "",
          service_city:
            customerPayload.service_city || customerPayload.city || "",
          service_state:
            customerPayload.service_state || customerPayload.state || "NY", // fallback for testing
          service_zip:
            customerPayload.service_zip ||
            customerPayload.zip_code ||
            customerPayload.zip ||
            "",

          // Billing Address
          billing_address_one:
            customerPayload.billing_address_one ||
            customerPayload.billing_address ||
            "",
          billing_address_two: customerPayload.billing_address_two || "",
          billing_city: customerPayload.billing_city || "",
          billing_state: customerPayload.billing_state || customerPayload.state || "NY", // fallback for testing
          billing_zip: customerPayload.billing_zip || "",

          // Extra fields
          sim: "",
          device_id: "",
          no_of_advance_month: 0,
          child_invoice_number: "",
        },
      ],
    };

    const response = await fetch(`${TELGOO5_BASE_URL}/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(fullPayload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (
      response.ok &&
      (data.msg_code === "RESTAPI000" ||
        data.status === "success" ||
        data.data?.[0]?.data?.enrollment_id ||
        data.data?.[0]?.data?.customer_id)
    ) {
      const resData = data.data?.[0]?.data || data.data || data;
      const esim = resData.esim || {};

      return {
        ok: true,
        data: {
          msisdn: resData.mdn || resData.msisdn || resData.phone_number || "",
          qrActivationCode:
            esim.QR_ACTIVATION_CODE || esim.ACTIVATION_CODE || "",
          activationCode:
            esim.ACTIVATION_CODE || esim.QR_ACTIVATION_CODE || "",
          iccid: esim.ICCID || resData.iccid || "",
          pin: resData.pin || esim.PIN || "",
          enrollmentId:
            resData.enrollment_id || customerPayload.enrollment_id || "",
          customerId: resData.customer_id || "",
          status: "Active",
          raw: data,
        },
      };
    } else {
      const rawErrorMsg =
        data.errors?.[0] ||
        data.msg ||
        data.message ||
        "Telgoo customer activation failed.";
      console.error("[Telgoo /customer Error Response]:", data);
      return {
        ok: false,
        error: formatTelgooError(rawErrorMsg),
        raw: data,
      };
    }
  } catch (err) {
    console.error("[Telgoo /customer Exception]:", err.message);
    return {
      ok: false,
      error:
        "We couldn't complete your activation at the moment. Please try again or contact support if the issue continues.",
    };
  }
}
