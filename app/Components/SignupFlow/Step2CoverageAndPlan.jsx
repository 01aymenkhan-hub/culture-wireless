"use client";

import React, { useState, useEffect } from "react";
import { checkServiceAvailability, getPlanList } from "../../../services/telgoo";
import { Ico } from "../Icons";
import PlanSkeletonLoader from "../Availability/Planskeletonloader";
import UnifiedPlanCard from "../Availability/UnifiedPlanCard";

export default function Step2CoverageAndPlan({
  enrollmentData,
  updateEnrollmentData,
  onNext,
  onBack,
}) {
  const [zipCode, setZipCode] = useState(enrollmentData.zipCode || "");
  const [phase, setPhase] = useState(enrollmentData.enrollmentId ? "plans" : "zip");
  
  const [checkingCoverage, setCheckingCoverage] = useState(false);
  const [coverageError, setCoverageError] = useState(null);

  const [loadingPlans, setLoadingPlans] = useState(false);
  const [plansError, setPlansError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(enrollmentData.selectedPlan || null);

  useEffect(() => {
    if (phase === "plans" && enrollmentData.zipCode) {
      fetchPlans(enrollmentData.zipCode);
    }
  }, [phase]);

  const handleZipSubmit = async (e) => {
    e.preventDefault();
    const cleanZip = zipCode.trim();
    if (cleanZip.length !== 5 || !/^\d{5}$/.test(cleanZip)) {
      setCoverageError("Please enter a valid 5-digit ZIP code.");
      return;
    }

    setCheckingCoverage(true);
    setCoverageError(null);

    const result = await checkServiceAvailability(cleanZip);

    setCheckingCoverage(false);

    if (result.ok && result.enrollmentId) {
      updateEnrollmentData("zipCode", cleanZip);
      updateEnrollmentData("enrollmentId", result.enrollmentId);
      setPhase("plans");
      fetchPlans(cleanZip);
    } else {
      setCoverageError(result.error || "Sorry, we don't have coverage in this area yet.");
    }
  };

  const fetchPlans = async (zip) => {
    setLoadingPlans(true);
    setPlansError(null);

    const result = await getPlanList(zip);
    setLoadingPlans(false);

    if (result.ok && result.plans && result.plans.length > 0) {
      setPlans(result.plans);
      if (!selectedPlan) {
        setSelectedPlan(result.plans[0]);
        updateEnrollmentData("selectedPlan", result.plans[0]);
      }
    } else {
      setPlansError(result.error || "Failed to load plans for your area.");
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    updateEnrollmentData("selectedPlan", {
      plan_id: plan.plan_id,
      plan_code: plan.plan_code,
      plan_name: plan.plan_name,
      amount: plan.amount,
      data_allowance: plan.data_allowance,
    });
  };

  const handleContinueToStep3 = () => {
    if (selectedPlan) {
      onNext();
    }
  };

  return (
    <div style={{ background: "var(--cw-bg-2)", minHeight: "100%", padding: "40px 24px 60px" }}>
      <div style={{ maxWidth: phase === "plans" ? 1180 : 680, margin: "0 auto", transition: "all 300ms ease" }}>

        {/* Phase A — ZIP Code Entry */}
        {phase === "zip" && (
          <div>
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
                LET'S SEE IF YOU HAVE <span className="cw-gradient-text">COVERAGE</span>
              </h1>
              <p style={{ color: "var(--cw-fg-2)", fontSize: 15, lineHeight: 1.6 }}>
                Get Started with Culture Wireless. Enter the ZIP Code where you'll use this service.
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
              <form onSubmit={handleZipSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
                    Enter Your ZIP Code *
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="e.g. 30274"
                      value={zipCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setZipCode(val);
                        setCoverageError(null);
                      }}
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        borderRadius: 10,
                        background: "var(--cw-bg-3)",
                        border: "1px solid var(--cw-border-1)",
                        color: "var(--cw-fg-1)",
                        fontSize: 18,
                        fontFamily: "var(--cw-font-display)",
                        fontWeight: 700,
                        textAlign: "center",
                        letterSpacing: "0.1em",
                        outline: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        right: 16,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--cw-fg-3)",
                      }}
                    >
                      <Ico n="map-pin" size={20} />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {coverageError && (
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 12,
                      background: "rgba(239, 68, 68, 0.12)",
                      border: "1px solid rgba(239, 68, 68, 0.4)",
                      color: "#f87171",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Ico n="x" size={16} color="#f87171" sw={3} />
                    <span>{coverageError}</span>
                  </div>
                )}

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={zipCode.length !== 5 || checkingCoverage}
                  className="btn btn-primary btn-lg"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    opacity: zipCode.length === 5 && !checkingCoverage ? 1 : 0.4,
                    cursor: zipCode.length === 5 && !checkingCoverage ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {checkingCoverage ? (
                    <>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          animation: "cwSpin 0.8s linear infinite",
                        }}
                      />
                      <span>Checking Coverage…</span>
                    </>
                  ) : (
                    <>
                      <span>Check Coverage & View Plans</span>
                      <Ico n="arrow-right" size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Phase B — Plan Selection */}
        {phase === "plans" && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "rgba(74,222,128,0.12)",
                  border: "1px solid rgba(74,222,128,0.4)",
                  color: "#4ade80",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                <Ico n="check-circle" size={16} color="#4ade80" />
                <span>Coverage Verified for ZIP {zipCode}</span>
                {enrollmentData.enrollmentId && (
                  <span style={{ color: "var(--cw-fg-3)", marginLeft: 4 }}>({enrollmentData.enrollmentId})</span>
                )}
              </div>
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
                Select Your <span className="cw-gradient-text">Mobile Plan</span>
              </h1>
              <p style={{ color: "var(--cw-fg-2)", fontSize: 15, maxWidth: 580, margin: "0 auto" }}>
                All plans include 5G nationwide speed, unlimited talk & text, Wi-Fi calling, and mobile hotspot with no contracts.
              </p>
            </div>

            {/* Skeleton Loading Experience matching Check Availability */}
            {loadingPlans && <PlanSkeletonLoader />}

            {/* Error Message */}
            {plansError && (
              <div
                style={{
                  marginBottom: 24,
                  padding: "16px 20px",
                  borderRadius: 14,
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#f87171",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{plansError}</span>
                <button
                  onClick={() => fetchPlans(zipCode)}
                  className="btn btn-ghost btn-sm"
                  style={{ color: "#f87171", border: "1px solid rgba(239,68,68,0.4)" }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Plan Cards Grid matching Check Availability Step3SelectPlan */}
            {!loadingPlans && plans.length > 0 && (
              <div>
                <div className="card-grid-3">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan?.plan_id === plan.plan_id;

                    /* Map Telgoo plan shape → UnifiedPlanCard shape */
                    const cardPlan = {
                      ...plan,
                      displayName: plan.plan_name,
                      name: plan.plan_name,
                      tag: plan.plan_code || "5G Mobile",
                      price: plan.amount,
                      speed: plan.data_allowance ? plan.data_allowance.split(" ")[0] : "5GB",
                      unit: plan.data_allowance ? plan.data_allowance.split(" ").slice(1).join(" ") || "5G Data" : "5G Data",
                      features: plan.features || [
                        "Nationwide 5G access",
                        "Unlimited talk & text",
                        "No contracts, cancel anytime",
                        "eSIM or Physical SIM",
                      ],
                      popular: plan.featured || false,
                    };

                    return (
                      <UnifiedPlanCard
                        key={plan.plan_id}
                        plan={cardPlan}
                        selected={isSelected}
                        onSelect={() => handleSelectPlan(plan)}
                        badgeColor="var(--cw-purple)"
                      />
                    );
                  })}
                </div>

                {/* Bottom Action Bar */}
                <div
                  style={{
                    marginTop: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <button onClick={onBack} className="btn btn-ghost">
                    <Ico n="arrow-left" size={14} /> Back to Device Selection
                  </button>

                  <button
                    onClick={handleContinueToStep3}
                    disabled={!selectedPlan}
                    className="btn btn-primary btn-lg"
                    style={{
                      opacity: selectedPlan ? 1 : 0.4,
                      cursor: selectedPlan ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span>Continue to Your Number</span>
                    <Ico n="arrow-right" size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
