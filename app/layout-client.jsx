"use client";

import { usePathname } from "next/navigation";
import Nav from "./Components/Navigation/Nav";
import Footer from "./Components/Footer/Footer";

/**
 * Chromed shell for every route. The availability flow (`/check-availability`)
 * uses its own internal top bar and doesn't render Nav/Footer, matching the
 * original visual design where the flow occupies the full viewport.
 */
export default function LayoutClient({ children }) {
  return (
    <div>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
