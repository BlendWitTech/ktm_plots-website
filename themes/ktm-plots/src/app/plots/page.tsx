import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPlots, getImageUrl, getSiteData, getSection, type PageRecord } from '@/lib/cms';

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

function StatusBadge({ status }: { status: string | null }) {
  const s = status?.toLowerCase() ?? 'available';
  if (s === 'sold') return <span className="badge-sold">Sold</span>;
  if (s === 'limited') return <span className="badge-limited">Limited</span>;
  return <span className="badge-available">Available</span>;
}

interface Props {
  searchParams: Promise<{ category?: string; page?: string; status?: string; search?: string }>;
}

export default async function PlotsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const category = params.category;
  const status = params.status;
  const search = params.search;

  const [{ data: plots, total }, siteData] = await Promise.all([
    getPlots({ page, limit: 9, category, status, search }),
    getSiteData(),
  ]);
  const totalPages = Math.ceil(total / 9);

  const pages = (siteData as any).pages as PageRecord[] ?? [];
  const heroSec = getSection(pages, 'plots', 'hero');
  const heroTitle    = heroSec.data.title    || 'Available Plots';
  const heroSubtitle = heroSec.data.subtitle || 'Browse our verified land plots across Kathmandu Valley. All with clear legal titles and professional support.';

  const categories = [
    { slug: '', label: 'All Plots' },
    { slug: 'residential', label: 'Residential' },
    { slug: 'commercial', label: 'Commercial' },
    { slug: 'agricultural', label: 'Agricultural' },
  ];

  return (
    <>
      {/* Header */}
      <div className="page-hero-band" style={{ background: '#1E1E1E', padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        {/* Red left accent — brand marker */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: '#CC1414' }} />
        <div className="container">
          <div className="tag-label">Land Listings</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem' }}>
            {heroTitle}
          </h1>
          <p style={{ color: '#A0A0A0', maxWidth: '480px', lineHeight: 1.7 }}>
            {heroSubtitle}
          </p>
        </div>
      </div>

      <section style={{ padding: '3rem 0 5rem', background: '#F4F4F4' }}>
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
              <button type="submit" style={{ padding: '0.6rem 1.5rem', background: '#CC1414', color: '#fff', fontWeight: 700, fontSize: '0.875rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
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
                {categories.map((cat) => {
                  const href = new URLSearchParams({ ...(cat.slug && { category: cat.slug }), ...(status && { status }), ...(search && { search }) }).toString();
                  return (
                    <Link key={cat.slug} href={`/plots${href ? '?' + href : ''}`}
                      style={{ padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', background: (category || '') === cat.slug ? '#CC1414' : '#F3F4F6', color: (category || '') === cat.slug ? '#fff' : '#4B5563', border: '1px solid', borderColor: (category || '') === cat.slug ? '#CC1414' : 'transparent', transition: 'all 0.15s' }}>
                      {cat.label}
                    </Link>
                  );
                })}
              </div>
              <div style={{ width: '1px', height: '20px', background: '#E5E7EB' }} />
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Status:</span>
                {[{ slug: '', label: 'All' }, { slug: 'available', label: 'Available' }, { slug: 'limited', label: 'Limited' }, { slug: 'sold', label: 'Sold' }].map((s) => {
                  const href = new URLSearchParams({ ...(category && { category }), ...(s.slug && { status: s.slug }), ...(search && { search }) }).toString();
                  return (
                    <Link key={s.slug} href={`/plots${href ? '?' + href : ''}`}
                      style={{ padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', background: (status || '') === s.slug ? '#1E1E1E' : '#F3F4F6', color: (status || '') === s.slug ? '#fff' : '#4B5563', border: '1px solid', borderColor: (status || '') === s.slug ? '#1E1E1E' : 'transparent', transition: 'all 0.15s' }}>
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {plots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: '#6B7280' }}>
              <p style={{ fontSize: '1.1rem' }}>No plots found in this category.</p>
              <Link href="/plots" style={{ color: '#CC1414', fontWeight: 600, marginTop: '1rem', display: 'inline-block' }}>View all plots →</Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1.5rem', color: '#6B7280', fontSize: '0.875rem' }}>
                Showing {plots.length} of {total} plots
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
                {plots.map((plot) => {
                  const imgUrl = getImageUrl(plot.featuredImageUrl);
                  return (
                    <Link
                      key={plot.id}
                      href={`/plots/${plot.slug}`}
                      className="plot-card"
                    >
                      <div style={{ position: 'relative', height: '220px', background: 'linear-gradient(135deg, #2a0a0a 0%, #A01010 100%)', flexShrink: 0 }}>
                        {imgUrl
                          ? <Image src={imgUrl} alt={plot.title} fill style={{ objectFit: 'cover' }} />
                          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="48" height="48" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                        }
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
                        <div style={{ position: 'absolute', top: '12px', right: '12px' }}><StatusBadge status={plot.status} /></div>
                        {plot.category && (
                          <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            {plot.category.name}
                          </div>
                        )}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          {plot.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem' }}>
                              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              {plot.location}
                            </div>
                          )}
                          {plot.priceFrom && (
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>From</div>
                              <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1 }}>NPR {Number(plot.priceFrom).toLocaleString('en-NP')}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ padding: '1.1rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1E1E1E', marginBottom: '0.4rem', lineHeight: 1.3 }}>{plot.title}</h3>
                        <p style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.65, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{plot.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid #F3F4F6' }}>
                          {plot.areaFrom && (
                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                              <span style={{ color: '#374151', fontWeight: 700 }}>{plot.areaFrom}</span>
                              {plot.areaTo && plot.areaTo !== plot.areaFrom && <span> – {plot.areaTo}</span>}
                            </div>
                          )}
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#CC1414', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            View Details <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                  {page > 1 && (
                    <Link href={`/plots?${new URLSearchParams({ page: String(page - 1), ...(category && { category }), ...(status && { status }), ...(search && { search }) })}`}
                      style={{ padding: '0.5rem 1rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', textDecoration: 'none', color: '#4B5563', fontSize: '0.875rem' }}>
                      ← Prev
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link key={p} href={`/plots?${new URLSearchParams({ page: String(p), ...(category && { category }), ...(status && { status }), ...(search && { search }) })}`}
                      style={{ padding: '0.5rem 0.875rem', background: p === page ? '#CC1414' : '#FFFFFF', border: '1px solid', borderColor: p === page ? '#CC1414' : '#E5E7EB', borderRadius: '6px', textDecoration: 'none', color: p === page ? '#FFFFFF' : '#4B5563', fontSize: '0.875rem', fontWeight: p === page ? 700 : 400 }}>
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link href={`/plots?${new URLSearchParams({ page: String(page + 1), ...(category && { category }), ...(status && { status }), ...(search && { search }) })}`}
                      style={{ padding: '0.5rem 1rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', textDecoration: 'none', color: '#4B5563', fontSize: '0.875rem' }}>
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <style>{`.plot-card{text-decoration:none;display:flex;flex-direction:column;background:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.07);transition:transform 0.22s ease,box-shadow 0.22s ease}.plot-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(204,20,20,0.13)}`}</style>
    </>
  );
}
