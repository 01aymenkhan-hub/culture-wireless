"use client";

import React, { useEffect, useState } from "react";
import { Ico, SignalWave } from "../Icons";
import PlanSkeletonLoader from "./Planskeletonloader";

/* ── Unified Plan Card Component for Fiber, Wireless & Mobile ────────────────── */
function UnifiedPlanCard({
  plan,
  selected,
  onSelect,
  badgeColor = "var(--cw-purple)",
}) {
  const isSel = selected;
  return (
    <button
      onClick={() => onSelect(plan)}
      type="button"
      className={`plan-card-flow${isSel ? " selected" : ""}`}
      style={{
        border: isSel
          ? `2px solid ${badgeColor}`
          : "1.5px solid var(--cw-border-1)",
        position: "relative",
        fontFamily: "var(--cw-font-sans)",
        transform: isSel ? "translateY(-4px)" : "translateY(0)",
        textAlign: "left",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        background: isSel ? "rgba(255,255,255,0.06)" : "var(--cw-bg-1)",
        borderRadius: 16,
        padding: 24,
        transition: "all 250ms ease",
      }}
    >
      {/* Top Tag or Popular Badge */}
      <div>
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
            Most Popular
          </div>
        )}
        <div
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: badgeColor,
            marginBottom: 6,
          }}
        >
          {plan.tag || plan.categoryLabel}
        </div>
        <div
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--cw-fg-1)",
            marginBottom: 14,
          }}
        >
          {plan.displayName || plan.name}
        </div>

        {/* Speed / Data Big Metric */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 18,
          }}
        >
          <span
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 54,
              fontWeight: 800,
              letterSpacing: "0.01em",
              lineHeight: 1,
              color: "var(--cw-fg-1)",
            }}
          >
            {plan.speed || plan.dataAmount}
          </span>
          <span
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 16,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: badgeColor,
            }}
          >
            {plan.unit || plan.dataUnit}
          </span>
        </div>

        {/* Price Section */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            marginBottom: 18,
            paddingBottom: 18,
            borderBottom: "1px solid var(--cw-border-1)",
          }}
        >
          <span style={{ fontSize: 13, color: "var(--cw-fg-3)" }}>
            Starting at
          </span>
          <span
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--cw-fg-1)",
            }}
          >
            ${plan.price}
          </span>
          <span style={{ fontSize: 13, color: "var(--cw-fg-3)" }}>/mo</span>
        </div>

        {/* Features List */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {(plan.features || []).map((f) => (
            <li
              key={f}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "var(--cw-fg-2)",
              }}
            >
              <Ico n="check" size={12} color={badgeColor} sw={3} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Select Indicator Radio */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid var(--cw-border-1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: isSel ? badgeColor : "var(--cw-fg-3)",
          }}
        >
          {isSel ? "Selected Plan" : "Select Plan"}
        </span>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: isSel
              ? `6px solid ${badgeColor}`
              : "2px solid var(--cw-border-2)",
            background: isSel ? "#fff" : "transparent",
            transition: "all 200ms ease",
          }}
        />
      </div>
    </button>
  );
}

/* ── Status Pill ────────────────────────────────────────────────── */
function StatusPill({ available, caution, label }) {
  // Three states: available (green), caution (yellow/amber), unavailable (yellow)
  let bg, border, color, icon;
  if (available && !caution) {
    bg = "rgba(74,222,128,0.12)";
    border = "rgba(74,222,128,0.35)";
    color = "#4ade80";
    icon = "check-circle";
  } else if (caution) {
    bg = "rgba(255,185,0,0.12)";
    border = "rgba(255,185,0,0.35)";
    color = "var(--cw-yellow)";
    icon = "alert-triangle";
  } else {
    bg = "rgba(255,185,0,0.12)";
    border = "rgba(255,185,0,0.35)";
    color = "var(--cw-yellow)";
    icon = "clock";
  }
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 12px",
        borderRadius: 999,
        background: bg,
        border: `1px solid ${border}`,
        fontFamily: "var(--cw-font-display)",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 700,
        color,
      }}
    >
      <Ico n={icon} size={12} color={color} />
      {label}
    </div>
  );
}

export default function Step3SelectPlan({
  address,
  coverageResult,
  selectedPlan,
  onSelectPlan,
  onNext,
  onBack,
}) {
  const [plansData, setPlansData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Single Zoho API call to fetch all plans
  useEffect(() => {
    let active = true;
    const fetchAllPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/zoho/plans");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!active) return;
        if (data.ok && Array.isArray(data.plans)) {
          setPlansData(data.plans);
        } else {
          throw new Error(data.error || "Failed to load plans from Zoho.");
        }
      } catch (err) {
        console.error("Error fetching Zoho plans:", err);
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAllPlans();
    return () => {
      active = false;
    };
  }, []);

  const fiberAvailable = coverageResult?.fiber ?? false;
  const home5gAvailable = coverageResult?.home5g ?? false;
  const mobileAvailable = coverageResult?.mobile ?? false;
  const home5gStatus = coverageResult?.home5gStatus ?? false;

  // Process Fiber Plans
  const getFiberPlans = () => {
    if (!plansData) return [];
    const cityLower = (address?.city || "").toLowerCase();
    const isAugusta =
      cityLower.includes("augusta") ||
      cityLower.includes("gordon") ||
      cityLower.includes("fort gordon") ||
      cityLower.includes("ft gordon");

    const rawFiber = plansData.filter(
      (p) =>
        p.product_id === "3390400000001023053" ||
        (p.plan_code || "").startsWith("CWG100") ||
        (p.plan_code || "").startsWith("CWG500") ||
        (p.plan_code || "").startsWith("CWG1000"),
    );

    const filtered = isAugusta
      ? rawFiber.filter((p) => (p.plan_code || "").toUpperCase().endsWith("FG"))
      : rawFiber.filter(
          (p) => !(p.plan_code || "").toUpperCase().endsWith("FG"),
        );

    const mapped = filtered.map((p) => {
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
      }

      const originalPrice = p.original_price ?? p.recurring_price;
      const addonPrice = p.addon_price ?? 0;
      const price = p.display_price ?? originalPrice + addonPrice;

      return {
        id: p.plan_code,
        category: "fiber",
        categoryLabel: "Fiber Internet",
        name: `Culture ${name}`,
        displayName: `Culture ${name}`,
        speed,
        unit,
        price,
        originalPrice,
        addonPrice,
        addon_code: p.addon_code || "CWG-GSpire",
        tag,
        features,
        popular,
        plan_code: p.plan_code,
        plan_id: p.plan_id,
        zohoUrl: p.url,
      };
    });

    mapped.sort((a, b) => {
      const numA = a.speed === "1" ? 1000 : parseInt(a.speed, 10) || 0;
      const numB = b.speed === "1" ? 1000 : parseInt(b.speed, 10) || 0;
      return numA - numB;
    });

    return mapped;
  };

  // Process Wireless (5G Home Internet) Plan: CWG5GHI
  const getWirelessPlan = () => {
    if (!plansData) return null;
    const rawWireless = plansData.find((p) => p.plan_code === "CWG5GHI");
    if (!rawWireless) return null;

    const originalPrice =
      rawWireless.original_price ?? rawWireless.recurring_price;
    const addonPrice = rawWireless.addon_price ?? 0;
    const price = rawWireless.display_price ?? originalPrice + addonPrice;

    return {
      id: "CWG5GHI",
      category: "home5g",
      categoryLabel: "5G Home Internet",
      name: "5G Home Max Unlimited",
      displayName: "5G Home Max Unlimited",
      speed: "300+",
      unit: "Mbps",
      price,
      originalPrice,
      addonPrice,
      addon_code: rawWireless.addon_code || "5GHR",
      tag: "Whole home 5G",
      features: [
        "Unlimited 5G Data",
        "Wi-Fi 6 Gateway included",
        "Self-install in 5 minutes",
        "No contracts, no data caps",
      ],
      popular: true,
      plan_code: "CWG5GHI",
      plan_id: rawWireless.plan_id,
      zohoUrl: rawWireless.url,
    };
  };

  // Process 5G Mobile Plans: CWM001 to CWM005
  const getMobilePlans = () => {
    if (!plansData) return [];
    const validCodes = ["CWM001", "CWM002", "CWM003", "CWM004", "CWM005"];
    const rawMobile = plansData.filter((p) => validCodes.includes(p.plan_code));

    const mapped = rawMobile.map((p) => {
      let dataAmount = "Unlimited";
      let dataUnit = "5G Data";
      let tag = "Best seller";
      let popular = false;

      if (p.plan_code === "CWM005") {
        dataAmount = "1GB";
        tag = "Light use";
      } else if (p.plan_code === "CWM001") {
        dataAmount = "5GB";
        tag = "Starter";
      } else if (p.plan_code === "CWM002") {
        dataAmount = "15GB";
        tag = "Essential";
        popular = true;
      } else if (p.plan_code === "CWM003") {
        dataAmount = "30GB";
        tag = "Pro";
      } else if (p.plan_code === "CWM004") {
        dataAmount = "40GB";
        tag = "Ultimate";
      }

      return {
        id: p.plan_code,
        category: "mobile",
        categoryLabel: "5G Mobile",
        name: p.name,
        displayName: p.name,
        speed: dataAmount,
        unit: dataUnit,
        price: p.recurring_price,
        originalPrice: p.recurring_price,
        addonPrice: 0,
        addon_code: null,
        tag,
        features: [
          "Nationwide 5G access",
          "Unlimited talk & text",
          "No contracts, cancel anytime",
          "eSIM or Physical SIM",
        ],
        popular,
        plan_code: p.plan_code,
        plan_id: p.plan_id,
        zohoUrl: p.url,
      };
    });

    mapped.sort((a, b) => a.price - b.price);
    return mapped;
  };

  const fiberPlans = getFiberPlans();
  const wirelessPlan = getWirelessPlan();
  const mobilePlans = getMobilePlans();

  const handleSelectPlan = (plan) => {
    onSelectPlan(plan);
  };

  return (
    <div
      style={{
        background: "var(--cw-bg-2)",
        minHeight: "100%",
      }}
    >
      <div>
        {/* Hero banner */}
        <div className="result-banner">
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <SignalWave
              style={{
                position: "absolute",
                right: -60,
                top: 40,
                opacity: 0.16,
              }}
            />
            <div style={{ maxWidth: 760, position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                {fiberAvailable && (
                  <StatusPill available label="Fiber · On-net" />
                )}
                {home5gAvailable && home5gStatus === "caution" && (
                  <StatusPill available caution label="5G Home · Caution" />
                )}
                {home5gAvailable && home5gStatus !== "caution" && (
                  <StatusPill available label="5G Home · Available" />
                )}
                {mobileAvailable && (
                  <StatusPill available label="5G Mobile · Available" />
                )}
                {!fiberAvailable && (
                  <StatusPill available={false} label="Fiber · Off-net" />
                )}
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
                  <>
                    Good news — we&rsquo;re
                    <br />
                    <span className="cw-gradient-text">live in your area.</span>
                  </>
                ) : (
                  <>
                    We&rsquo;ve got you
                    <br />
                    <span className="cw-gradient-text">covered on 5G.</span>
                  </>
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
              <p
                style={{
                  marginTop: 20,
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 20,
                  maxWidth: 560,
                  lineHeight: 1.55,
                }}
              >
                {fiberAvailable
                  ? "Pick a plan below — install in as little as 5 business days. No contract, no deposit, no nonsense."
                  : "Fiber hasn't reached your block yet, but you're covered by our nationwide 5G network."}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{ maxWidth: 1180, margin: "0 auto", paddingBottom: "40px" }}
        >
          {/* Loading State */}
          {loading && <PlanSkeletonLoader />}

          {!loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              {/* Fiber Section */}
              {fiberAvailable && fiberPlans.length > 0 && (
                <section>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >
                    <Ico n="wifi" size={16} color="var(--cw-blue)" />
                    <h2
                      style={{
                        fontFamily: "var(--cw-font-display)",
                        fontSize: 14,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--cw-blue)",
                        margin: 0,
                      }}
                    >
                      Fiber to the Home (Gigabit Speed)
                    </h2>
                  </div>
                  <div className="card-grid-3">
                    {fiberPlans.map((p) => (
                      <UnifiedPlanCard
                        key={p.id}
                        plan={p}
                        selected={selectedPlan?.id === p.id}
                        onSelect={handleSelectPlan}
                        badgeColor="var(--cw-blue)"
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Wireless (5G Home) Section */}
              {home5gAvailable && wirelessPlan && (
                <section>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >
                    <Ico n="wifi" size={16} color="var(--cw-blue)" />
                    <h2
                      style={{
                        fontFamily: "var(--cw-font-display)",
                        fontSize: 14,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--cw-blue)",
                        margin: 0,
                      }}
                    >
                      5G Home Internet
                    </h2>
                  </div>
                  <div style={{ maxWidth: 380 }}>
                    <UnifiedPlanCard
                      plan={wirelessPlan}
                      selected={selectedPlan?.id === wirelessPlan.id}
                      onSelect={handleSelectPlan}
                      badgeColor="var(--cw-blue)"
                    />
                  </div>
                </section>
              )}

              {/* Mobile Section */}
              {mobileAvailable && mobilePlans.length > 0 && (
                <section>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >
                    <Ico n="smartphone" size={16} color="var(--cw-purple)" />
                    <h2
                      style={{
                        fontFamily: "var(--cw-font-display)",
                        fontSize: 14,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--cw-purple)",
                        margin: 0,
                      }}
                    >
                      5G Mobile Plans
                    </h2>
                  </div>
                  <div className="card-grid-3">
                    {mobilePlans.map((p) => (
                      <UnifiedPlanCard
                        key={p.id}
                        plan={p}
                        selected={selectedPlan?.id === p.id}
                        onSelect={handleSelectPlan}
                        badgeColor="var(--cw-purple)"
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Footer Navigation Bar */}
          <div
            style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: "1px solid var(--cw-border-1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <button onClick={onBack} className="btn btn-ghost">
              <Ico n="arrow-left" size={14} /> Back to Address
            </button>

            <button
              onClick={onNext}
              disabled={!selectedPlan}
              className="btn btn-primary btn-lg"
              style={{
                opacity: selectedPlan ? 1 : 0.4,
                cursor: selectedPlan ? "pointer" : "not-allowed",
              }}
            >
              Continue to Customer Info <Ico n="arrow-right" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
