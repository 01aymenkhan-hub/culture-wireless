"use client";

import React from "react";
import Link from "next/link";
import { Ico } from "./Components/Icons";
import CoverageMap from "./Components/CoverageMap/CoverageMap";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <span className="eyebrow-pill">
            <span className="dot" />
            &nbsp;Connect · Empower · Expand
          </span>
          <h1>
            Speed You Can Trust. <span className="accent">Service You Can Feel.</span>
          </h1>
          <p className="hero-lede">
            Affordable, reliable fiber internet for the communities we serve. The
            internet isn't a luxury — it's a necessity.
          </p>
          <div className="hero-btns">
            <Link
              href="/check-availability"
              className="btn btn-primary btn-lg"
            >
              Check Availability <Ico n="arrow-right" size={14} />
            </Link>
            <Link href="/fiber" className="btn btn-ghost btn-lg">
              View Plans
            </Link>
          </div>
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-num">1200+</div>
              <div className="stat-label">Communities served</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">99.9%</div>
              <div className="stat-label">Network uptime</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">&lt;90s</div>
              <div className="stat-label">Avg. answer time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map */}
      <section className="map-section">
        <div className="sec-inner">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <div>
              <div className="section-eyebrow">Service Coverage</div>
              <h2 className="section-h2" style={{ marginBottom: 8 }}>
                Where we deliver.
              </h2>
              <p
                style={{
                  color: "var(--cw-fg-3)",
                  fontSize: 14,
                  maxWidth: 520,
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Home fiber internet in 11 markets. Nationwide 5G mobile on the same
                towers as the major carriers. Hover any pin for the city.
              </p>
            </div>
            <div className="map-legend">
              <span
                className="legend-pill"
                style={{
                  background: "rgba(255,185,0,0.15)",
                  color: "#FFB900",
                  borderColor: "#FFB900",
                }}
              >
                <span
                  className="legend-dot"
                  style={{
                    background: "#FFB900",
                    boxShadow: "0 0 6px #FFB900",
                  }}
                />
                Fiber Internet Markets
              </span>
              <span
                className="legend-pill"
                style={{
                  background: "rgba(79,123,255,0.14)",
                  color: "#77A3FF",
                  borderColor: "#4F7BFF",
                }}
              >
                <span className="legend-dot" style={{ background: "#77A3FF" }} />
                5G Mobile (Nationwide)
              </span>
            </div>
          </div>
          <CoverageMap />
        </div>
      </section>

      {/* We Are Culture Wireless */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="two-col">
            <div>
              <div className="section-eyebrow">About us</div>
              <h2 className="section-h2">A telecom for the communities we serve.</h2>
              <p
                style={{
                  fontSize: 16,
                  color: "var(--cw-fg-2)",
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                We're not a big-box carrier. We're operators, builders, and neighbors
                closing the digital divide one block at a time. Our trucks are local.
                Our techs live where you live. And every line we run is one less family
                stuck on dial-up speeds.
              </p>
              <p
                style={{
                  fontSize: 16,
                  color: "var(--cw-fg-2)",
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                Culture Wireless was founded in 2019 by Atlanta natives who'd watched
                too many neighborhoods get passed over by national carriers. We started
                with one fiber pull on the East Side. We're now in 1200+ communities
                across the nation.
              </p>
              <Link href="/about" className="btn btn-primary">
                Our Story <Ico n="arrow-right" size={13} />
              </Link>
            </div>
            <div
              className="card-grid-3"
              style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}
            >
              {[
                {
                  icon: "radio-tower",
                  title: "Connect",
                  text: "Reliable fiber and 5G where the big carriers won't go.",
                },
                {
                  icon: "users",
                  title: "Empower",
                  text: "Local jobs, local techs, local accountability.",
                },
                {
                  icon: "globe",
                  title: "Expand",
                  text: "Bringing high-speed internet to every block we touch.",
                },
                {
                  icon: "shield-check",
                  title: "No Contracts",
                  text: "Cancel any time. Stay because you want to.",
                },
              ].map((c) => (
                <div key={c.title} className="card" style={{ gap: 10 }}>
                  <div className="icon-box">
                    <Ico n={c.icon} size={20} />
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--cw-fg-3)",
                      lineHeight: 1.5,
                    }}
                  >
                    {c.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Three Ways */}
      <section className="page-section" style={{ background: "var(--cw-bg-2)" }}>
        <div className="sec-inner">
          <div className="section-eyebrow">Pick your service</div>
          <h2 className="section-h2">Three ways to connect.</h2>
          <div className="card-grid-3">
            {[
              {
                icon: "wifi",
                title: "Home Fiber",
                price: "$49",
                unit: "/mo",
                text: "Fiber to the home. 100 Mbps to 1 Gig. No contracts, no caps, no nonsense.",
                cta: "Check Availability",
                href: "/check-availability",
              },
              {
                icon: "smartphone",
                title: "Mobile",
                price: "from $15",
                unit: "/mo",
                text: "Bring your phone, keep your number. Unlimited 5G on the nation's most reliable network.",
                cta: "See Mobile Plans",
                href: "/mobile",
              },
              {
                icon: "router",
                title: "Business Fiber",
                price: "Custom",
                unit: "pricing",
                text: "SLA-backed dedicated fiber for teams. Static IPs, four-hour response window.",
                cta: "Get a Quote",
                href: "/support",
              },
            ].map((c) => (
              <div key={c.title} className="connect-card">
                <div className="icon-box lg">
                  <Ico n={c.icon} size={26} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 32,
                    fontWeight: 700,
                    color: "var(--cw-fg-1)",
                    lineHeight: 1,
                  }}
                >
                  {c.price}
                  <span
                    style={{
                      fontFamily: "var(--cw-font-sans)",
                      fontSize: 13,
                      fontWeight: 400,
                      color: "var(--cw-fg-3)",
                      letterSpacing: 0,
                      textTransform: "none",
                    }}
                  >
                    {c.unit}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "var(--cw-fg-3)", lineHeight: 1.55, flex: 1 }}>
                  {c.text}
                </p>
                <Link href={c.href} className="btn btn-primary btn-sm">
                  {c.cta} <Ico n="arrow-right" size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="section-eyebrow">From our customers</div>
          <h2 className="section-h2">Voices from the block.</h2>
          <div className="card-grid-3" style={{ marginTop: 16 }}>
            {[
              {
                text: "Got fiber installed Tuesday. Watched my granddaughter's recital live in 4K Wednesday. That's it. That's the review.",
                name: "Diane M.",
                loc: "East Point, GA",
                initials: "DM",
              },
              {
                text: "My old carrier dropped me on every business call. Switched to Culture, haven't had a dead zone since.",
                name: "Marcus T.",
                loc: "Atlanta, GA",
                initials: "MT",
              },
              {
                text: "When the storm knocked out power, their tech was on my street the next morning. Try getting that from a 1-800.",
                name: "Rosa B.",
                loc: "Macon, GA",
                initials: "RB",
              },
            ].map((t, i) => (
              <div key={i} className="card" style={{ gap: 8 }}>
                <div className="quote-mark">"</div>
                <div className="quote-text">{t.text}</div>
                <div className="quote-author">
                  <div className="avatar">{t.initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--cw-fg-3)" }}>
                      {t.loc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        style={{
          background: "var(--cw-gradient-bg)",
          color: "#fff",
          padding: "56px 32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(255,185,0,0.15)",
              border: "1px solid rgba(255,185,0,0.4)",
              fontFamily: "var(--cw-font-display)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--cw-yellow)",
              fontWeight: 700,
            }}
          >
            1ST MONTH FREE
          </span>
          <h2
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: "clamp(24px,4vw,40px)",
              fontWeight: 700,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Sign up for fiber internet — your first month is on us.
          </h2>
          <p style={{ opacity: 0.78, maxWidth: 520, fontSize: 15, lineHeight: 1.5, margin: 0 }}>
            New fiber customers get their first month free. No catch, no contract.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/check-availability" className="btn btn-yellow btn-lg">
              Claim Offer <Ico n="arrow-right" size={14} />
            </Link>
            <Link
              href="/support"
              className="btn btn-lg"
              style={{
                borderColor: "rgba(255,255,255,0.3)",
                color: "#fff",
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.3)",
              }}
            >
              Talk to a Rep
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
