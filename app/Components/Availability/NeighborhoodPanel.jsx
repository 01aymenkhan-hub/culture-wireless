"use client";

import React from "react";
import { Ico, SignalWave } from "../Icons";

export default function NeighborhoodPanel({ zip }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = async () => {
    const url = `https://culturewireless.com/r/${zip || "30274"}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard access denied — silently ignore; the button remains actionable.
      }
    }
  };

  return (
    <div className="neighbor-panel">
      <SignalWave style={{ position: "absolute", right: -80, bottom: -40, opacity: 0.18 }} />
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--cw-yellow)",
            marginBottom: 12,
          }}
        >
          Bring fiber to your block
        </div>
        <h3
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            margin: "0 0 12px",
            lineHeight: 1.15,
          }}
        >
          Demand decides
          <br />
          where we go next.
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 14,
            margin: "0 0 24px",
            maxWidth: 320,
            lineHeight: 1.55,
          }}
        >
          The more neighbours that sign up, the faster we light up an area.
          Share the link — every signup counts.
        </p>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Your ZIP demand
            </span>
            <span
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--cw-yellow)",
              }}
            >
              62% of goal
            </span>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "62%",
                height: "100%",
                background: "linear-gradient(90deg,#4F7BFF,#8B69C1)",
                borderRadius: 999,
                boxShadow: "0 0 16px rgba(139,105,193,0.6)",
              }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
            186 neighbours interested · 300 needed to break ground
          </div>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 18px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            cursor: "pointer",
            fontFamily: "var(--cw-font-sans)",
            fontSize: 13,
            width: "100%",
            textAlign: "left",
          }}
          onClick={handleCopyLink}
        >
          <Ico n="link-2" size={15} color="var(--cw-blue)" />
          <span style={{ flex: 1, color: "rgba(255,255,255,0.85)", overflow: "hidden", textOverflow: "ellipsis" }}>
            culturewireless.com/r/{zip || "30274"}
          </span>
          <span
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--cw-blue)",
              fontWeight: 700,
            }}
          >
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>
    </div>
  );
}
