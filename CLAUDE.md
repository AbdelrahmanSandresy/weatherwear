# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

All commands run from the `client/` directory:

```bash
cd client
npm install        # Install dependencies
npm run dev        # Start dev server (Vite)
npm run build      # Production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Architecture Overview

**Weatherwear** is a weather-based outfit recommendation app. Users manage a personal outfit closet and get outfit suggestions based on current weather.

### Stack

- **Frontend:** React 19 + Vite 8, plain JSX (no TypeScript)
- **Routing:** React Router DOM 7
- **Backend/Auth/DB:** Supabase (project ref: `crxgvfidqlljfghtkhoi`)
- **External API:** OpenWeatherMap for weather data

### Planned Page Structure

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | App landing/description |
| `/auth` | Auth | Login + registration (dual-form) with email confirmation |
| `/closet` | Closet | CRUD for user's outfit collection |
| `/contact` | Contact | Email, phone, GitHub, LinkedIn links |
| `*` | Error | 404/error page with Home button |

### Data Model (Supabase)

- **User profiles** — linked to Supabase Auth
- **Outfits** — private per-user, sorted by creation date; fields include name, description, image, tags/categories

### Styling

CSS custom properties are defined in `client/src/index.css`. Key variables:

```css
--text, --accent (#aa3bff purple), --bg, --border
```

Use these variables throughout components rather than hardcoded color values.

### Key Implementation Notes

- `client/src/App.jsx` is currently a placeholder — replace with React Router layout and routes
- Supabase client needs initialization (create `client/src/lib/supabase.js`)
- Outfit collection should be password-protected and private per user
- Weather data comes from OpenWeatherMap API (key stored in `.env`)
- App planning docs live in `app_outline/` — consult `plan.md` and `user_journey.md` for feature requirements and user flow
