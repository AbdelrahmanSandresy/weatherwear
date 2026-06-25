# Weatherwear — Project Metrics

Weather-based outfit recommendation app — grading reference for CRUD + Auth requirements.

**Stack:** Vite 8 + React 19 · React Router DOM 7 · Axios 1.18 · Supabase

---

## Quick Start

```bash
# Install dependencies
cd client
npm install

# Create environment file
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_OPENWEATHER_KEY

# Start dev server
npm run dev    # → http://localhost:5173

# Build for production
npm run build
```

---

## Tech Stack

| Dependency | Version | Usage |
|---|---|---|
| Vite + React | 8.0 / 19.2 | JSX, `@vitejs/plugin-react` |
| React Router DOM | 7.18 | `BrowserRouter`, protected routes via `ProtectedRoute` |
| Axios | 1.18 | Two instances — Supabase REST API + Storage; auth-injection interceptor |
| Supabase JS SDK | 2.108 | Auth (signUp / signIn / signOut) + Postgres DB + Storage bucket |

---

## Authentication Checklist

| Requirement | Status | Where to find it |
|---|---|---|
| Register | ✅ Pass | `AuthPage.jsx` — "Register" tab; fields: first name, last name, username, email, password, confirm password; calls `supabase.auth.signUp()` with user metadata |
| Login | ✅ Pass | `AuthPage.jsx` — "Sign In" tab; email + password with client-side validation; calls `supabase.auth.signInWithPassword()` |
| Logout | ✅ Pass | "Log out" button in `NavBar.jsx` — calls `supabase.auth.signOut()`, redirects to `/auth` |


---

## CRUD Resource — Outfits

| Operation | Status | Where to find it |
|---|---|---|
| Create | ✅ Pass | `AddOutfitModal.jsx` → `outfitsService.createOutfit()` — POST to `/rest/v1/outfits` via Axios. Optional image upload to Supabase Storage. |
| Read | ✅ Pass | `outfitsService.fetchOutfits()` — GET filtered by `user_id`, ordered by `created_at desc`. Displayed in `ClosetPage.jsx` and `HomePage.jsx`. |
| Update | ✅ Pass | `ViewOutfitModal.jsx` → `outfitsService.updateOutfit()` — PATCH by `id`. Editable: name, category, condition, temp range, description, photo, worn status. |
| Delete | ✅ Pass | `ViewOutfitModal.jsx` → `outfitsService.deleteOutfit()` — DELETE by `id`. Confirm dialog shown first. Associated image removed from Storage. |

---

## Dynamic UI & Error Handling

| Requirement | Status | Where to find it |
|---|---|---|
| Dynamic UI | ✅ Pass | Live search/filter in closet; weather-driven outfit pair suggestions update on load; loading states throughout; React Router protected routes redirect unauthenticated users. |
| Error handling | ✅ Pass | Field-level validation on all forms; server errors surfaced inline; Axios response interceptor extracts HTTP error messages (`axiosClient.js`); location-denied and weather-fetch-fail states handled; 404 `ErrorPage.jsx` on unknown routes. |

---

## Application Routes

| Path | Page | Access | Description |
|---|---|---|---|
| `/auth` | AuthPage | Public | Login + Register (dual-form) |
| `/` | HomePage | Protected | Live weather + outfit pair suggestion |
| `/closet` | ClosetPage | Protected | Full CRUD for outfit collection |
| `/contact` | ContactPage | Protected | Developer contact info |
| `*` | ErrorPage | Public | 404 catch-all with Home button |

---

## Key File Locations

```
client/src/
├── App.jsx                    # Router layout + protected route wiring
├── contexts/
│   ├── AuthContext.jsx         # login / register / logout + session state
│   └── OutfitsContext.jsx      # outfit state + CRUD methods
├── services/
│   └── outfitsService.js       # Axios calls to Supabase REST + Storage
├── lib/
│   ├── axiosClient.js          # Axios instances with auth + error interceptors
│   └── supabase.js             # Supabase client init
├── hooks/
│   └── useWeather.js           # OpenWeatherMap fetch + condition mapping
├── pages/
│   ├── AuthPage.jsx            # Login + register
│   ├── HomePage.jsx            # Weather + outfit suggestions
│   ├── ClosetPage.jsx          # Outfit list + search
│   ├── ContactPage.jsx         # Contact info
│   └── ErrorPage.jsx           # 404
└── components/
    ├── AddOutfitModal.jsx       # Create outfit
    ├── ViewOutfitModal.jsx      # View / edit / delete outfit
    ├── NavBar.jsx               # Navigation + logout
    ├── ProtectedRoute.jsx       # Auth guard
    └── ConfirmDialog.jsx        # Delete confirmation
```
