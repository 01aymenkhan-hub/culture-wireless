"use client";

import React from "react";
import { Ico } from "../Icons";

const DEFAULT_STEP_LABELS = [
  "Service Address",
  "Checking Coverage",
  "Select a Plan",
  "Customer Info",
  "Current Service",
  "Review Order",
];

export default function WizardHeader({
  step,
  onBack,
  hideBack = false,
  totalSteps = 6,
  stepLabels = DEFAULT_STEP_LABELS,
}) {
  const currentStep = Math.min(Math.max(step || 1, 1), totalSteps);
  const activeLabels = stepLabels && stepLabels.length > 0 ? stepLabels : DEFAULT_STEP_LABELS;
  const stepNumbers = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div
      style={{
        background: "var(--cw-bg-2)",
        borderBottom: "1px solid var(--cw-border-1)",
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Top Row: Back button & Step text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
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
                  fontSize: 12,
                  color: "var(--cw-fg-2)",
                }}
              >
                <Ico n="arrow-left" size={14} /> Back
              </button>
            ) : (
              <div style={{ width: 60 }} />
            )}
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--cw-purple)",
                fontWeight: 700,
                marginBottom: 2,
              }}
            >
              Step {currentStep} of {totalSteps}
            </div>
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--cw-fg-1)",
              }}
            >
              {activeLabels[currentStep - 1] || `Step ${currentStep}`}
            </div>
          </div>

          <div style={{ width: 60 }} />
        </div>

        {/* Bottom Row: 6-step progress pills */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%" }}>
          {stepNumbers.map((s) => {
            const isActive = s === currentStep;
            const isCompleted = s < currentStep;
            return (
              <div
                key={s}
                title={`Step ${s}: ${activeLabels[s - 1] || s}`}
                style={{
                  flex: 1,
                  maxWidth: isActive ? 48 : 20,
                  height: 6,
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
    </div>
  );
}
