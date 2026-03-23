import type { Metadata } from 'next';
import Link from 'next/link';
import { getPlots, getSiteData, getPlotCategories, getSection, isSectionEnabled, type PageRecord } from '@/lib/cms';
import PlotListingClient from '@/components/plots/PlotListingClient';

export const metadata: Metadata = {
  title: 'Available Plots',
  description: 'Browse all available land plots across Kathmandu Valley. Verified titles, transparent pricing, and professional support.',
  openGraph: {
    title: 'Available Plots | KTM Plots',
    description: 'Browse all available land plots across Kathmandu Valley. Verified titles, transparent pricing, and professional support.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Available Plots | KTM Plots',
    description: 'Browse all available land plots across Kathmandu Valley. Verified titles, transparent pricing, and professional support.',
  },
};

interface Props {
  searchParams: Promise<{ category?: string; page?: string; status?: string; search?: string }>;
}

const LIMIT = 9;

export default async function PlotsPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Number(params.page || 1);
  const category = params.category;
  const status = params.status;
  const search = params.search;

  const [{ data: initialPlots, total: initialTotal }, siteData, categories] = await Promise.all([
    getPlots({ page: currentPage, limit: LIMIT, category, status, search }),
    getSiteData(),
    getPlotCategories(),
  ]);

  const listingMode = siteData.settings.listingMode || 'load-more';

  const pages = (siteData as any).pages as PageRecord[] ?? [];
  const show  = (id: string) => isSectionEnabled(pages, 'plots', id);
  const heroSec = getSection(pages, 'plots', 'hero');
  const heroTitle    = heroSec.data.title    || 'Available Plots';
  const heroSubtitle = heroSec.data.subtitle || 'Browse our verified land plots across Kathmandu Valley. All with clear legal titles and professional support.';

  const filterCategories = [
    { slug: '', label: 'All Plots' },
    ...categories.map(c => ({ slug: c.slug, label: c.name })),
  ];

  return (
    <>
      {/* Header */}
      {show('hero') && <div className="page-hero-band" style={{ background: 'var(--color-secondary)', padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: 'var(--color-primary)' }} />
        <div className="container">
          <div className="tag-label animate-slide-right">Land Listings</div>
          <h1 className="animate-slide-up delay-100" style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem' }}>
            {heroTitle}
          </h1>
          <p className="animate-fade-in delay-200" style={{ color: '#A0A0A0', maxWidth: '480px', lineHeight: 1.7 }}>
            {heroSubtitle}
          </p>
        </div>
      </div>}

      <section style={{ padding: '3rem 0 5rem', background: 'var(--color-accent)' }}>
        <div className="container">

          {/* Search + Filters bar */}
          <div style={{ background: '#fff', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Search */}
            <form action="/plots" style={{ display: 'flex', gap: '0.75rem' }}>
              {category && <input type="hidden" name="category" value={category} />}
              {status && <input type="hidden" name="status" value={status} />}
              <div style={{ flex: 1, position: 'relative' }}>
                <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  type="text"
                  name="search"
                  defaultValue={search || ''}
                  placeholder="Search by name or location..."
                  style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#F9FAFB' }}
                />
              </div>
              <button type="submit" style={{ padding: '0.6rem 1.5rem', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '0.875rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                Search
              </button>
              {(search || category || status) && (
                <Link href="/plots" style={{ padding: '0.6rem 1rem', background: '#F3F4F6', color: '#6B7280', fontWeight: 600, fontSize: '0.8rem', borderRadius: '8px', textDecoration: 'none', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                  Clear all
                </Link>
              )}
            </form>

            {/* Category + Status pills */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Type:</span>
                {filterCategories.map((cat) => {
                  const href = new URLSearchParams({ ...(cat.slug && { category: cat.slug }), ...(status && { status }), ...(search && { search }) }).toString();
                  return (
                    <Link key={cat.slug} href={`/plots${href ? '?' + href : ''}`}
                      style={{ padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', background: (category || '') === cat.slug ? 'var(--color-primary)' : '#F3F4F6', color: (category || '') === cat.slug ? '#fff' : '#4B5563', border: '1px solid', borderColor: (category || '') === cat.slug ? 'var(--color-primary)' : 'transparent', transition: 'all 0.15s' }}>
                      {cat.label}
                    </Link>
                  );
                })}
              </div>
              <div className="plots-filter-divider" style={{ width: '1px', height: '20px', background: '#E5E7EB' }} />
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Status:</span>
                {[{ slug: '', label: 'All' }, { slug: 'available', label: 'Available' }, { slug: 'limited', label: 'Limited' }, { slug: 'sold', label: 'Sold' }].map((s) => {
                  const href = new URLSearchParams({ ...(category && { category }), ...(s.slug && { status: s.slug }), ...(search && { search }) }).toString();
                  return (
                    <Link key={s.slug} href={`/plots${href ? '?' + href : ''}`}
                      style={{ padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', background: (status || '') === s.slug ? 'var(--color-secondary)' : '#F3F4F6', color: (status || '') === s.slug ? '#fff' : '#4B5563', border: '1px solid', borderColor: (status || '') === s.slug ? 'var(--color-secondary)' : 'transparent', transition: 'all 0.15s' }}>
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <PlotListingClient
            initialPlots={initialPlots}
            initialTotal={initialTotal}
            initialPage={currentPage}
            limit={LIMIT}
            listingMode={listingMode}
            category={category}
            search={search}
            status={status}
            categories={categories}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  );
}
