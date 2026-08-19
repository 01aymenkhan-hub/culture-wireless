"use client";

import React, { useState } from "react";
import { Ico } from "../Icons";

export default function Step3YourNumber({
  enrollmentData,
  updateEnrollmentData,
  onNext,
  onBack,
}) {
  const [numberChoice, setNumberChoice] = useState("new");

  const handleContinue = (e) => {
    e.preventDefault();
    updateEnrollmentData("numberChoice", "new");
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
            KEEP IT OR <span className="cw-gradient-text">START FRESH</span>
          </h1>
          <p style={{ color: "var(--cw-fg-2)", fontSize: 15, lineHeight: 1.6 }}>
            Choose how you'd like to get your phone number.
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
            gap: 24,
          }}
        >
          {/* Option Cards */}
          <div className="grid-2-to-1">
            
            {/* Keep Number Card — DISABLED with Coming Soon */}
            <div
              style={{
                padding: 20,
                borderRadius: 14,
                background: "var(--cw-bg-3)",
                border: "1px solid var(--cw-border-1)",
                cursor: "not-allowed",
                opacity: 0.45,
                transition: "all 200ms ease",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--cw-font-display)", fontWeight: 700, fontSize: 14, color: "var(--cw-fg-1)" }}>
                  KEEP MY NUMBER
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "var(--cw-font-display)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    background: "rgba(255,185,0,0.15)",
                    border: "1px solid rgba(255,185,0,0.35)",
                    color: "var(--cw-yellow, #FFB900)",
                    padding: "3px 8px",
                    borderRadius: 999,
                  }}
                >
                  Coming Soon
                </span>
              </div>
              <p style={{ fontSize: 12, color: "var(--cw-fg-3)", margin: 0, lineHeight: 1.4 }}>
                Port from your current carrier — no downtime.
              </p>
            </div>

            {/* Get New Number Card — ACTIVE */}
            <div
              onClick={() => setNumberChoice("new")}
              style={{
                padding: 20,
                borderRadius: 14,
                background: "rgba(139,105,193,0.15)",
                border: "2px solid var(--cw-purple)",
                boxShadow: "0 0 24px rgba(139,105,193,0.25)",
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--cw-font-display)", fontWeight: 700, fontSize: 14, color: "var(--cw-fg-1)" }}>
                  GET A NEW NUMBER
                </span>
                <Ico n="check-circle" size={18} color="var(--cw-purple)" />
              </div>
              <p style={{ fontSize: 12, color: "var(--cw-fg-3)", margin: 0, lineHeight: 1.4 }}>
                We'll assign a new number in your area.
              </p>
            </div>

          </div>

          {/* No additional fields shown when "Get a New Number" is selected */}

        </div>

        {/* Buttons */}
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
            <Ico n="arrow-left" size={14} /> Back to Plan Selection
          </button>

          <button
            onClick={handleContinue}
            className="btn btn-primary btn-lg"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>Continue to SIM Type</span>
            <Ico n="arrow-right" size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
