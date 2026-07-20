"use client";

import React from "react";
import Link from "next/link";
import FAQ from "../Components/Faq/Faq";
import { Ico } from "../Components/Icons";

export default function Fiber() {

  const fiberFaqs = [
    {
      q: "How long does installation take?",
      a: "Most installs are completed in 2–4 hours by a local technician. We schedule within 5 business days of sign-up.",
    },
    {
      q: "Do you require a contract?",
      a: "No. We're month-to-month, period. Cancel any time with no early termination fees.",
    },
    {
      q: "What if my speeds are slow?",
      a: "Call us and we'll dispatch a tech within 24 hours — for free. If speeds don't meet your plan, that month is on us.",
    },
    {
      q: "Can I keep my existing email address?",
      a: "Yes. Switching to Culture doesn't change your email. We don't offer email hosting, so your Gmail, Yahoo, or Outlook stays exactly the same.",
    },
    {
      q: "Do you offer student or senior discounts?",
      a: "Yes — we participate in the Affordable Connectivity Program (ACP) and offer additional discounts for qualifying households. Call us for details.",
    },
    {
      q: "What happens if I move?",
      a: "We'll transfer your service to your new address if we cover it, at no charge. If we don't yet serve your new area, you can cancel with no penalty.",
    },
  ];

  return (
    <main>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link href="/">culturewireless.com</Link>
            <span className="slash">/</span>
            <span>fiber</span>
          </div>
          <h1 className="page-h1">
            HOME
            <br />
            INTERNET.
          </h1>
          <p className="page-lede">
            Real fiber. Honest pricing. No throttling, no surprise fees, no
            contracts.
          </p>
        </div>
      </div>

      {/* Plan Tiers */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="section-eyebrow">Pricing</div>
          <h2 className="section-h2">Real fiber. No surprise fees.</h2>
          <div className="card-grid-3" style={{ marginTop: 16 }}>
            {[
              {
                name: "Connect 100",
                speed: "100 Mbps · symmetric",
                price: 55,
                tag: "Streaming + work from home",
                features: [
                  "100 Mbps symmetric",
                  "Wi-Fi 6 router included",
                  "Free pro install",
                  "24/7 local support",
                  "No data caps, ever",
                ],
                featured: false,
              },
              {
                name: "Connect 500",
                speed: "500 Mbps · symmetric",
                price: 65,
                tag: "Whole household",
                features: [
                  "500 Mbps symmetric",
                  "Mesh Wi-Fi for 2,500 sq ft",
                  "Priority support",
                  "Static IP available",
                  "No throttling, no contracts",
                ],
                featured: true,
              },
              {
                name: "Culture Gig",
                speed: "1,000 Mbps · symmetric",
                price: 75,
                tag: "Power users + creators",
                features: [
                  "1 Gig symmetric",
                  "Whole-home mesh",
                  "Same-day dispatch",
                  "Free static IP",
                  "Gamer-grade latency",
                ],
                featured: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`card${p.featured ? " featured" : ""}`}
              >
                <div
                  className="section-eyebrow"
                  style={{ margin: 0, fontSize: 9 }}
                >
                  {p.tag}
                </div>
                <div className="plan-name">{p.name}</div>
                <div className="plan-speed">{p.speed}</div>
                <div className="plan-price">
                  ${p.price}
                  <small>/mo</small>
                </div>
                <div className="feat-list">
                  {p.features.map((f) => (
                    <div key={f} className="feat-item">
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/check-availability"
                  className={`btn btn-sm ${
                    p.featured ? "btn-primary" : "btn-ghost"
                  }`}
                  style={{ marginTop: 8 }}
                >
                  Choose {p.name} <Ico n="arrow-right" size={12} />
                </Link>
              </div>
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: 12,
              fontSize: 13,
              color: "var(--cw-fg-3)",
            }}
          >
            All prices include taxes and equipment. No promo pricing that
            doubles in 12 months. Pricing may vary by city.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section
        className="page-section"
        style={{ background: "var(--cw-bg-2)" }}
      >
        <div className="sec-inner">
          <div className="section-eyebrow">In every plan</div>
          <h2 className="section-h2">
            Everything you need. Nothing you don't.
          </h2>
          <div className="card-grid-3" style={{ marginTop: 16 }}>
            {[
              {
                icon: "router",
                title: "Wi-Fi 6 Router",
                text: "Mesh-ready, replaced every 3 years at no charge.",
              },
              {
                icon: "wrench",
                title: "Pro Install",
                text: "Free, scheduled within 5 days. Local tech, not a contractor.",
              },
              {
                icon: "headphones",
                title: "Local Support",
                text: "Locally-based, 24/7, under 90-second average answer time.",
              },
              {
                icon: "shield-check",
                title: "No Caps",
                text: "Use the internet like the internet. No throttling, ever.",
              },
              {
                icon: "gauge",
                title: "Speed Guarantee",
                text: "If your speeds don't meet plan specs, that month is on us.",
              },
              {
                icon: "leaf",
                title: "No Contracts",
                text: "Cancel any time. Keep the router. No early termination fees.",
              },
            ].map((f) => (
              <div key={f.title} className="card" style={{ gap: 10 }}>
                <div className="icon-box">
                  <Ico n={f.icon} size={20} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--cw-fg-3)",
                    lineHeight: 1.5,
                  }}
                >
                  {f.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MDU & HOA */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="two-col">
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                minHeight: 240,
                alignSelf: "stretch",
                position: "relative",
              }}
            >
              <img
                src="/assets/fiber-hero.webp"
                alt="Atlanta skyline"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                  display: "block",
                }}
              />
            </div>
            <div>
              <div className="section-eyebrow">For property managers</div>
              <h2 className="section-h2">Bulk fiber for your building.</h2>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--cw-fg-3)",
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                One contract, every unit wired. Residents get gig speeds; you
                get a building amenity that pays for itself.
              </p>
              <div className="feat-list" style={{ marginBottom: 24 }}>
                <div className="feat-item">
                  Single-bill billing for the whole property
                </div>
                <div className="feat-item">
                  Resident-onboarding portal included
                </div>
                <div className="feat-item">Volume pricing from $29/unit/mo</div>
                <div className="feat-item">
                  Dedicated property manager, direct line
                </div>
              </div>
              <Link href="/support" className="btn btn-primary">
                Contact Sales <Ico n="arrow-right" size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Business Fiber */}
      <section
        className="page-section"
        style={{ background: "var(--cw-bg-2)" }}
      >
        <div className="sec-inner">
          <div className="two-col">
            <div>
              <div className="section-eyebrow">For business</div>
              <h2 className="section-h2">SLA-backed fiber for your team.</h2>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--cw-fg-3)",
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                From the corner shop to the corporate floor. Static IPs,
                dedicated lines, four-hour response window.
              </p>
              <Link href="/support" className="btn btn-primary">
                Get a Quote <Ico n="arrow-right" size={13} />
              </Link>
            </div>
            <div className="card-grid-2" style={{ gap: 12 }}>
              {[
                { icon: "shield", text: "99.99% uptime SLA" },
                { icon: "globe", text: "Static IPv4 + IPv6 included" },
                { icon: "clock", text: "4-hour response, 24/7" },
                { icon: "phone", text: "Dedicated business line" },
              ].map((f) => (
                <div
                  key={f.text}
                  className="card"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: "14px 18px",
                    gap: 12,
                  }}
                >
                  <div className="icon-box">
                    <Ico n={f.icon} size={18} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{f.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="section-eyebrow">FAQ</div>
          <h2 className="section-h2">Common questions.</h2>
          <div style={{ maxWidth: 720, marginTop: 8 }}>
            <FAQ items={fiberFaqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
