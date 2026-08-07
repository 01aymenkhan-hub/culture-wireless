"use client";

import React, { useState } from "react";
import { Ico } from "../Icons";

export default function Step5Review({ enrollmentData, onBack }) {
  const [confirmed, setConfirmed] = useState(false);

  const plan = enrollmentData.selectedPlan || {
    plan_name: "Culture Mobile 5G Plan",
    amount: 29,
  };

  const handleConfirm = () => {
    setConfirmed(true);
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
            Please review all details before completing your signup.
          </p>
        </div>

        {/* Confirmation State */}
        {confirmed ? (
          <div
            style={{
              background: "var(--cw-bg-1)",
              border: "1.5px solid rgba(74,222,128,0.4)",
              borderRadius: 20,
              padding: "44px 32px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(74,222,128,0.15)",
                border: "2px solid #4ade80",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Ico n="check" size={32} color="#4ade80" sw={3} />
            </div>
            <h2
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 24,
                fontWeight: 800,
                textTransform: "uppercase",
                color: "#fff",
                margin: "0 0 10px",
              }}
            >
              MOBILE SIGNUP CONFIRMED!
            </h2>
            <p style={{ color: "var(--cw-fg-2)", fontSize: 15, maxWidth: 480, lineHeight: 1.6, margin: "0 0 24px" }}>
              Your Culture Mobile subscription has been successfully registered under Enrollment ID:{" "}
              <strong style={{ color: "var(--cw-purple)", fontFamily: "var(--cw-font-display)" }}>
                {enrollmentData.enrollmentId || "ACUL410"}
              </strong>
            </p>
            <button
              onClick={() => (window.location.href = "/mobile")}
              className="btn btn-primary btn-lg"
            >
              Return to Mobile Overview
            </button>
          </div>
        ) : (
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
                    {enrollmentData.brand || "Apple"} {enrollmentData.model || "iPhone 14"}
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

            {/* Section 2: Coverage & Enrollment */}
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
                2. Coverage & Enrollment ID
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 15 }}>
                <div>
                  <span style={{ color: "var(--cw-fg-3)" }}>Service ZIP Code: </span>
                  <strong style={{ color: "var(--cw-fg-1)" }}>{enrollmentData.zipCode || "98103"}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--cw-fg-3)" }}>Telgoo5 Enrollment ID: </span>
                  <strong style={{ color: "var(--cw-purple)", fontFamily: "var(--cw-font-display)" }}>
                    {enrollmentData.enrollmentId || "ACUL410"}
                  </strong>
                </div>
              </div>
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
                    {plan.plan_name}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--cw-fg-3)", marginTop: 4 }}>
                    {plan.data_allowance || "5G Nationwide Data"} · Unlimited Talk & Text
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
                    ${plan.amount}
                    <small style={{ fontSize: 14, fontWeight: 400, color: "var(--cw-fg-3)" }}>
                      /mo
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Phone Number Selection */}
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
              {enrollmentData.numberChoice === "keep" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 15 }}>
                  <div>
                    <span style={{ color: "var(--cw-fg-3)" }}>Port Number: </span>
                    <strong style={{ color: "var(--cw-fg-1)" }}>{enrollmentData.portNumber || "(404) 555-0182"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--cw-fg-3)" }}>Current Carrier: </span>
                    <strong style={{ color: "var(--cw-fg-1)" }}>{enrollmentData.portCarrier || "Current Carrier"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--cw-fg-3)" }}>Account #: </span>
                    <strong style={{ color: "var(--cw-fg-1)" }}>{enrollmentData.portAccountNumber || "xxxx-xxxx"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--cw-fg-3)" }}>Transfer PIN: </span>
                    <strong style={{ color: "var(--cw-fg-1)" }}>****</strong>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 15 }}>
                  <span style={{ color: "var(--cw-fg-3)" }}>Requested New Number: </span>
                  <strong style={{ color: "var(--cw-fg-1)", fontFamily: "var(--cw-font-display)", fontSize: 18 }}>
                    {enrollmentData.selectedNewNumber || `(${enrollmentData.areaCode || "404"}) 555-0142`}
                  </strong>
                </div>
              )}
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

            {/* Action Buttons */}
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
                <Ico n="arrow-left" size={14} /> Back to SIM Type
              </button>

              <button
                onClick={handleConfirm}
                className="btn btn-primary btn-lg"
                style={{ minWidth: 240, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}
              >
                <span>Confirm & Continue</span>
                <Ico n="arrow-right" size={16} />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
