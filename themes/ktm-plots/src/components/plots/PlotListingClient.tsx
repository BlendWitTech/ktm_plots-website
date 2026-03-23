'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Project, PlotCategory } from '@/lib/cms';
import { getImageUrl } from '@/lib/cms';
import ScrollReveal from '@/components/ui/ScrollReveal';
import WishlistButton from '@/components/ui/WishlistButton';

const API = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

function StatusBadge({ status }: { status: string | null }) {
  const s = status?.toLowerCase() ?? 'available';
  if (s === 'sold') return <span className="badge-sold">Sold</span>;
  if (s === 'limited') return <span className="badge-limited">Limited</span>;
  return <span className="badge-available">Available</span>;
}

function PlotCard({ plot, isNew }: { plot: Project; isNew?: boolean }) {
  const imgUrl = getImageUrl(plot.featuredImageUrl);
  return (
    <div className={isNew ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : undefined}>
      <Link href={`/plots/${plot.slug}`} className="plot-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ position: 'relative', height: '220px', background: 'linear-gradient(135deg, #2a0a0a 0%, #A01010 100%)', flexShrink: 0 }}>
          {imgUrl
            ? <Image src={imgUrl} alt={plot.title} fill style={{ objectFit: 'cover' }} />
            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="48" height="48" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
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
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-secondary)', marginBottom: '0.4rem', lineHeight: 1.3 }}>{plot.title}</h3>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.65, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{plot.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {plot.areaFrom && (
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  <span style={{ color: '#374151', fontWeight: 700 }}>{plot.areaFrom}</span>
                  {plot.areaTo && plot.areaTo !== plot.areaFrom && <span> – {plot.areaTo}</span>}
                </div>
              )}
              <WishlistButton plotId={plot.id} variant="inline" />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View Details
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

interface Props {
  initialPlots: Project[];
  initialTotal: number;
  initialPage: number;
  limit: number;
  listingMode: string;
  category?: string;
  search?: string;
  status?: string;
  categories: PlotCategory[];
  currentPage: number;
}

export default function PlotListingClient({
  initialPlots,
  initialTotal,
  initialPage,
  limit,
  listingMode,
  category,
  search,
  status,
  currentPage,
}: Props) {
  const [plots, setPlots] = useState<Project[]>(initialPlots);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  // Reset when filters/mode change (URL-driven navigation reloads the server component,
  // which passes fresh initialPlots — we sync state to match)
  useEffect(() => {
    setPlots(initialPlots);
    setTotal(initialTotal);
    setPage(initialPage);
    setNewIds(new Set());
  }, [initialPlots, initialTotal, initialPage]);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const qs = new URLSearchParams({ page: String(nextPage), limit: String(limit) });
      if (category) qs.set('category', category);
      if (status) qs.set('status', status);
      if (search) qs.set('search', search);
      const res = await fetch(`${API}/plots/public/list?${qs}`);
      const json = await res.json();
      const incoming: Project[] = (json.data ?? []).map((p: any) => ({
        ...p,
        featuredImageUrl: p.featuredImageUrl ?? p.coverImage ?? null,
        images: p.images ?? p.gallery ?? [],
      }));
      setNewIds(new Set(incoming.map((p) => p.id)));
      setPlots((prev) => [...prev, ...incoming]);
      setTotal(json.total ?? total);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to fetch more plots:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, limit, category, status, search, total]);

  // Infinite scroll: observe sentinel
  useEffect(() => {
    if (listingMode !== 'infinite') return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMore();
      },
      { rootMargin: '200px' }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [listingMode, fetchMore]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (plots.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#6B7280' }}>
        <p style={{ fontSize: '1.1rem' }}>No plots found in this category.</p>
        <Link href="/plots" style={{ color: 'var(--color-primary)', fontWeight: 600, marginTop: '1rem', display: 'inline-block' }}>View all plots →</Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: '1.5rem', color: '#6B7280', fontSize: '0.875rem' }}>
        Showing {plots.length} of {total} plots
      </div>

      {/* Pagination mode: render only the current page (SSR-supplied) */}
      {listingMode === 'pagination' ? (
        <>
          <div className="plots-listing-grid">
            {plots.map((plot, idx) => (
              <ScrollReveal key={plot.id} animation="scale" delay={idx * 60}>
                <PlotCard plot={plot} />
              </ScrollReveal>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              {currentPage > 1 && (
                <Link
                  href={`/plots?${new URLSearchParams({ page: String(currentPage - 1), ...(category && { category }), ...(status && { status }), ...(search && { search }) })}`}
                  style={{ padding: '0.5rem 1rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', textDecoration: 'none', color: '#4B5563', fontSize: '0.875rem' }}
                >
                  ← Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/plots?${new URLSearchParams({ page: String(p), ...(category && { category }), ...(status && { status }), ...(search && { search }) })}`}
                  style={{ padding: '0.5rem 0.875rem', background: p === currentPage ? 'var(--color-primary)' : '#FFFFFF', border: '1px solid', borderColor: p === currentPage ? 'var(--color-primary)' : '#E5E7EB', borderRadius: '6px', textDecoration: 'none', color: p === currentPage ? '#FFFFFF' : '#4B5563', fontSize: '0.875rem', fontWeight: p === currentPage ? 700 : 400 }}
                >
                  {p}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link
                  href={`/plots?${new URLSearchParams({ page: String(currentPage + 1), ...(category && { category }), ...(status && { status }), ...(search && { search }) })}`}
                  style={{ padding: '0.5rem 1rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', textDecoration: 'none', color: '#4B5563', fontSize: '0.875rem' }}
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        /* Load-more and Infinite modes: client-side append */
        <>
          <div className="plots-listing-grid">
            {plots.map((plot, idx) => (
              <ScrollReveal key={plot.id} animation="scale" delay={Math.min(idx, 8) * 60}>
                <PlotCard plot={plot} isNew={newIds.has(plot.id)} />
              </ScrollReveal>
            ))}
          </div>

          {/* Load More button */}
          {listingMode === 'load-more' && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
              {hasMore ? (
                <button
                  onClick={fetchMore}
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: '#FFFFFF', border: '1.5px solid #E5E7EB', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 700, color: '#374151', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                >
                  {loading ? (
                    <>
                      <svg style={{ animation: 'spin 0.8s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                      Loading…
                    </>
                  ) : (
                    <>
                      Load More Plots
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                    </>
                  )}
                </button>
              ) : (
                <p style={{ color: '#9CA3AF', fontSize: '0.875rem', fontWeight: 600 }}>All plots loaded</p>
              )}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          {listingMode === 'infinite' && (
            <>
              <div ref={sentinelRef} className="h-10" />
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 0' }}>
                  <svg style={{ animation: 'spin 0.8s linear infinite' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                </div>
              )}
              {!hasMore && plots.length > 0 && (
                <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.875rem', fontWeight: 600, paddingTop: '1.5rem' }}>All plots loaded</p>
              )}
            </>
          )}
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .plot-card { text-decoration: none; display: flex; flex-direction: column; background: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.07); transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .plot-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(204,20,20,0.13); }
        .plots-listing-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.75rem; }
        @media (max-width: 580px) { .plots-listing-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
