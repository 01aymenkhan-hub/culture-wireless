"use client";

import React, { useState } from "react";
import Link from "next/link";
import FAQ from "../Components/Faq/Faq";
import { Ico } from "../Components/Icons";

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState("");

  const supportFaqs = [
    {
      q: "How do I restart my router?",
      a: "Unplug the power cable, wait 30 seconds, plug back in. Allow 2 minutes for the router to reconnect. If issues persist, call us.",
    },
    {
      q: "How do I run a speed test?",
      a: "Open the ConnectIQ app and tap the gauge icon, or visit fast.com from a wired connection for the most accurate result.",
    },
    {
      q: "Why is my internet slow at night?",
      a: "Culture does not throttle. If you see slowdowns, it's likely Wi-Fi congestion. Move closer to your router or upgrade to our mesh option.",
    },
    {
      q: "How do I update my payment method?",
      a: "Log in to your account, go to Billing → Payment Methods, and add or replace your card. Changes take effect immediately.",
    },
    {
      q: "What's the number for emergencies/outages?",
      a: "Call (404) 555-0148. We have 24/7 local staff. Average answer time is under 90 seconds.",
    },
    {
      q: "Can I get a tech to come to my house?",
      a: "Yes. Schedule a free tech visit from your account portal, or call us. Most same-day and next-day slots are available.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setFormErr("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormErr("Please enter a valid email address.");
      return;
    }

    setFormErr("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          type: form.type,
          message: form.message,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message.");
      }

      setSubmitted(true);
    } catch (error) {
      setFormErr(error.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link href="/">culturewireless.com</Link>
            <span className="slash">/</span>
            <span>support</span>
          </div>
          <h1 className="page-h1">SUPPORT.</h1>
          <p className="page-lede">
            Real people, based in Atlanta. Average answer time under 90 seconds.
          </p>
        </div>
      </div>

      {/* Contact Channels */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="section-eyebrow">Get in touch</div>
          <h2 className="section-h2">Real people. Local. Fast.</h2>
          <div className="card-grid-3" style={{ marginTop: 16 }}>
            <a
              href="tel:+14045550148"
              className="channel-card"
              style={{ textDecoration: "none" }}
            >
              <div className="icon-box lg">
                <Ico n="phone" size={26} />
              </div>
              <div
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Call
              </div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                (404) 555-0148
              </div>
              <div style={{ fontSize: 12, color: "var(--cw-fg-3)" }}>
                Mon–Sun · 6am–11pm
              </div>
            </a>
            <a
              href="sms:30303?body=HELP"
              className="channel-card"
              style={{ textDecoration: "none" }}
            >
              <div className="icon-box lg">
                <Ico n="message-circle" size={26} />
              </div>
              <div
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Text
              </div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                Text HELP to 30303
              </div>
              <div style={{ fontSize: 12, color: "var(--cw-fg-3)" }}>
                24/7 · avg reply 2 min
              </div>
            </a>
            <a
              href="mailto:support@culturewireless.com"
              className="channel-card"
              style={{ textDecoration: "none" }}
            >
              <div className="icon-box lg">
                <Ico n="mail" size={26} />
              </div>
              <div
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Email
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                support@culturewireless.com
              </div>
              <div style={{ fontSize: 12, color: "var(--cw-fg-3)" }}>
                Replies within 4 hours
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="page-section"
        style={{ background: "var(--cw-bg-2)" }}
      >
        <div className="sec-inner">
          <div className="section-eyebrow">FAQ</div>
          <h2 className="section-h2">Common questions.</h2>
          <div style={{ maxWidth: 720, marginTop: 8 }}>
            <FAQ items={supportFaqs} />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="page-section">
        <div className="sec-inner">
          <div className="two-col" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="section-eyebrow">Contact form</div>
              <h2 className="section-h2">Send us a message.</h2>
              <p className="section-sub">
                We answer every message in under 4 hours. For outages, please
                use chat or call.
              </p>
            </div>
            <div className="card" style={{ padding: 28 }}>
              {submitted ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: "var(--cw-gradient)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(139,105,193,0.4)",
                    }}
                  >
                    <Ico n="check" size={28} color="#fff" sw={3} />
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--cw-font-display)",
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "var(--cw-navy)",
                    }}
                  >
                    Message Sent!
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--cw-fg-3)",
                      lineHeight: 1.6,
                      maxWidth: 320,
                    }}
                  >
                    We've received your message and will reply to{" "}
                    <strong style={{ color: "var(--cw-navy)" }}>
                      {form.email}
                    </strong>{" "}
                    within 4 hours.
                  </p>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", type: "", message: "" });
                    }}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 14,
                    }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Name *</label>
                      <input
                        className="form-input"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Email *</label>
                      <input
                        className="form-input"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issue Type</label>
                    <select
                      className="form-input form-select"
                      value={form.type}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, type: e.target.value }))
                      }
                    >
                      <option value="">Select a topic…</option>
                      <option>Billing question</option>
                      <option>Technical issue</option>
                      <option>New service inquiry</option>
                      <option>Cancel or change service</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      className="form-input"
                      placeholder="What can we help with?"
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                    />
                  </div>
                  {formErr && (
                    <div
                      style={{
                        color: "#dd342a",
                        fontSize: 13,
                        marginBottom: 12,
                      }}
                    >
                      {formErr}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      opacity: submitting ? 0.6 : 1,
                      cursor: submitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {submitting ? "Sending…" : "Send Message"}
                    {!submitting && <Ico n="arrow-right" size={13} />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
