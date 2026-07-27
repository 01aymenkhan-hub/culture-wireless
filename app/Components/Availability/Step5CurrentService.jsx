"use client";

import React, { useState } from "react";
import { Ico } from "../Icons";

const PROVIDERS_LIST = [
  "Xfinity / Comcast",
  "AT&T Fiber / DSL",
  "Spectrum / Charter",
  "T-Mobile 5G Home Internet",
  "Verizon 5G Home / Fios",
  "Cox Communications",
  "CenturyLink / Quantum Fiber",
  "Satellite (Starlink / HughesNet / Viasat)",
  "Other Provider",
  "None / New Service",
];

const REASONS_LIST = [
  "High prices / frequent bill increases",
  "Slow internet speeds & lag",
  "Unreliable connection / frequent outages",
  "Data caps & hidden throttling fees",
  "Poor customer support / long hold times",
  "Moving to a new location",
  "Want better value & honest pricing",
  "Other reason",
];

export default function Step5CurrentService({
  currentServiceInfo,
  onChange,
  onNext,
  onBack,
}) {
  const currentProvider = currentServiceInfo?.currentProvider || "";
  const switchingReason = currentServiceInfo?.switchingReason || "";

  const isValid =
    currentProvider.trim().length > 0 && switchingReason.trim().length > 0;

  const handleChange = (field, val) => {
    onChange({ ...currentServiceInfo, [field]: val });
  };

  return (
    <div
      style={{
        background: "var(--cw-bg-2)",
        minHeight: "100%",
        padding: "40px 24px 60px",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
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
            Current Service <span className="cw-gradient-text">Details</span>
          </h1>
          <p style={{ color: "var(--cw-fg-2)", fontSize: 15 }}>
            Tell us about your current setup so we can ensure a smooth
            transition with zero downtime.
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
          {/* Current Provider Dropdown / Input */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--cw-font-display)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--cw-fg-2)",
                marginBottom: 8,
                fontWeight: 700,
              }}
            >
              Current Internet Provider / Service *
            </label>
            <select
              value={currentProvider}
              onChange={(e) => handleChange("currentProvider", e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--cw-border-1)",
                color: "var(--cw-fg-2)",
                fontSize: 15,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option
                value=""
                disabled
                style={{ background: "#1A1233", color: "#ccc" }}
              >
                Select your current provider…
              </option>
              {PROVIDERS_LIST.map((p) => (
                <option
                  key={p}
                  value={p}
                  style={{ background: "#1A1233", color: "#fff" }}
                >
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Reason for Switching Dropdown / Input */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--cw-font-display)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--cw-fg-2)",
                marginBottom: 8,
                fontWeight: 700,
              }}
            >
              Main Reason for Switching *
            </label>
            <textarea
              value={switchingReason}
              onChange={(e) => handleChange("switchingReason", e.target.value)}
              rows="7"
              name=""
              id=""
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--cw-border-1)",
                color: "var(--cw-fg-2)",
                fontSize: 15,
                outline: "none",
                cursor: "pointer",
              }}
            ></textarea>
            {/* <select
              value={switchingReason}
              onChange={(e) => handleChange("switchingReason", e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--cw-border-1)",
                color: "#fff",
                fontSize: 15,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="" disabled style={{ background: "#1A1233", color: "#ccc" }}>
                Select your main reason for switching…
              </option>
              {REASONS_LIST.map((r) => (
                <option key={r} value={r} style={{ background: "#1A1233", color: "#fff" }}>
                  {r}
                </option>
              ))}
            </select> */}
          </div>
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
            <Ico n="arrow-left" size={14} /> Back to Customer Info
          </button>

          <button
            onClick={onNext}
            disabled={!isValid}
            className="btn btn-primary btn-lg"
            style={{
              opacity: isValid ? 1 : 0.4,
              cursor: isValid ? "pointer" : "not-allowed",
            }}
          >
            Review Order Summary <Ico n="arrow-right" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
