# ARLY — AI Product Finder

ARLY is an intelligent e-commerce data extraction utility that scrapes, tracks, and monitors changing item values across Nepali retail marketplaces. Users paste a single product link and ARLY checks it against 10+ local retailers to find the best price.

## Architecture

The project is a multi-service system with three independent services:

| Service | Stack | Port | Purpose |
|---|---|---|---|
| Frontend | React 19 + Vite + Tailwind CSS v4 | 5173 | User interface and auth UI |
| Backend (Auth + API) | Next.js (App Router) + Supabase | 3000 | Authentication and user profiles |
| Query Scraper | Express.js + LLM pipeline | 3002 | Product data extraction via URL |
| Product Scraper | Express.js + LLM pipeline | 3001 | Multi-site price comparison and ranking |

## What the Frontend Does

### Visual Design & Layout
- **Sticky Navbar**: Glassmorphic navigation bar with custom ARLY branding, theme toggle (dark/light), and auth-aware profile dropdown
- **URL Input Hub**: Centered landing page where users paste a product URL with instant format validation
- **Modular Pages**: Home, About, Result, Login, Register, Admin Dashboard, History — each in its own component
- **Product Result Cards**: High-contrast cards displaying extracted pricing, marketplace names, stock badges, and comparison links

### Authentication System
- **Email/Password Login & Registration**: Full forms wired to Supabase backend endpoints
- **Google OAuth**: One-click sign-in via Supabase's built-in Google provider
- **Session Management**: Automatic session restoration on page refresh via `supabase.auth.getSession()`
- **Profile Dropdown**: Displays username, email, and role badge

### Scrape History
- **Automatic Recording**: Every successful scrape (catalog lookup or URL extraction) is saved to the user's Supabase `scrape_history` table
- **History Page**: Lists past scrapes newest-first with product thumbnail, brand, price, source, and timestamp
- **Actions**: Re-scrape any past entry or open its source page, plus per-entry delete
- **Privacy**: Row Level Security scopes history to the owning user only

### Admin Dashboard
- **Role-Gated Access**: Only users with `role: "admin"` in the profiles table can view
- **403 Fallback**: Clean "Access Denied" layout for unauthorized users
- **Metrics Grid**: Responsive cards showing dashboard metrics

## Frontend Routes

| Path | Page | Access |
|---|---|---|
| `/` | Home (URL input hub) | Public |
| `/result?url=...` | Scraping results + price comparison | Public |
| `/about` | Project overview | Public |
| `/login` | Email/password + Google OAuth | Public |
| `/register` | User registration | Public |
| `/admin/dashboard` | Admin analytics dashboard | Admin only |
| `/history` | Per-user scrape history | Authenticated |

## API Proxy Rules (Vite Dev Server)

| Frontend Path | Target | Port |
|---|---|---|
| `/api/auth/*` | Next.js backend | 3000 |
| `/api/*` | Query Scraper | 3002 |
| `/compare-api/*` | Product Scraper | 3001 |

## Backend API Endpoints

| Method | Path | Service | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | Next.js | Email/password login via Supabase |
| POST | `/api/auth/register` | Next.js | User registration via Supabase |
| POST | `/` | Query Scraper | Extract product data from URL |
| POST | `/compare` | Product Scraper | Compare prices across retailers |

## Tech Stack

### Frontend
- React 19 + TypeScript 6
- Vite 8 (Rolldown bundler)
- Tailwind CSS v4 + PostCSS
- React Router DOM v7
- Supabase JS Client (auth + database)
- Framer Motion (animations)
- Lucide React + React Icons

### Backend
- Next.js (App Router)
- Supabase (auth, database, RLS)
- Express.js (scraper services)
- LLM pipelines (product extraction + comparison)

## Setup

```bash
# Frontend
cd arly-frontend
npm install
echo "VITE_SUPABASE_URL=your_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_key" >> .env
npm run dev

# Backend (separate terminal)
cd arly_backend_gces026
npm install
npm run dev

# Query Scraper (separate terminal)
cd arly_backend_gces026/query_scrapper
node index.js

# Product Scraper (separate terminal)
cd arly_backend_gces026/product_scrapper
node index.js
```

## Environment Variables

### Frontend (.env)
| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |

### Backend (uses NEXT_PUBLIC_SUPABASE_URL, etc.)
The Next.js backend reads Supabase credentials from its own `.env.local`.

## Project Members
- Ujwal Rana
- Sushan Tamang
- Anmol Tamang
