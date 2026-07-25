"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAvailability } from "../context/AvailabilityContext";
import { Ico, SignalWave } from "../Components/Icons";

export default function OrderReceivedPage() {
  const router = useRouter();
  const { address, selectedPlan, customerInfo, resetFlow } = useAvailability();

  // Snapshot wizard data locally before wiping state
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Save snapshot of order summary for display
    const currentSummary = {
      address: address?.formattedAddress || address?.streetAddress || "",
      planName: selectedPlan?.displayName || selectedPlan?.name || "Culture Internet",
      planCategory: selectedPlan?.categoryLabel || "Service Plan",
      planSpeed: selectedPlan?.speed ? `${selectedPlan.speed} ${selectedPlan.unit}` : "",
      planPrice: selectedPlan?.price ? `$${selectedPlan.price}/mo` : "",
      addonPrice: selectedPlan?.addonPrice ? `$${selectedPlan.addonPrice}` : null,
      customerName: `${customerInfo?.firstName || ""} ${customerInfo?.lastName || ""}`.trim(),
      customerEmail: customerInfo?.email || "",
      customerPhone: customerInfo?.phone || "",
    };

    setSummary(currentSummary);

    // Clear wizard state and LocalStorage automatically after checkout completion
    resetFlow();
    try {
      localStorage.removeItem("cw-availability-wizard-v1");
    } catch (e) {
      // ignore
    }
  }, []);

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
          maxWidth: 680,
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
            maxWidth: 520,
            margin: "0 auto 32px",
          }}
        >
          Thank you{summary?.customerName ? `, ${summary.customerName}` : ""}! Your subscription request has been successfully created. We've received your order and are preparing your connection.
        </p>

        {/* Summary Card */}
        {summary && (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--cw-border-1)",
              borderRadius: 18,
              padding: 24,
              textAlign: "left",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--cw-purple)",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Order Details
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              {summary.planName && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--cw-fg-3)" }}>Selected Plan:</span>
                  <strong style={{ color: "var(--cw-fg-1)" }}>{summary.planName}</strong>
                </div>
              )}

              {summary.planPrice && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--cw-fg-3)" }}>Monthly Recurring:</span>
                  <strong style={{ color: "#4ade80", fontSize: 16 }}>{summary.planPrice}</strong>
                </div>
              )}

              {summary.address && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <span style={{ color: "var(--cw-fg-3)", flexShrink: 0 }}>Service Address:</span>
                  <strong style={{ color: "var(--cw-fg-1)", textAlign: "right", maxWidth: 300 }}>
                    {summary.address}
                  </strong>
                </div>
              )}

              {summary.customerEmail && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--cw-fg-3)" }}>Email Address:</span>
                  <strong style={{ color: "var(--cw-fg-1)" }}>{summary.customerEmail}</strong>
                </div>
              )}
            </div>
          </div>
        )}

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
              What happens next?
            </div>
            <div style={{ fontSize: 13, color: "var(--cw-fg-2)", lineHeight: 1.5 }}>
              A Culture Wireless specialist will reach out shortly to confirm installation or equipment shipping. Your billing will begin one week after order placement.
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
