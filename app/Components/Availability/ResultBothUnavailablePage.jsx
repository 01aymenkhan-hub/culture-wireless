"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AvailTopBar from "./AvailTopBar";
import { Ico } from "../Icons";
import NeighborhoodPanel from "./NeighborhoodPanel";

export default function ResultBothUnavailablePage({ address, zip: zipProp, onBack }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const zipMatch = (address || "").match(/\b\d{5}\b/);
  const zip = zipProp || (zipMatch ? zipMatch[0] : "");

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubmitError("");
    try {
      // Fire-and-forget: hit the (currently scaffolded) Zoho lead endpoint.
      // If Zoho isn't configured yet, the server returns 501 which we treat as success
      // for the user's optimistic-UI purposes.
      await fetch("/api/zoho/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          address,
          zip,
          source: "waitlist_form",
        }),
      }).catch(() => null);
      setNotified(true);
    } catch {
      setSubmitError("Something went wrong. Please try again in a moment.");
    }
  };

  return (
    <div className="avail-page">
      <div
        style={{
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1280px",
          marginInline: "auto",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
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
          <Ico n="arrow-left" size={16} /> Check Another Address
        </button>
        {/* <AvailTopBar step={3} total={3} onBack={onBack} backLabel="Check Another Address" /> */}
        <div style={{ width: 60 }} />
      </div>

      <div className="unavail-section">
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(237,52,42,0.12)",
                border: "1px solid var(--cw-error)",
                color: "var(--cw-error)",
                fontFamily: "var(--cw-font-display)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "6px 14px",
                borderRadius: 999,
              }}
            >
              <Ico n="x" size={12} color="var(--cw-error)" sw={3} /> Fiber · Off-net
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,185,0,0.12)",
                border: "1px solid var(--cw-yellow)",
                color: "var(--cw-yellow)",
                fontFamily: "var(--cw-font-display)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "6px 14px",
                borderRadius: 999,
              }}
            >
              <Ico n="clock" size={12} color="var(--cw-yellow)" /> Wireless Internet · Coming Soon
            </div>
          </div>
          <h1
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: "clamp(28px,4vw,48px)",
              fontWeight: 800,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              color: "var(--cw-fg-1)",
              lineHeight: 1.05,
              margin: "0 0 16px",
            }}
          >
            Fiber Internet is not available
            <br />
            <span
              style={{
                background: "linear-gradient(90deg,#4F7BFF,#8B69C1)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              at your location yet.
            </span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "var(--cw-fg-2)",
              lineHeight: 1.55,
              margin: "0 0 14px",
              maxWidth: 480,
            }}
          >
            Fiber Internet has not reached your block yet, and Wireless Internet is coming soon. Drop your email and we'll let you know the second service lights up at:
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 28 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "var(--cw-bg-1)",
                border: "1px solid var(--cw-border-1)",
                padding: "10px 16px",
                borderRadius: 12,
                fontSize: 15,
                color: "var(--cw-fg-1)",
              }}
            >
              <Ico n="map-pin" size={15} color="var(--cw-purple)" />
              <strong style={{ fontWeight: 600 }}>{address}</strong>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="btn btn-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 12,
                border: "1px solid var(--cw-border-2)",
                color: "var(--cw-fg-1)",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              <Ico n="refresh-cw" size={14} /> Check Another Address
            </button>
          </div>
          {!notified ? (
            <form onSubmit={handleNotifySubmit} style={{ display: "flex", gap: 10, maxWidth: 480 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <Ico n="mail" size={17} color="var(--cw-fg-3)" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusEmail(true)}
                  onBlur={() => setFocusEmail(false)}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    padding: "14px 16px 14px 44px",
                    borderRadius: 12,
                    border: `1.5px solid ${
                      focusEmail ? "var(--cw-purple)" : "var(--cw-border-2)"
                    }`,
                    fontFamily: "var(--cw-font-sans)",
                    fontSize: 15,
                    color: "var(--cw-fg-1)",
                    background: "var(--cw-bg-1)",
                    outline: "none",
                    boxShadow: focusEmail
                      ? "0 0 0 4px rgba(139,105,193,0.15)"
                      : "none",
                  }}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Notify me <Ico n="bell" size={13} />
              </button>
            </form>
          ) : null}
          {submitError && (
            <div
              role="alert"
              style={{
                marginTop: 10,
                color: "var(--cw-error)",
                fontSize: 13,
              }}
            >
              {submitError}
            </div>
          )}
          {notified ? (
            <div
              style={{
                padding: "18px 22px",
                borderRadius: 16,
                maxWidth: 480,
                background:
                  "linear-gradient(135deg,rgba(139,105,193,0.10),rgba(119,163,255,0.10))",
                border: "1.5px solid var(--cw-purple)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: "linear-gradient(90deg,#4F7BFF,#8B69C1)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ico n="check" size={20} color="#fff" sw={3} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--cw-fg-1)",
                    marginBottom: 2,
                  }}
                >
                  You're on the list
                </div>
                <div style={{ fontSize: 13, color: "var(--cw-fg-3)" }}>
                  We'll email <strong style={{ color: "var(--cw-fg-1)" }}>{email}</strong>{" "}
                  the moment your area goes live.
                </div>
              </div>
            </div>
          ) : null}
          <div style={{ marginTop: 36, paddingTop: 28, borderTop: "1px solid var(--cw-border-1)", maxWidth: 480 }}>
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--cw-fg-3)",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Coming Soon
            </div>
            {[
              {
                icon: "wifi",
                label: "Wireless Internet — Coming Soon",
                sub: "High-speed wireless home internet is expanding to new neighborhoods soon.",
                action: () => {},
              },
              {
                icon: "smartphone",
                label: "5G Mobile — Coming Soon",
                sub: "Nationwide 5G mobile coverage and BYOD plans are coming soon.",
                action: () => router.push("/mobile"),
              },
            ].map((c) => (
              <div
                key={c.label}
                onClick={c.action}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "var(--cw-bg-1)",
                  border: "1px solid var(--cw-border-1)",
                  textAlign: "left",
                  fontFamily: "var(--cw-font-sans)",
                  width: "100%",
                  marginBottom: 10,
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "var(--cw-bg-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Ico n={c.icon} size={19} color="var(--cw-purple)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--cw-fg-1)" }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--cw-fg-3)" }}>
                    {c.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <NeighborhoodPanel zip={zip} />
      </div>
    </div>
  );
}
