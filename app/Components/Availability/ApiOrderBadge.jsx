"use client";

import React from "react";
import { Ico } from "../Icons";

export default function ApiOrderBadge({ step, icon, color, label, sub }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        borderRadius: 12,
        background: "var(--cw-bg-1)",
        border: "1px solid var(--cw-border-1)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: `${color}1A`,
          border: `1.5px solid ${color}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontFamily: "var(--cw-font-display)",
          fontSize: 11,
          fontWeight: 700,
          color: color,
        }}
      >
        {step}
      </div>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${color}14`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Ico n={icon} size={18} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--cw-fg-1)" }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--cw-fg-3)" }}>{sub}</div>
      </div>
    </div>
  );
}
