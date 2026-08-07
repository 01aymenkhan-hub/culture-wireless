"use client";

import React, { useState } from "react";
import Link from "next/link";
import FAQ from "../Components/Faq/Faq";
import { Ico } from "../Components/Icons";

export default function Mobile() {
  const [imei, setImei] = useState("");
  const [imeiResult, setImeiResult] = useState(null);

  const mobileFaqs = [
    {
      q: "Can I keep my current phone number?",
      a: "Yes. Your number ports in the background, usually within 2 hours. No downtime, no missed calls.",
    },
    {
      q: "Which phones are compatible?",
      a: "Most unlocked iPhones (11+), Pixel (5+), and Galaxy (S20+) work out of the box. Use our IMEI checker to confirm any device.",
    },
    {
      q: "What network does Culture Mobile use?",
      a: "We run on the same nationwide 5G infrastructure as T-Mobile and other major carriers, covering 99% of the US population.",
    },
    {
      q: "Is there a family plan discount?",
      a: "Yes — add a second line and save $5/mo. Third and fourth lines save $10/mo each.",
    },
    {
      q: "Does my plan include international calling?",
      a: "All plans include unlimited calling to 80+ countries. Roaming data packages are available for 130+ countries.",
    },
    {
      q: "Can I pause my plan when traveling?",
      a: "Yes. You can pause and resume your plan once per calendar year at no charge.",
    },
  ];

  const handleImeiCheck = () => {
    if (imei.trim().length > 5) {
      setImeiResult("compatible");
    } else {
      setImeiResult("error");
    }
  };

  return (
    <main>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link href="/">culturewireless.com</Link>
            <span className="slash">/</span>
            <span>mobile</span>
          </div>
          <h1 className="page-h1">MOBILE.</h1>
          <p className="page-lede">
            Bring your phone. Keep your number. Unlimited 5G on the nation's most
            reliable network.
          </p>
        </div>
      </div>

      {/* Plan Grid */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="section-eyebrow">Pricing</div>
          <h2 className="section-h2">Pick your plan. Keep your phone.</h2>
          <p className="section-sub">
            All plans include unlimited talk &amp; text, 5G nationwide, Wi-Fi
            calling, and calling to Canada and Mexico. No contracts, no surprises.
          </p>
          <div className="mob-plans">
            {[
              {
                name: "Starter",
                data: "1 GB",
                price: 15,
                tag: "Light use",
                feat: [
                  "1 GB 5G data",
                  "Unlimited talk & text",
                  "Wi-Fi calling",
                  "Mobile hotspot",
                ],
                featured: false,
              },
              {
                name: "Essential",
                data: "5 GB",
                price: 29,
                tag: "Everyday use",
                feat: [
                  "5 GB 5G data",
                  "Unlimited talk & text",
                  "Wi-Fi calling",
                  "Mobile hotspot",
                ],
                featured: false,
              },
              {
                name: "Plus",
                data: "15 GB",
                price: 39,
                tag: "Most popular",
                feat: [
                  "15 GB 5G data",
                  "Unlimited talk & text",
                  "Wi-Fi calling",
                  "Mobile hotspot",
                ],
                featured: true,
              },
              {
                name: "Premium",
                data: "30 GB",
                price: 59,
                tag: "Heavy use",
                feat: [
                  "30 GB 5G data",
                  "Unlimited talk & text",
                  "Wi-Fi calling",
                  "Mobile hotspot",
                ],
                featured: false,
              },
              {
                name: "Ultimate",
                data: "40 GB",
                price: 79,
                tag: "Power user",
                feat: [
                  "40 GB 5G data",
                  "Unlimited talk & text",
                  "Wi-Fi calling",
                  "Mobile hotspot",
                ],
                featured: false,
              },
            ].map((p) => (
              <div key={p.name} className={`card${p.featured ? " featured" : ""}`}>
                <div
                  className="section-eyebrow"
                  style={{ margin: 0, fontSize: 9 }}
                >
                  {p.tag}
                </div>
                <div className="plan-name" style={{ fontSize: 15 }}>
                  {p.name}
                </div>
                <div className="plan-speed">{p.data} data</div>
                <div className="plan-price" style={{ fontSize: 32 }}>
                  ${p.price}
                  <small>/mo</small>
                </div>
                <div className="feat-list">
                  {p.feat.map((f) => (
                    <div key={f} className="feat-item">
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/mobile/signup"
                  className={`btn btn-sm ${p.featured ? "btn-primary" : "btn-ghost"}`}
                  style={{ marginTop: 8, display: "inline-flex", textDecoration: "none", justifyContent: "center" }}
                >
                  Choose {p.name}
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
            All plans include taxes &amp; fees. Multi-line discounts available.
          </p>
        </div>
      </section>

      {/* BYOD */}
      <section className="page-section" style={{ background: "var(--cw-bg-2)" }}>
        <div className="sec-inner">
          <div className="section-eyebrow">BYOD</div>
          <h2 className="section-h2">Keep your phone. Keep your number.</h2>
          <p className="section-sub">
            Most unlocked phones from the last five years just work. Check yours in
            30 seconds.
          </p>
          <div className="card-grid-3" style={{ marginTop: 12, marginBottom: 24 }}>
            {[
              {
                title: "iPhone",
                sub: "iPhone 11 and newer",
                img: "/assets/iphone-byod.webp",
                h: 220,
              },
              {
                title: "Pixel",
                sub: "Pixel 5 and newer",
                img: "/assets/pixel-byod.webp",
                h: 170,
              },
              {
                title: "Galaxy",
                sub: "Galaxy S20 and newer",
                img: "/assets/galaxy-byod.webp",
                h: 170,
              },
            ].map((d) => (
              <div
                key={d.title}
                className="card"
                style={{
                  alignItems: "center",
                  textAlign: "center",
                  gap: 10,
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 220,
                  }}
                >
                  {d.img ? (
                    <img
                      src={d.img}
                      alt={d.title}
                      style={{ height: d.h, width: "auto", maxWidth: "100%" }}
                    />
                  ) : (
                    <div className="icon-box lg">
                      <Ico n="smartphone" size={26} />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "var(--cw-font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {d.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--cw-fg-3)" }}>
                  {d.sub}
                </div>
              </div>
            ))}
          </div>
          <div className="imei-row">
            <input
              className="wf-input"
              placeholder="Enter your phone's IMEI (dial *#06#)"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              style={{ flex: 1, height: 44, borderRadius: 6 }}
            />
            <button className="btn btn-primary" onClick={handleImeiCheck}>
              Check Compatibility
            </button>
          </div>
          {imeiResult === "compatible" && (
            <div
              style={{
                marginTop: 12,
                padding: "12px 16px",
                borderRadius: 10,
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.4)",
                color: "#16a34a",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico n="check-circle" size={16} color="#16a34a" /> Your device is
              compatible with Culture Mobile.
            </div>
          )}
          {imeiResult === "error" && (
            <div
              style={{
                marginTop: 12,
                padding: "12px 16px",
                borderRadius: 10,
                background: "rgba(221,52,42,0.08)",
                border: "1px solid rgba(221,52,42,0.3)",
                color: "#dd342a",
                fontWeight: 600,
              }}
            >
              Please enter a valid IMEI (at least 6 digits).
            </div>
          )}
        </div>
      </section>

      {/* Activate a SIM */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="section-eyebrow">3 steps</div>
          <h2 className="section-h2">Up and running in 10 minutes.</h2>
          <div className="card-grid-3" style={{ marginTop: 12 }}>
            {[
              {
                step: "01",
                title: "Order",
                text: "Pick a plan and we'll ship a SIM (or eSIM) free overnight.",
              },
              {
                step: "02",
                title: "Activate",
                text: "Scan the QR code in our app or pop in the physical SIM.",
              },
              {
                step: "03",
                title: "Connect",
                text: "Your number ports in the background. No downtime.",
              },
            ].map((s) => (
              <div key={s.step} className="card" style={{ gap: 10 }}>
                <div
                  className="icon-box"
                  style={{ background: "rgba(139,105,193,0.12)" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--cw-purple)",
                    }}
                  >
                    {s.step}
                  </span>
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
                  {s.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--cw-fg-3)", lineHeight: 1.55 }}>
                  {s.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <Link href="/mobile/signup" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Get Your e-SIM <Ico n="arrow-right" size={13} />
            </Link>
            <Link href="/mobile/signup" className="btn btn-ghost" style={{ textDecoration: "none" }}>
              Activate SIM
            </Link>
          </div>
        </div>
      </section>

      {/* International */}
      <section className="page-section" style={{ background: "var(--cw-bg-2)" }}>
        <div className="sec-inner">
          <div className="section-eyebrow">International</div>
          <h2 className="section-h2">Call home from anywhere.</h2>
          <p className="section-sub">
            Unlimited talk and text to 80+ countries. Roaming in 130+. No daily
            passes, no surprise bills.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6,1fr)",
              gap: 10,
              marginTop: 12,
              marginBottom: 16,
            }}
          >
            {["🇲🇽", "🇯🇲", "🇭🇹", "🇳🇬", "🇬🇭", "🇪🇹", "🇰🇪", "🇮🇳", "🇵🇭", "🇧🇷", "🇨🇴", "🇩🇴"].map(
              (flag) => (
                <div
                  key={flag}
                  className="card"
                  style={{
                    aspectRatio: "1",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    padding: 8,
                    minHeight: 64,
                  }}
                >
                  {flag}
                </div>
              )
            )}
          </div>
          <button className="btn btn-ghost">
            See full country list <Ico n="arrow-right" size={13} />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="section-eyebrow">FAQ</div>
          <h2 className="section-h2">Common questions.</h2>
          <div style={{ maxWidth: 720, marginTop: 8 }}>
            <FAQ items={mobileFaqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
