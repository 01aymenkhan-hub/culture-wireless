"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { Ico } from "../Icons";

const NAV_LINKS = [
  { path: "/fiber", label: "Home Internet" },
  { path: "/mobile", label: "Mobile" },
  { path: "/about", label: "About" },
  { path: "/support", label: "Support" },
  { path: "/account", label: "My Account" },
];

export default function Nav() {
  const pathname = usePathname();
  const [mobOpen, setMobOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLinkClick = () => {
    setMobOpen(false);
  };

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav">
          <Link href="/" className="brand" onClick={handleLinkClick}>
            <img
              src="/assets/logos/full_logo_transparent_background_250.png"
              alt="Culture Wireless"
            />
          </Link>
          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.path}
                href={l.path}
                className={pathname === l.path ? "active" : ""}
                onClick={handleLinkClick}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title="Toggle theme"
            >
              <svg
                className="ico-moon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <svg
                className="ico-sun"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            </button>
            <Link
              href="/account"
              className="btn btn-ghost btn-sm btn-hide-mob"
              onClick={handleLinkClick}
            >
              <Ico n="user" size={13} /> Account
            </Link>
            <Link
              href="/check-availability"
              className="btn btn-primary btn-sm btn-hide-mob"
              onClick={handleLinkClick}
            >
              Check Availability
            </Link>
            <button
              className="mob-toggle"
              onClick={() => setMobOpen(true)}
              aria-label="Open menu"
            >
              <Ico n="menu" size={18} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`mob-drawer${mobOpen ? " open" : ""}`}
        aria-hidden={!mobOpen}
      >
        <div className="mob-backdrop" onClick={() => setMobOpen(false)} />
        <div className="mob-panel">
          <div className="mob-panel-head">
            <img
              src="/assets/logos/full_logo_transparent_background_250.png"
              alt="Culture Wireless"
              style={{ height: 30 }}
            />
            <button
              className="mob-toggle"
              onClick={() => setMobOpen(false)}
              aria-label="Close menu"
            >
              <Ico n="x" size={18} />
            </button>
          </div>
          <nav className="mob-nav-links">
            <Link
              href="/"
              className={pathname === "/" ? "active" : ""}
              onClick={handleLinkClick}
            >
              Home <span className="mob-arrow">›</span>
            </Link>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.path}
                href={l.path}
                className={pathname === l.path ? "active" : ""}
                onClick={handleLinkClick}
              >
                {l.label}
                <span className="mob-arrow">›</span>
              </Link>
            ))}
          </nav>
          <div className="mob-cta">
            <Link
              href="/check-availability"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={handleLinkClick}
            >
              Check Availability
            </Link>
            <Link
              href="/account"
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={handleLinkClick}
            >
              My Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
