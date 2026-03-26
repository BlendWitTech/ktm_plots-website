# KTM Plots Theme — Setup & Deployment Guide

This guide covers running the theme locally, connecting it to the CMS backend, and deploying to Vercel.

---

## Architecture

```
┌──────────────────────┐   NEXT_PUBLIC_CMS_API_URL   ┌──────────────────────┐
│  KTM Plots Theme     │ ──────────────────────────► │  Mero CMS Backend    │
│  Next.js (Vercel)    │   Public API — no auth       │  NestJS (Railway)    │
│  ktm-plots repo      │   /public/site-data          │  blendwit-cms repo   │
│                      │   /plots/public/*            │                      │
└──────────────────────┘   /posts/public/*            └──────────────────────┘
                           /categories, /services      │
                           /seo-meta/*                 │  PostgreSQL (Railway)
                                                       └──────────────────────┘
```

The theme and the backend are completely independent deployments. The only connection is the `NEXT_PUBLIC_CMS_API_URL` environment variable.

---

## Part 1 — Local Development

### Prerequisites

- Node.js 20+
- A running Mero CMS backend. See the [blendwit-cms repo](https://github.com/BlendWitTech/blendwit-cms) SETUP.md to get the backend running on `http://localhost:3001`.

### Step 1 — Clone the repo

```bash
git clone https://github.com/BlendWitTech/ktm-plots.git
cd ktm-plots
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_CMS_API_URL=http://localhost:3001
```

For production, this points to the Railway backend URL.

### Step 4 — Run the dev server

```bash
npm run dev
# Starts at http://localhost:3000
```

> **Fallback mode:** If the backend is unreachable, the theme renders with embedded fallback data defined in `src/lib/cms.ts`. You will see the site structure but with placeholder content.

---

## Part 2 — Connecting to the CMS

### Activate the theme in the admin dashboard

1. Open the Mero CMS admin (deployed separately from the `blendwit-cms` repo)
2. Go to **Dashboard → Appearance → Themes**
3. Find **KTM Plots** → click **Setup** (seeds menus, plots, services, etc.)
4. Click **Activate**

### Required modules

The `theme.json` declares which CMS modules this theme uses. Ensure these are enabled in **Dashboard → Settings → Modules**:

- `plots` — Real estate plot listings
- `blogs` — Blog posts
- `services` — Services section
- `testimonials` — Client testimonials
- `menus` — Navigation menus
- `leads` — Contact form submissions
- `seo-meta` — Per-page SEO metadata

### ISR revalidation

The theme uses Next.js ISR (Incremental Static Regeneration) with a 10-second revalidate. When content changes in the CMS admin, it calls the theme's `/api/revalidate` endpoint to immediately clear the cache.

Set `REVALIDATE_SECRET` in both the theme env and the CMS backend env to enable this:

```
# .env.local
REVALIDATE_SECRET=your-secret-here
```

```
# Backend env (Railway)
REVALIDATE_SECRET=same-secret-here
THEME_REVALIDATE_URL=https://your-ktm-plots.vercel.app/api/revalidate
```

---

## Part 3 — Vercel Deployment

### Step 1 — Connect repo to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → **Import**
2. Select the `BlendWitTech/ktm-plots` repository
3. **Root Directory**: leave **empty** (theme is at repo root)
4. Framework: Next.js (auto-detected)

### Step 2 — Set environment variables

In the Vercel project settings → **Environment Variables**:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_CMS_API_URL` | `https://your-ktm-plots-backend.railway.app` |
| `REVALIDATE_SECRET` | Same value as set in the backend |

Set these for **Production**, **Preview**, and **Development** environments.

### Step 3 — Deploy

Click **Deploy**. Vercel reads `vercel.json` at the repo root which specifies the build configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

### Step 4 — Add custom domain

1. Vercel project → **Settings** → **Domains**
2. Add the client's domain (e.g. `ktmplots.com`)
3. Follow the DNS setup instructions Vercel provides
4. Update the CMS backend's `CORS_ORIGINS` to include the new domain

---

## Part 4 — Branch Strategy

```
main        ← production (auto-deploys to Vercel on merge)
  └── feature/my-change   ← day-to-day work
```

```bash
# Start a change
git checkout main
git pull origin main
git checkout -b feature/update-hero-section

# Work, commit
git add src/components/sections/Hero.tsx
git commit -m "feat(hero): update headline and filter layout"
git push origin feature/update-hero-section

# Open PR: feature/update-hero-section → main
# Review and merge → Vercel auto-deploys
```

**Rules:**
- Never push directly to `main`
- Every PR must build successfully (Vercel preview must be green) before merging
- Use [Conventional Commits](https://www.conventionalcommits.org/)

---

## Part 5 — Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start development server at localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint |

---

## Part 6 — Environment Files Reference

| File | Purpose |
|---|---|
| `.env.example` | Template — copy to `.env.local` for local dev |
| `.env.local` | Local dev values — never commit this file |

---

## Troubleshooting

**Site shows fallback content instead of CMS data**
- Check `NEXT_PUBLIC_CMS_API_URL` is set and points to the correct backend URL
- Open the backend URL in your browser — it should return JSON
- Check the backend's `CORS_ORIGINS` includes your theme URL

**Images not loading**
- CMS-hosted images have relative paths like `/uploads/filename.jpg`
- The theme prepends `NEXT_PUBLIC_CMS_API_URL` to relative paths via `getImageUrl()` in `src/lib/cms.ts`
- Ensure the backend URL is set correctly and the backend's uploads directory is accessible

**`/api/revalidate` returns 401**
- `REVALIDATE_SECRET` in the theme must exactly match the value set in the backend

**Vercel build fails: "Root Directory not found"**
- Ensure the Vercel project's Root Directory setting is **empty** (not `themes/ktm-plots`)
- Go to Vercel project → Settings → General → Root Directory → clear the field
