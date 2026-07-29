"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAvailability } from "../context/AvailabilityContext";
import { Ico, SignalWave } from "../Components/Icons";

function OrderReceivedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hostedpageId = searchParams.get("hostedpage_id");

  const { address, selectedPlan, customerInfo, resetFlow } = useAvailability();

  const [loading, setLoading] = useState(!!hostedpageId);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);

  // Snapshot wizard data locally as a fallback
  const [localFallback, setLocalFallback] = useState(null);

  useEffect(() => {
    // Local fallback snapshot
    if (address || selectedPlan || customerInfo?.email) {
      setLocalFallback({
        address: address?.formattedAddress || address?.streetAddress || "",
        planName: selectedPlan?.displayName || selectedPlan?.name || "Culture Internet",
        planPrice: selectedPlan?.price ? `$${selectedPlan.price}/mo` : "",
        customerName: `${customerInfo?.firstName || ""} ${customerInfo?.lastName || ""}`.trim(),
        customerEmail: customerInfo?.email || "",
      });
    }

    // Clear wizard state after reaching order-received page
    resetFlow();
    try {
      localStorage.removeItem("cw-availability-wizard-v1");
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!hostedpageId) return;

    let active = true;
    setLoading(true);
    setError(null);

    async function fetchOrderDetails() {
      try {
        const res = await fetch(`/api/zoho/order-details?hostedpage_id=${encodeURIComponent(hostedpageId)}`);
        const data = await res.json().catch(() => ({}));

        if (!active) return;

        if (res.ok && data.ok && data.details) {
          setOrderData(data.details);
        } else {
          setError(data.error || "Unable to retrieve order details from Zoho.");
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load order confirmation.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchOrderDetails();

    return () => {
      active = false;
    };
  }, [hostedpageId]);

  // Extracts structured details from Zoho Hosted Page response
  const sub = orderData?.subscription;
  const cust = sub?.customer;
  const plan = sub?.plan;
  const addons = sub?.addons || [];
  const billingAddr = cust?.billing_address;

  const displayCustomerName =
    cust?.display_name ||
    `${cust?.first_name || ""} ${cust?.last_name || ""}`.trim() ||
    localFallback?.customerName ||
    "Valued Customer";

  const displayEmail = cust?.email || localFallback?.customerEmail || "";

  const streetText = billingAddr
    ? [billingAddr.street, billingAddr.street2].filter(Boolean).join(", ")
    : localFallback?.address || "";

  const cityStateZipText = billingAddr
    ? [billingAddr.city, billingAddr.state, billingAddr.zip, billingAddr.country]
        .filter(Boolean)
        .join(", ")
    : "";

  const fullAddressDisplay = streetText
    ? cityStateZipText
      ? `${streetText}, ${cityStateZipText}`
      : streetText
    : "Provided upon activation";

  const subNumber = sub?.subscription_number || "Order Confirmed";
  const productName = sub?.product_name || sub?.name || "Culture Wireless Service";
  const planName = plan?.name || plan?.plan_code || localFallback?.planName || "Service Plan";
  const planPrice = plan?.price !== undefined ? `$${plan.price}/mo` : localFallback?.planPrice || "";
  const totalAmount = sub?.amount !== undefined ? `$${sub.amount}/mo` : planPrice;
  const startDate = sub?.start_date || "";

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--cw-bg-2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "4px solid var(--cw-border-1)",
            borderTopColor: "var(--cw-purple)",
            animation: "cwSpin 0.8s linear infinite",
            marginBottom: 20,
          }}
        />
        <h3
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 18,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            color: "var(--cw-fg-1)",
            margin: "0 0 8px",
          }}
        >
          Retrieving your order details…
        </h3>
        <p style={{ fontSize: 14, color: "var(--cw-fg-3)", margin: 0 }}>
          Please wait a moment while we verify your subscription and generate your receipt.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--cw-bg-2)",
        minHeight: "100vh",
        padding: "60px 24px 80px",
        fontFamily: "var(--cw-font-sans)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SignalWave style={{ position: "absolute", right: -80, top: 40, opacity: 0.12 }} />

      <div
        style={{
          maxWidth: 720,
          width: "100%",
          background: "var(--cw-bg-1)",
          border: "1.5px solid var(--cw-border-1)",
          borderRadius: 24,
          padding: "48px 40px",
          textAlign: "center",
          boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Animated Green Success Badge */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(74,222,128,0.05) 100%)",
            border: "2px solid #4ade80",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 0 32px rgba(74,222,128,0.25)",
          }}
        >
          <Ico n="check" size={36} color="#4ade80" sw={3} />
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            margin: "0 0 12px",
            color: "var(--cw-fg-1)",
          }}
        >
          Order <span className="cw-gradient-text">Received!</span>
        </h1>

        <p
          style={{
            color: "var(--cw-fg-2)",
            fontSize: 16,
            lineHeight: 1.6,
            maxWidth: 540,
            margin: "0 auto 32px",
          }}
        >
          Thank you, <strong>{displayCustomerName}</strong>! Your subscription request has been successfully processed and recorded.
        </p>

        {/* Error Alert Banner if fetch had issue */}
        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 28,
              padding: "16px 20px",
              borderRadius: 14,
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#f87171",
              fontSize: 14,
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Ico n="alert-triangle" size={18} color="#f87171" />
            <span style={{ flex: 1 }}>{error}</span>
          </div>
        )}

        {/* Dynamic Order Summary Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--cw-border-1)",
            borderRadius: 20,
            padding: 28,
            textAlign: "left",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid var(--cw-border-1)",
              paddingBottom: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--cw-purple)",
                fontWeight: 700,
              }}
            >
              Order & Subscription Summary
            </div>
            {subNumber && (
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "var(--cw-font-display)",
                  fontWeight: 700,
                  color: "var(--cw-fg-1)",
                  background: "var(--cw-bg-3)",
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                Ref: {subNumber}
              </span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14 }}>
            {/* Customer Name */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--cw-fg-3)" }}>Customer Name:</span>
              <strong style={{ color: "var(--cw-fg-1)" }}>{displayCustomerName}</strong>
            </div>

            {/* Email */}
            {displayEmail && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--cw-fg-3)" }}>Email Address:</span>
                <strong style={{ color: "var(--cw-fg-1)" }}>{displayEmail}</strong>
              </div>
            )}

            {/* Service Address */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <span style={{ color: "var(--cw-fg-3)", flexShrink: 0 }}>Service Address:</span>
              <strong style={{ color: "var(--cw-fg-1)", textAlign: "right", maxWidth: 360 }}>
                {fullAddressDisplay}
              </strong>
            </div>

            {/* Product / Service */}
            {productName && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--cw-fg-3)" }}>Selected Service:</span>
                <strong style={{ color: "var(--cw-fg-1)" }}>{productName}</strong>
              </div>
            )}

            {/* Purchased Plan */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--cw-fg-3)" }}>Purchased Plan:</span>
              <strong style={{ color: "var(--cw-fg-1)" }}>
                {planName} {planPrice ? `(${planPrice})` : ""}
              </strong>
            </div>

            {/* Selected Add-ons */}
            {addons.length > 0 && (
              <div style={{ borderTop: "1px dashed var(--cw-border-1)", paddingTop: 12, marginTop: 2 }}>
                <div style={{ color: "var(--cw-fg-3)", marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
                  Included Add-ons:
                </div>
                {addons.map((addon) => (
                  <div
                    key={addon.addon_id || addon.addon_code}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingLeft: 12,
                      marginBottom: 6,
                      fontSize: 13.5,
                    }}
                  >
                    <span style={{ color: "var(--cw-fg-2)" }}>
                      • {addon.name || addon.addon_code}
                    </span>
                    <strong style={{ color: "var(--cw-fg-1)" }}>
                      ${addon.price}/mo
                    </strong>
                  </div>
                ))}
              </div>
            )}

            {/* Total Recurring */}
            <div
              style={{
                borderTop: "1px solid var(--cw-border-1)",
                paddingTop: 14,
                marginTop: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "var(--cw-fg-1)", fontWeight: 700, fontSize: 15 }}>
                Total Monthly Recurring:
              </span>
              <strong style={{ color: "#4ade80", fontSize: 20, fontFamily: "var(--cw-font-display)" }}>
                {totalAmount}
              </strong>
            </div>

            {/* Start Date */}
            {startDate && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <span style={{ color: "var(--cw-fg-3)" }}>Subscription Start Date:</span>
                <span style={{ color: "var(--cw-fg-2)", fontWeight: 600 }}>{startDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* What's Next Section */}
        <div
          style={{
            background: "rgba(139,105,193,0.06)",
            border: "1px solid rgba(139,105,193,0.2)",
            borderRadius: 16,
            padding: 20,
            textAlign: "left",
            marginBottom: 36,
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(139,105,193,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <Ico n="headphones" size={18} color="var(--cw-purple)" />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--cw-fg-1)",
                marginBottom: 4,
              }}
            >
              Support Ticket Created
            </div>
            <div style={{ fontSize: 13, color: "var(--cw-fg-2)", lineHeight: 1.5 }}>
              A Zoho Desk support ticket has been automatically opened for your order. A Culture Wireless specialist will contact you at <strong style={{ color: "var(--cw-fg-1)" }}>{displayEmail || "your email"}</strong> to confirm service activation and delivery.
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => router.push("/")}
          className="btn btn-primary btn-lg"
          style={{ width: "100%", justifyContent: "center" }}
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
}

export default function OrderReceivedPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "var(--cw-bg-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--cw-fg-3)",
            fontFamily: "var(--cw-font-sans)",
          }}
        >
          Loading confirmation…
        </div>
      }
    >
      <OrderReceivedContent />
    </Suspense>
  );
}
