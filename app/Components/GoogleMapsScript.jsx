"use client";

import Script from "next/script";

export default function GoogleMapsScript() {
  return (
    <Script
      id="google-maps"
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
      strategy="afterInteractive"
      onLoad={() => {
        window.dispatchEvent(new Event("google-places-ready"));
      }}
    />
  );
}