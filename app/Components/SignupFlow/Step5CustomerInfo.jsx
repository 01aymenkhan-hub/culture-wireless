"use client";

import React, { useState } from "react";
import { Ico } from "../Icons";

export default function Step5CustomerInfo({
  customerInfo,
  onChange,
  onNext,
  onBack,
}) {
  const [touched, setTouched] = useState({});

  const firstName = customerInfo?.firstName || "";
  const lastName = customerInfo?.lastName || "";
  const email = customerInfo?.email || "";
  const phone = customerInfo?.phone || "";

  const isFirstNameValid = firstName.trim().length >= 2;
  const isLastNameValid = lastName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhoneValid = phone.replace(/\D/g, "").length >= 10;

  const isValid = isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChangeField = (field, val) => {
    onChange({
      ...customerInfo,
      [field]: val,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    }
  };

  return (
    <div style={{ background: "var(--cw-bg-2)", minHeight: "100%", padding: "40px 24px 60px" }}>
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
            CUSTOMER <span className="cw-gradient-text">INFORMATION</span>
          </h1>
          <p style={{ color: "var(--cw-fg-2)", fontSize: 15, lineHeight: 1.6 }}>
            Where should we send your receipt, eSIM QR code, and order updates?
          </p>
        </div>

        {/* Form Container Card */}
        <div
          style={{
            background: "var(--cw-bg-1)",
            border: "1.5px solid var(--cw-border-1)",
            borderRadius: 20,
            padding: 32,
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            
            {/* First & Last Name Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* First Name */}
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
                  First Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. John"
                  value={firstName}
                  onChange={(e) => handleChangeField("firstName", e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "var(--cw-bg-3)",
                    border: touched.firstName && !isFirstNameValid
                      ? "1px solid #f87171"
                      : "1px solid var(--cw-border-1)",
                    color: "var(--cw-fg-1)",
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </div>

              {/* Last Name */}
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
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Doe"
                  value={lastName}
                  onChange={(e) => handleChangeField("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "var(--cw-bg-3)",
                    border: touched.lastName && !isLastNameValid
                      ? "1px solid #f87171"
                      : "1px solid var(--cw-border-1)",
                    color: "var(--cw-fg-1)",
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Email Address */}
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
                Email Address *
              </label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "var(--cw-bg-3)",
                  border: touched.email && !isEmailValid
                    ? "1px solid #f87171"
                    : "1px solid var(--cw-border-1)",
                  color: "var(--cw-fg-1)",
                  fontSize: 15,
                  outline: "none",
                }}
              />
              {touched.email && !isEmailValid && (
                <span style={{ color: "#f87171", fontSize: 12, marginTop: 4, display: "block" }}>
                  Please enter a valid email address.
                </span>
              )}
            </div>

            {/* Phone Number */}
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
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="(555) 000-0000"
                value={phone}
                onChange={(e) => handleChangeField("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "var(--cw-bg-3)",
                  border: touched.phone && !isPhoneValid
                    ? "1px solid #f87171"
                    : "1px solid var(--cw-border-1)",
                  color: "var(--cw-fg-1)",
                  fontSize: 15,
                  outline: "none",
                }}
              />
              {touched.phone && !isPhoneValid && (
                <span style={{ color: "#f87171", fontSize: 12, marginTop: 4, display: "block" }}>
                  Please enter a valid 10-digit phone number.
                </span>
              )}
            </div>

          </form>
        </div>

        {/* Footer Action Bar */}
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
            <Ico n="arrow-left" size={14} /> Back to SIM Type
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="btn btn-primary btn-lg"
            style={{
              opacity: isValid ? 1 : 0.4,
              cursor: isValid ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>Continue to Review Order</span>
            <Ico n="arrow-right" size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
