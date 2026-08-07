"use client";

import React, { useState, useEffect } from "react";
import { Ico } from "../Icons";

export default function Step4SimType({
  enrollmentData,
  updateEnrollmentData,
  onNext,
  onBack,
}) {
  const [selectedSim, setSelectedSim] = useState("esim");

  useEffect(() => {
    updateEnrollmentData("simType", "esim");
  }, []);

  const handleReviewOrder = () => {
    updateEnrollmentData("simType", "esim");
    onNext();
  };

  return (
    <div style={{ background: "var(--cw-bg-2)", minHeight: "100%", padding: "40px 24px 60px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

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
            HOW DO YOU WANT TO <span className="cw-gradient-text">CONNECT?</span>
          </h1>
          <p style={{ color: "var(--cw-fg-2)", fontSize: 15, lineHeight: 1.6 }}>
            Go instant with an eSIM, or have a physical SIM shipped free.
          </p>
        </div>

        {/* Form Container */}
        <div
          style={{
            background: "var(--cw-bg-1)",
            border: "1.5px solid var(--cw-border-1)",
            borderRadius: 20,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Two Cards Container */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Left Card: eSIM (ENABLED) */}
            <div
              onClick={() => setSelectedSim("esim")}
              style={{
                position: "relative",
                padding: 24,
                borderRadius: 16,
                background: "rgba(139,105,193,0.15)",
                border: "2px solid var(--cw-purple)",
                boxShadow: "0 0 24px rgba(139,105,193,0.25)",
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
            >
              {/* INSTANT Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "linear-gradient(135deg, var(--cw-purple), #6d4aaa)",
                  color: "#fff",
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 9,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 999,
                  letterSpacing: "0.1em",
                }}
              >
                INSTANT
              </div>

              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(139,105,193,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Ico n="zap" size={22} color="var(--cw-purple)" />
              </div>

              <h3
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--cw-fg-1)",
                  margin: "0 0 6px",
                }}
              >
                ESIM
              </h3>
              <p style={{ fontSize: 13, color: "var(--cw-fg-2)", lineHeight: 1.5, margin: "0 0 16px" }}>
                Activate instantly by scanning a QR code. No waiting, no shipping fees.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#4ade80", fontWeight: 600 }}>
                <Ico n="check-circle" size={16} color="#4ade80" />
                <span>Ready for Immediate Activation</span>
              </div>
            </div>

            {/* Right Card: PHYSICAL SIM (HARDCODED DISABLED) */}
            <div
              style={{
                position: "relative",
                padding: 24,
                borderRadius: 16,
                background: "var(--cw-bg-3)",
                border: "1.5px solid var(--cw-border-1)",
                opacity: 0.45,
                cursor: "not-allowed",
                userSelect: "none",
              }}
            >
              {/* Tooltip / Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "var(--cw-bg-3)",
                  border: "1px solid var(--cw-border-1)",
                  color: "var(--cw-fg-3)",
                  fontSize: 9,
                  fontFamily: "var(--cw-font-display)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 999,
                }}
              >
                Currently Unavailable
              </div>

              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--cw-bg-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Ico n="credit-card" size={22} color="var(--cw-fg-3)" />
              </div>

              <h3
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--cw-fg-3)",
                  margin: "0 0 6px",
                }}
              >
                PHYSICAL SIM
              </h3>
              <p style={{ fontSize: 13, color: "var(--cw-fg-3)", lineHeight: 1.5, margin: "0 0 16px" }}>
                We ship a SIM free — arrives in about 2 business days.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>
                <Ico n="info" size={14} color="#f59e0b" />
                <span>Out of stock — Please select eSIM</span>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <button onClick={onBack} className="btn btn-ghost">
            <Ico n="arrow-left" size={14} /> Back to Your Number
          </button>

          <button
            onClick={handleReviewOrder}
            className="btn btn-primary btn-lg"
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span>Continue to Customer Info</span>
            <Ico n="arrow-right" size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
