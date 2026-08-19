"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Ico, SignalWave } from "../../Components/Icons";
import QRCode from "qrcode";

function ActivationContent() {
  const searchParams = useSearchParams();
  const hostedpageId = searchParams.get("hostedpage_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activationData, setActivationData] = useState(null);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  // Clear Telgoo wizard state from localStorage on mount
  useEffect(() => {
    try {
      localStorage.removeItem("cw-telgoo-wizard-v1");
    } catch (e) {
      // ignore
    }
  }, []);

  const runActivationPipeline = async () => {
    if (!hostedpageId) {
      setError("Missing payment order reference (hostedpage_id). Please complete checkout first.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/telgoo/activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostedpage_id: hostedpageId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok || !data.activationData) {
        throw new Error(
          data.error ||
            "We couldn't complete your activation at the moment. Please try again or contact support if the issue continues."
        );
      }

      const actData = data.activationData;
      setActivationData(actData);

      // Generate QR Code Data URI on frontend if activation code is present
      const qrString = actData.qrActivationCode || actData.activationCode || actData.qrCode || "";
      if (qrString) {
        try {
          const url = await QRCode.toDataURL(qrString, { margin: 2, width: 280 });
          setGeneratedQrDataUrl(url);
        } catch (qrErr) {
          console.error("Client QR Generation Error:", qrErr);
        }
      }
    } catch (err) {
      setError(
        err.message ||
          "We couldn't complete your activation at the moment. Please try again or contact support if the issue continues."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runActivationPipeline();
  }, [hostedpageId]);

  const handleCopyCode = (codeText) => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    });
  };

  return (
    <div
      className="activation-page-wrapper"
      style={{
        minHeight: "100vh",
        background: "var(--cw-bg-2)",
        color: "var(--cw-fg-1)",
        padding: "60px 24px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SignalWave
        style={{
          position: "absolute",
          right: -100,
          top: -40,
          opacity: 0.12,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 720, width: "100%", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              background: "var(--cw-bg-1)",
              border: "1.5px solid var(--cw-border-1)",
              borderRadius: 24,
              padding: "60px 32px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: "3px solid var(--cw-border-1)",
                borderTopColor: "var(--cw-purple)",
                borderRightColor: "var(--cw-blue)",
                animation: "cwSpin 0.9s linear infinite",
                marginBottom: 24,
              }}
            />
            <h2
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--cw-fg-1)",
                margin: "0 0 10px",
              }}
            >
              ACTIVATING YOUR <span className="cw-gradient-text">eSIM SERVICE</span>
            </h2>
            <p style={{ color: "var(--cw-fg-2)", fontSize: 15, maxWidth: 460, margin: 0, lineHeight: 1.6 }}>
              Payment confirmed! Please wait while we verify your order and provision your 5G mobile line...
            </p>
          </div>
        )}

        {/* Error State (NO dummy/mock data rendered) */}
        {!loading && error && (
          <div
            style={{
              background: "var(--cw-bg-1)",
              border: "1.5px solid rgba(239,68,68,0.4)",
              borderRadius: 24,
              padding: "44px 32px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(239,68,68,0.15)",
                border: "2px solid #f87171",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Ico n="alert-triangle" size={32} color="#f87171" />
            </div>

            <h2
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 24,
                fontWeight: 800,
                textTransform: "uppercase",
                color: "var(--cw-fg-1)",
                margin: "0 0 10px",
              }}
            >
              ACTIVATION UNSUCCESSFUL
            </h2>

            <p style={{ color: "#f87171", fontSize: 15, maxWidth: 520, margin: "0 0 24px", lineHeight: 1.6 }}>
              {error}
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={runActivationPipeline} className="btn btn-primary btn-lg">
                Retry Activation
              </button>

              <button onClick={() => (window.location.href = "/mobile")} className="btn btn-ghost">
                Return to Mobile Overview
              </button>
            </div>
          </div>
        )}

        {/* Real Production Activation UI */}
        {!loading && !error && activationData && (
          <div>
            {/* Header Card */}
            <div
              style={{
                background: "var(--cw-bg-1)",
                border: "1.5px solid rgba(74,222,128,0.4)",
                borderRadius: 24,
                padding: "44px 32px",
                textAlign: "center",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 32px rgba(74,222,128,0.15)",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(74,222,128,0.15)",
                  border: "2.5px solid #4ade80",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: "0 0 24px rgba(74,222,128,0.3)",
                }}
              >
                <Ico n="check" size={36} color="#4ade80" sw={3} />
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 14px",
                  borderRadius: 999,
                  background: "rgba(74,222,128,0.12)",
                  border: "1px solid rgba(74,222,128,0.35)",
                  color: "#4ade80",
                  fontSize: 12,
                  fontFamily: "var(--cw-font-display)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: 14,
                }}
              >
                Payment & Activation Successful
              </div>

              <h1
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: "clamp(26px, 4.5vw, 40px)",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  color: "var(--cw-fg-1)",
                  margin: "0 0 12px",
                }}
              >
                YOUR eSIM IS <span className="cw-gradient-text">READY</span>
              </h1>

              <p style={{ color: "var(--cw-fg-2)", fontSize: 16, maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>
                Welcome to Culture Wireless, <strong>{activationData.customerName || "Valued Customer"}</strong>! Scan the QR code below or enter the manual activation code to connect.
              </p>
            </div>

            {/* eSIM Activation Card Container */}
            <div
              style={{
                background: "var(--cw-bg-1)",
                border: "1.5px solid var(--cw-border-1)",
                borderRadius: 24,
                padding: 32,
                marginBottom: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Activated Phone Number (if present) */}
              {activationData.msisdn && (
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 11,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--cw-purple)",
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    Activated 5G Phone Number
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 32,
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      color: "var(--cw-fg-1)",
                    }}
                  >
                    {activationData.msisdn}
                  </div>
                </div>
              )}

              {/* Option 1: Generated QR Code Image */}
              {(generatedQrDataUrl || activationData.qrDataUrl) && (
                <div style={{ marginBottom: 28, width: "100%", maxWidth: 320 }}>
                  <div
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--cw-fg-2)",
                      marginBottom: 10,
                      fontWeight: 700,
                    }}
                  >
                    Option 1: Scan QR Code with Device Camera
                  </div>
                  <div
                    style={{
                      padding: 20,
                      background: "#fff",
                      borderRadius: 20,
                      boxShadow: "0 12px 36px rgba(0,0,0,0.4)",
                      display: "inline-block",
                    }}
                  >
                    <img
                      src={generatedQrDataUrl || activationData.qrDataUrl}
                      alt="eSIM Activation QR Code"
                      style={{ width: 220, height: 220, display: "block" }}
                    />
                  </div>
                </div>
              )}

              {/* Option 2: Manual Activation Code */}
              {(activationData.activationCode || activationData.qrActivationCode) && (
                <div style={{ width: "100%", maxWidth: 540, marginBottom: 24, textAlign: "left" }}>
                  <div
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--cw-purple)",
                      fontWeight: 700,
                      marginBottom: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Option 2: Manual Activation Code</span>
                    <button
                      onClick={() =>
                        handleCopyCode(
                          activationData.activationCode || activationData.qrActivationCode
                        )
                      }
                      className="btn btn-ghost btn-sm"
                      style={{
                        color: copiedCode ? "#4ade80" : "var(--cw-purple)",
                        fontSize: 12,
                        padding: "2px 8px",
                      }}
                    >
                      {copiedCode ? "Copied!" : "Copy Code"}
                    </button>
                  </div>

                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: "var(--cw-blue)",
                      background: "var(--cw-bg-3)",
                      border: "1px dashed var(--cw-border-1)",
                      borderRadius: 12,
                      padding: "14px 16px",
                      wordBreak: "break-all",
                      userSelect: "all",
                    }}
                  >
                    {activationData.activationCode || activationData.qrActivationCode}
                  </div>
                </div>
              )}

              {/* Technical Details: ICCID, PIN, Enrollment ID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: 12,
                  width: "100%",
                  maxWidth: 540,
                  marginTop: 8,
                  paddingTop: 20,
                  borderTop: "1px solid var(--cw-border-1)",
                }}
              >
                {activationData.iccid && (
                  <div style={{ background: "var(--cw-bg-3)", padding: 12, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--cw-fg-3)", textTransform: "uppercase" }}>
                      ICCID
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--cw-fg-1)", marginTop: 4 }}>
                      {activationData.iccid}
                    </div>
                  </div>
                )}

                {activationData.pin && (
                  <div style={{ background: "var(--cw-bg-3)", padding: 12, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--cw-fg-3)", textTransform: "uppercase" }}>
                      Account PIN
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--cw-purple)", marginTop: 4 }}>
                      {activationData.pin}
                    </div>
                  </div>
                )}

                {activationData.enrollmentId && (
                  <div style={{ background: "var(--cw-bg-3)", padding: 12, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--cw-fg-3)", textTransform: "uppercase" }}>
                      Enrollment ID
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--cw-fg-1)", marginTop: 4 }}>
                      {activationData.enrollmentId}
                    </div>
                  </div>
                )}
              </div>
            </div>

         
            {/* Order Summary */}
            <div
              style={{
                background: "var(--cw-bg-1)",
                border: "1.5px solid var(--cw-border-1)",
                borderRadius: 20,
                padding: 24,
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 13,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--cw-purple)",
                  fontWeight: 700,
                  marginBottom: 14,
                }}
              >
                Subscription Summary
              </div>

              <div className="grid-2-to-1" style={{ gap: 12, fontSize: 14 }}>
                <div>
                  <span style={{ color: "var(--cw-fg-3)" }}>Plan: </span>
                  <strong style={{ color: "var(--cw-fg-1)" }}>{activationData.planName}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--cw-fg-3)" }}>Monthly Price: </span>
                  <strong style={{ color: "var(--cw-fg-1)" }}>${activationData.amount}/mo</strong>
                </div>
                <div>
                  <span style={{ color: "var(--cw-fg-3)" }}>Email: </span>
                  <strong style={{ color: "var(--cw-fg-1)", wordBreak: "break-all" }}>{activationData.customerEmail}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--cw-fg-3)" }}>Status: </span>
                  <strong style={{ color: "#4ade80" }}>Active</strong>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div style={{ textAlign: "center" }}>
              <button onClick={() => (window.location.href = "/mobile")} className="btn btn-primary btn-lg">
                Return to Mobile Overview
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function MobileActivationPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "var(--cw-bg-2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--cw-fg-1)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "3px solid var(--cw-border-1)",
              borderTopColor: "var(--cw-purple)",
              animation: "cwSpin 0.8s linear infinite",
              marginBottom: 16,
            }}
          />
          <div style={{ fontFamily: "var(--cw-font-display)", fontSize: 12, letterSpacing: "0.18em" }}>
            Loading Activation Page…
          </div>
        </div>
      }
    >
      <ActivationContent />
    </Suspense>
  );
}
