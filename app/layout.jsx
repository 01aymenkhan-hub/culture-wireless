import { Orbitron, Jost } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import LayoutClient from "./layout-client";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-jost",
});

export const metadata = {
  title: "Culture Wireless - Reliable & Affordable Connectivity",
  description:
    "Culture Wireless is on a mission to close the digital divide. We provide affordable internet services to communities that need. Available In Clayton County, GA ...",
  metadataBase: undefined,
};

// Set the initial theme BEFORE React hydrates — prevents dark/light flicker.
const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('cw-theme');
    var theme = saved;
    if (theme !== 'dark' && theme !== 'light') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${orbitron.variable} ${jost.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {googleMapsKey ? (
          <Script
            id="google-maps"
            src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places&loading=async`}
            strategy="afterInteractive"
          />
        ) : null}

        <ThemeProvider>
          <AvailabilityProvider>
            <LayoutClient>{children}</LayoutClient>
          </AvailabilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
