"use client";

import { useState } from "react";

export default function CoverageMap() {
  const [hovered, setHovered] = useState(null);

  const cities = [
    { name: "L.A. County, CA", lng: -118.24, lat: 34.05, ox: 0, oy: -38 },
    { name: "Denver, CO", lng: -104.99, lat: 39.74, ox: 0, oy: -38 },
    { name: "Jackson, MS", lng: -90.18, lat: 32.3, ox: -66, oy: 0 },
    { name: "Birmingham, AL", lng: -86.8, lat: 33.52, ox: 0, oy: -38 },
    { name: "Detroit, MI", lng: -83.05, lat: 42.33, ox: 66, oy: 0 },
    { name: "Columbus, OH", lng: -82.99, lat: 39.96, ox: -66, oy: 0 },
    { name: "Atlanta, GA", lng: -84.39, lat: 33.75, ox: 66, oy: 0 },
    { name: "Miami, FL", lng: -81.25, lat: 26.3, ox: -62, oy: 0, ppx: 80 },
    { name: "Baltimore, MD", lng: -76.61, lat: 39.29, ox: 62, oy: 0 },
    { name: "Philadelphia, PA", lng: -75.17, lat: 39.95, ox: 0, oy: -38 },
  ];

  const W = 960;
  const H = 600;
  const VX = 0;
  const VY = 0;
  const VW = 960;
  const VH = 600;
  const LNG0 = -124.7;
  const LNG1 = -66.9;
  const LAT0 = 49.4;
  const LAT1 = 24.5;
  const ML = 42;
  const MR = 928;
  const MT = 21;
  const MB = 562;

  const mercY = (φ) => Math.log(Math.tan(Math.PI / 4 + (φ * Math.PI) / 360));
  const MY0 = mercY(LAT0);
  const MY1 = mercY(LAT1);

  const project = (lng, lat) => [
    ML + ((lng - LNG0) / (LNG1 - LNG0)) * (MR - ML),
    MT + ((MY0 - mercY(lat)) / (MY0 - MY1)) * (MB - MT),
  ];

  const svgCities = cities.map((c) => {
    const [px, py] = project(c.lng, c.lat);
    const cpx = px + (c.ppx || 0);
    const cpy = py + (c.ppy || 0);
    const lx = cpx + (c.ox || 0);
    const ly = cpy + (c.oy || 0);
    const tw = c.name.length * 6.2 + 16;
    return { ...c, px: cpx, py: cpy, lx, ly, tw };
  });

  return (
    <div className="map-wrap">
      <svg
        id="cw-map-svg"
        viewBox={`${VX} ${VY} ${VW} ${VH}`}
        width="100%"
        style={{ display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="cw-map-filter"
            colorInterpolationFilters="sRGB"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <feColorMatrix type="hueRotate" values="288" result="hue" />
            <feColorMatrix type="saturate" values="0.9" in="hue" result="sat" />
            <feComponentTransfer in="sat">
              <feFuncR type="linear" slope="0.95" />
              <feFuncG type="linear" slope="0.95" />
              <feFuncB type="linear" slope="0.95" />
            </feComponentTransfer>
          </filter>
          <filter id="pin-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill="#000" />
        <image
          href="/assets/CoverageMap.png"
          x="0"
          y="0"
          width={W}
          height={H}
          preserveAspectRatio="xMidYMid slice"
          filter="url(#cw-map-filter)"
        />
        <g filter="url(#pin-glow)">
          {svgCities.map((c, i) => (
            <g
              key={c.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={c.px.toFixed(1)}
                cy={c.py.toFixed(1)}
                r="26"
                fill="#FFB900"
                opacity="0.18"
              />
              <circle
                cx={c.px.toFixed(1)}
                cy={c.py.toFixed(1)}
                r="12"
                fill="#FFB900"
                opacity="0.45"
              />
              <circle
                cx={c.px.toFixed(1)}
                cy={c.py.toFixed(1)}
                r="5.5"
                fill="#FFE066"
              />
              {(c.ox || c.oy) && (
                <line
                  x1={c.px.toFixed(1)}
                  y1={c.py.toFixed(1)}
                  x2={c.lx.toFixed(1)}
                  y2={c.ly.toFixed(1)}
                  stroke="#FFB900"
                  strokeWidth="1"
                  opacity="0.5"
                />
              )}
              <rect
                x={(c.lx - c.tw / 2).toFixed(1)}
                y={(c.ly - 12).toFixed(1)}
                width={c.tw.toFixed(1)}
                height="22"
                rx="5"
                fill="rgba(0,0,0,0.88)"
              />
              <text
                x={c.lx.toFixed(1)}
                y={(c.ly + 5).toFixed(1)}
                fill={hovered === i ? "#FFE066" : "#FFB900"}
                fontFamily="system-ui,sans-serif"
                fontSize="10.5"
                fontWeight="700"
                textAnchor="middle"
              >
                {c.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}