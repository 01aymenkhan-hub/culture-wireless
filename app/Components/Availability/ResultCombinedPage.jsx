"use client";

import React, { useState, useEffect } from "react";
import { Ico, SignalWave } from "../Icons";

/* ── Plan Card (Fiber) ──────────────────────────────────── */
function PlanCard({ plan, selected, onSelect }) {
  const isSel = selected;
  return (
    <button
      onClick={() => onSelect(plan.id)}
      className={`plan-card-flow${isSel ? " selected" : ""}`}
      style={{
        border: isSel ? "2px solid var(--cw-purple)" : "1.5px solid var(--cw-border-1)",
        position: "relative",
        fontFamily: "var(--cw-font-sans)",
        transform: isSel ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {plan.popular && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: 24,
            background: "var(--cw-gradient)",
            color: "#fff",
            fontFamily: "var(--cw-font-display)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 700,
            padding: "6px 14px",
            borderRadius: 999,
            boxShadow: "0 8px 16px rgba(139,105,193,0.4)",
          }}
        >
          Most popular
        </div>
      )}
      <div
        style={{
          fontFamily: "var(--cw-font-display)",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: isSel ? "var(--cw-blue)" : "var(--cw-purple)",
          marginBottom: 8,
        }}
      >
        {plan.tag}
      </div>
      <div
        style={{
          fontFamily: "var(--cw-font-display)",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        Culture {plan.name}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
        <span
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "0.01em",
            lineHeight: 1,
          }}
        >
          {plan.speed}
        </span>
        <span
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 18,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: isSel ? "var(--cw-blue)" : "var(--cw-purple)",
          }}
        >
          {plan.unit}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
          marginBottom: 20,
          paddingBottom: 20,
          borderBottom: `1px solid ${isSel ? "rgba(255,255,255,0.15)" : "var(--cw-border-1)"}`,
        }}
      >
        <span style={{ fontSize: 14, color: isSel ? "rgba(255,255,255,0.6)" : "var(--cw-fg-3)" }}>
          Starting at
        </span>
        <span style={{ fontFamily: "var(--cw-font-display)", fontSize: 24, fontWeight: 700 }}>
          ${plan.price}
        </span>
        <span style={{ fontSize: 13, color: isSel ? "rgba(255,255,255,0.6)" : "var(--cw-fg-3)" }}>
          /mo
        </span>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {plan.features.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: isSel ? "rgba(255,255,255,0.85)" : "var(--cw-fg-2)",
            }}
          >
            <Ico n="check" size={13} color={isSel ? "#4ade80" : "var(--cw-purple)"} sw={3} />
            {f}
          </li>
        ))}
      </ul>
      <div
        style={{
          marginTop: 18,
          padding: "10px 14px",
          borderRadius: 999,
          background: isSel ? "var(--cw-gradient)" : "var(--cw-bg-2)",
          color: isSel ? "#fff" : "var(--cw-purple)",
          fontFamily: "var(--cw-font-display)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          textAlign: "center",
          border: isSel ? "none" : "1px solid var(--cw-border-2)",
        }}
      >
        {isSel ? "✓ Selected" : "Select this plan"}
      </div>
    </button>
  );
}

/* ── Mobile Plan Card ───────────────────────────────────── */
function MobilePlanCard({ plan, selected, onSelect }) {
  const isSel = selected;
  return (
    <button
      onClick={() => onSelect(plan.id)}
      style={{
        background: isSel ? "var(--cw-navy)" : "var(--cw-bg-1)",
        color: isSel ? "#fff" : "var(--cw-fg-1)",
        border: isSel ? "2px solid var(--cw-purple)" : "1.5px solid var(--cw-border-1)",
        borderRadius: 16,
        padding: "20px 18px 16px",
        textAlign: "left",
        cursor: "pointer",
        position: "relative",
        fontFamily: "var(--cw-font-sans)",
        transition: "transform 240ms, box-shadow 240ms",
        transform: isSel ? "translateY(-3px)" : "translateY(0)",
        boxShadow: isSel ? "0 16px 40px rgba(139,105,193,0.30)" : "0 2px 8px rgba(26,18,51,0.06)",
      }}
    >
      {plan.popular && (
        <div
          style={{
            position: "absolute",
            top: -10,
            left: 16,
            background: "var(--cw-gradient)",
            color: "#fff",
            fontFamily: "var(--cw-font-display)",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 999,
          }}
        >
          Most popular
        </div>
      )}
      <div
        style={{
          fontFamily: "var(--cw-font-display)",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: isSel ? "var(--cw-blue)" : "var(--cw-purple)",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {plan.tag}
      </div>
      <div
        style={{
          fontFamily: "var(--cw-font-display)",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {plan.name}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--cw-font-display)", fontSize: 36, fontWeight: 800, lineHeight: 1 }}>
          {plan.data}
        </span>
        <span style={{ fontSize: 12, color: isSel ? "rgba(255,255,255,0.6)" : "var(--cw-fg-3)" }}>
          GB
        </span>
      </div>
      <div
        style={{
          paddingBottom: 10,
          marginBottom: 10,
          borderBottom: `1px solid ${isSel ? "rgba(255,255,255,0.12)" : "var(--cw-border-1)"}`,
          display: "flex",
          alignItems: "baseline",
          gap: 4,
        }}
      >
        <span style={{ fontFamily: "var(--cw-font-display)", fontSize: 20, fontWeight: 700 }}>
          ${plan.price}
        </span>
        <span style={{ fontSize: 12, color: isSel ? "rgba(255,255,255,0.6)" : "var(--cw-fg-3)" }}>
          /mo
        </span>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {plan.features.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: isSel ? "rgba(255,255,255,0.8)" : "var(--cw-fg-2)",
            }}
          >
            <Ico n="check" size={11} color={isSel ? "#4ade80" : "var(--cw-purple)"} sw={3} />
            {f}
          </li>
        ))}
      </ul>
    </button>
  );
}

/* ── Status Pill ────────────────────────────────────────── */
function StatusPill({ available, label }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 12px",
        borderRadius: 999,
        background: available ? "rgba(74,222,128,0.12)" : "rgba(255,185,0,0.12)",
        border: `1px solid ${available ? "rgba(74,222,128,0.35)" : "rgba(255,185,0,0.35)"}`,
        fontFamily: "var(--cw-font-display)",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 700,
        color: available ? "#4ade80" : "var(--cw-yellow)",
      }}
    >
      <Ico n={available ? "check-circle" : "clock"} size={12} color={available ? "#4ade80" : "var(--cw-yellow)"} />
      {label}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESULT COMBINED PAGE
   Shows whichever services are available as plan sections
   ═══════════════════════════════════════════════════════════ */
export default function ResultCombinedPage({
  address,
  fiberAvailable,
  home5gAvailable,
  mobileAvailable,
  fiberDetail,
  home5gDetail,
  mobileDetail,
  onSelectPlan,
  onBack,
}) {
  console.log({city: address.city.toLowerCase()})
  const [selectedFiber, setSelectedFiber] = useState(null);
  const [selectedHome5g, setSelectedHome5g] = useState(1);
  const [selectedMobile, setSelectedMobile] = useState(1);

  const [fiberPlans, setFiberPlans] = useState([]);
  const [loadingFiberPlans, setLoadingFiberPlans] = useState(false);
  const [fiberPlansError, setFiberPlansError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const home5gPlans = [
    { id: 0, name: "Home Connect", data: "100+", price: 45, tag: "Single / light use", features: ["Unlimited data", "Home 5G gateway", "Self-install kit", "No contract"] },
    { id: 1, name: "Home Plus", data: "300+", price: 60, tag: "Most popular", popular: true, features: ["Unlimited data", "Home 5G gateway", "30GB hotspot", "Priority support"] },
    { id: 2, name: "Home Max", data: "Unlimited", price: 75, tag: "Whole home", features: ["Unlimited data", "Premium gateway", "50GB hotspot", "Mesh extender included"] },
  ];

  const mobilePlans = [
    { id: 0, name: "Go", data: "5", price: 25, tag: "Light use", features: ["Unlimited talk & text", "5G access", "WiFi calling"] },
    { id: 1, name: "Culture+", data: "Unlimited", price: 45, tag: "Best seller", popular: true, features: ["Unlimited everything", "50GB premium data", "15GB hotspot", "HD streaming"] },
    { id: 2, name: "Culture Max", data: "Unlimited", price: 55, tag: "Power user", features: ["Unlimited everything", "100GB premium data", "50GB hotspot", "4K streaming"] },
  ];

  useEffect(() => {
    if (!fiberAvailable) return;

    let active = true;
    const fetchFiberPlans = async () => {
      setLoadingFiberPlans(true);
      setFiberPlansError(null);
      setUsingFallback(false);
      try {
        const res = await fetch("/api/zoho/plans");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!active) return;

        if (data.ok && Array.isArray(data.plans)) {
          const cityLower = (address?.city || "").toLowerCase();
          const isAugusta =
            cityLower.includes("augusta") ||
            cityLower.includes("gordon") ||
            cityLower.includes("fort gordon") ||
            cityLower.includes("ft gordon");

          let filtered = data.plans;
          if (isAugusta) {
            filtered = data.plans.filter((p) =>
              (p.plan_code || "").toUpperCase().endsWith("FG")
            );
          } else {
            filtered = data.plans.filter((p) =>
              !(p.plan_code || "").toUpperCase().endsWith("FG")
            );
          }

          const mappedPlans = filtered.map((p) => {
            const nameUpper = (p.name || "").toUpperCase();
            const codeUpper = (p.plan_code || "").toUpperCase();

            let speed = "100";
            let unit = "Mbps";
            let name = "Connect";
            let tag = "Streaming + work";
            let features = ["Router included", "No contract", "No deposit"];
            let popular = false;

            if (
              nameUpper.includes("1000") ||
              nameUpper.includes("1 GIG") ||
              codeUpper.includes("1000")
            ) {
              speed = "1";
              unit = "Gig";
              name = "Expand";
              tag = "Power users";
              features = [
                "Router included",
                "No contract",
                "CommandIQ App",
                "Whole-home mesh",
              ];
            } else if (nameUpper.includes("500") || codeUpper.includes("500")) {
              speed = "500";
              unit = "Mbps";
              name = "Empower";
              tag = "Family of four";
              features = [
                "Router included",
                "No contract",
                "CommandIQ App",
                "Priority support",
              ];
              popular = true;
            } else {
              speed = "100";
              unit = "Mbps";
              name = "Connect";
              tag = "Streaming + work";
              features = ["Router included", "No contract", "No deposit"];
            }

            return {
              id: p.plan_code,
              name,
              speed,
              unit,
              price: p.recurring_price,
              tag,
              features,
              popular,
              plan_code: p.plan_code,
              plan_id: p.plan_id,
              zohoUrl: p.url,
            };
          });

          // Sort plans by speed ascending (100 -> 500 -> 1000)
          mappedPlans.sort((a, b) => {
            const parseSpeedNum = (s) => (s.speed === "1" ? 1000 : parseInt(s.speed, 10) || 0);
            return parseSpeedNum(a) - parseSpeedNum(b);
          });

          setFiberPlans(mappedPlans);

          if (mappedPlans.length > 0) {
            const popPlan = mappedPlans.find((p) => p.popular);
            setSelectedFiber(popPlan ? popPlan.id : mappedPlans[0].id);
          }
        } else {
          throw new Error(data.error || "Failed to load plans from Zoho");
        }
      } catch (err) {
        console.error("Error fetching Zoho plans:", err);
        if (!active) return;
        setFiberPlansError(err.message || "Failed to load plans");
        
        // Fallback to hardcoded plans on failure
        const hardcoded = [
          { id: 0, name: "Connect", speed: "100", unit: "Mbps", price: 55, tag: "Streaming + work", features: ["Router included", "No contract", "No deposit"] },
          { id: 1, name: "Empower", speed: "500", unit: "Mbps", price: 65, tag: "Family of four", features: ["Router included", "No contract", "CommandIQ App", "Priority support"], popular: true },
          { id: 2, name: "Expand", speed: "1", unit: "Gig", price: 75, tag: "Power users", features: ["Router included", "No contract", "CommandIQ App", "Whole-home mesh"] },
        ];
        setFiberPlans(hardcoded);
        setSelectedFiber(1);
        setUsingFallback(true);
      } finally {
        if (active) {
          setLoadingFiberPlans(false);
        }
      }
    };

    fetchFiberPlans();
    return () => {
      active = false;
    };
  }, [fiberAvailable, address]);

  const anyAvailable = fiberAvailable || home5gAvailable || mobileAvailable;

  return (
    <div style={{ background: "var(--cw-bg-2)", minHeight: "100%", fontFamily: "var(--cw-font-sans)" }}>
      {/* Hero banner */}
      <div className="result-banner">
        <SignalWave style={{ position: "absolute", right: -60, top: 40, opacity: 0.16 }} />
        <div style={{ maxWidth: 760, position: "relative" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {fiberAvailable && <StatusPill available label="Fiber · On-net" />}
            {home5gAvailable && <StatusPill available label="5G Home · Available" />}
            {mobileAvailable && <StatusPill available label="5G Mobile · Available" />}
            {!fiberAvailable && <StatusPill available={false} label="Fiber · Off-net" />}
          </div>
          <h1
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: "clamp(32px,5vw,52px)",
              fontWeight: 800,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              lineHeight: 1.02,
              margin: "0 0 16px",
            }}
          >
            {fiberAvailable ? (
              <>Good news — we&rsquo;re<br /><span className="cw-gradient-text">live in your area.</span></>
            ) : (
              <>We&rsquo;ve got you<br /><span className="cw-gradient-text">covered on 5G.</span></>
            )}
          </h1>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "10px 18px",
              borderRadius: 12,
              fontSize: 15,
              color: "#fff",
            }}
          >
            <Ico n="map-pin" size={15} color="#FFB900" />
            <span>{address.formattedAddress}</span>
          </div>
          <p style={{ marginTop: 20, color: "rgba(255,255,255,0.78)", fontSize: 16, maxWidth: 560, lineHeight: 1.55 }}>
            {fiberAvailable
              ? "Pick a plan below — install in as little as 5 business days. No contract, no deposit, no nonsense."
              : "Fiber hasn't reached your block yet, but you're covered by our nationwide 5G network."}
          </p>
        </div>
      </div>

      {/* Fiber Plans */}
      {fiberAvailable && (
        <section style={{ padding: "48px 32px 32px", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
              <div
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--cw-yellow)",
                  fontWeight: 700,
                }}
              >
                <Ico n="wifi" size={13} color="var(--cw-yellow)" /> Fiber to Home
              </div>
              {fiberDetail && (
                <span style={{ fontSize: 12, color: "var(--cw-fg-3)", fontFamily: "var(--cw-font-sans)" }}>
                  {fiberDetail}
                </span>
              )}
            </div>
            {loadingFiberPlans ? (
              <div className="card-grid-3" style={{ width: "100%" }}>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="card"
                    style={{
                      minHeight: 380,
                      background: "rgba(255,255,255,0.03)",
                      border: "1.5px solid var(--cw-border-1)",
                      borderRadius: 16,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: 24,
                      opacity: 0.6,
                      // animation: "cw-pulse 1.5s infinite ease-in-out",
                    }}
                  >
                    <div>
                      <div style={{ height: 12, width: "40%", background: "rgba(255,255,255,0.1)", borderRadius: 4, marginBottom: 12 }} />
                      <div style={{ height: 24, width: "70%", background: "rgba(255,255,255,0.1)", borderRadius: 4, marginBottom: 20 }} />
                      <div style={{ height: 50, width: "50%", background: "rgba(255,255,255,0.1)", borderRadius: 4, marginBottom: 24 }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ height: 10, width: "90%", background: "rgba(255,255,255,0.1)", borderRadius: 4 }} />
                        <div style={{ height: 10, width: "80%", background: "rgba(255,255,255,0.1)", borderRadius: 4 }} />
                        <div style={{ height: 10, width: "85%", background: "rgba(255,255,255,0.1)", borderRadius: 4 }} />
                      </div>
                    </div>
                    <div style={{ height: 36, width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: 20 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-grid-3">
                {fiberPlans.map((p) => (
                  <PlanCard key={p.id} plan={p} selected={selectedFiber === p.id} onSelect={setSelectedFiber} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5G Home Plans */}
      {home5gAvailable && (
        <section style={{ padding: "40px 32px 32px" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
              <div
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--cw-blue)",
                  fontWeight: 700,
                }}
              >
                <Ico n="wifi" size={13} color="var(--cw-blue)" /> 5G Home Internet
              </div>
              {home5gDetail && (
                <span style={{ fontSize: 12, color: "var(--cw-fg-3)", fontFamily: "var(--cw-font-sans)" }}>
                  {home5gDetail}
                </span>
              )}
            </div>
            <div className="card-grid-3">
              {home5gPlans.map((p) => (
                <MobilePlanCard key={p.id} plan={p} selected={selectedHome5g === p.id} onSelect={setSelectedHome5g} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5G Mobile Plans */}
      {mobileAvailable && (
        <section style={{ padding: "40px 32px 32px" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
              <div
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--cw-purple)",
                  fontWeight: 700,
                }}
              >
                <Ico n="smartphone" size={13} color="var(--cw-purple)" /> 5G Mobile
              </div>
              {mobileDetail && (
                <span style={{ fontSize: 12, color: "var(--cw-fg-3)", fontFamily: "var(--cw-font-sans)" }}>
                  {mobileDetail}
                </span>
              )}
            </div>
            <div className="card-grid-3">
              {mobilePlans.map((p) => (
                <MobilePlanCard key={p.id} plan={p} selected={selectedMobile === p.id} onSelect={setSelectedMobile} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section
        style={{
          padding: "24px 32px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "var(--cw-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "var(--cw-shadow-glow)",
            }}
          >
            <Ico n="check" size={22} color="#fff" sw={3} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--cw-purple)",
                fontWeight: 700,
                marginBottom: 2,
              }}
            >
              Ready to go
            </div>
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--cw-navy)",
              }}
            >
              Select a plan and continue
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={onBack}>
            Try a different address
          </button>
          <button className="btn btn-primary btn-lg" onClick={onSelectPlan}>
            Continue to checkout <Ico n="arrow-right" size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
