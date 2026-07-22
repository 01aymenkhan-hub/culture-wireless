"use client";

import React, { useState } from "react";
import { Ico } from "../Icons";

export default function Step4CustomerInfo({
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

  const handleChange = (field, val) => {
    onChange({ ...customerInfo, [field]: val });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
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
            Customer <span className="cw-gradient-text">Information</span>
          </h1>
          <p style={{ color: "var(--cw-fg-2)", fontSize: 15 }}>
            Please provide your contact details to set up your account and schedule installation.
          </p>
        </div>

        {/* Form Container */}
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
          {/* First & Last Name */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
                value={firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                placeholder="John"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: touched.firstName && !isFirstNameValid ? "1px solid #f87171" : "1px solid var(--cw-border-1)",
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                }}
              />
            </div>

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
                value={lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                placeholder="Doe"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: touched.lastName && !isLastNameValid ? "1px solid #f87171" : "1px solid var(--cw-border-1)",
                  color: "#fff",
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
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="john.doe@example.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                border: touched.email && !isEmailValid ? "1px solid #f87171" : "1px solid var(--cw-border-1)",
                color: "#fff",
                fontSize: 15,
                outline: "none",
              }}
            />
            {touched.email && !isEmailValid && (
              <span style={{ fontSize: 12, color: "#f87171", marginTop: 4, display: "block" }}>
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
              value={phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              placeholder="(555) 000-0000"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                border: touched.phone && !isPhoneValid ? "1px solid #f87171" : "1px solid var(--cw-border-1)",
                color: "#fff",
                fontSize: 15,
                outline: "none",
              }}
            />
            {touched.phone && !isPhoneValid && (
              <span style={{ fontSize: 12, color: "#f87171", marginTop: 4, display: "block" }}>
                Please enter a valid 10-digit phone number.
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
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
            <Ico n="arrow-left" size={14} /> Back to Plan Selection
          </button>

          <button
            onClick={onNext}
            disabled={!isValid}
            className="btn btn-primary btn-lg"
            style={{
              opacity: isValid ? 1 : 0.4,
              cursor: isValid ? "pointer" : "not-allowed",
            }}
          >
            Continue to Service Details <Ico n="arrow-right" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
