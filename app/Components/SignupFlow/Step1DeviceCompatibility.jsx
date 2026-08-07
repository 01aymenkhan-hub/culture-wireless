"use client";

import React, { useState, useEffect } from "react";
import { Ico } from "../Icons";

const esimCompatible = {
  Apple: ["iPhone XR", "iPhone XS", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16"],
  Samsung: ["Galaxy S21", "Galaxy S22", "Galaxy S23", "Galaxy S24", "Galaxy Z Fold 3", "Galaxy Z Flip 3"],
  Google: ["Pixel 3a", "Pixel 4", "Pixel 5", "Pixel 6", "Pixel 7", "Pixel 8"],
  Motorola: ["Moto G52", "Edge 30"],
  OnePlus: ["OnePlus 12"],
  Other: [],
};

const brandModels = {
  Apple: ["iPhone 8", "iPhone X", "iPhone XR", "iPhone XS", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16", "Other iPhone"],
  Samsung: ["Galaxy S10", "Galaxy S20", "Galaxy S21", "Galaxy S22", "Galaxy S23", "Galaxy S24", "Galaxy Z Fold 3", "Galaxy Z Flip 3", "Other Samsung"],
  Google: ["Pixel 3", "Pixel 3a", "Pixel 4", "Pixel 5", "Pixel 6", "Pixel 7", "Pixel 8", "Other Pixel"],
  Motorola: ["Moto G Power", "Moto G Stylus", "Moto G52", "Edge 30", "Other Motorola"],
  OnePlus: ["OnePlus 9", "OnePlus 10", "OnePlus 11", "OnePlus 12", "Other OnePlus"],
  Other: ["Other Device Model"],
};

export default function Step1DeviceCompatibility({ enrollmentData, updateEnrollmentData, onNext }) {
  const [brand, setBrand] = useState(enrollmentData.brand || "");
  const [model, setModel] = useState(enrollmentData.model || "");

  const modelsList = brand ? brandModels[brand] || [] : [];
  const isEsim = brand && model ? (esimCompatible[brand] || []).includes(model) : false;

  useEffect(() => {
    if (brand && model) {
      const compatible = (esimCompatible[brand] || []).includes(model);
      updateEnrollmentData("isEsim", compatible);
    }
  }, [brand, model]);

  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value;
    setBrand(selectedBrand);
    setModel("");
    updateEnrollmentData("brand", selectedBrand);
    updateEnrollmentData("model", "");
  };

  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);
    updateEnrollmentData("model", selectedModel);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (brand && model) {
      updateEnrollmentData("brand", brand);
      updateEnrollmentData("model", model);
      updateEnrollmentData("isEsim", isEsim);
      onNext();
    }
  };

  const canSubmit = !!(brand && model);

  return (
    <div style={{ background: "var(--cw-bg-2)", minHeight: "100%", padding: "40px 24px 60px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        
        {/* Title Header matching Check Availability */}
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
            Device <span className="cw-gradient-text">Compatibility</span>
          </h1>
          <p style={{ color: "var(--cw-fg-2)", fontSize: 15, lineHeight: 1.6 }}>
            Pick your phone type to activate your services immediately if your phone is eSIM compatible.
          </p>
        </div>

        {/* Card Container */}
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
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            
            {/* Dropdowns Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              
              {/* Brand Dropdown */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--cw-fg-2)",
                    marginBottom: 6,
                    fontWeight: 700,
                  }}
                >
                  Select a brand *
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={brand}
                    onChange={handleBrandChange}
                    style={{
                      width: "100%",
                      padding: "12px 36px 12px 16px",
                      borderRadius: 10,
                      background: "var(--cw-bg-3)",
                      border: "1px solid var(--cw-border-1)",
                      color: "var(--cw-fg-1)",
                      fontSize: 15,
                      outline: "none",
                      appearance: "none",
                      WebkitAppearance: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="" disabled style={{ background: "var(--cw-bg-1)", color: "var(--cw-fg-1)" }}>
                      -- Select a Brand --
                    </option>
                    {Object.keys(brandModels).map((b) => (
                      <option key={b} value={b} style={{ background: "var(--cw-bg-1)", color: "var(--cw-fg-1)" }}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "var(--cw-fg-3)",
                    }}
                  >
                    <Ico n="chevron-down" size={16} />
                  </div>
                </div>
              </div>

              {/* Model Dropdown */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--cw-fg-2)",
                    marginBottom: 6,
                    fontWeight: 700,
                  }}
                >
                  Select a model *
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={model}
                    onChange={handleModelChange}
                    disabled={!brand}
                    style={{
                      width: "100%",
                      padding: "12px 36px 12px 16px",
                      borderRadius: 10,
                      background: "var(--cw-bg-3)",
                      border: "1px solid var(--cw-border-1)",
                      color: "var(--cw-fg-1)",
                      fontSize: 15,
                      outline: "none",
                      appearance: "none",
                      WebkitAppearance: "none",
                      opacity: !brand ? 0.5 : 1,
                      cursor: !brand ? "not-allowed" : "pointer",
                    }}
                  >
                    <option value="" disabled style={{ background: "var(--cw-bg-1)", color: "var(--cw-fg-1)" }}>
                      {brand ? "-- Select a Model --" : "Select Brand First"}
                    </option>
                    {modelsList.map((m) => (
                      <option key={m} value={m} style={{ background: "var(--cw-bg-1)", color: "var(--cw-fg-1)" }}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "var(--cw-fg-3)",
                    }}
                  >
                    <Ico n="chevron-down" size={16} />
                  </div>
                </div>
              </div>

            </div>

            {/* Note */}
            <p style={{ fontSize: 13, color: "var(--cw-fg-3)", fontStyle: "italic", margin: 0 }}>
              * If your model is not under the dropdown then you have to select the physical SIM
            </p>

            {/* eSIM Compatibility Banner & SIM Cards */}
            {brand && model && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
                
                {/* Result Banner */}
                {isEsim ? (
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 12,
                      background: "rgba(74,222,128,0.12)",
                      border: "1px solid rgba(74,222,128,0.4)",
                      color: "#4ade80",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Ico n="check-circle" size={20} color="#4ade80" />
                    <div>
                      <strong style={{ display: "block", color: "#4ade80", fontWeight: 700 }}>
                        Congrats! Your {brand} {model} is eSIM Compatible.
                      </strong>
                      <span style={{ fontSize: 13, color: "var(--cw-fg-2)" }}>
                        You'll get your eSIM sent directly to your email for instant activation.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 12,
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.4)",
                      color: "#f59e0b",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Ico n="info" size={20} color="#f59e0b" />
                    <div>
                      <strong style={{ display: "block", color: "#f59e0b", fontWeight: 700 }}>
                        Physical SIM recommended for {brand} {model}.
                      </strong>
                      <span style={{ fontSize: 13, color: "var(--cw-fg-2)" }}>
                        This model requires a physical SIM card or check your device settings for eSIM support.
                      </span>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Submit Button */}
            <div style={{ marginTop: 24, textAlign: "right" }}>
              <button
                type="submit"
                disabled={!canSubmit}
                className="btn btn-primary btn-lg"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: canSubmit ? 1 : 0.4,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span>Submit & Continue</span>
                <Ico n="arrow-right" size={16} />
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
