---
slug: oliz-crawler
status: awaiting-approval
intent: clear
pending-action: user approval to start execution
approach: Adapter-based catalog with file-based JSON cache (no external DB) — shared core + OlizStore (Playwright) + Brother-mart (static HTTP) adapters + two-pass crawler + cache-first query scraper + 3-tier matching
---

# Draft: oliz-crawler

## Components (topology ledger)

| id | outcome | status | evidence |
|----|---------|--------|----------|
| C1 | Adapter interface + shared core (domain allowlist, fetcher, title parser) | active | User spec Sections 1-2, 5 |
| C2 | File-based JSON cache (per-site JSON files, CRUD + search) | active | User said "just store in cache" — no external DB |
| C3 | OlizStore adapter (Playwright, Cloudflare) | active | `product_scrapper/src/olizstore.js` |
| C4 | Brother-mart adapter (static HTTP, Shopify) | active | `product_scrapper/src/brothermart.js` |
| C5 | Two-pass catalog crawler CLI | active | User spec Section 2 |
| C6 | Cache-first query scraper + 3-tier matching | active | User spec Sections 3-4 |
| C7 | needs_review queue | active | User spec Sections 5-6 |
| C8 | Frontend tiered match display | active | `arly-frontend/src/pages/result.tsx` |

## Key change from original plan
User said "lets not store the products in database but just store in cache" — removed Supabase dependency entirely. Replaced catalog-db.js (Supabase client) with cache.js (file-based JSON). No migration, no RLS, no external services.

## Scope IN
- File-based JSON cache
- Adapter interface + shared core
- OlizStore + Brother-mart adapters
- Two-pass crawler CLI
- Cache-first query scraper endpoint
- 3-tier matching cascade
- needs_review queue
- Frontend tiered match display

## Scope OUT
- External databases (Supabase, Redis, SQLite)
- Hukut, Mudita, nagmani adapters
- Free-text search, fuzzy scoring
- Non-phone categories
- Admin dashboard, scheduling, auth changes

## Approval gate
Status: awaiting-approval
