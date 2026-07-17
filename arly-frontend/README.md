# ARLY — AI Product Finder (Frontend)

A modern e-commerce price comparison SPA built with React 19, TypeScript, Tailwind CSS v4, and Supabase auth.

Users paste a Nepali product link and ARLY extracts pricing data from 10+ local retailers, then compares prices across stores to find the cheapest option.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript 6 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 + PostCSS |
| Auth | Supabase (email/password + Google OAuth) |
| Icons | Lucide React + React Icons |
| Animation | Framer Motion |
| Build | Vite ( Rolldown ) |

## Project Structure

```
arly-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx              # Sticky nav with profile dropdown
│   │   ├── PageTransition.tsx      # Framer Motion page wrapper
│   │   ├── ProductCard.tsx         # Extracted product display card
│   │   ├── UrlInputHub.tsx         # URL paste input form
│   │   └── home/                   # Landing page section components
│   │       ├── Statsstrip.tsx
│   │       ├── Problemsolution.tsx
│   │       ├── Pipelineflow.tsx
│   │       ├── Projectstructure.tsx
│   │       └── Prosgrid.tsx
│   ├── context/
│   │   └── AuthContext.tsx         # Auth provider (login, register, logout, premium)
│   ├── lib/
│   │   └── supabase.ts            # Supabase browser client
│   ├── pages/
│   │   ├── home.tsx                # Landing page with URL input
│   │   ├── about.tsx               # Project overview
│   │   ├── result.tsx              # Scraping results + price comparison
│   │   ├── login.tsx               # Email/password + Google OAuth login
│   │   ├── register.tsx            # User registration
│   │   ├── admin-dashboard.tsx     # Admin analytics (role-gated)
│   │   ├── purchase.tsx            # Diamond VIP upgrade checkout
│   │   └── footer.tsx              # Shared footer
│   ├── types/
│   │   ├── product.ts              # ProductData, CompareResponse types
│   │   └── user.ts                 # User, UserProfile, Session types
│   ├── App.tsx                     # Root router + AuthProvider
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Tailwind directives + global styles
├── .env                            # Supabase keys (gitignored)
├── vite.config.ts                  # Vite config with API proxy rules
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Routes

| Path | Page | Access |
|---|---|---|
| `/` | Home (URL input hub) | Public |
| `/result?url=...` | Scraping results + comparison | Public |
| `/about` | Project overview | Public |
| `/login` | Email/password + Google OAuth | Public |
| `/register` | User registration | Public |
| `/admin/dashboard` | Admin analytics dashboard | Admin only |
| `/purchase` | Diamond VIP upgrade | Authenticated |

## API Proxy Configuration

The Vite dev server proxies requests to three backend services:

| Frontend Path | Backend Service | Port |
|---|---|---|
| `/api/auth/*` | Next.js (auth routes) | 3000 |
| `/api/purchase/*` | Next.js (webhook mock) | 3000 |
| `/api/*` | Query Scraper (LLM extraction) | 3002 |
| `/compare-api/*` | Product Scraper (price comparison) | 3001 |

## Setup

```bash
cd arly-frontend
npm install

# Create .env file with your Supabase credentials
echo "VITE_SUPABASE_URL=your_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_key" >> .env

npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

## Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```
