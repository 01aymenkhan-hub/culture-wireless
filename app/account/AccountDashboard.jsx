"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export default function AccountDashboard() {
  const { user } = useUser();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Customer";
  const email = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <main>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link href="/">culturewireless.com</Link>
            <span className="slash">/</span>
            <span>account</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <h1 className="page-h1" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>MY ACCOUNT.</h1>
            <UserButton />
          </div>
          <p className="page-lede" style={{ fontSize: 16 }}>
            Welcome back, <strong>{displayName}</strong>{email ? ` (${email})` : ""}.
          </p>
        </div>
      </div>
      <section className="page-section">
        <div className="sec-inner">
          <div className="card-grid-2" style={{ marginBottom: 24 }}>
            <div className="card" style={{ background: "var(--cw-gradient-bg)", border: "none", color: "#fff", gap: 8 }}>
              <div className="section-eyebrow" style={{ color: "inherit", opacity: 0.7 }}>Current plan</div>
              <div style={{ fontFamily: "var(--cw-font-display)", fontSize: 24, fontWeight: 700 }}>SERVICE DETAILS</div>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>Your active service, billing, and usage will appear here as account records are connected to your Clerk identity.</p>
            </div>
            <div className="card" style={{ gap: 14 }}>
              <div className="section-eyebrow">Account settings</div>
              <p style={{ margin: 0, color: "var(--cw-fg-2)" }}>Manage your profile, sign-in methods, and security settings.</p>
              <div><UserButton showName /></div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "var(--cw-fg-3)" }}>Orders created after sign-in are securely associated with your authenticated account.</p>
        </div>
      </section>
    </main>
  );
}
