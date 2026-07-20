"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "cw-theme";

/**
 * Read the current theme from the DOM. The inline script in <head>
 * (see app/layout.jsx) sets `data-theme` on <html> before hydration,
 * so this returns the correct value on the very first render.
 */
function readTheme() {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

function subscribeToTheme(callback) {
  if (typeof window === "undefined") return () => {};
  // Sync when the OS-level preference changes (only when the user hasn't
  // set an explicit preference — see ThemeProvider.setTheme).
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved !== "dark" && saved !== "light") {
        const next = mql.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        callback();
      }
    } catch {
      // ignore
    }
  };
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Theme provider — dark/light with system preference detection.
 * Persists user preference to localStorage. Avoids hydration flicker by
 * reading the initial value from `<html data-theme>` (set by the inline
 * script in app/layout.jsx).
 */
export function ThemeProvider({ children }) {
  // useSyncExternalStore keeps `theme` in step with the DOM without
  // triggering `set-state-in-effect` lint errors under React 19.
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, () => "light");
  // Bump this on manual toggles so consumers re-render.
  const [tick, setTick] = useState(0);

  const setTheme = useCallback((next) => {
    try {
      document.documentElement.setAttribute("data-theme", next);
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore write errors — the DOM update still succeeded above.
    }
    setTick((n) => n + 1);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(readTheme() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, mounted: true, _tick: tick }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
