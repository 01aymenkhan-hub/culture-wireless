"use client";

import React from "react";
import { Ico } from "../Icons";

const STEP_LABELS = [
  "Service Address",
  "Checking Coverage",
  "Select a Plan",
  "Customer Info",
  "Current Service",
  "Review Order",
];

export default function WizardHeader({ step, onBack, hideBack = false }) {
  const currentStep = Math.min(Math.max(step || 1, 1), 6);
  const percent = Math.round(((currentStep - 1) / 5) * 100);

  return (
    <div
      style={{
        background: "var(--cw-bg-2)",
        borderBottom: "1px solid var(--cw-border-1)",
        padding: "20px 24px",
        // position: "sticky",
        // top: 0,
        // zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Back Button */}
        <div>
          {!hideBack && onBack ? (
            <button
              onClick={onBack}
              className="btn btn-ghost btn-sm"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                fontSize: 13,
                color: "var(--cw-fg-2)",
              }}
            >
              <Ico n="arrow-left" size={14} /> Back
            </button>
          ) : (
            <div style={{ width: 70 }} />
          )}
        </div>

        {/* Step Indicator Text */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--cw-purple)",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Step {currentStep} of 6
          </div>
          <div
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--cw-fg-1)",
            }}
          >
            {STEP_LABELS[currentStep - 1]}
          </div>
        </div>

        {/* Progress Dots / Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[1, 2, 3, 4, 5, 6].map((s) => {
            const isActive = s === currentStep;
            const isCompleted = s < currentStep;
            return (
              <div
                key={s}
                title={`Step ${s}: ${STEP_LABELS[s - 1]}`}
                style={{
                  width: isActive ? 24 : 10,
                  height: 10,
                  borderRadius: 999,
                  background: isActive
                    ? "var(--cw-purple)"
                    : isCompleted
                    ? "rgba(139,105,193,0.4)"
                    : "var(--cw-border-1)",
                  transition: "all 300ms ease",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Thin line progress indicator at bottom */}
      {/* <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          // top: 0,
          height: 2,
          width: `${percent}%`,
          background: "var(--cw-gradient)",
          transition: "width 400ms ease",
        }}
      /> */}
    </div>
  );
}
