"use client";

import React from "react";
import { Ico } from "../Icons";

export function ProgressDots({ step, total }) {
  return (
    <div className="progress-dots">
      {Array.from({ length: total }).map((_, i) => {
        const done = i + 1 < step;
        const active = i + 1 === step;
        return (
          <React.Fragment key={i}>
            <div className={`pdot${active ? " active" : done ? " done" : " todo"}`} />
            {i < total - 1 && (
              <div
                style={{
                  width: 12,
                  height: 1,
                  background: "var(--cw-border-2)",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
      <div
        style={{
          marginLeft: 12,
          fontFamily: "var(--cw-font-display)",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--cw-fg-3)",
          fontWeight: 700,
        }}
      >
        Step {step} / {total}
      </div>
    </div>
  );
}

export default function AvailTopBar({ onBack, backLabel = "Back", step, total }) {
  return (
    <div className="avail-topbar">
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "var(--cw-fg-3)",
          fontSize: 13,
          fontFamily: "var(--cw-font-sans)",
        }}
      >
        <Ico n="arrow-left" size={16} /> {backLabel}
      </button>
      {step ? <ProgressDots step={step} total={total || 4} /> : <div />}
      <div style={{ width: 80 }} />
    </div>
  );
}
