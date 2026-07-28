"use client";

import React, { useState, useEffect, useRef } from "react";
import AvailTopBar from "./AvailTopBar";
import { Ico } from "../Icons";
import CoverageMap from "../CoverageMap/CoverageMap";
import ApiOrderBadge from "./ApiOrderBadge";

// Helper to parse address string if structured fields are missing
function parseAddressString(fullAddress, inputZip) {
  const parts = (fullAddress || "").split(",").map((p) => p.trim());
  let street = "";
  let city = "";
  let state = "";
  let zip = inputZip || "";

  // Remove USA / United States
  if (
    parts.length > 0 &&
    (parts[parts.length - 1].toLowerCase() === "usa" ||
      parts[parts.length - 1].toLowerCase() === "united states")
  ) {
    parts.pop();
  }

  if (parts.length >= 3) {
    street = parts[0];
    city = parts[1];
    const stateZipPart = parts[2];
    const match = stateZipPart.match(/^([A-Z]{2})\s*(\d{5})?/i);
    if (match) {
      state = match[1].toUpperCase();
      if (!zip && match[2]) {
        zip = match[2];
      }
    }
  } else if (parts.length === 2) {
    street = parts[0];
    const cityStateZip = parts[1];
    const zipMatch = cityStateZip.match(/\b\d{5}\b/);
    if (zipMatch) {
      zip = zipMatch[0];
    }
    const cleanText = cityStateZip.replace(/\b\d{5}\b/, "").trim();
    const stateMatch = cleanText.match(/\b([A-Z]{2})\b/i);
    if (stateMatch) {
      state = stateMatch[1].toUpperCase();
      city = cleanText.replace(/\b[A-Z]{2}\b/i, "").trim();
    } else {
      city = cleanText;
    }
  } else {
    street = fullAddress;
  }

  return {
    streetAddress: street || fullAddress,
    city: city || "Atlanta",
    state: state || "GA",
    zip: zip || "30308",
  };
}

export default function AddressEntryV2({ onSubmit, onBack }) {
  const [address, setAddress] = useState("");
  const [unit, setUnit] = useState("");
  const [zip, setZip] = useState("");
  const [focus, setFocus] = useState(null);
  const [showSug, setShowSug] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [googleReady, setGoogleReady] = useState(false);
  const [selectedAutocomplete, setSelectedAutocomplete] = useState(null);
  const autocompleteRef = useRef(null);
  const debounceRef = useRef(null);

  const MOCK_ADDRESSES = [
    "1247 Lakeview Drive, Riverdale, GA 30274",
    "842 Peachtree St NW, Atlanta, GA 30308",
    "5300 Memorial Dr, Stone Mountain, GA 30083",
    "1247 Lakeview Lane, Jonesboro, GA 30236",
  ];

  // Wait for Google Places to initialise
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.maps?.places) {
        autocompleteRef.current =
          new window.google.maps.places.AutocompleteService();
        setGoogleReady(true);
        clearInterval(interval);
      }
    }, 200);

    // Give up after 8s so we don't leak the timer.
    const timeout = setTimeout(() => clearInterval(interval), 8000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const fetchSuggestions = (value) => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => {
        if (googleReady && autocompleteRef.current) {
          autocompleteRef.current.getPlacePredictions(
            {
              input: value,
              componentRestrictions: { country: "us" },
              types: ["address"],
            },
            (predictions, status) => {
              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                predictions
              ) {
                setSuggestions(
                  predictions.map((p) => ({
                    placeId: p.place_id,
                    label: p.description,
                    main: p.structured_formatting?.main_text || p.description,
                    secondary: p.structured_formatting?.secondary_text || "",
                  })),
                );
              } else {
                setSuggestions([]);
              }
            },
          );
        } else {
          // Fallback mock when API key not configured
          const v = value.trim().toLowerCase();
          setSuggestions(
            MOCK_ADDRESSES.filter((s) =>
              s.toLowerCase().includes(v.slice(0, 3)),
            ).map((s) => ({
              placeId: null,
              label: s,
              main: s.split(",")[0],
              secondary: s.split(",").slice(1).join(",").trim(),
            })),
          );
        }
      },
      googleReady ? 280 : 0,
    );
  };

  const selectSuggestion = (sug) => {
    setShowSug(false);
    setSuggestions([]);
    if (sug.placeId && window.google?.maps?.places) {
      const svc = new window.google.maps.places.PlacesService(
        document.createElement("div"),
      );
      svc.getDetails(
        {
          placeId: sug.placeId,
          fields: ["formatted_address", "address_components", "geometry"],
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const addressComponents = place.address_components || [];
            let streetNumber = "";
            let route = "";
            let city = "";
            let state = "";
            let zipCode = "";

            addressComponents.forEach((component) => {
              const types = component.types;
              if (types.includes("street_number")) {
                streetNumber = component.long_name;
              }
              if (types.includes("route")) {
                route = component.long_name;
              }
              if (types.includes("locality")) {
                city = component.long_name;
              }
              if (types.includes("administrative_area_level_1")) {
                state = component.short_name; // e.g. GA
              }
              if (types.includes("postal_code")) {
                zipCode = component.short_name;
              }
            });

            const streetAddress = `${streetNumber} ${route}`.trim();
            const formattedAddress = place.formatted_address;
            const computedZip = zipCode || "";
            const lat = place.geometry?.location?.lat() || null;
            const lng = place.geometry?.location?.lng() || null;

            setAddress(formattedAddress);
            setZip(computedZip);
            setSelectedAutocomplete({
              address: formattedAddress,
              streetAddress,
              city,
              state,
              zip: computedZip,
              lat,
              lng,
            });
          }
        },
      );
    } else {
      setAddress(sug.label);
      const computedZip = sug.label.match(/\d{5}$/)?.[0] || "";
      setZip(computedZip);

      const parsed = parseAddressString(sug.label, computedZip);
      setSelectedAutocomplete({
        address: sug.label,
        streetAddress: parsed.streetAddress,
        city: parsed.city,
        state: parsed.state,
        zip: computedZip,
        lat: null,
        lng: null,
      });
    }
  };

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;

    setSaving(true);
    setSaveError(null);

    let streetAddress = "";
    let city = "";
    let state = "";
    let latitude = null;
    let longitude = null;
    const zipCode = zip.trim();

    if (selectedAutocomplete && selectedAutocomplete.address === address) {
      streetAddress = selectedAutocomplete.streetAddress;
      city = selectedAutocomplete.city;
      state = selectedAutocomplete.state;
      latitude = selectedAutocomplete.lat;
      longitude = selectedAutocomplete.lng;
    } else {
      const parsed = parseAddressString(address, zip);
      streetAddress = parsed.streetAddress;
      city = parsed.city;
      state = parsed.state;
    }

    const payload = {
      formattedAddress: address.trim(),
      streetAddress,
      unit: unit.trim(),
      city,
      state,
      zipCode,
      latitude,
      longitude,
      serviceType: "home_internet",
    };

    try {
      const res = await fetch("/api/availability/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        throw new Error(
          data.error || "Unable to save address to database. Please try again.",
        );
      }

      // Address saved to MongoDB successfully! Proceed to Step 2
      onSubmit(payload);
    } catch (err) {
      console.error("Error saving availability address to MongoDB:", err);
      setSaveError(
        err.message || "Failed to record your address. Please try again in a moment.",
      );
      setSaving(false);
    }
  };

  const canSubmit = address.trim().length > 5 && zip.trim().length === 5;

  const inputStyle = (focused, withIcon) => ({
    width: "100%",
    padding: withIcon ? "14px 16px 14px 44px" : "14px 16px",
    borderRadius: 12,
    border: `1.5px solid ${focused ? "var(--cw-purple)" : "var(--cw-border-2)"}`,
    fontFamily: "var(--cw-font-sans)",
    fontSize: 15,
    color: "var(--cw-fg-1)",
    background: "var(--cw-bg-1)",
    outline: "none",
    boxShadow: focused ? "0 0 0 4px rgba(139,105,193,0.18)" : "none",
    transition: "border-color 150ms, box-shadow 240ms",
  });

  return (
    <div
      style={{
        background: "var(--cw-bg-2)",
        minHeight: "100%",
        fontFamily: "var(--cw-font-sans)",
      }}
    >
      {/* <AvailTopBar step={1} total={3} onBack={onBack} /> */}

      <div
        style={{
          padding: "56px 32px 48px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          maxWidth: 1280,
          margin: "0 auto",
        }}
        className="two-col"
      >
        {/* Left — copy */}
        <div>
          <div
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--cw-purple)",
              marginBottom: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ico n="map-pin" size={14} color="var(--cw-purple)" />
            Coverage Check
          </div>
          <h1
            style={{
              fontFamily: "var(--cw-font-display)",
              fontSize: "clamp(32px,4vw,48px)",
              fontWeight: 700,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "var(--cw-fg-1)",
              margin: "0 0 16px",
              lineHeight: 1.05,
              textWrap: "balance",
            }}
          >
            Where should we
            <br />
            <span
              style={{
                background: "linear-gradient(90deg,#4F7BFF,#8B69C1)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              connect you?
            </span>
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--cw-fg-3)",
              margin: "0 0 28px",
              lineHeight: 1.6,
              maxWidth: 440,
            }}
          >
            Enter your address and we'll check fiber and 5G mobile availability
            in real time — automatically, in one step.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <ApiOrderBadge
              step={1}
              icon="wifi"
              color="var(--cw-yellow)"
              label="Fiber to Home"
              sub="Checked first — fastest speeds"
            />
            <div
              style={{
                paddingLeft: 28,
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "var(--cw-fg-4)",
                fontSize: 12,
              }}
            >
              <div
                style={{
                  width: 1,
                  height: 16,
                  background: "var(--cw-border-2)",
                }}
              />
              If no fiber coverage, auto-switches →
            </div>
            <ApiOrderBadge
              step={2}
              icon="smartphone"
              color="var(--cw-blue)"
              label="5G Mobile"
              sub="Nationwide — T-Mobile backbone"
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "var(--cw-fg-3)",
              fontSize: 13,
            }}
          >
            <Ico n="shield-check" size={16} color="var(--cw-purple)" />
            Address used only for coverage lookup. No spam.
          </div>
        </div>

        {/* Right — form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ display: "block" }}>
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: focus === "addr" ? "var(--cw-purple)" : "var(--cw-fg-3)",
                marginBottom: 8,
                transition: "color 150ms",
              }}
            >
              Street address
            </div>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                <Ico n="map-pin" size={18} color="var(--cw-fg-3)" />
              </span>
              <input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setSelectedAutocomplete(null); // clear stale selection on any manual edit
                  setShowSug(true);
                  fetchSuggestions(e.target.value);
                }}
                onFocus={() => {
                  setFocus("addr");
                  setShowSug(true);
                }}
                onBlur={() => {
                  setFocus(null);
                  setTimeout(() => setShowSug(false), 150);
                }}
                placeholder="Start typing your address…"
                style={inputStyle(focus === "addr", true)}
              />
              {showSug && suggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    background: "var(--cw-bg-1)",
                    border: "1px solid var(--cw-border-1)",
                    borderRadius: 12,
                    boxShadow: "0 12px 32px rgba(26,18,51,0.14)",
                    zIndex: 10,
                    overflow: "hidden",
                  }}
                  className="suggestions-box-v2"
                >
                  {suggestions.map((sug, i) => (
                    <button
                      key={sug.placeId || sug.label}
                      type="button"
                      onMouseDown={() => selectSuggestion(sug)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "11px 16px",
                        background: "var(--cw-bg-1)",
                        border: "none",
                        borderBottom:
                          i < suggestions.length - 1
                            ? "1px solid var(--cw-border-1)"
                            : "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily: "var(--cw-font-sans)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--cw-bg-2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "var(--cw-bg-1)")
                      }
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: "var(--cw-bg-3)",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ico n="map-pin" size={13} color="var(--cw-purple)" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "var(--cw-fg-1)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {sug.main}
                        </div>
                        {sug.secondary && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--cw-fg-3)",
                              marginTop: 1,
                            }}
                          >
                            {sug.secondary}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                  {googleReady && (
                    <div
                      style={{
                        padding: "7px 16px",
                        display: "flex",
                        justifyContent: "flex-end",
                        borderTop: "1px solid var(--cw-border-1)",
                        background: "var(--cw-bg-2)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--cw-fg-4)",
                          fontFamily: "var(--cw-font-sans)",
                        }}
                      >
                        Powered by{" "}
                        <span style={{ fontWeight: 700, color: "#4285F4" }}>
                          G
                        </span>
                        <span style={{ fontWeight: 700, color: "#EA4335" }}>
                          o
                        </span>
                        <span style={{ fontWeight: 700, color: "#FBBC05" }}>
                          o
                        </span>
                        <span style={{ fontWeight: 700, color: "#4285F4" }}>
                          g
                        </span>
                        <span style={{ fontWeight: 700, color: "#34A853" }}>
                          l
                        </span>
                        <span style={{ fontWeight: 700, color: "#EA4335" }}>
                          e
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </label>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <label style={{ display: "block" }}>
              <div
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:
                    focus === "unit" ? "var(--cw-purple)" : "var(--cw-fg-3)",
                  marginBottom: 8,
                }}
              >
                Apt / Unit (optional)
              </div>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                onFocus={() => setFocus("unit")}
                onBlur={() => setFocus(null)}
                placeholder="e.g. Apt 4B"
                style={inputStyle(focus === "unit")}
              />
            </label>
            <label style={{ display: "block" }}>
              <div
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:
                    focus === "zip" ? "var(--cw-purple)" : "var(--cw-fg-3)",
                  marginBottom: 8,
                }}
              >
                ZIP code
              </div>
              <input
                value={zip}
                onChange={(e) =>
                  setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
                }
                onFocus={() => setFocus("zip")}
                onBlur={() => setFocus(null)}
                placeholder="30274"
                inputMode="numeric"
                style={inputStyle(focus === "zip")}
              />
            </label>
          </div>

          {saveError && (
            <div
              role="alert"
              style={{
                marginTop: 8,
                padding: "14px 18px",
                borderRadius: 12,
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#f87171",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
                animation: "cw-pop 200ms ease-out",
              }}
            >
              <Ico n="x" size={16} color="#f87171" sw={3} />
              <span style={{ flex: 1, lineHeight: 1.4 }}>{saveError}</span>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => canSubmit && !saving && handleSubmit()}
            disabled={!canSubmit || saving}
            style={{
              marginTop: 8,
              opacity: canSubmit && !saving ? 1 : 0.6,
              pointerEvents: canSubmit && !saving ? "auto" : "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              cursor: canSubmit && !saving ? "pointer" : "not-allowed",
            }}
          >
            {saving ? (
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
                <span>Saving address…</span>
              </>
            ) : (
              <>
                <span>Check my address</span>
                <Ico n="arrow-right" size={16} />
              </>
            )}
          </button>

          <div
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              background: "var(--cw-bg-1)",
              border: "1px solid var(--cw-border-1)",
              display: "flex",
              gap: 14,
              alignItems: "center",
            }}
          >
            <Ico n="clock" size={18} color="var(--cw-purple)" />
            <div
              style={{ fontSize: 13, color: "var(--cw-fg-3)", lineHeight: 1.5 }}
            >
              <strong style={{ color: "var(--cw-fg-1)" }}>
                Takes under 5 seconds.
              </strong>{" "}
              We query the Fiber to Home database and national 5G coverage map
              live on submit.
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          background: "var(--cw-navy-deep)",
          color: "#fff",
          display: "flex",
          alignItems: "stretch",
          padding: "0 56px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
        className="stats-strip"
      >
        {[
          {
            color: "var(--cw-yellow)",
            label: "Fiber to Home",
            stat: "11 Markets",
            sub: "Live & expanding",
          },
          {
            color: "var(--cw-blue)",
            label: "5G Mobile",
            stat: "Nationwide",
            sub: "T-Mobile backbone",
          },
          {
            color: "var(--cw-purple)",
            label: "API Response",
            stat: "< 2s",
            sub: "Real-time query",
          },
          {
            color: "#4ade80",
            label: "Auto-Fallback",
            stat: "Seamless",
            sub: "Best option served",
          },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            style={{
              flex: 1,
              padding: "28px 0",
              borderRight:
                i < arr.length - 1
                  ? "1px solid rgba(255,255,255,0.07)"
                  : "none",
              paddingRight: 32,
              paddingLeft: i === 0 ? 0 : 32,
            }}
            className="stat-box"
          >
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: item.color,
                marginBottom: 6,
                fontWeight: 700,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: "var(--cw-font-display)",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "0.02em",
                color: "#fff",
                marginBottom: 2,
              }}
            >
              {item.stat}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
              {item.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Programmatic Coverage Map Panel */}
      <div
        style={{
          background: "#0A0612",
          color: "#fff",
          padding: "56px 32px 72px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--cw-purple)",
                  marginBottom: 8,
                  fontWeight: 700,
                }}
              >
                Service Coverage
              </div>
              <h3
                style={{
                  fontFamily: "var(--cw-font-display)",
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  color: "#fff",
                  margin: "0 0 8px",
                  lineHeight: 1.0,
                }}
              >
                Where we deliver.
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 14,
                  margin: 0,
                  maxWidth: 520,
                  lineHeight: 1.5,
                }}
              >
                Home fiber in 11 markets. Nationwide 5G mobile. Hover any pin
                for the city.
              </p>
            </div>
            <div className="map-legend">
              <span
                className="legend-pill"
                style={{ borderColor: "var(--cw-yellow)" }}
              >
                <span
                  className="legend-dot"
                  style={{
                    background: "var(--cw-yellow)",
                    boxShadow: "0 0 8px var(--cw-yellow)",
                  }}
                />
                Fiber Internet Markets
              </span>
              <span
                className="legend-pill"
                style={{ borderColor: "var(--cw-blue)" }}
              >
                <span
                  className="legend-dot"
                  style={{ background: "var(--cw-purple)" }}
                />
                5G Mobile (Nationwide)
              </span>
            </div>
          </div>
          <CoverageMap />
        </div>
      </div>
    </div>
  );
}
