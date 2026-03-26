# KTM Plots — Theme

The official public website for **KTM Plots**, Kathmandu Valley's trusted real estate partner.
Built as a standalone Next.js theme on top of [Mero CMS](https://blendwit.com/mero-cms) by [Blendwit Tech](https://blendwit.com).

---

## What This Repo Is

This is a **theme-only** repository. It contains the client-facing public website — pages, components, and styles. It does **not** contain the CMS engine (backend API, admin dashboard, or database). Those live in the [mero-cms](https://github.com/BlendWitTech/mero-cms) repo.

The theme fetches all content from the Mero CMS backend via a single environment variable.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 19 |
| Language | TypeScript |
| Styling | CSS Modules + inline styles |
| Data | Mero CMS Public API (`/public/site-data`, `/plots/public/*`) |
| Deployment | Vercel |

---

## Project Structure

```
ktm-plots/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Home page
│   │   ├── about/                  # About page
│   │   ├── plots/                  # Plot listings + detail pages
│   │   │   ├── page.tsx            # All plots (with filters)
│   │   │   ├── [slug]/             # Individual plot detail
│   │   │   └── category/[slug]/    # Plots filtered by category
│   │   ├── blog/                   # Blog listing + post pages
│   │   ├── services/               # Services page
│   │   ├── contact/                # Contact page + lead form
│   │   ├── [slug]/                 # Dynamic CMS pages
│   │   ├── api/
│   │   │   ├── submit-lead/        # Lead form proxy (avoids CORS)
│   │   │   ├── comments/           # Blog comments proxy
│   │   │   └── revalidate/         # ISR revalidation webhook
│   │   ├── globals.css             # Base styles and CSS variables
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── robots.ts               # robots.txt generation
│   │   └── sitemap.ts              # Sitemap generation
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Site header + navigation
│   │   │   └── Footer.tsx          # Site footer
│   │   ├── sections/               # Home page section components
│   │   │   ├── Hero.tsx            # Hero with search/filter widget
│   │   │   ├── About.tsx           # About section + stats strip
│   │   │   ├── Plots.tsx           # Featured plots section
│   │   │   ├── Services.tsx        # Services section
│   │   │   ├── Testimonials.tsx    # Testimonials carousel
│   │   │   ├── BlogPreview.tsx     # Recent blog posts
│   │   │   └── CtaStrip.tsx        # Call-to-action strip
│   │   ├── plots/
│   │   │   ├── PlotCardGrid.tsx    # Reusable plot card grid
│   │   │   └── PlotListingClient.tsx # Client-side filter + pagination
│   │   ├── blog/
│   │   │   ├── BlogCardGrid.tsx    # Reusable blog card grid
│   │   │   ├── BlogListingClient.tsx # Client-side filter + pagination
│   │   │   └── BlogComments.tsx    # Comments section
│   │   ├── services/
│   │   │   └── ServicesDetailGrid.tsx
│   │   ├── ui/
│   │   │   ├── ScrollReveal.tsx    # Intersection observer animation
│   │   │   ├── AnimatedStatsStrip.tsx
│   │   │   ├── WishlistButton.tsx
│   │   │   ├── FloatingActions.tsx
│   │   │   └── TeamSocialIcons.tsx
│   │   └── PlotGallery.tsx         # Image gallery for plot detail
│   └── lib/
│       └── cms.ts                  # All CMS API fetchers + types
├── media/                          # Uploaded media (gitignored in dev)
├── public/                         # Static assets
├── theme.json                      # Theme metadata (slug, required modules)
├── next.config.js                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── vercel.json                     # Vercel deployment configuration
└── .env.example                    # Required environment variables
```

---

## Quick Start (Local)

### Prerequisites

- Node.js 20+
- A running Mero CMS backend (see [mero-cms](https://github.com/BlendWitTech/mero-cms))

### Steps

```bash
# 1. Clone
git clone https://github.com/BlendWitTech/ktm_plots-website.git
cd ktm_plots-website

# 2. Install dependencies
npm install

# 3. Set environment variable
cp .env.example .env.local
# Edit .env.local and set:
# NEXT_PUBLIC_CMS_API_URL=http://localhost:3001

# 4. Run dev server
npm run dev
# Opens at http://localhost:3000
```

The theme works even without a live backend — it falls back to embedded default content defined in `src/lib/cms.ts`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CMS_API_URL` | Yes | URL of the Mero CMS backend (e.g. `https://ktm-plots-backend.railway.app`) |

---

## Deployment (Vercel)

1. Connect this repo to a Vercel project
2. **Root Directory**: leave empty (theme is at repo root)
3. Set environment variable:
   ```
   NEXT_PUBLIC_CMS_API_URL = https://your-backend.railway.app
   ```
4. Deploy

The `vercel.json` at the repo root handles the build configuration automatically.

---

## Content Management

All content — plots, blog posts, services, testimonials, menus, site settings — is managed through the **Mero CMS admin dashboard**. The theme fetches data at request time (ISR, 10s revalidate) from the backend's public API.

For instant content updates, the CMS triggers the `/api/revalidate` endpoint on publish events, which clears the Next.js cache for affected pages.

---

## CMS Engine

This theme is built on **Mero CMS** by Blendwit Tech.

- Engine repo: [BlendWitTech/mero-cms](https://github.com/BlendWitTech/mero-cms)
- Documentation: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- Setup guide: [SETUP.md](SETUP.md)

---

## License

This theme is proprietary software owned by **Blendwit Tech** and licensed to KTM Plots for their production deployment. Unauthorized redistribution is prohibited.
