"use client";

import React from "react";
import { Ico } from "../Icons";

/**
 * Unified Plan Card Component shared across Check Availability and Telgoo Wizard.
 */
export default function UnifiedPlanCard({
  plan,
  selected,
  onSelect,
  badgeColor = "var(--cw-purple)",
}) {
  const isSel = selected;
  return (
    <button
      onClick={() => onSelect(plan)}
      type="button"
      className={`plan-card-flow${isSel ? " selected" : ""}`}
      style={{
        border: isSel
          ? `2px solid ${badgeColor}`
          : "1.5px solid var(--cw-border-1)",
        position: "relative",
        fontFamily: "var(--cw-font-sans)",
        transform: isSel ? "translateY(-4px)" : "translateY(0)",
        textAlign: "left",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        background: isSel ? "var(--cw-bg-3)" : "var(--cw-bg-1)",
        borderRadius: 16,
        padding: 24,
        transition: "all 250ms ease",
        boxSizing: "border-box",
      }}
    >
      {/* Top Tag or Popular Badge */}
      <div>
        {(plan.popular || plan.featured) && (
          <div
            style={{
              position: "absolute",
              top: -12,
              left: 24,
              background: "var(--cw-gradient)",
              color: "#fff",
              fontFamily: "var(--cw-font-display)",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 999,
              boxShadow: "0 8px 16px rgba(139,105,193,0.4)",
            }}
          >
            Most Popular
          </div>
        )}
        {/* <div
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: badgeColor,
            marginBottom: 6,
          }}
        >
          {plan.tag || plan.categoryLabel || plan.plan_code || "5G Mobile"}
        </div> */}
        <div
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--cw-fg-1)",
            marginBottom: 14,
          }}
        >
          {plan.displayName || plan.name || plan.plan_name}
        </div>

        {/* Speed / Data Big Metric */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 18,
          }}
        >
          <span
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 54,
              fontWeight: 800,
              letterSpacing: "0.01em",
              lineHeight: 1,
              color: "var(--cw-fg-1)",
            }}
          >
            {plan.speed || plan.dataAmount || (plan.data_allowance ? plan.data_allowance.split(" ")[0] : "5GB")}
          </span>
          <span
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 16,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: badgeColor,
            }}
          >
            {plan.unit || plan.dataUnit || (plan.data_allowance ? plan.data_allowance.split(" ").slice(1).join(" ") : "5G Data")}
          </span>
        </div>

        {/* Price Section */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            marginBottom: 18,
            paddingBottom: 18,
            borderBottom: "1px solid var(--cw-border-1)",
          }}
        >
          <span style={{ fontSize: 13, color: "var(--cw-fg-3)" }}>
            Starting at
          </span>
          <span
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--cw-fg-1)",
            }}
          >
            ${plan.price !== undefined ? plan.price : plan.amount}
          </span>
          <span style={{ fontSize: 13, color: "var(--cw-fg-3)" }}>/mo</span>
        </div>

        {/* Features List */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {(plan.features || []).map((f, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "var(--cw-fg-2)",
              }}
            >
              <Ico n="check" size={12} color={badgeColor} sw={3} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Select Indicator Radio */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid var(--cw-border-1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: isSel ? badgeColor : "var(--cw-fg-3)",
          }}
        >
          {isSel ? "Selected Plan" : "Select Plan"}
        </span>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: isSel
              ? `6px solid ${badgeColor}`
              : "2px solid var(--cw-border-2)",
            background: isSel ? "#fff" : "transparent",
            transition: "all 200ms ease",
          }}
        />
      </div>
    </button>
  );
}
