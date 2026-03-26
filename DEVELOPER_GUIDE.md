# KTM Plots Theme — Developer Guide

This guide covers the architecture, coding patterns, and workflows for anyone working on this theme. Read this before writing any code.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Fetching — cms.ts](#data-fetching--cmsts)
3. [Page Structure](#page-structure)
4. [Section Components](#section-components)
5. [Layout Components](#layout-components)
6. [UI Components](#ui-components)
7. [Plots Module](#plots-module)
8. [Blog Module](#blog-module)
9. [CMS API Reference](#cms-api-reference)
10. [Styling Conventions](#styling-conventions)
11. [Git Workflow](#git-workflow)
12. [Commit Convention](#commit-convention)

---

## Architecture Overview

```
┌──────────────────────┐   NEXT_PUBLIC_CMS_API_URL   ┌──────────────────────┐
│  KTM Plots Theme     │ ──────────────────────────► │  Mero CMS Backend    │
│  Next.js 16          │   Public API — no auth       │  NestJS / Railway    │
│  React 19            │                              │                      │
│  TypeScript          │   GET /public/site-data      │  PostgreSQL          │
│  App Router          │   GET /plots/public/*        │                      │
└──────────────────────┘   GET /posts/public/*        └──────────────────────┘
```

- **This repo** contains only the client-facing public website (theme)
- **No auth required** — the theme only uses the backend's unauthenticated public API
- **ISR** — pages are statically generated at build time and revalidated every 10 seconds via `next: { revalidate: 10 }`
- **Fallback data** — if the backend is unreachable, the theme renders using embedded defaults in `src/lib/cms.ts`

---

## Data Fetching — cms.ts

All data fetching lives in one file: `src/lib/cms.ts`. Never use `fetch` directly in page or component files — always import from `cms.ts`.

### Key functions

```typescript
import {
  getSiteData,       // All site-wide data in one call
  getPlots,          // Paginated plot listings with filters
  getPlotBySlug,     // Single plot detail
  getFeaturedPlots,  // Featured plots for home page
  getPlotCategories, // All plot categories
  getPosts,          // Paginated blog posts
  getPostBySlug,     // Single blog post
  getPageBySlug,     // CMS-managed static pages
  getSeoMeta,        // Per-page SEO metadata
  getImageUrl,       // Resolves relative media paths to full URLs
  formatDate,        // Formats ISO dates to Nepali locale
  renderContent,     // Renders CMS content (HTML or markdown) to safe HTML
  submitLead,        // Submits contact form via local API proxy
} from '@/lib/cms';
```

### getSiteData()

The most commonly used function. Returns settings, menus, services, testimonials, and recent posts in a single call.

```typescript
// In a server component or page
import { getSiteData } from '@/lib/cms';

export default async function HomePage() {
  const { settings, menus, services, testimonials, recentPosts } = await getSiteData();
  // Pass to child components as props
}
```

### getPlots() — with filters

```typescript
const result = await getPlots({
  page: 1,
  limit: 12,
  category: 'residential',  // plot category slug
  status: 'available',       // available | sold | reserved
  search: 'kathmandu',
});
// result: { data: Project[], total: number, page: number, limit: number }
```

### getImageUrl()

Always use this for CMS media paths. It prepends the backend URL to relative paths:

```typescript
import { getImageUrl } from '@/lib/cms';

// CMS returns: "/uploads/abc123.jpg"
// getImageUrl returns: "https://backend.railway.app/uploads/abc123.jpg"
const url = getImageUrl(plot.featuredImageUrl);
```

### renderContent()

Converts CMS rich text content (HTML or basic markdown) to safe HTML for `dangerouslySetInnerHTML`:

```typescript
import { renderContent } from '@/lib/cms';

<div dangerouslySetInnerHTML={{ __html: renderContent(post.content) }} />
```

---

## Page Structure

```
src/app/
├── page.tsx                    # Home — renders all section components
├── about/page.tsx              # About — getSiteData() + static content
├── plots/
│   ├── page.tsx                # All plots — server shell + PlotListingClient
│   ├── [slug]/page.tsx         # Plot detail — getPlotBySlug()
│   └── category/[slug]/page.tsx # Category filtered plots
├── blog/
│   ├── page.tsx                # Blog listing — server shell + BlogListingClient
│   └── [slug]/page.tsx         # Blog post detail — getPostBySlug()
├── services/page.tsx           # Services — getSiteData()
├── contact/page.tsx            # Contact — form + lead submission
└── [slug]/page.tsx             # Dynamic CMS pages — getPageBySlug()
```

### Server vs Client components

- **Pages are server components** — they fetch data and pass it as props
- **Interactive UI is client components** — filters, carousels, modals are `'use client'`
- Never call `getSiteData()` or other CMS functions in client components — fetch in the server page and pass data down as props

```typescript
// CORRECT — server component fetches, client component receives props
// plots/page.tsx (server)
export default async function PlotsPage() {
  const { data: initialPlots, total } = await getPlots({ limit: 12 });
  const categories = await getPlotCategories();
  return <PlotListingClient initialPlots={initialPlots} categories={categories} total={total} />;
}

// PlotListingClient.tsx ('use client')
'use client';
export function PlotListingClient({ initialPlots, categories, total }) {
  // handles filter state and pagination client-side
}
```

---

## Section Components

Home page sections live in `src/components/sections/`. Each section receives props from the home `page.tsx`.

| Component | Data source | Key props |
|---|---|---|
| `Hero.tsx` | `settings`, `plots` (featured) | Type/status filter, search, scroll to plots |
| `About.tsx` | `settings` | Title, content, stats strip |
| `Plots.tsx` | `plots` (featured), `categories` | Filter tabs, horizontal scroll on mobile |
| `Services.tsx` | `services` | List of services with icons |
| `Testimonials.tsx` | `testimonials` | Carousel of client testimonials |
| `BlogPreview.tsx` | `recentPosts` | Grid of recent blog posts |
| `CtaStrip.tsx` | `settings` | CTA text and button from `settings.ctaText` / `settings.ctaUrl` |

### Adding a new section

1. Create `src/components/sections/NewSection.tsx`
2. Accept data as props — never fetch inside the component
3. Add it to `src/app/page.tsx` and pass the relevant data from `getSiteData()`

```typescript
// src/app/page.tsx
import { NewSection } from '@/components/sections/NewSection';

export default async function HomePage() {
  const { settings, services } = await getSiteData();
  return (
    <>
      {/* existing sections */}
      <NewSection settings={settings} services={services} />
    </>
  );
}
```

---

## Layout Components

### Header.tsx

Renders the site navigation. Reads menu items from the `main-nav` menu slug. Handles mobile hamburger menu state (client component).

### Footer.tsx

Renders footer links, social icons, contact info from `settings`. Static — no interactive state.

---

## UI Components

| Component | Purpose |
|---|---|
| `ScrollReveal.tsx` | Wraps any element with an IntersectionObserver fade-in animation |
| `AnimatedStatsStrip.tsx` | Number counter animation for stats (years, plots sold, etc.) |
| `WishlistButton.tsx` | Client-side wishlist toggle using localStorage |
| `FloatingActions.tsx` | Fixed floating call/WhatsApp buttons |
| `TeamSocialIcons.tsx` | Social media icon row for team member profiles |
| `PlotGallery.tsx` | Lightbox image gallery for plot detail pages |

### ScrollReveal usage

```typescript
import ScrollReveal from '@/components/ui/ScrollReveal';

<ScrollReveal>
  <div className="my-card">...</div>
</ScrollReveal>
```

> **Important:** Do not wrap elements inside `overflow-x: auto` horizontal scroll containers with ScrollReveal — off-screen items never enter the viewport so they stay invisible. Use `opacity: 1 !important` CSS override for those containers.

---

## Plots Module

The plots module is the core feature of this theme. Key files:

| File | Purpose |
|---|---|
| `src/lib/cms.ts` — `getPlots()` | Paginated, filterable plot listings |
| `src/lib/cms.ts` — `getPlotBySlug()` | Single plot with all detail fields |
| `src/lib/cms.ts` — `getPlotCategories()` | All plot category slugs and names |
| `src/lib/cms.ts` — `getFeaturedPlots()` | Featured plots for home page |
| `src/components/plots/PlotCardGrid.tsx` | Reusable card grid (server/client) |
| `src/components/plots/PlotListingClient.tsx` | Client-side filters + pagination |
| `src/components/sections/Plots.tsx` | Home page featured plots section |
| `src/components/PlotGallery.tsx` | Detail page image gallery |

### Plot data shape (`Project` type)

```typescript
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  featuredImageUrl: string | null;
  images: string[];
  featured: boolean;
  status: string | null;         // "available" | "sold" | "reserved"
  location: string | null;
  priceFrom: string | null;
  priceTo: string | null;
  areaFrom: string | null;
  areaTo: string | null;
  facing: string | null;
  roadAccess: string | null;
  plotNumber: string | null;
  landType: string | null;       // plot category / type
  latitude: number | null;
  longitude: number | null;
  mapUrl: string | null;
  totalPlots: number | null;
  availablePlots: number | null;
  category?: { name: string; slug: string };
}
```

---

## Blog Module

| File | Purpose |
|---|---|
| `src/lib/cms.ts` — `getPosts()` | Paginated blog posts |
| `src/lib/cms.ts` — `getPostBySlug()` | Single post with full content |
| `src/lib/cms.ts` — `getPostCategories()` | All blog category slugs |
| `src/components/blog/BlogCardGrid.tsx` | Reusable blog card grid |
| `src/components/blog/BlogListingClient.tsx` | Client-side filters + pagination |
| `src/components/blog/BlogComments.tsx` | Comments section (client component) |
| `src/components/sections/BlogPreview.tsx` | Home page blog preview section |

---

## CMS API Reference

All endpoints are on the Mero CMS backend at `NEXT_PUBLIC_CMS_API_URL`. These require no authentication.

| Endpoint | Description |
|---|---|
| `GET /public/site-data` | Settings, menus, services, testimonials, recent posts |
| `GET /public/pages/:slug` | Single CMS page by slug |
| `GET /plots/public/list` | Paginated plots (`?page&limit&category&status&search`) |
| `GET /plots/public/featured` | Featured plots array |
| `GET /plots/public/:slug` | Single plot detail |
| `GET /plot-categories` | All plot categories |
| `GET /posts/public` | Paginated published blog posts |
| `GET /posts/public/:slug` | Single blog post |
| `GET /categories` | All blog categories |
| `GET /seo-meta/:pageType` | SEO metadata for a page type |
| `GET /seo-meta/:pageType/:id` | SEO metadata for a specific item |
| `POST /leads` | Submit a contact form lead |

---

## Styling Conventions

- **CSS variables** for brand colours are set in `src/app/globals.css`:
  ```css
  :root {
    --color-primary: #CC1414;   /* KTM Plots red */
    --color-secondary: #1a1a1a;
  }
  ```
- **Inline styles** are used throughout section components — keep them consistent with existing patterns
- **No Tailwind** — this theme uses inline styles and standard CSS only
- **Mobile-first** — use `@media (max-width: 640px)` breakpoints, with `480px` for extra-small screens
- **No custom CSS files per component** — all component styles live in the component's `<style>` tag or as inline style objects

---

## Git Workflow

```
main          ← production (auto-deploys to Vercel)
  └── feature/your-change    ← day-to-day work
  └── fix/bug-description
  └── chore/task-name
```

```bash
# Always branch from main
git checkout main
git pull origin main
git checkout -b feature/update-plots-card

# Work, commit often
git add src/components/plots/PlotCardGrid.tsx
git commit -m "feat(plots): add area badge to plot card"

# Push and open PR to main
git push origin feature/update-plots-card
# Open PR on GitHub → confirm Vercel preview builds → merge
```

**Rules:**
- Never push directly to `main`
- Every PR must have a passing Vercel preview deployment before merging
- One PR per logical change — keep PRs small and focused

---

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

| Type | When to use |
|---|---|
| `feat` | New page, section, or component |
| `fix` | Bug fix |
| `chore` | Config, dependencies, build scripts |
| `refactor` | Code restructure, no behaviour change |
| `docs` | Documentation only |
| `style` | Formatting, CSS tweaks — no logic change |

**Examples:**
```
feat(hero): add 50/50 type-status filter on mobile
fix(plots): hide scrollbar in pill filter row
chore(vercel): update root directory setting
docs(readme): add deployment instructions
style(about): tighten stats strip padding on mobile
```
