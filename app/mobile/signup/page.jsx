// Feature flag: set to true when client enables 5G Mobile purchasing
const MOBILE_PURCHASING_ENABLED = false;

export default function MobileSignupPage() {
  if (MOBILE_PURCHASING_ENABLED) {
    return (
      <TelgooProvider>
        <SignupFlow />
      </TelgooProvider>
    );
  }

  return (
    <div
      style={{
        minHeight: "85vh",
        background: "var(--cw-bg-2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        fontFamily: "var(--cw-font-sans)",
        color: "var(--cw-fg-1)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          background: "var(--cw-bg-1)",
          border: "1.5px solid var(--cw-border-1)",
          borderRadius: 24,
          padding: "48px 32px",
          boxShadow: "0 20px 48px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(255,185,0,0.12)",
            border: "1px solid var(--cw-yellow)",
            fontFamily: "var(--cw-font-display)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--cw-yellow)",
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          5G Mobile · Coming Soon
        </div>
        <h1
          style={{
            fontFamily: "var(--cw-font-display)",
            fontSize: "clamp(24px, 4.5vw, 36px)",
            fontWeight: 800,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            margin: "0 0 14px",
            lineHeight: 1.1,
          }}
        >
          Culture Mobile is <span className="cw-gradient-text">Coming Soon</span>
        </h1>
        <p
          style={{
            color: "var(--cw-fg-2)",
            fontSize: 15,
            lineHeight: 1.6,
            margin: "0 0 28px",
          }}
        >
          Online mobile line activation is not available for purchase at this time. Only Fiber Internet is currently available.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/check-availability" className="btn btn-primary">
            Check Fiber Availability
          </a>
          <a href="/mobile" className="btn btn-ghost">
            View Mobile Plans
          </a>
        </div>
      </div>
    </div>
  );
}
