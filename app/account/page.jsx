"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Ico } from "../Components/Icons";

export default function Account() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loginErr, setLoginErr] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginErr("Please enter your email and password.");
      return;
    }
    if (!email.includes("@")) {
      setLoginErr("Please enter a valid email address.");
      return;
    }
    setLoginErr("");
    setLoggedIn(true);
  };

  const handleSignOut = () => {
    setLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  if (loggedIn) {
    return (
      <main>
        <div className="page-header">
          <div className="page-header-inner">
            <div className="breadcrumb">
              <Link href="/">culturewireless.com</Link>
              <span className="slash">/</span>
              <span>account</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <h1 className="page-h1" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
                MY ACCOUNT.
              </h1>
              <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
            <p className="page-lede" style={{ fontSize: 16 }}>
              Signed in as <strong>{email}</strong>
            </p>
          </div>
        </div>
        <section className="page-section">
          <div className="sec-inner">
            {/* Plan + Bill Row */}
            <div className="card-grid-2" style={{ marginBottom: 24 }}>
              <div
                className="card"
                style={{
                  background: "var(--cw-gradient-bg)",
                  border: "none",
                  color: "#fff",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    opacity: 0.7,
                  }}
                >
                  Current plan
                </div>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Connect 500
                </div>
                <div style={{ fontSize: 13, opacity: 0.75 }}>
                  500 Mbps symmetric · No contract
                </div>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 40,
                    fontWeight: 700,
                    lineHeight: 1,
                    marginTop: 8,
                    color: "#fff",
                  }}
                >
                  $69
                  <span
                    style={{
                      fontFamily: "var(--cw-font-sans)",
                      fontSize: 14,
                      fontWeight: 400,
                      opacity: 0.7,
                    }}
                  >
                    /mo
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <button className="btn btn-yellow btn-sm">Pay Now</button>
                  <button
                    className="btn btn-sm"
                    style={{
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "#fff",
                      background: "transparent",
                    }}
                  >
                    Set Autopay
                  </button>
                </div>
              </div>
              <div className="card" style={{ gap: 14 }}>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--cw-fg-3)",
                  }}
                >
                  Bill overview
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14, color: "var(--cw-fg-2)" }}>
                    Amount due
                  </span>
                  <span style={{ fontFamily: "var(--cw-font-display)", fontWeight: 700, fontSize: 20 }}>
                    $87.42
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14, color: "var(--cw-fg-2)" }}>
                    Due date
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Jun 18, 2026</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14, color: "var(--cw-fg-2)" }}>
                    Account
                  </span>
                  <span style={{ fontSize: 14, fontFamily: "var(--cw-font-mono)" }}>
                    CW-104722
                  </span>
                </div>
                <div style={{ paddingTop: 12, borderTop: "1px solid var(--cw-border-1)" }}>
                  <div style={{ fontSize: 12, color: "var(--cw-fg-3)", marginBottom: 8 }}>
                    Data this month
                  </div>
                  <div className="usage-bar-wrap">
                    <div className="usage-bar" style={{ width: "62%" }} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 6,
                      fontSize: 12,
                      color: "var(--cw-fg-3)",
                    }}
                  >
                    <span>248 GB used</span>
                    <span>Unlimited</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Usage Stats */}
            <div className="card-grid-4" style={{ marginBottom: 24 }}>
              {[
                { label: "Download", val: "248", unit: "GB" },
                { label: "Upload", val: "41", unit: "GB" },
                { label: "Avg Speed", val: "487", unit: "Mbps" },
                { label: "Devices", val: "24", unit: "active" },
              ].map((s) => (
                <div key={s.label} className="card" style={{ gap: 8 }}>
                  <div
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--cw-fg-3)",
                    }}
                  >
                    {s.label}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontFamily: "var(--cw-font-display)", fontSize: 28, fontWeight: 700 }}>
                      {s.val}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--cw-fg-3)" }}>
                      {s.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Quick Links */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                "Manage Devices",
                "Parental Controls",
                "Payment Methods",
                "Account Settings",
                "Move My Service",
              ].map((l) => (
                <button key={l} className="btn btn-ghost btn-sm">
                  {l}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link href="/">culturewireless.com</Link>
            <span className="slash">/</span>
            <span>account</span>
          </div>
          <h1 className="page-h1">
            MY
            <br />
            ACCOUNT.
          </h1>
          <p className="page-lede">
            Sign in to manage your service, pay your bill, or check your usage.
          </p>
        </div>
      </div>
      <section className="page-section">
        <div className="sec-inner">
          <div style={{ display: "flex", justifyContext: "center", justifyContent: "center" }}>
            <div className="card" style={{ maxWidth: 420, width: "100%", padding: 32, gap: 0 }}>
              <div className="section-eyebrow">Welcome back</div>
              <h2
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                  marginTop: 4,
                }}
              >
                Sign in to Culture.
              </h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email or Account #</label>
                  <input
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="form-input"
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      style={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--cw-fg-3)",
                      }}
                    >
                      <Ico n={showPw ? "eye-off" : "eye"} size={16} />
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, cursor: "pointer" }}>
                    <input type="checkbox" /> Keep me signed in
                  </label>
                  <a href="#" style={{ color: "var(--cw-purple)", fontSize: 13, fontWeight: 600 }}>
                    Forgot?
                  </a>
                </div>
                {loginErr && (
                  <div style={{ color: "#dd342a", fontSize: 13, marginBottom: 12 }}>
                    {loginErr}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginBottom: 16 }}
                >
                  Sign In
                </button>
              </form>
              <div
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  color: "var(--cw-fg-3)",
                  paddingTop: 16,
                  borderTop: "1px solid var(--cw-border-1)",
                }}
              >
                New to Culture?{" "}
                <a href="#" style={{ color: "var(--cw-purple)", fontWeight: 600 }}>
                  Create an account →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
