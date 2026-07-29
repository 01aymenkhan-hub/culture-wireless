

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
    apiUrl: optional(
      "COVERAGE_API_URL",
      "https://enterprise.coveragemap.com/api/v1",
    ),
    isConfigured: !!process.env.COVERAGE_API_KEY,
  },
  telgoo5: {
    baseUrl: optional("TELGOO5_BASE_URL"),
    agentId: optional("TELGOO5_AGENT_ID"),
    enabled: bool("FEATURE_TELGOO5"),
    isConfigured: !!(
      process.env.TELGOO5_BASE_URL && process.env.TELGOO5_AGENT_ID
    ),
  },
  zoho: {
    orginizationId: optional("ZOHO_ORG_ID", "933083011"),
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
  mongodb: {
    uri: optional(
      "MONGODB_URI",
      "mongodb+srv://ashrafcc202:Hamira123%40%23@cluster0.ziucbb3.mongodb.net/culture-wireless",
    ),
    isConfigured: true,
  },
  smtp: {
    host: optional("SMTP_HOST", "smtp.office365.com"),
    port: parseInt(optional("SMTP_PORT", "587"), 10),
    user: optional("SMTP_USER"),
    password: optional("SMTP_PASSWORD"),
    from: optional("SMTP_FROM", "Culture Wireless <Do-not-reply@culturewireless.net>"),
    isConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
  },
};

export { required };
