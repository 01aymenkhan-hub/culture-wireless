"use client";

import { useMemo } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "../../context/ThemeContext";

const TOKENS = {
  light: {
    background: "#f7f4fb",
    surface: "#ffffff",
    input: "#f7f4fb",
    foreground: "#1a1233",
    muted: "#6b6478",
    border: "#d6cfe1",
  },
  dark: {
    background: "#1a1233",
    surface: "#221842",
    input: "#14102b",
    foreground: "#ffffff",
    muted: "rgba(255, 255, 255, 0.58)",
    border: "rgba(255, 255, 255, 0.18)",
  },
};

function createAppearance(theme) {
  const colors = TOKENS[theme] || TOKENS.light;

  return {
    variables: {
      colorPrimary: "#8b69c1",
      colorPrimaryForeground: "#ffffff",
      colorBackground: colors.background,
      colorForeground: colors.foreground,
      colorMutedForeground: colors.muted,
      colorInput: colors.input,
      colorInputForeground: colors.foreground,
      colorDanger: "#dd342a",
      colorSuccess: "#4ade80",
      colorWarning: "#ffb900",
      colorModalBackdrop: "rgba(26, 18, 51, 0.68)",
      fontFamily: "var(--cw-font-sans)",
      fontFamilyButtons: "var(--cw-font-display)",
      fontFamilyMono: "var(--cw-font-mono)",
      fontSize: "14px",
      fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
      borderRadius: "8px",
      spacing: "16px",
    },
    elements: {
      rootBox: "cw-clerk-root",
      cardBox: "cw-clerk-card-box",
      card: "cw-clerk-card",
      headerTitle: "cw-clerk-title",
      headerSubtitle: "cw-clerk-subtitle",
      socialButtonsBlockButton: "cw-clerk-social-button",
      socialButtonsBlockButtonText: "cw-clerk-social-button-text",
      dividerLine: "cw-clerk-divider-line",
      dividerText: "cw-clerk-divider-text",
      formFieldLabel: "cw-clerk-label",
      formFieldInput: "cw-clerk-input",
      formFieldInputShowPasswordButton: "cw-clerk-input-action",
      formButtonPrimary: "cw-clerk-primary-button",
      footer: "cw-clerk-footer",
      footerActionText: "cw-clerk-footer-text",
      footerActionLink: "cw-clerk-link",
      formFieldErrorText: "cw-clerk-error-text",
      alertText: "cw-clerk-alert-text",
      identityPreviewText: "cw-clerk-identity-text",
      // User profile modal: email's Primary badge and connected-account rows.
      badge: "cw-clerk-profile-badge",
      profileSectionItem: "cw-clerk-profile-item",
      profileSectionItemText: "cw-clerk-profile-item-text",
      profileSectionItemPrimary: "cw-clerk-profile-item-primary",
      profileSectionTitle: "cw-clerk-profile-section-title",
      profileSectionPrimaryButton: "cw-clerk-profile-action",
      // “Connect account” opens this menu in a portal outside the profile row.
      menuList: "cw-clerk-provider-menu",
      menuItem: "cw-clerk-provider-menu-item",
      menuItemText: "cw-clerk-provider-menu-item-text",
      userButtonAvatarBox: "cw-clerk-avatar",
      userButtonPopoverCard: "cw-clerk-user-menu",
      userButtonPopoverActionButton: "cw-clerk-user-menu-action",
      userButtonPopoverActionButtonText: "cw-clerk-user-menu-action-text",
    },
  };
}

/**
 * Clerk is deliberately nested under the existing ThemeProvider. Changing the
 * app theme re-renders this provider with matching Clerk appearance tokens.
 */
export default function ClerkThemeProvider({ children }) {
  const { theme } = useTheme();
  const appearance = useMemo(() => createAppearance(theme), [theme]);

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={appearance}
    >
      {children}
    </ClerkProvider>
  );
}
