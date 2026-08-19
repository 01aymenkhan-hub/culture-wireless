"use client";

import React, { useState, useEffect } from "react";
import { Ico } from "../Icons";
import { useCheckoutAuth } from "../Auth/CheckoutAuth";

export default function Step6ReviewOrder({ enrollmentData, onBack }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [resolvedLocation, setResolvedLocation] = useState(null);
  const [resolvingLocation, setResolvingLocation] = useState(false);
  const { requireCheckoutAuthentication } = useCheckoutAuth();

  const zipCode = (enrollmentData.zipCode || "").toString().trim();

  const plan = enrollmentData.selectedPlan || {
    plan_code: "CWM001",
    plan_name: "Culture Mobile 5G Plan",
    amount: 29,
    data_allowance: "5GB 5G Data",
  };

  const customerInfo = enrollmentData.customerInfo || {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  // Pre-resolve location via Google Maps API on mount so user sees resolved City, State, Country
  useEffect(() => {
    let isMounted = true;
    if (zipCode && zipCode.length === 5) {
      setResolvingLocation(true);
      fetch("/api/google/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipCode }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.ok && data.address) {
            setResolvedLocation(data.address);
          }
        })
        .catch((err) => {
          console.error("Google Maps pre-resolution notice:", err);
        })
        .finally(() => {
          if (isMounted) setResolvingLocation(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [zipCode]);

  console.log({ resolvedLocation })

  // Reset submitting state if user navigates back to page via browser BFCache
  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) {
        setSubmitting(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleProceedToCheckout = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const authResult = await requireCheckoutAuthentication();
      if (!authResult.allowed) {
        if (authResult.pending) setSubmitting(false);
        return;
      }

      if (!zipCode || zipCode.length !== 5) {
        throw new Error("A valid 5-digit ZIP code is required. Please go back and re-enter your ZIP code.");
      }

      // Step 1: Resolve customer's ZIP code into full address via Google Maps API
      let addressData = resolvedLocation;

      if (!addressData) {
        const geocodeRes = await fetch("/api/google/geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ zipCode }),
        });

        const geocodeData = await geocodeRes.json().catch(() => ({}));

        if (!geocodeRes.ok || !geocodeData.ok || !geocodeData.address) {
          throw new Error(
            geocodeData.error ||
            `Unable to resolve ZIP code "${zipCode}" with Google Maps API. Please check your ZIP code or go back and re-enter it.`
          );
        }

        addressData = geocodeData.address;
        setResolvedLocation(addressData);
      }

      // Step 2: Call /api/zoho/hostedpage with real Google Maps address
      const redirectUrl = `${window.location.origin}/mobile/activation`;

      const res = await fetch("/api/zoho/hostedpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: {
            streetAddress: addressData.streetAddress,
            city: addressData.city,
            state: addressData.state,
            zipCode: addressData.zipCode,
            country: addressData.country || "USA",
            formattedAddress: addressData.formattedAddress,
            placeId: addressData.placeId || "",
          },
          selectedPlan: plan,
          customerInfo: customerInfo,
          redirectUrl: redirectUrl,
          immediateBilling: true, // Immediate payment required for Telgoo
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok || !data.url) {
        throw new Error(data.error || "Failed to generate Zoho Hosted Checkout page.");
      }

      // Redirect to Zoho Hosted Payment page
      window.location.href = data.url;
    } catch (err) {
      console.error("Hosted Checkout Error:", err);
      setError(err.message || "An unexpected error occurred during checkout.");
      setSubmitting(false);
    }
  };

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
            Please review all details before proceeding to secure checkout.
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div
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
            }}
          >
            <Ico n="x" size={18} color="#f87171" sw={3} />
            <div style={{ flex: 1 }}>{error}</div>
            <button
              onClick={handleProceedToCheckout}
              className="btn btn-ghost btn-sm"
              style={{ color: "#f87171", border: "1px solid rgba(239,68,68,0.4)" }}
            >
              Retry Checkout
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Section 1: Device Info */}
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
                fontSize: 15,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--cw-purple)",
                fontWeight: 700,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico n="smartphone" size={16} color="var(--cw-purple)" />
              1. Device Compatibility
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 15 }}>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Device Model: </span>
                <strong style={{ color: "var(--cw-fg-1)" }}>
                  {enrollmentData.brand || "Apple"} {enrollmentData.model || "iPhone"}
                </strong>
              </div>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Compatibility: </span>
                <strong style={{ color: enrollmentData.isEsim ? "#4ade80" : "#f59e0b" }}>
                  {enrollmentData.isEsim ? "eSIM Compatible" : "Standard Device"}
                </strong>
              </div>
            </div>
          </div>

          {/* Section 2: Coverage & Google Maps Resolved Location */}
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
                fontSize: 15,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--cw-yellow)",
                fontWeight: 700,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico n="map-pin" size={16} color="var(--cw-yellow)" />
              2. Coverage & Verified Address (Google Maps)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 15 }}>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Service ZIP Code: </span>
                <strong style={{ color: "var(--cw-fg-1)" }}>{zipCode || "30274"}</strong>
              </div>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Verified Location: </span>
                {resolvingLocation ? (
                  <span style={{ color: "var(--cw-fg-3)", fontSize: 13 }}>Resolving Google Maps…</span>
                ) : resolvedLocation ? (
                  <strong style={{ color: "#4ade80" }}>
                    {resolvedLocation.city}, {resolvedLocation.state} ({resolvedLocation.country})
                  </strong>
                ) : (
                  <strong style={{ color: "var(--cw-purple)", fontFamily: "var(--cw-font-display)" }}>
                    {enrollmentData.enrollmentId || "Verified"}
                  </strong>
                )}
              </div>
            </div>
            {resolvedLocation?.formattedAddress && (
              <div style={{ marginTop: 10, fontSize: 13, color: "var(--cw-fg-3)", borderTop: "1px solid var(--cw-border-1)", paddingTop: 10 }}>
                Google Maps Formatted Address: <strong style={{ color: "var(--cw-fg-1)" }}>{resolvedLocation.formattedAddress}</strong>
              </div>
            )}
          </div>

          {/* Section 3: Selected Mobile Plan */}
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
                fontSize: 15,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--cw-blue)",
                fontWeight: 700,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico n="check-circle" size={16} color="var(--cw-blue)" />
              3. Selected Mobile Plan
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
                  {plan.plan_name || plan.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--cw-fg-3)", marginTop: 4 }}>
                  {plan.data_allowance || plan.speed || "5G Nationwide Data"} · Unlimited Talk & Text
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
                  ${plan.amount || plan.price}
                  <small style={{ fontSize: 14, fontWeight: 400, color: "var(--cw-fg-3)" }}>
                    /mo
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Phone Number Choice */}
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
                fontSize: 15,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--cw-purple)",
                fontWeight: 700,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico n="smartphone" size={16} color="var(--cw-purple)" />
              4. Phone Number Choice
            </div>
            <div style={{ fontSize: 15 }}>
              <span style={{ color: "var(--cw-fg-3)" }}>Option: </span>
              <strong style={{ color: "var(--cw-fg-1)", fontFamily: "var(--cw-font-display)" }}>
                Get a New Number
              </strong>
            </div>
          </div>

          {/* Section 5: Connection & SIM */}
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
                fontSize: 15,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--cw-blue)",
                fontWeight: 700,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico n="zap" size={16} color="var(--cw-blue)" />
              5. Connection & Delivery Format
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 15 }}>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>SIM Format: </span>
                <strong style={{ color: "var(--cw-fg-1)" }}>eSIM — Instant Digital Delivery</strong>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--cw-font-display)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: "rgba(74,222,128,0.2)",
                  border: "1px solid rgba(74,222,128,0.4)",
                  color: "#4ade80",
                }}
              >
                No Shipping Needed
              </span>
            </div>
          </div>

          {/* Section 6: Customer Information */}
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
                fontSize: 15,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--cw-purple)",
                fontWeight: 700,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico n="user" size={16} color="var(--cw-purple)" />
              6. Customer Information
            </div>
            <div className="grid-2-to-1" style={{ fontSize: 15 }}>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Name: </span>
                <strong style={{ color: "var(--cw-fg-1)" }}>
                  {customerInfo.firstName} {customerInfo.lastName}
                </strong>
              </div>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Email: </span>
                <strong style={{ color: "var(--cw-fg-1)" }}>{customerInfo.email}</strong>
              </div>
              <div>
                <span style={{ color: "var(--cw-fg-3)" }}>Phone: </span>
                <strong style={{ color: "var(--cw-fg-1)" }}>{customerInfo.phone}</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              marginTop: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <button onClick={onBack} disabled={submitting} className="btn btn-ghost">
              <Ico n="arrow-left" size={14} /> Back to Customer Info
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
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? (
                <>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      animation: "cwSpin 0.8s linear infinite",
                    }}
                  />
                  <span>Resolving Google Address & Checkout…</span>
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

      {/* Full Screen Loading Modal Overlay matching Check Availability Step6ReviewOrder */}
      {submitting && (
        <div
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
            animation: "fadeIn 200ms ease",
          }}
        >
          <div
            style={{
              background: "var(--cw-bg-1)",
              border: "1.5px solid var(--cw-border-1)",
              borderRadius: 24,
              padding: "48px 36px",
              maxWidth: 440,
              width: "100%",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 40px rgba(139,105,193,0.25)",
            }}
          >
            {/* Spinning Indicator with Center Lock Icon */}
            <div
              style={{
                position: "relative",
                width: 72,
                height: 72,
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "4px solid rgba(139,105,193,0.15)",
                  borderTopColor: "var(--cw-purple)",
                  borderRightColor: "var(--cw-blue)",
                  animation: "cwSpin 0.9s linear infinite",
                }}
              />
              <Ico n="lock" size={26} color="var(--cw-purple)" />
            </div>

            <h3
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--cw-fg-1)",
                margin: "0 0 10px",
              }}
            >
              Resolving Address & Preparing Checkout
            </h3>

            <p
              style={{
                color: "var(--cw-fg-2)",
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Resolving your ZIP code with Google Maps API and connecting to secure payment server...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
