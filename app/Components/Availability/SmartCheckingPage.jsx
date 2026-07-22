"use client";

import React, { useEffect, useRef, useState } from "react";
import { Ico, SignalBars } from "../Icons";

/* -------------------------------------------------------------------------- */
/*  Presentational bits                                                       */
/* -------------------------------------------------------------------------- */
function StatusDot({ status }) {
  const bg =
    status === "pass"
      ? "#4ade80"
      : status === "fail"
        ? "#f87171"
        : status === "checking"
          ? "var(--cw-blue)"
          : "rgba(255,255,255,0.15)";

  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: 999,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "background 300ms",
      }}
    >
      {status === "pass" && <Ico n="check" size={11} color="#0f1a14" sw={3} />}
      {status === "fail" && <Ico n="x" size={10} color="#fff" sw={3} />}
      {status === "checking" && (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#fff",
            animation: "cw-pulse 900ms ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

function ApiCheckCard({ icon, iconColor, label, sub, status, detail }) {
  const isActive =
    status === "checking" || status === "pass" || status === "fail";

  return (
    <div
      style={{
        padding: "16px 20px",
        borderRadius: 14,
        background: isActive
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: isActive ? 1 : 0.5,
        transition: "opacity 400ms, background 400ms, border-color 400ms",
        position: "relative",
        overflow: "hidden",
        animation: isActive
          ? "cw-pop 300ms cubic-bezier(0.22,1,0.36,1)"
          : "none",
      }}
    >
      {status === "checking" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 3,
            background: "linear-gradient(90deg, #4F7BFF, #8B69C1)",
            borderRadius: "14px 14px 0 0",
            animation: "apiCardLoading 2.2s ease-out forwards",
          }}
        />
      )}
      {(status === "pass" || status === "fail") && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 3,
            background: status === "pass" ? "#4ade80" : "#f87171",
            borderRadius: "14px 14px 0 0",
            transition: "width 200ms",
          }}
        />
      )}

      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: `${iconColor}1A`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Ico n={icon} size={19} color={iconColor} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
            marginTop: 2,
          }}
        >
          {status === "pass"
            ? detail || "Available"
            : status === "fail"
              ? detail || "Not available"
              : sub}
        </div>
      </div>
      <StatusDot status={status} />
    </div>
  );
}

function SimpleCheckRow({ label, status }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        opacity: status === "pending" ? 0.4 : 1,
        transition: "opacity 400ms",
      }}
    >
      <StatusDot status={status} />
      <span style={{ fontSize: 14, color: "#fff" }}>{label}</span>
    </div>
  );
}

function PulseSignal() {
  return (
    <div
      style={{
        width: 120,
        height: 120,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 8px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid var(--cw-blue)",
            opacity: 0,
            animation: `cw-ring 2.4s ease-out ${i * 0.8}s infinite`,
          }}
        />
      ))}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #4F7BFF, #8B69C1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(79,123,255,0.45)",
          zIndex: 1,
        }}
      >
        <SignalBars size={26} color="#fff" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Availability API helpers                                                  */
/* -------------------------------------------------------------------------- */
async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({}));
}

function formatCoverageDetail(data, label) {
  if (data?.available) {
    const sig = typeof data.signal === "number" ? `${data.signal} dBm` : "";
    const cov =
      typeof data.coverage === "number"
        ? `${Math.round(data.coverage * 100)}% coverage`
        : "";
    const bits = [sig, cov].filter(Boolean).join(", ");
    if (data.status === "caution") {
      return bits
        ? `${label} qualified with caution (${bits})`
        : `${label} qualified with caution`;
    }
    return bits ? `${label} available (${bits})` : `${label} available`;
  }
  return data?.error ? `${label} not available (${data.error})` : `${label} not available`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* -------------------------------------------------------------------------- */
/*  SmartCheckingPage — sequential geocode → fiber → 5G home → mobile         */
/* -------------------------------------------------------------------------- */
export default function SmartCheckingPage({
  address,
  onComplete,
  autoAdvance = true,
}) {
  const [phase, setPhase] = useState("geocode");
  const [results, setResults] = useState({
    geocode: null,
    fiber: null,
    home5g: null,
    mobile: null,
  });
  const [details, setDetails] = useState({
    fiber: "",
    home5g: "",
    mobile: "",
  });
  const completedRef = useRef(false);

  const getStatus = (key) => {
    if (results[key]) return results[key];
    if (phase === key) return "checking";
    return "pending";
  };

  useEffect(() => {
    let cancelled = false;

    const runChecks = async () => {
      // Address payload used by every downstream API. Server helpers accept both
      // normalized (streetAddress, zipCode...) and legacy field names.
      const payload = {
        formattedAddress: address?.formattedAddress || "",
        streetAddress: address?.streetAddress || "",
        unit: address?.unit || "",
        city: address?.city || "",
        state: address?.state || "",
        zipCode: address?.zipCode || "",
        latitude: address?.latitude ?? null,
        longitude: address?.longitude ?? null,
      };

      // Phase 1 — geocoding (already done in AddressEntryV2 for real addresses)
      await delay(600);
      if (cancelled) return;
      setResults((r) => ({ ...r, geocode: "pass" }));
      setPhase("fiber");

      // Phase 2 — Fiber via eBOSS
      let fiberResult = "fail";
      let fiberDetail = "";
      try {
        const data = await postJson("/api/fiber", payload);
        fiberResult = data.available ? "pass" : "fail";
        if (data.available) {
          fiberDetail = `On-net — Premise is ${data.statusLabel || "serviceable"}`;
        } else if (data.error) {
          fiberDetail = data.error.includes("404")
            ? "Off-net — Premise not found"
            : "Off-net — Fiber not available";
        } else {
          fiberDetail = "Off-net — Fiber not available";
        }
      } catch {
        fiberDetail = "Off-net — Connection error";
      }
      if (cancelled) return;
      setDetails((d) => ({ ...d, fiber: fiberDetail }));
      setResults((r) => ({ ...r, fiber: fiberResult }));
      setPhase("home5g");

      // Phase 3 — 5G Home via CoverageMap
      let home5gResult = "fail";
      let home5gDetail = "";
      let home5gStatus = "unavailable";
      try {
        const data = await postJson("/api/coverage", {
          ...payload,
          serviceType: "home_internet",
        });
        home5gResult = data.available ? "pass" : "fail";
        home5gStatus = data.status || (data.available ? "available" : "unavailable");
        home5gDetail = formatCoverageDetail(data, "5G Home");
      } catch {
        home5gDetail = "5G Home not available (Error)";
      }
      if (cancelled) return;
      setDetails((d) => ({ ...d, home5g: home5gDetail }));
      setResults((r) => ({ ...r, home5g: home5gResult }));
      setPhase("mobile");

      // Phase 4 — 5G Mobile via CoverageMap
      let mobileResult = "fail";
      let mobileDetail = "";
      try {
        const data = await postJson("/api/coverage", {
          ...payload,
          serviceType: "mobile",
        });
        mobileResult = data.available ? "pass" : "fail";
        mobileDetail = formatCoverageDetail(data, "5G Mobile");
      } catch {
        mobileDetail = "5G Mobile not available (Error)";
      }
      if (cancelled) return;
      setDetails((d) => ({ ...d, mobile: mobileDetail }));
      setResults((r) => ({ ...r, mobile: mobileResult }));
      setPhase("done");

      if (autoAdvance && !completedRef.current) {
        await delay(600);
        if (cancelled) return;
        completedRef.current = true;
        onComplete({
          fiber: fiberResult === "pass",
          home5g: home5gResult === "pass",
          home5gStatus,
          mobile: mobileResult === "pass",
          fiberDetail,
          home5gDetail,
          mobileDetail,
        });
      }
    };

    runChecks();
    return () => {
      cancelled = true;
    };
    // Intentionally run once on mount; downstream helpers all read from `address` at time of call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allDone = phase === "done";
  const displayAddress = address?.formattedAddress || "";

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #1A1233 0%, #0A0612 100%)",
        minHeight: 820,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 32px",
        fontFamily: "var(--cw-font-sans)",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 480, width: "100%" }}>
        <PulseSignal />

        <div
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--cw-blue)",
            margin: "20px 0 10px",
          }}
        >
          {allDone ? "Scan complete" : "Scanning your coverage"}
        </div>

        <h2
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: "clamp(24px,4vw,36px)",
            fontWeight: 700,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            margin: "0 0 12px",
            lineHeight: 1.1,
          }}
        >
          {allDone ? (
            <>
              Results are
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg,#4F7BFF,#8B69C1)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ready.
              </span>
            </>
          ) : (
            <>
              Checking your
              <br />
              address now…
            </>
          )}
        </h2>

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 14,
            margin: "0 0 32px",
          }}
        >
          {displayAddress}
        </p>

        <SimpleCheckRow
          label="Geocoding address"
          status={getStatus("geocode")}
        />

        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            margin: "8px 0 16px",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <ApiCheckCard
            icon="wifi"
            iconColor="#FFB900"
            label="Fiber to Home"
            sub="Querying eBOSS…"
            status={getStatus("fiber")}
            detail={
              details.fiber ||
              (getStatus("fiber") === "pass"
                ? "On-net — Fiber available"
                : "Off-net — Fiber not available")
            }
          />
          <ApiCheckCard
            icon="wifi"
            iconColor="var(--cw-blue)"
            label="5G Home Internet"
            sub="Querying CoverageMap…"
            status={getStatus("home5g")}
            detail={
              details.home5g ||
              (getStatus("home5g") === "pass"
                ? "5G Home available"
                : "5G Home not available")
            }
          />
          <ApiCheckCard
            icon="smartphone"
            iconColor="var(--cw-purple)"
            label="5G Mobile"
            sub="Querying CoverageMap…"
            status={getStatus("mobile")}
            detail={
              details.mobile ||
              (getStatus("mobile") === "pass"
                ? "5G Mobile available"
                : "5G Mobile not available")
            }
          />
        </div>

        {allDone && !autoAdvance && (
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              if (!completedRef.current) {
                completedRef.current = true;
                onComplete({
                  fiber: results.fiber === "pass",
                  home5g: results.home5g === "pass",
                  home5gStatus: home5gStatus || "unavailable",
                  mobile: results.mobile === "pass",
                  fiberDetail: details.fiber,
                  home5gDetail: details.home5g,
                  mobileDetail: details.mobile,
                });
              }
            }}
            style={{
              marginTop: 28,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              width: "100%",
            }}
          >
            <span>View results</span>
            <Ico n="arrow-right" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
