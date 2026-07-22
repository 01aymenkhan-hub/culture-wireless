/* ─────────────────────────────────────────────────────────────────────────────
   PlanSkeletonLoader.jsx
   Drop-in skeleton for Step3SelectPlan loading state.
   Mirrors the exact card anatomy: tag label → plan name → big metric →
   price row → feature pills → select indicator.
   ───────────────────────────────────────────────────────────────────────────── */

import React from "react";

/* ── Shimmer keyframes injected once ─────────────────────────────────────────
   Using a <style> tag inside the component so it works without a global CSS
   file. Only injected on first render via a module-level flag.              */
let shimmerInjected = false;
function ensureShimmer() {
  if (shimmerInjected || typeof document === "undefined") return;
  shimmerInjected = true;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes cw-shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    .cw-skel {
      background: linear-gradient(
        90deg,
        rgba(255,255,255,0.04) 25%,
        rgba(255,255,255,0.10) 50%,
        rgba(255,255,255,0.04) 75%
      );
      background-size: 600px 100%;
      animation: cw-shimmer 1.6s infinite linear;
      border-radius: 6px;
    }
  `;
  document.head.appendChild(style);
}

/* ── Single skeleton "pill" block ────────────────────────────────────────── */
function Skel({ w = "100%", h = 12, mb = 0, radius = 6, style: extra = {} }) {
  ensureShimmer();
  return (
    <div
      className="cw-skel"
      style={{
        width: w,
        height: h,
        marginBottom: mb,
        borderRadius: radius,
        flexShrink: 0,
        ...extra,
      }}
    />
  );
}

/* ── One skeleton plan card ──────────────────────────────────────────────── */
function SkeletonCard({ featuresCount = 3, hasBadge = false }) {
  return (
    <div
      style={{
        position: "relative",
        background: "var(--cw-bg-1)",
        border: "1.5px solid var(--cw-border-1)",
        borderRadius: 16,
        padding: 34,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* "Most Popular" badge stub */}
      {hasBadge && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: 24,
          }}
        >
          <Skel w={96} h={22} radius={999} />
        </div>
      )}

      <div>
        {/* Category tag  e.g. "STREAMING + WORK" */}
        <Skel w="55%" h={10} mb={10} />

        {/* Plan name  e.g. "CULTURE CONNECT" */}
        <Skel w="75%" h={20} mb={20} />

        {/* Big speed/data number */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
          <Skel w={80} h={52} radius={6} />
          <Skel w={44} h={14} radius={6} />
        </div>

        {/* Price row  "Starting at $XX /mo" */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginBottom: 18,
            paddingBottom: 18,
            borderBottom: "1px solid var(--cw-border-1)",
          }}
        >
          <Skel w={56} h={11} />
          <Skel w={50} h={22} />
          <Skel w={24} h={11} />
        </div>

        {/* Feature list items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: featuresCount }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* check icon circle */}
              <Skel w={12} h={12} radius={12} style={{ flexShrink: 0 }} />
              <Skel w={`${60 + (i % 3) * 10}%`} h={11} />
            </div>
          ))}
        </div>
      </div>

      {/* Select indicator row */}
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
        <Skel w={72} h={10} />
        <Skel w={20} h={20} radius={999} />
      </div>
    </div>
  );
}

/* ── Section header skeleton  (icon + label) ─────────────────────────────── */
function SkeletonSectionHeader() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <Skel w={16} h={16} radius={4} />
      <Skel w={220} h={11} />
    </div>
  );
}

/* ── Full page skeleton — mirrors the real layout exactly ────────────────── */
export default function PlanSkeletonLoader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

      {/* ── FIBER SECTION ─────────────────────────────────────────────────── */}
      <section>
        <SkeletonSectionHeader />
        {/* 3-column grid matching .card-grid-3 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
          className="card-grid-3-skel"
        >
          <SkeletonCard featuresCount={3} hasBadge={false} />
          <SkeletonCard featuresCount={4} hasBadge={true} />
          <SkeletonCard featuresCount={4} hasBadge={false} />
        </div>
      </section>

      {/* ── 5G HOME INTERNET SECTION ──────────────────────────────────────── */}
      <section>
        <SkeletonSectionHeader />
        {/* Single card, max-width 380 matching the real layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
          className="card-grid-3-skel"
        >
          <SkeletonCard featuresCount={4} hasBadge={true} />
          <SkeletonCard featuresCount={4} hasBadge={false} />
          <SkeletonCard featuresCount={4} hasBadge={false} />
        </div>
      </section>

      {/* ── 5G MOBILE SECTION ─────────────────────────────────────────────── */}
      <section>
        <SkeletonSectionHeader />
        {/*
          5 mobile plans: first row 3 cards, second row 2 cards.
          Using CSS grid auto-fill with the same column size so it wraps
          naturally, exactly like the screenshot.
        */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          <SkeletonCard featuresCount={4} hasBadge={false} />
          <SkeletonCard featuresCount={4} hasBadge={false} />
          <SkeletonCard featuresCount={4} hasBadge={true} />
          {/* empty third cell in row 2 — keeps grid balanced */}
          <div />
        </div>
      </section>

    </div>
  );
}