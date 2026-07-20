import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            <img
              src="/assets/logos/full_logo_transparent_background_250.png"
              alt="Culture Wireless"
              style={{ filter: "brightness(10)" }}
            />
          </div>
          <div className="footer-copy" style={{ marginTop: 8 }}>
            © 2026 Culture Wireless · All rights reserved
          </div>
        </div>
        {/* <div className="footer-links">
          <Link href="/fiber">Home Internet</Link>
          <Link href="/mobile">Mobile</Link>
          <Link href="/about">About</Link>
          <Link href="/support">Support</Link>
          <Link href="/account">My Account</Link>
        </div> */}

        <div className="footer-links">
          <Link href="/fiber">Home Internet</Link>
          <Link href="/mobile">Mobile</Link>
          <Link href="/about">About</Link>
          <Link href="/support">Support</Link>
          <Link href="/account">My Account</Link>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            <span style={{ color: "var(--cw-yellow)" }}>Authentic</span> · Expert ·
            Connected
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: "var(--cw-font-display)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Unserved · Underserved · Unconnected
          </div>
        </div>
      </div>
    </footer>
  );
}