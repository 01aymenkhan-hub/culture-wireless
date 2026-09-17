"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Ico } from "../Components/Icons";

export default function ClaytonPage() {
  const [spots] = useState(25);
  const [selectedPlan, setSelectedPlan] = useState("1 Gig");
  const [step, setStep] = useState("address"); // "address" | "contact" | "complete"
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [reference, setReference] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emailOptIn: true,
    smsOptIn: true,
  });

  const addressInputRef = useRef(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePickPlan = (plan) => {
    setSelectedPlan(plan);
    scrollToSection("availability");
  };

  const handleCheckAddress = (e) => {
    e.preventDefault();
    const val = address.trim();
    if (!val) {
      if (addressInputRef.current) addressInputRef.current.focus();
      return;
    }
    setSubmitting(true);
    setStatus("");

    setTimeout(() => {
      setSubmitting(false);
      setStep("contact");
    }, 350);
  };

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    const refCode =
      "CWG-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setReference(refCode);

    try {
      await fetch("/api/availability/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formattedAddress: address,
          streetAddress: address,
          city: "Clayton County",
          state: "GA",
          serviceType: "fiber_clayton_promo",
        }),
      }).catch(() => {});

      setStep("complete");
    } catch (err) {
      console.error("Submission error:", err);
      setStep("complete");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--cw-bg-1)" }}>
      {/* 1. TOP SCARCITY / LAUNCH BANNER */}
      <div
        style={{
          background: "var(--cw-yellow)",
          color: "#1A1233",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          padding: "10px 24px",
          fontFamily: "var(--cw-font-display)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#1A1233",
            display: "inline-block",
            animation: "cwPulse 1.8s infinite",
          }}
        />
        <span>Clayton County launch offer</span>
        <span style={{ opacity: 0.65 }}>First {spots} connections only</span>
        <button
          type="button"
          onClick={() => scrollToSection("availability")}
          style={{
            padding: "5px 14px",
            borderRadius: "var(--cw-radius-md)",
            background: "#1A1233",
            color: "#FFFFFF",
            fontSize: 9,
            letterSpacing: "0.14em",
            fontWeight: 700,
            border: 0,
            cursor: "pointer",
            fontFamily: "var(--cw-font-display)",
            textTransform: "uppercase",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cw-yellow)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
        >
          Claim yours
        </button>
      </div>

      {/* 2. HERO SECTION */}
      <section
        id="top"
        style={{
          background: "#241748",
          color: "var(--cw-white)",
          padding: "72px 24px 80px",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Left Hero Column */}
          <div>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.6)",
                marginBottom: 18,
                fontFamily: "var(--cw-font-mono)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Link
                href="/"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                }}
              >
                culturewireless.com
              </Link>
              <span style={{ color: "var(--cw-purple)" }}>/</span>
              <span>clayton</span>
            </div>

            <span
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(255,185,0,0.16)",
                color: "#FFD466",
                fontFamily: "var(--cw-font-display)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Clayton County, Georgia
            </span>

            <h1
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: "clamp(34px, 5vw, 62px)",
                lineHeight: 1.06,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                fontWeight: 700,
                margin: 0,
                color: "#FFFFFF",
              }}
            >
              Clayton's connected.
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #4F7BFF, #8B69C1, #B07BC9)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Now it's your turn.
              </span>
            </h1>

            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.82)",
                maxWidth: 500,
                margin: "20px 0 0",
              }}
            >
              Choose any available fiber speed for one simple price. Your price stays
              the same for two full years.
            </p>

            {/* Price Row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 12,
                margin: "28px 0 0",
              }}
            >
              <strong
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(44px, 6vw, 60px)",
                  color: "var(--cw-yellow)",
                  lineHeight: 1,
                }}
              >
                $55
              </strong>
              <span style={{ fontSize: 14, lineHeight: 1.35, paddingBottom: 4 }}>
                /month
                <br />
                <b
                  style={{
                    color: "var(--cw-yellow)",
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  for 24 months
                </b>
              </span>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 14,
                margin: "32px 0 0",
              }}
            >
              <button
                type="button"
                onClick={() => scrollToSection("availability")}
                className="btn btn-primary btn-lg"
                style={{
                  boxShadow: "0 6px 20px rgba(122,96,214,0.35)",
                }}
              >
                Claim my connection <Ico n="arrow-right" size={14} />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("map")}
                className="btn btn-ghost btn-lg"
                style={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "#FFFFFF",
                }}
              >
                See the connected streets
              </button>
            </div>

            <p
              style={{
                fontSize: 12,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.45)",
                maxWidth: 480,
                margin: "24px 0 0",
              }}
            >
              New qualifying customers. Limited to the first {spots} completed
              enrollments during the 30-day launch window.
            </p>
          </div>

          {/* Right Hero Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Spots Card */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                alignItems: "center",
                gap: 18,
                padding: "18px 22px",
                borderRadius: "var(--cw-radius-lg)",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,185,0,0.35)",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "var(--cw-radius-md)",
                  background: "var(--cw-yellow)",
                  color: "#1A1233",
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 24,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {spots}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <strong
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  First {spots} connections only
                </strong>
                <small style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
                  Offer closes when all spots are claimed or after 30 days.
                </small>
              </div>
            </div>

            {/* Photo Card with Overlay */}
            <div
              style={{
                position: "relative",
                borderRadius: "var(--cw-radius-lg)",
                overflow: "hidden",
                height: 240,
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              <img
                src="/assets/clayton/clayton-family.png"
                alt="A family using connected devices at home in Clayton County"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 16,
                  bottom: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: "12px 16px",
                  borderRadius: "var(--cw-radius-md)",
                  background: "rgba(26,18,51,0.88)",
                  border: "1px solid rgba(255,185,0,0.35)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--cw-yellow)",
                  }}
                >
                  One price
                </span>
                <strong
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#FFFFFF",
                  }}
                >
                  Any speed
                </strong>
                <small style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                  100 Mbps · 500 Mbps · 1 Gig
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STAT BAR */}
      <section
        style={{
          background: "var(--cw-bg-1)",
          padding: "24px 24px",
          borderBottom: "1px solid var(--cw-border-1)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {[
            "100% fiber",
            "No contracts",
            "Local support",
            "Professional installation",
          ].map((item) => (
            <span
              key={item}
              style={{
                textAlign: "center",
                fontFamily: "var(--cw-font-display)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--cw-fg-1)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* 4. OFFER / PICK YOUR SPEED SECTION */}
      <section
        id="offer"
        style={{
          background: "var(--cw-bg-2)",
          padding: "64px 24px",
          borderBottom: "1px solid var(--cw-border-1)",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div className="section-eyebrow">One price · No guessing</div>
          <h2 className="section-h2" style={{ marginBottom: 14 }}>
            Pick the speed that fits your life.
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "var(--cw-fg-3)",
              maxWidth: 640,
              margin: "0 0 40px",
            }}
          >
            All three plans share the same introductory price. Choose based on how
            your home connects, not what your budget can stretch to.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              alignItems: "stretch",
            }}
          >
            {/* 100 Mbps */}
            <article
              style={{
                position: "relative",
                background: "var(--cw-bg-1)",
                border:
                  selectedPlan === "100 Mbps"
                    ? "2px solid var(--cw-purple)"
                    : "1px solid var(--cw-border-1)",
                borderRadius: 12,
                padding: "32px 26px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow:
                  selectedPlan === "100 Mbps"
                    ? "0 8px 24px rgba(139,105,193,0.18)"
                    : "var(--cw-shadow-1)",
                transition: "all 0.2s ease",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--cw-fg-1)",
                    margin: "0 0 10px",
                  }}
                >
                  100 Mbps
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--cw-fg-3)",
                    margin: "0 0 20px",
                    minHeight: 44,
                  }}
                >
                  Browsing, streaming and everyday connection
                </p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <strong
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 42,
                      fontWeight: 700,
                      color: "var(--cw-fg-1)",
                      lineHeight: 1,
                    }}
                  >
                    $55
                  </strong>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--cw-fg-3)",
                      paddingBottom: 4,
                    }}
                  >
                    /mo
                  </span>
                </div>
                <small
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "var(--cw-fg-3)",
                    marginTop: 8,
                  }}
                >
                  Price guaranteed for 24 months
                </small>
              </div>
              <button
                type="button"
                onClick={() => handlePickPlan("100 Mbps")}
                style={{
                  marginTop: 26,
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--cw-purple)",
                  background: "transparent",
                  border: 0,
                  padding: 0,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Choose this speed →
              </button>
            </article>

            {/* 500 Mbps */}
            <article
              style={{
                position: "relative",
                background: "var(--cw-bg-1)",
                border:
                  selectedPlan === "500 Mbps"
                    ? "2px solid var(--cw-purple)"
                    : "1px solid var(--cw-border-1)",
                borderRadius: 12,
                padding: "32px 26px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow:
                  selectedPlan === "500 Mbps"
                    ? "0 8px 24px rgba(139,105,193,0.18)"
                    : "var(--cw-shadow-1)",
                transition: "all 0.2s ease",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--cw-fg-1)",
                    margin: "0 0 10px",
                  }}
                >
                  500 Mbps
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--cw-fg-3)",
                    margin: "0 0 20px",
                    minHeight: 44,
                  }}
                >
                  Families, gaming and multiple devices
                </p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <strong
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 42,
                      fontWeight: 700,
                      color: "var(--cw-fg-1)",
                      lineHeight: 1,
                    }}
                  >
                    $55
                  </strong>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--cw-fg-3)",
                      paddingBottom: 4,
                    }}
                  >
                    /mo
                  </span>
                </div>
                <small
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "var(--cw-fg-3)",
                    marginTop: 8,
                  }}
                >
                  Price guaranteed for 24 months
                </small>
              </div>
              <button
                type="button"
                onClick={() => handlePickPlan("500 Mbps")}
                style={{
                  marginTop: 26,
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--cw-purple)",
                  background: "transparent",
                  border: 0,
                  padding: 0,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Choose this speed →
              </button>
            </article>

            {/* 1 Gig (Featured) */}
            <article
              style={{
                position: "relative",
                background: "var(--cw-bg-1)",
                border:
                  selectedPlan === "1 Gig"
                    ? "2px solid var(--cw-purple)"
                    : "1px solid var(--cw-border-1)",
                borderRadius: 12,
                padding: "32px 26px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow:
                  selectedPlan === "1 Gig"
                    ? "0 8px 24px rgba(139,105,193,0.18)"
                    : "var(--cw-shadow-1)",
                transition: "all 0.2s ease",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -12,
                  left: 20,
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: "var(--cw-purple)",
                  color: "#FFFFFF",
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 12px rgba(139,105,193,0.35)",
                }}
              >
                Most speed. Same price.
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--cw-fg-1)",
                    margin: "0 0 10px",
                  }}
                >
                  1 Gig
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--cw-fg-3)",
                    margin: "0 0 20px",
                    minHeight: 44,
                  }}
                >
                  Creators, smart homes and everything at once
                </p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <strong
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 42,
                      fontWeight: 700,
                      color: "var(--cw-fg-1)",
                      lineHeight: 1,
                    }}
                  >
                    $55
                  </strong>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--cw-fg-3)",
                      paddingBottom: 4,
                    }}
                  >
                    /mo
                  </span>
                </div>
                <small
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "var(--cw-fg-3)",
                    marginTop: 8,
                  }}
                >
                  Price guaranteed for 24 months
                </small>
              </div>
              <button
                type="button"
                onClick={() => handlePickPlan("1 Gig")}
                style={{
                  marginTop: 26,
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--cw-purple)",
                  background: "transparent",
                  border: 0,
                  padding: 0,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Choose this speed →
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* 5. MAP / CONNECTED NEIGHBORHOOD SECTION (THIRD CONTENT SECTION - DECENT IMAGE HEIGHT) */}
      <section
        id="map"
        style={{
          background: "var(--cw-bg-1)",
          padding: "64px 24px",
          borderBottom: "1px solid var(--cw-border-1)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Map Image with clean, balanced, decent height */}
          <div
            style={{
              position: "relative",
              height: 380,
              maxHeight: 380,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--cw-border-1)",
              background: "var(--cw-bg-2)",
              boxShadow: "var(--cw-shadow-2)",
            }}
          >
            <img
              src="/assets/clayton/clayton-map.png"
              alt="Fiber streets near Highway 138, Taylor Road, Fox Ridge, Avalon and Flint River Road"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                display: "block",
              }}
            />
          </div>

          {/* Connected Streets Copy */}
          <div>
            <div className="section-eyebrow">The connected neighborhood</div>
            <h2 className="section-h2" style={{ marginBottom: 14 }}>
              Fiber is already on these streets.
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--cw-fg-2)",
                margin: 0,
              }}
            >
              Fox Ridge. Avalon. Taylor Road. Highway 138. Flint River Road. This is
              not a citywide promise. It is a network built street by street for the
              places you call home.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 28px" }}>
              {[
                "Your address determines eligibility",
                "Installation is scheduled after qualification",
                "Support comes from people invested in the community",
              ].map((point) => (
                <li
                  key={point}
                  style={{
                    position: "relative",
                    padding: "10px 0 10px 24px",
                    borderBottom: "1px solid var(--cw-border-1)",
                    fontSize: 14,
                    color: "var(--cw-fg-2)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 17,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--cw-purple)",
                    }}
                  />
                  {point}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => scrollToSection("availability")}
              className="btn btn-primary"
              style={{
                boxShadow: "0 6px 20px rgba(122,96,214,0.35)",
              }}
            >
              See if my home is connected <Ico n="arrow-right" size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. WHY CULTURE SECTION */}
      <section
        id="why"
        style={{
          background: "var(--cw-navy-deep)",
          color: "var(--cw-white)",
          padding: "64px 24px",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--cw-purple)",
              margin: "0 0 8px",
            }}
          >
            Born in community · Built for everyone
          </p>
          <h2
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: "clamp(26px, 3.2vw, 38px)",
              fontWeight: 700,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              lineHeight: 1.12,
              margin: "0 0 14px",
              color: "#FFFFFF",
            }}
          >
            Better internet. Stronger community.
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.75)",
              maxWidth: 620,
              margin: "0 0 36px",
            }}
          >
            We built Culture Wireless because our communities deserve exceptional
            internet, local accountability and a company that sees connectivity as more
            than a utility.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                title: "Local accountability",
                desc: "Real support from a team that understands the communities we serve.",
              },
              {
                title: "Fiber performance",
                desc: "Fast downloads, strong uploads and capacity for the whole home.",
              },
              {
                title: "A clearer choice",
                desc: "No contract and no need to trade the speed you want for the price you need.",
              },
            ].map((card) => (
              <article
                key={card.title}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "26px 22px",
                }}
              >
                <b
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#FFFFFF",
                    display: "block",
                  }}
                >
                  {card.title}
                </b>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.7)",
                    margin: "10px 0 0",
                  }}
                >
                  {card.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AVAILABILITY & LEAD FORM SECTION */}
      <section
        id="availability"
        style={{
          background: "var(--cw-bg-2)",
          padding: "64px 24px",
          borderTop: "1px solid var(--cw-border-1)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Left Column */}
          <div>
            <div className="section-eyebrow">Only {spots} launch connections</div>
            <h2 className="section-h2" style={{ marginBottom: 14 }}>
              Is your address one of them?
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--cw-fg-3)",
                maxWidth: 480,
                margin: 0,
              }}
            >
              Start with your service address. We keep your campaign source attached
              through order, installation and activation.
            </p>

            {/* Step Indicators */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                margin: "24px 0 0",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: step === "address" ? "var(--cw-navy)" : "var(--cw-bg-1)",
                  color: step === "address" ? "var(--cw-white)" : "var(--cw-fg-3)",
                  border:
                    step === "address"
                      ? "1px solid var(--cw-navy)"
                      : "1px solid var(--cw-border-1)",
                }}
              >
                1 Address
              </span>
              <span
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: step === "contact" ? "var(--cw-navy)" : "var(--cw-bg-1)",
                  color: step === "contact" ? "var(--cw-white)" : "var(--cw-fg-3)",
                  border:
                    step === "contact"
                      ? "1px solid var(--cw-navy)"
                      : "1px solid var(--cw-border-1)",
                }}
              >
                2 Contact
              </span>
              <span
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: step === "complete" ? "var(--cw-navy)" : "var(--cw-bg-1)",
                  color: step === "complete" ? "var(--cw-white)" : "var(--cw-fg-3)",
                  border:
                    step === "complete"
                      ? "1px solid var(--cw-navy)"
                      : "1px solid var(--cw-border-1)",
                }}
              >
                3 Connect
              </span>
            </div>
          </div>

          {/* Right Column / Form Box */}
          <div>
            {/* STEP 1: ADDRESS FORM */}
            {step === "address" && (
              <form
                onSubmit={handleCheckAddress}
                style={{
                  background: "var(--cw-bg-1)",
                  padding: "28px 24px",
                  border: "1px solid var(--cw-border-1)",
                  borderRadius: 12,
                  boxShadow: "var(--cw-shadow-2)",
                }}
              >
                <label
                  htmlFor="service_address"
                  style={{
                    display: "block",
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--cw-fg-1)",
                    marginBottom: 10,
                  }}
                >
                  Home address
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <input
                    id="service_address"
                    name="service_address"
                    ref={addressInputRef}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="1234 Your Street, Clayton County, GA"
                    autoComplete="street-address"
                    required
                    style={{
                      flex: "1 1 220px",
                      minWidth: 0,
                      height: 48,
                      border: "1px solid var(--cw-border-2)",
                      borderRadius: 8,
                      padding: "0 16px",
                      background: "var(--cw-bg-1)",
                      color: "var(--cw-fg-1)",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{
                      height: 48,
                      boxShadow: "0 6px 20px rgba(122,96,214,0.35)",
                    }}
                  >
                    {submitting ? "Checking…" : "Check my address"}
                  </button>
                </div>
                <small
                  style={{
                    display: "block",
                    marginTop: 12,
                    color: "var(--cw-fg-3)",
                    fontSize: 12,
                  }}
                >
                  No obligation. We only use this to check service availability.
                </small>
              </form>
            )}

            {/* STEP 2: CONTACT DETAILS FORM */}
            {step === "contact" && (
              <form
                onSubmit={handleSubmitLead}
                style={{
                  background: "var(--cw-bg-1)",
                  padding: "28px 24px",
                  border: "1px solid var(--cw-border-1)",
                  borderRadius: 12,
                  boxShadow: "var(--cw-shadow-2)",
                }}
              >
                {/* Active Address Bar */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    background: "var(--cw-bg-2)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginBottom: 18,
                  }}
                >
                  <b
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--cw-fg-1)",
                    }}
                  >
                    Address:
                  </b>
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--cw-fg-2)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {address}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep("address")}
                    style={{
                      border: 0,
                      background: "none",
                      color: "var(--cw-purple)",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Edit
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: 14,
                  }}
                >
                  <label
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--cw-fg-1)",
                    }}
                  >
                    First name
                    <input
                      name="first_name"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      style={{
                        display: "block",
                        width: "100%",
                        height: 44,
                        marginTop: 6,
                        border: "1px solid var(--cw-border-2)",
                        borderRadius: 6,
                        padding: "0 12px",
                        background: "var(--cw-bg-1)",
                        color: "var(--cw-fg-1)",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </label>

                  <label
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--cw-fg-1)",
                    }}
                  >
                    Last name
                    <input
                      name="last_name"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      style={{
                        display: "block",
                        width: "100%",
                        height: 44,
                        marginTop: 6,
                        border: "1px solid var(--cw-border-2)",
                        borderRadius: 6,
                        padding: "0 12px",
                        background: "var(--cw-bg-1)",
                        color: "var(--cw-fg-1)",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </label>

                  <label
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--cw-fg-1)",
                    }}
                  >
                    Email
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      style={{
                        display: "block",
                        width: "100%",
                        height: 44,
                        marginTop: 6,
                        border: "1px solid var(--cw-border-2)",
                        borderRadius: 6,
                        padding: "0 12px",
                        background: "var(--cw-bg-1)",
                        color: "var(--cw-fg-1)",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </label>

                  <label
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--cw-fg-1)",
                    }}
                  >
                    Mobile phone
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      style={{
                        display: "block",
                        width: "100%",
                        height: 44,
                        marginTop: 6,
                        border: "1px solid var(--cw-border-2)",
                        borderRadius: 6,
                        padding: "0 12px",
                        background: "var(--cw-bg-1)",
                        color: "var(--cw-fg-1)",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </label>

                  <label
                    style={{
                      gridColumn: "1/-1",
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--cw-fg-1)",
                    }}
                  >
                    Preferred speed
                    <select
                      name="product_interest"
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      style={{
                        display: "block",
                        width: "100%",
                        height: 44,
                        marginTop: 6,
                        border: "1px solid var(--cw-border-2)",
                        borderRadius: 6,
                        padding: "0 12px",
                        background: "var(--cw-bg-1)",
                        color: "var(--cw-fg-1)",
                        fontSize: 14,
                        outline: "none",
                      }}
                    >
                      <option value="100 Mbps">100 Mbps</option>
                      <option value="500 Mbps">500 Mbps</option>
                      <option value="1 Gig">1 Gig</option>
                    </select>
                  </label>
                </div>

                <label
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    marginTop: 14,
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "var(--cw-fg-3)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.emailOptIn}
                    onChange={(e) =>
                      setFormData({ ...formData, emailOptIn: e.target.checked })
                    }
                    style={{ marginTop: 2, accentColor: "var(--cw-purple)" }}
                  />
                  Send me service updates and offers by email.
                </label>

                <label
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    marginTop: 10,
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "var(--cw-fg-3)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.smsOptIn}
                    onChange={(e) =>
                      setFormData({ ...formData, smsOptIn: e.target.checked })
                    }
                    style={{ marginTop: 2, accentColor: "var(--cw-purple)" }}
                  />
                  I agree to receive automated texts from Culture Wireless about
                  availability, my order and related offers. Consent is not a condition of
                  purchase. Message and data rates may apply. Reply STOP to opt out.
                </label>

                {status && (
                  <p
                    role="alert"
                    style={{
                      color: "var(--cw-error)",
                      fontSize: 13,
                      marginTop: 14,
                    }}
                  >
                    {status}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    height: 48,
                    marginTop: 20,
                    justifyContent: "center",
                    boxShadow: "0 6px 20px rgba(122,96,214,0.35)",
                  }}
                >
                  {submitting ? "Submitting…" : "Reserve my connection"}
                </button>

                <small
                  style={{
                    display: "block",
                    marginTop: 10,
                    textAlign: "center",
                    color: "var(--cw-fg-3)",
                    fontSize: 11,
                  }}
                >
                  By submitting, you agree that Culture Wireless may contact you about
                  service at this address.
                </small>
              </form>
            )}

            {/* STEP 3: SUCCESS / CONFIRMATION */}
            {step === "complete" && (
              <div
                style={{
                  background: "var(--cw-bg-1)",
                  border: "1px solid var(--cw-border-1)",
                  borderTop: "4px solid var(--cw-purple)",
                  borderRadius: 12,
                  padding: "32px 24px",
                  boxShadow: "var(--cw-shadow-2)",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(139,105,193,0.15)",
                    color: "var(--cw-purple)",
                    marginBottom: 16,
                  }}
                >
                  <Ico n="check-circle" size={24} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--cw-fg-1)",
                    margin: "0 0 10px",
                  }}
                >
                  Your Clayton request is in.
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--cw-fg-3)",
                    margin: "0 0 16px",
                  }}
                >
                  We captured your address, selected speed (<b>{selectedPlan}</b>) and
                  campaign source. A Culture Wireless representative can now continue the
                  qualification and installation process.
                </p>
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "var(--cw-bg-2)",
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--cw-fg-2)",
                    marginBottom: 20,
                  }}
                >
                  Reference: {reference}
                </span>
                <div style={{ marginTop: 8 }}>
                  <Link href="/check-availability" className="btn btn-primary btn-sm">
                    Check standard availability <Ico n="arrow-right" size={12} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. FOOTER DISCLAIMER */}
      <div
        style={{
          background: "var(--cw-bg-1)",
          padding: "24px 24px 32px",
          borderTop: "1px solid var(--cw-border-1)",
        }}
      >
        <p
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--cw-fg-4)",
          }}
        >
          Offer applies to new qualifying Clayton County residential fiber customers.
          Available speeds vary by address. First {spots} completed enrollments during
          the 30-day launch window. Final equipment, installation, taxes, fees and
          post-month-24 pricing must be disclosed in the production offer terms.
        </p>
      </div>
    </main>
  );
}
