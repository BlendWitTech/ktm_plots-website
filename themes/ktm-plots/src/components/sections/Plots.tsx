'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Project } from '@/lib/cms';
import { getImageUrl } from '@/lib/cms';
import ScrollReveal from '@/components/ui/ScrollReveal';
import WishlistButton from '@/components/ui/WishlistButton';

interface Props {
  plots: Project[];
  secData?: Record<string, any>;
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status?.toLowerCase() ?? 'available';
  if (s === 'sold') return <span className="badge-sold">Sold</span>;
  if (s === 'limited') return <span className="badge-limited">Limited</span>;
  return <span className="badge-available">Available</span>;
}

const STATUS_FILTERS = [
  { slug: '', label: 'All Status' },
  { slug: 'available', label: 'Available' },
  { slug: 'limited', label: 'Limited' },
  { slug: 'sold', label: 'Sold' },
];

export default function Plots({ plots, secData = {} }: Props) {
  const list = plots.length > 0 ? plots : [];
  const sectionLabel = secData.label || 'Available Now';
  const sectionTitle = secData.title || 'Featured Plots';
  const sectionSubtitle = secData.subtitle || 'Handpicked plots across the Kathmandu Valley';
  const viewAllText = secData.viewAllText || 'View All Plots →';
  const viewAllUrl = secData.viewAllUrl || '/plots';

  const [activeCategory, setActiveCategory] = useState('');
  const [activeStatus, setActiveStatus]   = useState('');

  // Derive unique categories from the loaded plots
  const seenSlugs = new Set<string>();
  const categories: { slug: string; name: string }[] = [];
  for (const p of list) {
    if (p.category && !seenSlugs.has(p.category.slug)) {
      seenSlugs.add(p.category.slug);
      categories.push({ slug: p.category.slug, name: p.category.name });
    }
  }

  const filtered = list.filter((plot) => {
    if (activeCategory && plot.category?.slug !== activeCategory) return false;
    if (activeStatus && (plot.status?.toLowerCase() ?? 'available') !== activeStatus) return false;
    return true;
  });

  if (list.length === 0) {
    return (
      <section id="plots" style={{ padding: '5rem 0', background: 'var(--color-accent)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">{sectionTitle}</h2>
          <p style={{ color: '#6B7280' }}>No plots available at the moment. Please check back soon.</p>
        </div>
      </section>
    );
  }

  const pillBase: React.CSSProperties = {
    padding: '0.35rem 0.875rem', borderRadius: '9999px', fontSize: '0.78rem',
    fontWeight: 600, border: '1.5px solid transparent', cursor: 'pointer',
    transition: 'all 0.15s', background: 'none',
  };

  return (
    <section id="plots" style={{ padding: '5rem 0', background: 'var(--color-accent)' }}>
      <div className="container">
        {/* Header row */}
        <ScrollReveal animation="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              {sectionLabel}
            </div>
            <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>{sectionTitle}</h2>
            <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>{sectionSubtitle}</p>
          </div>
          <Link href={viewAllUrl} className="btn-green" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
            {viewAllText}
          </Link>
        </ScrollReveal>

        {/* Filter bar */}
        {(() => {
          const typeOpts = [{ slug: '', name: 'All Types' }, ...categories];
          const cycleBtn = (dir: -1 | 1, opts: {slug:string}[], active: string, set: (s:string)=>void) => {
            const idx = opts.findIndex(o => o.slug === active);
            return () => set(opts[(idx + dir + opts.length) % opts.length].slug);
          };
          return (
            <ScrollReveal animation="up" delay={80}>
              <div style={{ background: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>

                {/* Type row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>Type:</span>
                  {/* Desktop pills */}
                  <div className="pf-type-pills" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {typeOpts.map((o) => (
                      <button key={o.slug} onClick={() => setActiveCategory(o.slug)}
                        style={{ ...pillBase, background: activeCategory === o.slug ? 'var(--color-secondary)' : '#F3F4F6', color: activeCategory === o.slug ? '#fff' : '#4B5563', borderColor: activeCategory === o.slug ? 'var(--color-secondary)' : 'transparent' }}>
                        {o.name}
                      </button>
                    ))}
                  </div>
                  {/* Mobile cycle */}
                  <div className="pf-type-cycle" style={{ display: 'none', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
                    <button onClick={cycleBtn(-1, typeOpts, activeCategory, setActiveCategory)} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'26px', height:'26px', borderRadius:'6px', border:'1px solid #E5E7EB', background:'transparent', color:'#6B7280', cursor:'pointer', flexShrink:0 }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <span style={{ flex:1, textAlign:'center', padding:'0.3rem 0.5rem', borderRadius:'6px', background: activeCategory ? 'var(--color-secondary)' : '#F3F4F6', color: activeCategory ? '#fff' : '#4B5563', fontSize:'0.78rem', fontWeight:700, whiteSpace:'nowrap' }}>
                      {typeOpts.find(o => o.slug === activeCategory)?.name ?? 'All Types'}
                    </span>
                    <button onClick={cycleBtn(1, typeOpts, activeCategory, setActiveCategory)} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'26px', height:'26px', borderRadius:'6px', border:'1px solid #E5E7EB', background:'transparent', color:'#6B7280', cursor:'pointer', flexShrink:0 }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                </div>

                {/* Status row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>Status:</span>
                  {/* Desktop pills */}
                  <div className="pf-status-pills" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flex: 1 }}>
                    {STATUS_FILTERS.map((s) => (
                      <button key={s.slug} onClick={() => setActiveStatus(s.slug)}
                        style={{ ...pillBase, background: activeStatus === s.slug ? 'var(--color-secondary)' : '#F3F4F6', color: activeStatus === s.slug ? '#fff' : '#4B5563', borderColor: activeStatus === s.slug ? 'var(--color-secondary)' : 'transparent' }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                  {/* Mobile cycle */}
                  <div className="pf-status-cycle" style={{ display: 'none', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
                    <button onClick={cycleBtn(-1, STATUS_FILTERS, activeStatus, setActiveStatus)} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'26px', height:'26px', borderRadius:'6px', border:'1px solid #E5E7EB', background:'transparent', color:'#6B7280', cursor:'pointer', flexShrink:0 }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <span style={{ flex:1, textAlign:'center', padding:'0.3rem 0.5rem', borderRadius:'6px', background: activeStatus ? 'var(--color-secondary)' : '#F3F4F6', color: activeStatus ? '#fff' : '#4B5563', fontSize:'0.78rem', fontWeight:700, whiteSpace:'nowrap' }}>
                      {STATUS_FILTERS.find(s => s.slug === activeStatus)?.label ?? 'All Status'}
                    </span>
                    <button onClick={cycleBtn(1, STATUS_FILTERS, activeStatus, setActiveStatus)} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'26px', height:'26px', borderRadius:'6px', border:'1px solid #E5E7EB', background:'transparent', color:'#6B7280', cursor:'pointer', flexShrink:0 }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                  {(activeCategory || activeStatus) && (
                    <button onClick={() => { setActiveCategory(''); setActiveStatus(''); }}
                      style={{ ...pillBase, flexShrink:0, color:'var(--color-primary)', background:'#FEF2F2', borderColor:'#FCA5A5', fontSize:'0.72rem' }}>
                      ✕ Clear
                    </button>
                  )}
                </div>

              </div>
            </ScrollReveal>
          );
        })()}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6B7280' }}>
            <p style={{ marginBottom: '1rem' }}>No plots match the selected filters.</p>
            <button onClick={() => { setActiveCategory(''); setActiveStatus(''); }} style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
              Clear filters →
            </button>
          </div>
        ) : (
          <div className="plots-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {filtered.map((plot, idx) => {
              const imgUrl = getImageUrl(plot.featuredImageUrl);
              return (
                <ScrollReveal key={plot.id} animation="scale" delay={Math.min(idx * 80, 400)} className="plots-card-wrap">
                  <Link
                    href={`/plots/${plot.slug}`}
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#FFFFFF', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', transition: 'transform 0.22s ease, box-shadow 0.22s ease', height: '100%' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(204,20,20,0.13)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                  >
                    <div style={{ position: 'relative', height: '220px', background: 'linear-gradient(135deg, #2a0a0a 0%, #A01010 100%)', flexShrink: 0 }}>
                      {imgUrl
                        ? <Image src={imgUrl} alt={plot.title} fill style={{ objectFit: 'cover' }} />
                        : (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="48" height="48" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                          </div>
                        )
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', fontWeight: 500 }}>
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
                      <p style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.65, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {plot.description}
                      </p>
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
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        .pf-type-cycle, .pf-status-cycle { display: none; }
        @media (max-width: 640px) {
          .plots-divider { display: none !important; }
          .pf-type-pills  { display: none !important; }
          .pf-status-pills { display: none !important; }
          .pf-type-cycle  { display: flex !important; }
          .pf-status-cycle { display: flex !important; }
          .plots-grid {
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 1rem !important;
            padding-bottom: 1rem;
            scrollbar-width: none;
          }
          .plots-grid::-webkit-scrollbar { display: none; }
          .plots-card-wrap {
            flex: 0 0 82vw;
            min-width: 0;
            scroll-snap-align: start;
            display: flex;
            flex-direction: column;
            /* Force visible — off-screen cards never trigger IntersectionObserver */
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .plots-card-wrap > a { flex: 1; }
        }
      `}</style>
    </section>
  );
}
