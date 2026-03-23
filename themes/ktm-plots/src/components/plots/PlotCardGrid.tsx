'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/cms';
import { getImageUrl } from '@/lib/cms';
import ScrollReveal from '@/components/ui/ScrollReveal';
import WishlistButton from '@/components/ui/WishlistButton';

function StatusBadge({ status }: { status: string | null }) {
  const s = status?.toLowerCase() ?? 'available';
  if (s === 'sold') return <span className="badge-sold">Sold</span>;
  if (s === 'limited') return <span className="badge-limited">Limited</span>;
  return <span className="badge-available">Available</span>;
}

interface Props {
  plots: Project[];
  total: number;
}

export default function PlotCardGrid({ plots, total }: Props) {
  return (
    <>
      <div style={{ marginBottom: '1.5rem', color: '#6B7280', fontSize: '0.875rem' }}>
        Showing {plots.length} of {total} plots
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
        {plots.map((plot, idx) => {
          const imgUrl = getImageUrl(plot.featuredImageUrl);
          return (
            <ScrollReveal key={plot.id} animation="scale" delay={idx * 60}>
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
            </ScrollReveal>
          );
        })}
      </div>
    </>
  );
}
