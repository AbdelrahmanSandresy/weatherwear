# Weatherwear

A weather-based outfit recommendation app. Users build a personal closet of outfits and get intelligent suggestions based on real-time local weather.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
  - [Routing](#routing)
  - [Authentication](#authentication)
  - [Outfit Management](#outfit-management)
  - [Weather Integration](#weather-integration)
  - [Recommendation Engine](#recommendation-engine)
  - [API Layer](#api-layer)
- [Database Schema](#database-schema)
- [Design System](#design-system)
- [Environment Variables](#environment-variables)
- [Feature Status](#feature-status)

---

## Overview

Weatherwear solves the daily problem of not knowing what to wear by cross-referencing the current weather with the user's saved outfits. It fetches real-time conditions (temperature, precipitation, wind) and recommends the most appropriate top and bottom from the user's closet.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + Vite 8 |
| Routing | React Router DOM 7 |
| Backend / Auth / DB | Supabase (PostgreSQL + Auth + Storage) |
| HTTP Client | Axios |
| Weather Data | OpenWeatherMap API |
| Language | JavaScript (plain JSX, no TypeScript) |

---

## Getting Started

All commands run from the `client/` directory.

```bash
cd client
npm install       # Install dependencies
npm run dev       # Start dev server → http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

### Prerequisites

- Node.js 18+
- A Supabase project with the outfits table and `outfit-images` storage bucket (see [Database Schema](#database-schema))
- An OpenWeatherMap API key

Create `client/.env`:

```
VITE_SUPABASE_URL=https://<your-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_OPENWEATHER_KEY=<your-openweather-key>
```

---

## Project Structure

```
weatherwear/
├── client/                     # React frontend
│   └── src/
│       ├── App.jsx             # Root router and layout
│       ├── main.jsx            # React entry point
│       ├── index.css           # Global CSS variables and theme
│       ├── contexts/
│       │   ├── AuthContext.jsx     # Auth state (login / register / logout)
│       │   └── OutfitsContext.jsx  # Outfit CRUD state
│       ├── pages/
│       │   ├── HomePage.jsx        # Weather display + outfit suggestions
│       │   ├── ClosetPage.jsx      # Browse and manage all outfits
│       │   ├── AuthPage.jsx        # Login / register dual-form
│       │   ├── ContactPage.jsx     # Contact and support links
│       │   └── ErrorPage.jsx       # 404 fallback
│       ├── components/
│       │   ├── NavBar.jsx          # Top navigation bar
│       │   ├── ProtectedRoute.jsx  # Auth guard
│       │   ├── AddOutfitModal.jsx  # Create outfit form
│       │   ├── ViewOutfitModal.jsx # View / edit / delete outfit
│       │   └── ConfirmDialog.jsx   # Generic confirmation prompt
│       ├── hooks/
│       │   └── useWeather.js       # Geolocation + OpenWeatherMap fetch
│       ├── services/
│       │   └── outfitsService.js   # Outfit CRUD API calls
│       └── lib/
│           ├── supabase.js         # Supabase client
│           └── axiosClient.js      # Axios instances with auth injection
├── app_outline/                # Planning docs and wireframes
│   ├── plan.md
│   ├── user_journey.md
│   └── style_guide.md
├── supabase/migrations/        # SQL migration files
└── project_metrics.md          # Feature coverage checklist
```

---

## Architecture

### Routing

Defined in `client/src/App.jsx` using React Router DOM 7.

| Route | Page | Access |
|---|---|---|
| `/auth` | AuthPage | Public |
| `/` | HomePage | Protected |
| `/closet` | ClosetPage | Protected |
| `/contact` | ContactPage | Protected |
| `*` | ErrorPage | Public |

`ProtectedRoute` wraps any route that requires authentication. Unauthenticated users are redirected to `/auth`.

---

### Authentication

**File:** `src/contexts/AuthContext.jsx`

Wraps the app and exposes `{ user, login, register, logout }` via `useAuth()`.

| Function | Description |
|---|---|
| `login(email, password)` | Signs in with Supabase email/password auth |
| `register(email, password, metadata)` | Creates account with first name, last name, username |
| `logout()` | Signs out and clears session |

Auth state is kept in sync via `supabase.auth.onAuthStateChange`.

---

### Outfit Management

**Files:** `src/contexts/OutfitsContext.jsx`, `src/services/outfitsService.js`

Provides `{ outfits, fetchOutfits, addOutfit, updateOutfit, deleteOutfit }` via `useOutfits()`.

#### Outfit Object Shape

```javascript
{
  id,               // UUID
  name,             // string
  category,         // "Top" | "Bottom" | "Full Outfit"
  weatherCondition, // "Sunny" | "Cloudy" | "Rainy" | "Cold" | "Windy" | "Snowy"
  tempRange,        // string, e.g. "60-75°F"
  description,      // string
  imageUrl,         // public Storage URL or null
  worn,             // boolean
  wornAt,           // timestamp or null
  createdAt,        // timestamp
  userId,           // UUID
}
```

Images are stored in Supabase Storage under `outfit-images/{userId}/{uuid}.{ext}`.

---

### Weather Integration

**File:** `src/hooks/useWeather.js`

Returns `{ weather, loading, error }` where `weather` contains:

```javascript
{
  city,        // string
  tempF,       // number (Fahrenheit)
  feelsLike,   // number (Fahrenheit)
  description, // string (from OpenWeatherMap)
  condition,   // mapped condition string (see below)
  windSpeed,   // number (mph)
  humidity,    // number (%)
}
```

#### Weather Condition Mapping

| OpenWeatherMap Input | Mapped Condition |
|---|---|
| Snow | Snowy |
| Rain / Drizzle / Thunderstorm | Rainy |
| Wind > 15 mph | Windy |
| Clear | Sunny |
| Temp < 45°F | Cold |
| Everything else | Cloudy |

---

### Recommendation Engine

**File:** `src/pages/HomePage.jsx`

Selects the best-matching `Top` and `Bottom` from the user's closet for the current weather. Scoring logic:

```javascript
function scoreOutfit(outfit, condition, tempF) {
  const isRainy = condition === 'Rainy'
  // Rainy weather prioritizes condition match over temperature
  const conditionPoints = isRainy ? 2 : 1
  const tempPoints = isRainy ? 1 : 2
  let score = 0
  if (outfit.weatherCondition === condition) score += conditionPoints
  if (tempF != null) {
    const range = parseTempRange(outfit.tempRange)
    if (range && tempF >= range.min && tempF <= range.max) score += tempPoints
  }
  return score
}
```

Outfits with score > 0 are "exact matches"; the top scorer per category wins. If no outfit matches at all, the first available item in that category is shown as a fallback.

---

### API Layer

**File:** `src/lib/axiosClient.js`

Two Axios instances are created:

| Instance | Base URL | Used For |
|---|---|---|
| `apiClient` | `{SUPABASE_URL}/rest/v1` | Database reads and writes |
| `storageClient` | `{SUPABASE_URL}/storage/v1` | Image upload and delete |

Both automatically inject the current user's `Bearer` token via a request interceptor.

---

## Database Schema

### `outfits` Table

```sql
CREATE TABLE outfits (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outfit_name      VARCHAR(255) NOT NULL,
  category         VARCHAR(50),          -- 'Top' | 'Bottom' | 'Full Outfit'
  weather_condition VARCHAR(255) NOT NULL,
  temp_range       VARCHAR(50),
  description      TEXT,
  image_url        TEXT,
  worn             BOOLEAN DEFAULT false,
  worn_at          TIMESTAMP,
  created_at       TIMESTAMP DEFAULT now(),
  updated_at       TIMESTAMP DEFAULT now()
);
```

Row-level security should restrict all operations to the authenticated `user_id` owner.

### `outfit-images` Storage Bucket

- **Public read:** Yes
- **Upload path:** `{userId}/{uuid}.{ext}`
- **Policies:** Authenticated users may upload to and delete from their own folder; anyone may read.

---

## Design System

CSS custom properties are defined in `client/src/index.css` and used throughout all components.

| Variable | Value | Usage |
|---|---|---|
| `--text` | `#9ca3af` | Body text |
| `--text-h` | `#f3f4f6` | Headings |
| `--text-muted` | `#6b7280` | Secondary text |
| `--bg` | `#0f1117` | Page background |
| `--surface` | `#1a1d27` | Card and modal background |
| `--surface-hover` | `#22263a` | Hover state |
| `--border` | `#2e303a` | Dividers and borders |
| `--input-bg` | `#12141c` | Form input background |
| `--accent` | `#aa3bff` | Primary purple accent |
| `--accent-bg` | `rgba(170,59,255,0.12)` | Tinted accent backgrounds |
| `--error` | `#f87171` | Error states |
| `--success` | `#34d399` | Success states |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `VITE_OPENWEATHER_KEY` | Yes | OpenWeatherMap API key |

---

## Feature Status

| Feature | Status |
|---|---|
| User registration | Complete |
| User login / logout | Complete |
| Create outfit (with image) | Complete |
| Read outfits | Complete |
| Update outfit | Complete |
| Delete outfit | Complete |
| Image upload to Supabase Storage | Complete |
| Real-time weather fetch | Complete |
| Outfit recommendation engine | Complete |
| Protected routes | Complete |
| Closet search / filter | Complete |
| Worn toggle | Complete |
| Form validation and error handling | Complete |
