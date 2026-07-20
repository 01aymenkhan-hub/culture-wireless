/**
 * Centralized, typed-by-convention access to environment variables.
 *
 * Access env vars via this module (never `process.env.XYZ` directly) so we can
 * fail fast on missing config and keep the surface area small.
 */

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[env] Missing required environment variable "${name}". ` +
        `See .env.example for the full list.`,
    );
  }
  return value;
}

function optional(name, fallback = "") {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
}

function bool(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined || value === "") return fallback;
  return value === "true" || value === "1" || value === "yes";
}

export const env = {
  // Client-safe (only these are exposed to the browser)
  googleMapsKey: optional("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"),

  // Server-only
  eboss: {
    apiKey: optional("EBOSS_API_KEY"),
    baseUrl: optional("EBOSS_BASE_URL", "https://www.efiberboss.com"),
    carrier: optional("EBOSS_CARRIER", "Culture Wireless"),
    isConfigured: !!process.env.EBOSS_API_KEY,
  },
  coverage: {
    apiKey: optional("COVERAGE_API_KEY"),
    apiUrl: optional("COVERAGE_API_URL", "https://enterprise.coveragemap.com/api/v1"),
    isConfigured: !!process.env.COVERAGE_API_KEY,
  },
  telgoo5: {
    baseUrl: optional("TELGOO5_BASE_URL"),
    agentId: optional("TELGOO5_AGENT_ID"),
    enabled: bool("FEATURE_TELGOO5"),
    isConfigured: !!(process.env.TELGOO5_BASE_URL && process.env.TELGOO5_AGENT_ID),
  },
  zoho: {
    clientId: optional("ZOHO_CLIENT_ID"),
    clientSecret: optional("ZOHO_CLIENT_SECRET"),
    refreshToken: optional("ZOHO_REFRESH_TOKEN"),
    accountsUrl: optional("ZOHO_ACCOUNTS_URL", "https://accounts.zoho.com"),
    apiDomain: optional("ZOHO_API_DOMAIN", "https://www.zohoapis.com"),
    enabled: bool("FEATURE_ZOHO"),
    isConfigured: !!(
      process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN
    ),
  },
  supportWebhookUrl: optional("MAKE_SUPPORT_WEBHOOK_URL"),
  enableAvailabilityMocks: bool("ENABLE_AVAILABILITY_MOCKS"),
};

// Re-export required for consumers that want strict access
export { required };
