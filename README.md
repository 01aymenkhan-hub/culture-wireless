# Culture Wireless

Culture Wireless is a community-focused ISP + MVNO offering **fiber home internet**
and **nationwide 5G mobile** to unserved, underserved, and unconnected communities.
This repository is the customer-facing marketing site + availability-check flow,
built with **Next.js 16 (App Router) + React 19**.

---

## Tech stack

| Layer            | Choice                                        |
| ---------------- | --------------------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack)            |
| Language         | JavaScript (no TypeScript)                    |
| UI               | Tailwind CSS v4 + shadcn/ui + custom tokens   |
| Icons            | Lucide (`lucide-react`)                       |
| Fonts            | Orbitron (display) + Jost (sans)              |
| Maps / autocomp. | Google Maps JavaScript API + Places           |
| Deployment       | Vercel                                        |

---

## Project structure

```
app/                              # Next.js App Router
├── layout.jsx                    # Root layout, fonts, theme init, providers
├── layout-client.jsx             # Nav + Footer shell (hidden on /check-availability)
├── globals.css                   # Design tokens + hand-written CSS system
├── page.jsx                      # Home
├── fiber/page.jsx                # Fiber marketing page
├── mobile/page.jsx               # Mobile marketing page
├── about/page.jsx
├── support/page.jsx              # Contact form (submits to /api/support)
├── account/page.jsx
├── check-availability/page.jsx   # Availability flow entry
├── context/
│   ├── ThemeContext.jsx          # Dark/light mode w/ system detection
│   └── AvailabilityContext.jsx   # Shared availability flow state
├── Components/
│   ├── Navigation/Nav.jsx
│   ├── Footer/Footer.jsx
│   ├── Icons.jsx
│   ├── CoverageMap/…
│   ├── Faq/…
│   └── Availability/
│       ├── AvailabilityFlow.jsx        # 3-step orchestrator
│       ├── AddressEntryV2.jsx          # Step 1
│       ├── SmartCheckingPage.jsx       # Step 2 (runs eBOSS + CoverageMap)
│       ├── ResultCombinedPage.jsx      # Step 3 (available)
│       ├── ResultBothUnavailablePage.jsx # Step 3 (waitlist)
│       ├── AvailTopBar.jsx
│       ├── ApiOrderBadge.jsx
│       └── NeighborhoodPanel.jsx
└── api/
    ├── fiber/route.js            # POST — eBOSS fiber availability
    ├── coverage/route.js         # POST — CoverageMap 5G/4G lookup
    ├── telgoo5/route.js          # POST — placeholder (returns 501)
    ├── support/route.js          # POST — Make.com webhook (server-side)
    └── zoho/lead/route.js        # POST — placeholder (returns 501)

components/ui/                    # shadcn/ui primitives (Tailwind)
├── button.jsx
├── card.jsx
├── input.jsx
└── label.jsx

lib/
├── config/env.js                 # Central env-var reader + validation
├── validation/availability.js    # Normalized address contract
└── api/
    ├── eboss.js                  # eBOSS fiber availability wrapper
    ├── coverageMap.js            # CoverageMap signal-strength wrapper
    ├── telgoo5.js                # Telgoo5 wrapper (disabled)
    ├── zoho.js                   # Zoho scaffold (disabled)
    └── makeWebhook.js            # Make.com webhook (support form)

public/assets/                    # Local optimized images
referenceFiles/                   # Vendor API PDFs / guides — read before editing lib/api/*
```

---

## Setup

Prerequisites: **Node 20 LTS** and **npm 10+**.

```bash
git clone https://github.com/ashraf-work/culture-wireless.git
cd culture-wireless
npm install
cp .env.example .env.local        # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

| Script            | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Start dev server with Turbopack + hot reload                |
| `npm run build`   | Build the production bundle                                 |
| `npm run start`   | Serve the production bundle                                 |
| `npm run lint`    | Run ESLint over the whole codebase                          |
| `npm run lint:fix`| ESLint with auto-fix for safe issues                        |

---

## Environment variables

All secrets are read via `lib/config/env.js`. Never call `process.env.X`
directly from route handlers or components. See [`.env.example`](./.env.example)
for the full list. Highlights:

| Variable                             | Where           | Notes                                                    |
| ------------------------------------ | --------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`    | Client          | Exposed to browser. Restrict by HTTP-referrer in prod.   |
| `EBOSS_API_KEY` / `EBOSS_BASE_URL`   | Server          | Fiber availability. See `referenceFiles/EBOSS Documentation.pdf`. |
| `EBOSS_CARRIER`                      | Server          | Defaults to `Culture Wireless`.                          |
| `COVERAGE_API_KEY` / `COVERAGE_API_URL` | Server        | 5G/4G signal strength.                                   |
| `FEATURE_TELGOO5` (+ credentials)    | Server          | `false` disables `/api/telgoo5` (returns 501).           |
| `FEATURE_ZOHO` (+ credentials)       | Server          | `false` disables Zoho endpoints (returns 501).           |
| `MAKE_SUPPORT_WEBHOOK_URL`           | Server          | Support form webhook. Empty → API returns success but flags `delivered:false`. |
| `ENABLE_AVAILABILITY_MOCKS`          | Server          | `true` returns deterministic mock data when a vendor key is missing (dev only). |

---

## Availability API flow

```
                              ┌───────────────────────┐
                              │  AvailabilityContext  │  ← state: step, address, coverageResult
                              └──────────┬────────────┘
                                         │
                                         ▼
              ┌──────────────────────────────────────────────────┐
              │  AvailabilityFlow (client)                        │
              │  step 1 → AddressEntryV2  ──── Google Places      │
              │  step 2 → SmartCheckingPage ── /api/fiber          │
              │                              ── /api/coverage      │
              │  step 3 → ResultCombined / ResultBothUnavailable   │
              └──────────────────────────────────────────────────┘
                                         │
                              server-only fetches
                                         ▼
                    ┌─────────────────┐  ┌───────────────────────┐
                    │  lib/api/eboss  │  │  lib/api/coverageMap  │
                    └─────────────────┘  └───────────────────────┘
```

**All addresses share a single normalized shape** (validated in
`lib/validation/availability.js`):

```js
{
  formattedAddress: string,   // "1247 Lakeview Drive, Riverdale, GA 30274, USA"
  streetAddress:    string,   // "1247 Lakeview Drive"
  unit:             string,   // "Apt 4B" (optional)
  city:             string,   // "Riverdale"
  state:            string,   // "GA"  (2-letter, uppercase)
  zipCode:          string,   // "30274"
  latitude:         number|null,
  longitude:        number|null,
  serviceType:     "home_internet" | "mobile" | null,
}
```

### Endpoints

| Endpoint             | Body                                              | Response                                                     |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| `POST /api/fiber`    | normalized address                                | `{ available, provider:"eboss", status, statusLabel }`      |
| `POST /api/coverage` | normalized address + `{ serviceType }`            | `{ available, provider:"coveragemap", technology, signal, coverage }` |
| `POST /api/telgoo5`  | `{ zipCode, serviceType }`                        | 501 while disabled; live shape once wired                    |
| `POST /api/support`  | `{ name, email, type?, message }`                 | `{ ok, delivered }`                                          |
| `POST /api/zoho/lead`| lead payload                                      | 501 while disabled                                           |

---

## How to add future Zoho integrations

The Zoho scaffold lives in [`lib/api/zoho.js`](./lib/api/zoho.js). It already:

1. Reads env vars from `lib/config/env.js`.
2. Handles the OAuth2 refresh-token → access-token exchange with caching.
3. Exposes a helper `zohoFetch(path, init)` that adds
   `Authorization: Zoho-oauthtoken …` and `Content-Type: application/json`.
4. Ships stub high-level operations: `createLead`, `createCustomer`,
   `createOrder`, `createWaitlistEntry`.

To wire a new operation:

```js
// lib/api/zoho.js
export async function createLead(lead) {
  if (!isZohoEnabled()) return { ok: false, disabled: true };
  const res = await zohoFetch("/crm/v6/Leads", {
    method: "POST",
    body: JSON.stringify({ data: [lead] }),
  });
  if (!res.ok) throw new Error(`Zoho createLead failed: ${res.status}`);
  return res.json();
}
```

Then expose it through a route handler in `app/api/zoho/…/route.js` — see the
existing `app/api/zoho/lead/route.js` for the pattern.

Once credentials are provisioned, set:

```
FEATURE_ZOHO=true
ZOHO_CLIENT_ID=…
ZOHO_CLIENT_SECRET=…
ZOHO_REFRESH_TOKEN=…
```

---

## UI conventions

- **Design tokens** live in `app/globals.css` (`--cw-*` variables) and drive
  both light and dark themes.
- **Dark mode**: `<html data-theme="light|dark">`. The inline script in
  `app/layout.jsx` sets this before hydration to eliminate flicker.
- **Tailwind** is layered on top of the existing CSS system. shadcn primitives
  in `components/ui/*` use `cn()` (from `lib/utils.js`) + Tailwind classes and
  are available for any new UI without breaking existing pages.
- Add `data-testid` on any new interactive element for QA (existing pages omit
  these — add them opportunistically).

---

## Deployment

Deployed to **Vercel** with the default Next.js runtime + serverless functions.

- Do not enable static export (`output: 'export'`) — the app has server-side
  API routes.
- Push env variables into the Vercel dashboard, not `.env.local`, before your
  first production deploy.
- The Google Maps key is bundled into the client (as it must be) — restrict
  it by HTTP-referrer to `culturewireless.com` (and any preview domains)
  in Google Cloud Console.

---

## Contributing checklist

Before opening a PR:

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] No hard-coded secrets, webhooks, or `console.log`s.
- [ ] Any new server API call goes through `lib/api/*`.
- [ ] Any new address shape uses `normalizeAddress` from
      `lib/validation/availability.js`.
- [ ] Any new secret was added to `.env.example` (with a blank value).
