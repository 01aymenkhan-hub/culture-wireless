"use client";

import React, { useEffect, useState } from "react";
import { Ico, SignalWave } from "../Icons";
import PlanSkeletonLoader from "./Planskeletonloader";

import UnifiedPlanCard from "./UnifiedPlanCard";

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
                <StatusPill available label="Fiber · On-net" />
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
                Good news — we&rsquo;re
                <br />
                <span className="cw-gradient-text">live in your area.</span>
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
                <span>{address?.formattedAddress || address?.streetAddress}</span>
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
                Pick a plan below — install in as little as 5 business days. No contract, no deposit, no nonsense.
              </p>
            </div>
          </div>
        </div>

        <div
          className="plan-section-container"
          style={{ maxWidth: 1180, margin: "0 auto", paddingBottom: "40px" }}
        >
          {/* Loading State */}
          {loading && <PlanSkeletonLoader />}

          {/* Error State */}
          {!loading && error && (
            <div
              style={{
                background: "var(--cw-bg-1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 16,
                padding: "32px 24px",
                textAlign: "center",
                color: "var(--cw-fg-1)",
              }}
            >
              <div style={{ color: "var(--cw-error)", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                Unable to load plans
              </div>
              <p style={{ color: "var(--cw-fg-3)", fontSize: 14, margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          {!loading && !error && (
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              {/* Fiber Section */}
              {fiberPlans.length > 0 && (
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
