"use client";

import React, { useEffect, useState } from "react";
import { Ico } from "../Icons";
import { useCheckoutAuth } from "../Auth/CheckoutAuth";

export default function Step6ReviewOrder({
  address,
  selectedPlan,
  customerInfo,
  currentServiceInfo,
  onComplete,
  onBack,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { requireCheckoutAuthentication } = useCheckoutAuth();

  const handleProceedToCheckout = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const authResult = await requireCheckoutAuthentication();
      if (!authResult.allowed) {
        if (authResult.pending) setSubmitting(false);
        return;
      }

      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/order-received`
          : "";

      const res = await fetch("/api/zoho/hostedpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          selectedPlan,
          customerInfo,
          currentServiceInfo,
          redirectUrl,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (data.ok && data.url) {
        // Redirect to Zoho Hosted Checkout page
        window.location.href = data.url;
        return;
      } else {
        throw new Error(
          data.error ||
            "Unable to initialize checkout. Please check your details and try again.",
        );
      }
    } catch (err) {
      console.error("Error creating Zoho hosted page:", err);
      setError(
        err.message ||
          "An unexpected error occurred. Please try again in a moment.",
      );
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) {
        // BFCache se restore hua
        setSubmitting(false);
        setError(null);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);
  return (
    <div
      style={{
        background: "var(--cw-bg-2)",
        minHeight: "100%",
        padding: "40px 24px 60px",
        position: "relative",
      }}
    >
      {/* Full-Page Loading Overlay during Checkout Request */}
      {submitting && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Preparing checkout"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(10, 6, 18, 0.85)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
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
              maxWidth: 460,
              width: "100%",
              background: "var(--cw-bg-1)",
              border: "1.5px solid var(--cw-border-1)",
              borderRadius: 24,
              padding: "44px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
              animation: "cw-pop 250ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* Pulsing Spinner Ring Icon Container */}
            <div
              style={{
                position: "relative",
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "4px solid var(--cw-border-1)",
                  borderTopColor: "var(--cw-purple)",
                  borderRightColor: "var(--cw-blue)",
                  animation: "cwSpin 0.8s linear infinite",
                }}
              />
              <Ico n="lock" size={24} color="var(--cw-purple)" />
            </div>

            <h3
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "var(--cw-fg-1)",
                margin: "0 0 12px",
              }}
            >
              Preparing your secure checkout…
            </h3>

            <p
              style={{
                fontSize: 14,
                color: "var(--cw-fg-2)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Please wait while we connect you to our secure payment provider.
              <br />
              <strong
                style={{
                  color: "var(--cw-fg-3)",
                  display: "block",
                  marginTop: 12,
                  fontSize: 12,
                }}
              >
                Do not refresh or close this page.
              </strong>
            </p>
          </div>
        </div>
      )}

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
            Please review all details before proceeding to checkout.
          </p>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 24,
              padding: "16px 20px",
              borderRadius: 14,
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#f87171",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 12,
              animation: "cw-pop 200ms ease-out",
            }}
          >
            <Ico n="x" size={18} color="#f87171" sw={3} />
            <span style={{ flex: 1, lineHeight: 1.4 }}>{error}</span>
          </div>
        )}

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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--cw-fg-1)",
                  }}
                >
                  {selectedPlan?.displayName || selectedPlan?.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--cw-fg-3)",
                    marginTop: 4,
                  }}
                >
                  {selectedPlan?.categoryLabel || "Service Plan"} ·{" "}
                  {selectedPlan?.speed} {selectedPlan?.unit}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--cw-fg-1)",
                  }}
                >
                  ${selectedPlan?.price}
                  <small
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "var(--cw-fg-3)",
                    }}
                  >
                    /mo
                  </small>
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
            <div
              style={{ fontSize: 16, fontWeight: 600, color: "var(--cw-fg-1)" }}
            >
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                fontSize: 16,
              }}
            >
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Full Name: </span>
                <strong>
                  {customerInfo?.firstName} {customerInfo?.lastName}
                </strong>
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 16,
              }}
            >
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>
                  Current Provider:{" "}
                </span>
                <strong>{currentServiceInfo?.currentProvider}</strong>
              </div>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>
                  Reason for Switching:{" "}
                </span>
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
          <button
            onClick={onBack}
            disabled={submitting}
            className="btn btn-ghost"
          >
            <Ico n="arrow-left" size={14} /> Back to Service Info
          </button>

          <button
            onClick={handleProceedToCheckout}
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{
              minWidth: 260,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    animation: "cwSpin 0.8s linear infinite",
                  }}
                />
                <span>Preparing Secure Checkout…</span>
              </>
            ) : (
              <>
                <span>Proceed to Checkout</span>
                <Ico n="arrow-right" size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
