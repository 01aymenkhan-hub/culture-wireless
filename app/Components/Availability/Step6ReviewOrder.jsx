"use client";

import React, { useState } from "react";
import { Ico } from "../Icons";

export default function Step6ReviewOrder({
  address,
  selectedPlan,
  customerInfo,
  currentServiceInfo,
  onComplete,
  onBack,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitOrder = async () => {
    setSubmitting(true);
    // Simulate order submission / preparation for Stripe Checkout
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ background: "var(--cw-bg-2)", minHeight: "100%", padding: "60px 24px" }}>
        <div
          style={{
            maxWidth: 580,
            margin: "0 auto",
            background: "var(--cw-bg-1)",
            border: "1.5px solid var(--cw-border-1)",
            borderRadius: 24,
            padding: 40,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(74,222,128,0.15)",
              border: "1px solid rgba(74,222,128,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Ico n="check" size={32} color="#4ade80" sw={3} />
          </div>
          <h2
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 28,
              fontWeight: 800,
              textTransform: "uppercase",
              margin: "0 0 12px",
              color: "var(--cw-fg-1)",
            }}
          >
            Order Received!
          </h2>
          <p style={{ color: "var(--cw-fg-2)", fontSize: 16, lineHeight: 1.6, marginBottom: 28 }}>
            Thank you, <strong>{customerInfo?.firstName}</strong>! Your availability request and order details have been saved. A local Culture Wireless technician will contact you shortly at <strong>{customerInfo?.phone}</strong> to confirm your installation date.
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 14,
              padding: 20,
              textAlign: "left",
              marginBottom: 28,
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--cw-purple)" }}>
              ORDER SUMMARY
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--cw-fg-3)" }}>Plan:</span>
              <span>{selectedPlan?.displayName || selectedPlan?.name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--cw-fg-3)" }}>Monthly Total:</span>
              <span style={{ fontWeight: 700 }}>${selectedPlan?.price}/mo</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--cw-fg-3)" }}>Service Address:</span>
              <span style={{ maxWidth: 260, textAlign: "right" }}>{address?.formattedAddress}</span>
            </div>
          </div>

          <button onClick={onComplete} className="btn btn-primary btn-lg" style={{ width: "100%" }}>
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--cw-bg-2)", minHeight: "100%", padding: "40px 24px 60px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              margin: "0 0 8px",
              color: "var(--cw-fg-1)",
            }}
          >
            Review Your <span className="cw-gradient-text">Order</span>
          </h1>
          <p style={{ color: "var(--cw-fg-2)", fontSize: 15 }}>
            Please review all details before completing your availability request.
          </p>
        </div>

        {/* Summary Sections Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Section 1: Selected Plan */}
          <div
            style={{
              background: "var(--cw-bg-1)",
              border: "1.5px solid var(--cw-border-1)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 16,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--cw-purple)",
                fontWeight: 700,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico n="check-circle" size={14} color="var(--cw-purple)" />
              1. Selected Plan Details
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontFamily: "var(--cw-font-display)", fontSize: 20, fontWeight: 700, color: "var(--cw-fg-1)" }}>
                  {selectedPlan?.displayName || selectedPlan?.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--cw-fg-3)", marginTop: 4 }}>
                  {selectedPlan?.categoryLabel || "Service Plan"} · {selectedPlan?.speed} {selectedPlan?.unit}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--cw-font-display)", fontSize: 28, fontWeight: 800, color: "var(--cw-fg-1)" }}>
                  ${selectedPlan?.price}
                  <small style={{ fontSize: 14, fontWeight: 400, color: "var(--cw-fg-3)" }}>/mo</small>
                </div>
                {selectedPlan?.addonPrice > 0 && (
                  <div style={{ fontSize: 11, color: "var(--cw-fg-3)" }}>
                    (Includes ${selectedPlan.addonPrice} router add-on)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Service Address */}
          <div
            style={{
              background: "var(--cw-bg-1)",
              border: "1.5px solid var(--cw-border-1)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 16,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--cw-yellow)",
                fontWeight: 700,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico n="map-pin" size={14} color="var(--cw-yellow)" />
              2. Service Address
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--cw-fg-1)" }}>
              {address?.formattedAddress || "No address provided"}
            </div>
          </div>

          {/* Section 3: Customer Information */}
          <div
            style={{
              background: "var(--cw-bg-1)",
              border: "1.5px solid var(--cw-border-1)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 16,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--cw-blue)",
                fontWeight: 700,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico n="user" size={14} color="var(--cw-blue)" />
              3. Customer Information
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 16 }}>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Full Name: </span>
                <strong>{customerInfo?.firstName} {customerInfo?.lastName}</strong>
              </div>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Phone: </span>
                <strong>{customerInfo?.phone}</strong>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <span style={{ color: "var(--cw-fg-3)" }}>Email: </span>
                <strong>{customerInfo?.email}</strong>
              </div>
            </div>
          </div>

          {/* Section 4: Current Service Details */}
          <div
            style={{
              background: "var(--cw-bg-1)",
              border: "1.5px solid var(--cw-border-1)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 16,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--cw-purple)",
                fontWeight: 700,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico n="headphones" size={14} color="var(--cw-purple)" />
              4. Current Service & Switching Info
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 16 }}>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Current Provider: </span>
                <strong>{currentServiceInfo?.currentProvider}</strong>
              </div>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Reason for Switching: </span>
                <strong>{currentServiceInfo?.switchingReason}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <button onClick={onBack} className="btn btn-ghost">
            <Ico n="arrow-left" size={14} /> Back to Service Info
          </button>

          <button
            onClick={handleSubmitOrder}
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{
              minWidth: 220,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            {submitting ? (
              <span>Processing Order…</span>
            ) : (
              <>
                <span>Complete Order</span>
                <Ico n="arrow-right" size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
