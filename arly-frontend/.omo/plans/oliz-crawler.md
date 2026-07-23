# oliz-crawler - Work Plan

## TL;DR (For humans)

**What you'll get:** An adapter-based product catalog backed by file-based JSON cache (no external database). Two-pass crawlers (category pages → product detail pages) populate per-site JSON cache files. When a user pastes a product URL, the system detects the source site, checks cache freshness, live-scrapes if stale, then runs a 3-tier matching cascade (exact → variant → similar) to find the cheapest price elsewhere. Products with low-confidence extraction land in a `needs_review` queue instead of being silently stored.

**Why this approach:** Adapter pattern keeps site-specific scraping logic isolated from shared fetch/cache/retry infrastructure. File-based cache means zero infrastructure — no Supabase, no Redis, no external services. JSON files on disk are trivially inspectable and debuggable. Tiered matching is simple SQL-like filtering over in-memory arrays — predictable and fast at this scale.

**What it will NOT do:** Hukut or Mudita adapters (next milestone), free-text search, fuzzy similarity scoring, laptop/audio/camera categories, admin dashboard, price history, nagmani.com.np or mudita.com/store.mudita.com, external databases.

**Effort:** Large
**Risk:** Medium — Cloudflare on OlizStore category pages could limit crawl coverage (Playwright stealth mitigates but doesn't guarantee). Brother-mart is static HTTP (low risk).

**Decisions made (defaults, reversible):** Phones-only category scope, 6h cache freshness, 24h staleness warning, 48h availability downgrade, `product_slug` as matching key, `availability_raw` preserved alongside normalized enum.

Your next move: approve, or run a high-accuracy review. Full execution detail follows below.

---

> TL;DR (machine): Large effort, medium risk — adapter-based catalog (OlizStore + Brother-mart) with shared core (fetch/cache/retry/title-parser), file-based JSON cache (no external DB), two-pass category crawler, cache-first query scraper with 3-tier matching cascade, needs_review queue, frontend staleness display across 8 implementation todos in 4 waves.

## Scope

### Must have
- File-based JSON cache: per-site JSON files in `product_scrapper/data/` with CRUD + search + freshness checking
- Adapter interface + shared core: domain allowlist (4 sites, explicit reject for mudita.com/store.mudita.com), static HTTP fetcher (axios), headless fetcher (Playwright), universal title parser (Stage B)
- OlizStore adapter (Playwright, Cloudflare) + Brother-mart adapter (static HTTP, Shopify-style)
- Two-pass catalog crawler CLI: Pass A (category pages → product URLs) → Pass B (detail pages → extract → upsert into cache)
- Cache-first query scraper endpoint: `POST /compare-api/product-lookup` with freshness threshold (6h default)
- 3-tier matching cascade: Tier 1 (brand+model+storage_gb), Tier 2 (brand+model), Tier 3 (brand+category+price±20%)
- Live re-scrape of cheapest Tier 1 match before returning to user
- `needs_review` queue for low-confidence extractions (brand/model/storage extraction failure)
- `possibly_delisted` marking for products not seen in fresh crawl
- Frontend result page: tiered match display with staleness indicators

### Must NOT have (guardrails)
- External databases (Supabase, Redis, SQLite, PostgreSQL)
- Hukut, Mudita, nagmani.com.np, mudita.com/store.mudita.com adapters or domain allowlist entries
- Free-text search (URL paste only for now)
- Fuzzy/blended similarity scoring (tiered cascade only)
- Laptop, audio, camera, or other category support (phones only)
- Auth changes, admin dashboard, user management
- Real-time updates, websockets, SSE
- Price history tracking (no time-series)
- Recommendation engine, multi-language support
- Image download/caching
- Modifications to existing `/search`, `/compare`, or `interpretProduct` endpoints
- Changes to Navbar props or App.tsx isDark logic
- New npm dependencies

## Verification strategy

> Zero human intervention — all verification is agent-executed.
- Test decision: tests-after + Node.js assert (no test framework — ponytail)
- Evidence: `.omo/evidence/task-<N>-oliz-crawler.<ext>`

## Execution strategy

### Parallel execution waves

**Wave 1 — Foundation (2 todos, parallel)**
Adapter interface + shared core, file-based cache module — no inter-dependencies.

**Wave 2 — Adapters (2 todos, parallel)**
OlizStore adapter (Playwright) and Brother-mart adapter (static HTTP) — both depend only on Wave 1 interface/core.

**Wave 3 — Crawler + Query (2 todos, parallel)**
Two-pass catalog crawler + query scraper endpoint — both depend on Wave 1+2 but are independent of each other.

**Wave 4 — Frontend + Verification (2 todos, serial)**
Frontend types/result page update + integration test.

### Dependency matrix

| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1. Interface + core | — | 3, 4, 5, 6 | 2 |
| 2. File cache module | — | 5, 6 | 1 |
| 3. OlizStore adapter | 1 | 5, 6 | 4 |
| 4. Brother-mart adapter | 1 | 5, 6 | 3 |
| 5. Crawler + CLI | 1, 2, 3, 4 | 8 | 6 |
| 6. Query scraper endpoint | 1, 2, 3, 4 | 7, 8 | 5 |
| 7. Frontend update | 6 | 8 | — |
| 8. Integration test | 5, 6, 7 | — | — |

## Todos

- [ ] 1. Adapter interface + shared core (domain allowlist, fetcher, title parser)
  What to do: Create 4 files in backend repo (`/home/uzu/Projects/active/min/arly_backend_gces026/product_scrapper/src/`):

  A) `adapters/interface.js` — JSDoc `@interface` definition (no class, just documentation). Every adapter must export: `{ siteName, domain, renderingMethod: 'static'|'headless', categories: { phones: string }, extractCategoryUrls(html, categoryUrl): string[], extractProduct(html, productUrl): object, stripNoise(title): string }`. The `extractProduct` return shape: `{ product_slug, brand, model, storage_gb, ram_gb, color, network_tag, price_min, price_max, currency: 'NPR', availability_raw, availability_normalized, source_site, source_url, image_url, raw_title, category }`.

  B) `core/domain-allowlist.js` — Export `DOMAIN_MAP`: Map from domain string to adapter module path. Entries: `www.olizstore.com` → `../adapters/oliz_adapter.js`, `brother-mart.com` → `../adapters/brothermart_adapter.js`. Export `REJECTED_DOMAINS`: Set containing `mudita.com`, `store.mudita.com`, `nagmani.com.np`. Export `getAdapterForUrl(url)`: parses hostname, checks DOMAIN_MAP (exact match), throws if in REJECTED_DOMAINS or unknown. Export `isSupportedDomain(url)`: boolean check.

  C) `core/fetcher.js` — Export `fetchPage(url, method)`: if `method === 'static'` use axios+cheerio (reuse `fetchHtml` from `../utils.js`), if `method === 'headless'` use Playwright with stealth patches (reuse stealthPage pattern from `../olizstore.js` lines 7-38). Export `fetchStatic(url)`: returns `{ html: string }`. Export `fetchHeadless(url)`: returns `{ html: string }`, handles Cloudflare detection (same checks as olizstore.js lines 119-129), 25s timeout. Must NOT launch a new browser per call — accept optional `browser` parameter, create new context+page internally, close context after.

  D) `core/title-parser.js` — Export `extractFields(cleanedTitle)`: Stage B universal extraction, runs in this exact order:
  1. Brand — match first token(s) against fixed list: Apple, Samsung, Xiaomi, Redmi, Poco, Realme, Vivo, Oppo, Honor, OnePlus, Nothing, Infinix, Motorola, Tecno, Google, X-Age. Remove matched token.
  2. RAM/Storage shorthand — `/(\\d{1,2})\\s?\\/\\s?(\\d{2,4})\\s?GB/i` → group 1 = ram_gb, group 2 = storage_gb. Remove match.
  3. Storage standalone — if not captured: `/(\\d{2,4})\\s?(GB|TB)\\b/i`, take last numeric match. TB → ×1024 GB.
  4. RAM standalone — if not captured: `/(\\d{1,2})\\s?GB\\s?RAM\\b/i`.
  5. Color — match against fixed list: Black, Blue, Titanium, Starlight, Midnight, Deep Blue, Graphite, Silver, Gold, Green, Purple, White, Gray, Grey. Remove match.
  6. Network tag — `\\b(5G|4G)\\b` → extract, remove from string.
  7. Model — remaining text after all above removals, trim whitespace/punctuation.
  Return `{ brand, model, storage_gb, ram_gb, color, network_tag }`. If brand, model, or storage_gb is null/empty, also return `{ needs_review: true }`.
  Parallelization: Wave 1 | Blocked by: nothing | Blocks: 3, 4, 5, 6
  References: `product_scrapper/src/olizstore.js` lines 7-38 (stealth pattern), `product_scrapper/src/utils.js` (fetchHtml, parsePrice), user spec Section 5 (field extraction rules — exact order)
  Acceptance criteria (agent-executable): `cd /home/uzu/Projects/active/min/arly_backend_gces026 && node -e "import('./product_scrapper/src/core/title-parser.js').then(m => { const r = m.extractFields('iPhone 15 128GB Black 5G'); console.log(r.brand, r.model, r.storage_gb, r.color, r.network_tag); })"` — prints `Apple iPhone 15 128 Black 5G`. `node -e "import('./product_scrapper/src/core/domain-allowlist.js').then(m => { console.log(m.isSupportedDomain('https://www.olizstore.com/products/x')); console.log(m.isSupportedDomain('https://mudita.com/store.x')); })"` — prints `true false`.
  QA scenarios: happy: title parser extracts all fields for known brands, domain allowlist accepts 4 domains and rejects mudita.com + store.mudita.com. failure: unknown brand → brand=null, model=full title, needs_review=true. rejection: mudita.com explicitly throws or returns null.
  Commit: Y | feat(core): add adapter interface, domain allowlist, shared fetcher, and title parser

- [ ] 2. File-based cache module
  What to do: Create `product_scrapper/src/cache.js` in backend repo. File-based JSON cache — no external dependencies, just `fs` + `path`.

  Storage location: `product_scrapper/data/` directory (created on first write if missing). One JSON file per site: `data/{site_slug}.json` (e.g., `data/olizstore.json`, `data/brothermart.json`). Each file is a Map-like object keyed by `product_slug`, values are normalized product objects.

  Add `product_scrapper/data/` to `.gitignore` in the backend repo root.

  Export functions:

  `loadSiteCache(siteSlug)` — reads `data/{siteSlug}.json`, returns `{}` if file missing. Parses JSON, returns object keyed by product_slug.

  `saveSiteCache(siteSlug, cache)` — writes `data/{siteSlug}.json` atomically (write to `.tmp` then rename).

  `getProduct(siteName, productSlug)` — derives siteSlug from siteName (lowercase, no spaces), loads cache, returns product or null.

  `upsertProduct(product)` — loads site cache, sets `product.last_scraped_at = new Date().toISOString()`, `product.possibly_delisted = false`. If existing record has `needs_review: true` and new product has `needs_review: false`, clear it. If new product has `needs_review: true`, keep it set. Save cache.

  `getAllProducts()` — loads ALL site cache files (reads `data/` dir, loads each `.json` file), returns flat array of all products across all sites.

  `searchTier1(brand, model, storageGb, ramGb, excludeSite)` — `getAllProducts().filter()` where brand+model+storageGb match, needs_review=false, possibly_delisted=false, source_site != excludeSite. If ramGb is non-null, also match ram_gb. Sort by price_min ASC.

  `searchTier2(brand, model, excludeSite)` — filter where brand+model match, same exclusions. Sort by price_min ASC.

  `searchTier3(brand, category, priceLow, priceHigh, excludeSite)` — filter where brand+category match AND price_min is within range, same exclusions. Sort by price_min ASC.

  `markPossiblyDelisted(seenBefore)` — for each site cache, set `possibly_delisted=true` on products where `last_scraped_at < seenBefore`. Save each modified cache. Return count of marked products.

  `markNeedsReview(productSlug, siteName)` — load cache, set needs_review=true, save.

  `getCacheStats()` — return `{ totalProducts, bySite: { olizstore: N, brothermart: N }, needsReview: N, possiblyDelisted: N }`.

  Must NOT: use Supabase, Redis, SQLite, or any external dependency. Only `fs` and `path` from Node.js stdlib.
  Parallelization: Wave 1 | Blocked by: nothing | Blocks: 5, 6
  References: Node.js `fs` module, `path` module. Product shape from task 1 `extractProduct` return type.
  Acceptance criteria (agent-executable): `cd /home/uzu/Projects/active/min/arly_backend_gces026 && node -e "import('./product_scrapper/src/cache.js').then(m => { console.log(typeof m.upsertProduct, typeof m.searchTier1, typeof m.getAllProducts, typeof m.markPossiblyDelisted); })"` — prints `function function function function`. Verify `product_scrapper/data/` directory gets created on first write.
  QA scenarios: happy: all functions exported, writes create data directory, reads return empty on missing files. Concurrent upsert: last-write-wins (acceptable at this scale). Corrupt JSON: returns empty cache with warning log.
  Commit: Y | feat(cache): add file-based JSON cache module for product catalog

- [ ] 3. OlizStore adapter
  What to do: Create `product_scrapper/src/adapters/oliz_adapter.js` in backend repo. Implements the adapter interface from task 1.

  `siteName`: `'OlizStore'`, `domain`: `'www.olizstore.com'`, `renderingMethod`: `'headless'` (Cloudflare blocks static HTTP — verify during implementation). `categories.phones`: `'https://www.olizstore.com/collections/phone'`.

  `extractCategoryUrls(html, categoryUrl)`: parse `.product-item a` links from category page HTML, extract href attributes, filter to `/products/` URLs, return absolute URLs. Handle pagination: look for `a[rel="next"]` or `.pagination a` with "Next" text, return pagination URLs (up to 20 pages max) for the crawler to fetch separately.

  `extractProduct(html, productUrl)`: load HTML with cheerio. Extract:
  - Title: `h1.product-title` or `h1` or `.product-title` text
  - Price: `.product-price` or `[class*="price"]` — use parsePrice from utils.js
  - Original price: `.product-compare-price` or `del` or `[class*="compare"]`
  - Image: `.product-gallery img` or `meta[property="og:image"]` content
  - Description: `.product-description` or `meta[name="description"]` content
  - Availability: check for text containing "in stock", "out of stock", "add to cart", "sold out"
  - Specs: `.specification table`, `.product-specs`, or table with key-value rows → key_specs (may be empty)

  After raw extraction, call `stripNoise(title)` then `extractFields(cleanedTitle)` from `../core/title-parser.js`. Map to normalized product shape. Set `needs_review` if fields missing. Always populate `raw_title` with original uncleaned title. Set `product_slug` from URL (last path segment after `/products/`, strip query params). Set `source_site: 'OlizStore'`, `source_url: productUrl`, `category: 'phones'`.

  `stripNoise(title)`: remove trailing patterns: `/\s*\|\s*Warranty.*$/i`, `/\s*\(?\d{4}\s*Updated\)?$/i`, `/\s*Price\s+in\s+Nepal.*$/i`, `/\s*-\s*Nepal.*$/i`. Trim.

  IMPORTANT: Verify whether OlizStore product detail pages load via static HTTP or require Playwright. First test with `curl` or `fetchHtml()`. If the page renders with all data in static HTML, change `renderingMethod` to `'static'` and use `fetchStatic()` instead.
  Parallelization: Wave 2 | Blocked by: 1 | Blocks: 5, 6
  References: `product_scrapper/src/olizstore.js` (selectors: `.product-item`, `.product-title`, `.product-price`, `.product-compare-price`), `product_scrapper/src/utils.js` (parsePrice, absoluteUrl), `product_scrapper/src/core/title-parser.js`, `product_scrapper/src/core/domain-allowlist.js`
  Acceptance criteria (agent-executable): `cd /home/uzu/Projects/active/min/arly_backend_gces026 && node -e "import('./product_scrapper/src/adapters/oliz_adapter.js').then(m => { console.log(m.siteName, m.domain, m.renderingMethod, typeof m.extractProduct, typeof m.extractCategoryUrls, typeof m.stripNoise); })"` — prints `OlizStore www.olizstore.com headless function function function`.
  QA scenarios: happy: adapter exports all interface methods, stripNoise removes known junk, extractProduct returns normalized shape. failure: missing selectors → null for that field, needs_review=true if brand/model/storage missing. Cloudflare block → empty category URLs with warning.
  Commit: Y | feat(adapter): add OlizStore adapter with headless rendering and two-stage extraction

- [ ] 4. Brother-mart adapter
  What to do: Create `product_scrapper/src/adapters/brothermart_adapter.js` in backend repo. Implements the adapter interface from task 1.

  `siteName`: `'BrotherMart'`, `domain`: `'brother-mart.com'`, `renderingMethod`: `'static'` (Shopify-style, no Cloudflare). `categories.phones`: `'https://brother-mart.com/collections/mobiles'` (verify exact URL — may be `mobile`, `phones`, or `cell-phones`; check the site).

  `extractCategoryUrls(html, categoryUrl)`: parse `article.product-card a` links, extract href, filter to `/products/` URLs, return absolute URLs. Handle pagination: Shopify uses `?page=N`, follow up to 20 pages.

  `extractProduct(html, productUrl)`: load HTML with cheerio. Extract:
  - Title: `h1.product-title` or `.product__title` or `h1` (Shopify convention)
  - Price: `.price` or `.price__current` or `meta[property="product:price:amount"]`
  - Original price: `.price--compare` or `s.price`
  - Image: `.product__media img` or `meta[property="og:image"]`
  - Description: `.product__description` or `meta[name="description"]`
  - Availability: `meta[property="product:availability"]` or "sold out" / "in stock" text
  - Specs: `.product__specs` or table elements (may be empty)

  After raw extraction, call `stripNoise(title)` then `extractFields(cleanedTitle)`. Map to normalized shape. Set `needs_review` if fields missing. Populate `raw_title`.

  `stripNoise(title)`: remove trailing spec suffixes (Brother-mart appends processor names like `- Helio G99-Ultra Processor`). Patterns: `/\s*-\s*(Helio|Snapdragon|Dimensity|Exynos|A\d+|Bionic|MediaTek)[^\n]*$/i`, `/\s*\|\s*Warranty.*$/i`, `/\s*Price\s+in\s+Nepal.*$/i`. Trim.
  Parallelization: Wave 2 | Blocked by: 1 | Blocks: 5, 6
  References: `product_scrapper/src/brothermart.js` (selectors: `article.product-card`, `.price`), `product_scrapper/src/utils.js` (fetchHtml, parsePrice, absoluteUrl), `product_scrapper/src/core/title-parser.js`
  Acceptance criteria (agent-executable): `cd /home/uzu/Projects/active/min/arly_backend_gces026 && node -e "import('./product_scrapper/src/adapters/brothermart_adapter.js').then(m => { console.log(m.siteName, m.domain, m.renderingMethod, typeof m.extractProduct, typeof m.extractCategoryUrls, typeof m.stripNoise); })"` — prints `BrotherMart brother-mart.com static function function function`.
  QA scenarios: happy: adapter exports all interface methods, static HTTP fetch works, stripNoise removes processor suffixes. failure: missing selectors → null for that field, needs_review=true if brand/model/storage missing.
  Commit: Y | feat(adapter): add Brother-mart adapter with static HTTP and two-stage extraction

- [ ] 5. Two-pass catalog crawler + CLI script
  What to do: Two files in backend repo (`/home/uzu/Projects/active/min/arly_backend_gces026/product_scrapper/`):

  A) `src/crawler.js` — The crawler engine. Exports `runCrawl(options)` where options = `{ sites?: string[], dryRun?: boolean, browser?: Browser }`.

  Pass A flow (per site):
  1. Get adapter for site from domain-allowlist
  2. Fetch each category page URL (adapter.categories.phones) with pagination (up to 20 pages)
  3. Call `adapter.extractCategoryUrls(html, url)` for each page
  4. Collect all unique product URLs (deduplicate by URL)
  5. Log: "Site: found N product URLs across M category pages"

  Pass B flow (per site):
  1. For each product URL from Pass A:
     a. Extract slug from URL (last path segment, strip query params)
     b. Check cache: `getProduct(siteName, slug)` — if exists and `last_scraped_at` within current crawl window, skip
     c. Fetch product page HTML (using `fetchPage(url, adapter.renderingMethod)`)
     d. Call `adapter.extractProduct(html, url)` → normalized product
     e. If `dryRun`: print product to stdout
     f. If not dryRun: `upsertProduct(product)` (writes to file cache)
  2. Batch concurrency: 3 concurrent fetches, 1s delay between batches
  3. After all products: `markPossiblyDelisted(crawlStartTime)`

  Accept optional `browser` parameter. If provided, reuse it. If not and headless needed, launch one internally and close at end.

  B) `crawl.js` — CLI entry point. Load dotenv. Parse args:
  - `--dry-run`: skip cache writes
  - `--site olizstore` or `--site brothermart`: single site
  - `--verbose`: detailed logging
  Flow: launch browser if needed, call `runCrawl(options)`, print summary (URLs found, products scraped, updated, delisted, needs_review count), close browser.

  Must NOT: modify existing scraper files, add to package.json, build a scheduler.
  Parallelization: Wave 3 | Blocked by: 1, 2, 3, 4 | Blocks: 8
  References: All adapter modules, cache.js, fetcher.js, domain-allowlist.js
  Acceptance criteria (agent-executable): `cd /home/uzu/Projects/active/min/arly_backend_gces026 && node product_scrapper/crawl.js --dry-run --site brothermart --verbose` — attempts to crawl BrotherMart phones category, prints URLs and products, exits without cache writes.
  QA scenarios: happy: --dry-run prints products, --site limits to single site. Cloudflare on OlizStore → logs warning, continues. No products found → logs "0 products" and exits cleanly. Evidence `.omo/evidence/task-5-oliz-crawler.md`
  Commit: Y | feat(crawler): add two-pass catalog crawler with CLI and dry-run support

- [ ] 6. Query scraper endpoint: cache-first product lookup + tiered matching
  What to do: Add `POST /product-lookup` endpoint to `product_scrapper/index.js`. Accept `{ url: string }`. Flow:

  1. Validate URL, detect source site via `getAdapterForUrl(url)` from domain-allowlist. Reject unsupported domains with 400.
  2. Extract product_slug from URL (last path segment after `/products/`, strip query params).
  3. Cache check: `getProduct(siteName, slug)`.
  4. If found AND `last_scraped_at` within freshness threshold (env `FRESHNESS_HOURS`, default 6): use cached. Set `source = 'cache'`.
  5. If stale or not found: fetch HTML via `fetchPage(url, adapter.renderingMethod)`, call `adapter.extractProduct(html, url)`, `upsertProduct(product)`. Set `source = 'live_scrape'`.
  6. Run tiered matching (excluding source site):
     - **Tier 1**: `searchTier1(product.brand, product.model, product.storage_gb, product.ram_gb, product.source_site)`. If ram_gb is null in queried product, omit it from filter. If results found, sort by price_min ASC. Cheapest gets live re-scraped: `fetchPage(cheapest.source_url, cheapestAdapter.renderingMethod)` → `extractProduct` → `upsertProduct`. Return fresh data for cheapest, cached for others. Labels: "Exact match — confirmed price" (cheapest), "Exact match (checked as of {timestamp})" (others).
     - **Tier 2** (only if Tier 1 empty): `searchTier2(product.brand, product.model, product.source_site)`. Label: "Exact storage/RAM not found — closest variant available".
     - **Tier 3** (only if Tier 2 empty): ±20% price range, `searchTier3(product.brand, 'phones', priceLow, priceHigh, product.source_site)`. Label: "Similar alternative".
     - **No match**: return empty matches.

  Response:
  ```json
  {
    "success": true,
    "product": { /* normalized fields */ },
    "matches": {
      "tier1": [{ "product": {...}, "is_cheapest": bool, "freshly_scraped": bool, "label": "..." }],
      "tier2": [{ "product": {...}, "label": "..." }],
      "tier3": [{ "product": {...}, "label": "..." }]
    },
    "source": "cache" | "live_scrape",
    "freshness_threshold_hours": 6
  }
  ```

  Rate limit: existing `limiter`. Timeout: 30s.
  Must NOT: modify existing `/search`, `/compare`, `/health`. Change port. Build free-text search.
  Parallelization: Wave 3 | Blocked by: 1, 2, 3, 4 | Blocks: 7, 8
  References: `product_scrapper/index.js` (Express setup, rate limiting), cache.js (all search/get functions), domain-allowlist.js, fetcher.js
  Acceptance criteria (agent-executable): Start product_scrapper, `curl -X POST http://localhost:3001/product-lookup -H 'Content-Type: application/json' -d '{"url":"https://www.olizstore.com/products/test"}'` — returns JSON with success, product, matches structure. `curl ... -d '{"url":"https://nagmani.com.np/x"}'` — returns 400 "unsupported domain".
  QA scenarios: happy: returns product + tiered matches. Cache hit: fast. Cache miss: live scrape → upsert → return. Unsupported domain: 400. Stale product → re-scrape. Evidence `.omo/evidence/task-6-oliz-crawler.md`
  Commit: Y | feat(api): add POST /product-lookup with cache-first lookup and 3-tier matching

- [ ] 7. Frontend: update types and result page for tiered matching
  What to do: Update files in frontend repo (`/home/uzu/Projects/active/min/ARLY/arly-frontend/`):

  A) `src/types/product.ts` — Add new types, keep existing for backward compat:
  ```typescript
  interface NormalizedProduct {
    product_slug: string;
    brand: string;
    model: string;
    storage_gb: number | null;
    ram_gb: number | null;
    color: string | null;
    network_tag: '5G' | '4G' | null;
    price_min: number;
    price_max: number;
    currency: string;
    availability_raw: string;
    availability_normalized: 'in_stock' | 'out_of_stock' | 'unknown';
    source_site: string;
    source_url: string;
    category: string;
    image_url: string | null;
    last_scraped_at: string;
    needs_review: boolean;
  }
  interface MatchResult {
    product: NormalizedProduct;
    label: string;
    is_cheapest?: boolean;
    freshly_scraped?: boolean;
  }
  interface ProductLookupResponse {
    success: boolean;
    product: NormalizedProduct;
    matches: { tier1: MatchResult[]; tier2: MatchResult[]; tier3: MatchResult[] };
    source: 'cache' | 'live_scrape';
    freshness_threshold_hours: number;
  }
  ```

  B) `src/pages/result.tsx` — Change compare fetch to `POST /compare-api/product-lookup` with `{ url: productUrl }`. Store as `ProductLookupResponse`. Replace "Price Comparison" section with:
  1. **Primary match** (cheapest Tier 1): large card, fresh price, "Confirmed price" badge, store link, availability, "Last checked: just now"
  2. **Other exact matches** (rest Tier 1): smaller cards, cached price, "Checked as of {timestamp}", staleness indicator (>24h amber, >48h red)
  3. **Variant matches** (Tier 2): gray-bordered, "Closest variant — different storage/RAM"
  4. **Similar alternatives** (Tier 3): subtle, "Similar product in same price range"
  5. No matches: "No comparable product found across our catalog"
  Keep ProductCard at top. Keep StoreGrid. Keep AI Analysis section. Dark mode on all new sections.
  Parallelization: Wave 4 | Blocked by: 6 | Blocks: 8
  References: `src/types/product.ts`, `src/pages/result.tsx`, `vite.config.ts` (proxy `/compare-api/` → localhost:3001 already exists)
  Acceptance criteria (agent-executable): `npx tsc --noEmit` — clean. `npx vite build` — clean. Visual: result page shows tiered match sections (empty initially).
  QA scenarios: happy: tiered matches render with correct labels, staleness colors. Empty: "No comparable product found". Dark mode: all sections dark. Evidence `.omo/evidence/task-7-oliz-crawler.md`
  Commit: Y | feat(frontend): add tiered match display and staleness indicators to result page

- [ ] 8. Integration test + final verification
  What to do: Create `product_scrapper/test-integration.js` — Node.js `assert`, no framework. Tests:

  1. **Title parser**: `extractFields('Apple iPhone 15 Pro Max 256GB Black 5G')` → brand=Apple, model=iPhone 15 Pro Max, storage_gb=256, color=Black, network_tag=5G. `extractFields('Samsung Galaxy A54 8/256GB')` → brand=Samsung, model=Galaxy A54, ram_gb=8, storage_gb=256. `extractFields('Random Gadget 128GB')` → brand=null, needs_review=true.

  2. **Domain allowlist**: isSupportedDomain('olizstore.com') = true. mudita.com = false. store.mudita.com = false. nagmani.com.np = false. brother-mart.com = true.

  3. **Strip noise**: OlizStore `stripNoise('iPhone 15 | Warranty 1 Year')` → 'iPhone 15'. BrotherMart `stripNoise('Samsung Galaxy A54 - Helio G99-Ultra Processor')` → 'Samsung Galaxy A54'.

  4. **Cache round-trip**: upsertProduct with test data → getProduct returns it → searchTier1 finds it → markPossiblyDelisted works → cleanup (delete test cache file or remove test entries).

  5. **Adapter interface compliance**: both adapters export all required methods.

  Run via `node product_scrapper/test-integration.js`.
  Parallelization: Wave 4 | Blocked by: 5, 6, 7 | Blocks: nothing
  References: All modules from tasks 1-6
  Acceptance criteria (agent-executable): `cd /home/uzu/Projects/active/min/arly_backend_gces026 && node product_scrapper/test-integration.js` — all tests pass. `cd /home/uzu/Projects/active/min/ARLY/arly-frontend && npx vite build` — clean.
  QA scenarios: happy: all tests pass. Adapter missing method: test fails clearly. Evidence `.omo/evidence/task-8-oliz-crawler.md`
  Commit: Y | test: add integration tests for adapter pipeline and tiered matching

## Final verification wave

> Runs in parallel after ALL todos. ALL must APPROVE.

- [ ] F1. Plan compliance audit — every todo implemented as specified, no scope creep, no excluded domains in allowlist
- [ ] F2. Code quality — no `as any`, no empty catch blocks, no unused imports, consistent style
- [ ] F3. Real manual QA — `node product_scrapper/crawl.js --dry-run --site brothermart` works. `node product_scrapper/test-integration.js` passes. Frontend paste BrotherMart URL, verify tiered matching.
- [ ] F4. Scope fidelity — grep for forbidden: nagmani as supported, mudita.com/store.mudita.com as supported, Supabase imports, Navbar props, free-text search
- [ ] F5. Backend verification — `POST /product-lookup` with valid URL returns structured JSON. mudita.com URL returns 400.

## Commit strategy

One commit per todo, conventional commits (`feat(scope): description`). Backend repo for todos 1-6, 8. Frontend repo for todo 7.

## Success criteria

1. `node product_scrapper/crawl.js --dry-run --site brothermart` crawls at least one category page and prints normalized products
2. `POST /product-lookup` returns normalized product + tiered matches from file cache
3. mudita.com and store.mudita.com explicitly rejected by domain allowlist
4. Products with missing brand/model/storage flagged `needs_review` and excluded from matching
5. Frontend result page shows tiered match cards with staleness indicators
6. `tsc --noEmit` clean, `vite build` clean
7. `node product_scrapper/test-integration.js` passes
8. No existing functionality broken (search, compare, interpretation still work)
