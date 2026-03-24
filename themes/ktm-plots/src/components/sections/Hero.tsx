'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { SiteData, Project } from '@/lib/cms';
import { getImageUrl } from '@/lib/cms';

interface Stat { value: string; label: string; }
interface Props { siteData: SiteData; bannerItems?: Stat[]; featuredPlot?: Project | null; }

const CATEGORIES = [
  { slug: '', label: 'All Types' },
  { slug: 'residential',  label: 'Residential' },
  { slug: 'commercial',   label: 'Commercial' },
  { slug: 'agricultural', label: 'Agricultural' },
];

const STATUS_OPTS = [
  { slug: '', label: 'Any Status' },
  { slug: 'available', label: 'Available' },
  { slug: 'limited',   label: 'Limited' },
];


export default function Hero({ siteData, bannerItems, featuredPlot }: Props) {
  const router = useRouter();
  const { settings } = siteData;
  const title       = settings.heroTitle    || 'Find Your Perfect Land Plot';
  const subtitle    = settings.heroSubtitle || 'Premium plots with clear legal titles, transparent pricing, and full registration support across Kathmandu Valley.';
  const bgUrl       = getImageUrl(settings.heroBgImage);
  const cta2Text    = (settings as any).cta2Text || 'Free Consultation';
  const cta2Url     = (settings as any).cta2Url  || '/contact';
  const badgeText   = (settings as any).heroBadge || settings.tagline || "Kathmandu Valley's Trusted Land Partner";

  const DEFAULT_BANNER: Stat[] = [
    { value: '🏡', label: 'Free Site Visit' },
    { value: '📋', label: 'Clear Legal Title' },
    { value: '💳', label: 'Easy Installments' },
    { value: '📞', label: '24/7 Support' },
  ];
  const bottomBanner = (bannerItems && bannerItems.length > 0) ? bannerItems : DEFAULT_BANNER;

  // Featured plot card
  const plotTitle    = featuredPlot?.title    || 'Bhaisepati Residential';
  const plotLocation = featuredPlot?.location || 'Lalitpur · 4 Ana';
  const plotPrice    = featuredPlot?.priceFrom || 'NPR 45L';
  const plotArea     = featuredPlot?.areaFrom  || null;
  const plotStatus   = featuredPlot?.status    || 'Available';
  const plotImage    = featuredPlot?.featuredImageUrl ? getImageUrl(featuredPlot.featuredImageUrl) : null;
  const plotStatusColor = plotStatus?.toLowerCase() === 'sold'    ? '#ef4444'
                        : plotStatus?.toLowerCase() === 'limited' ? '#f59e0b'
                        : '#22c55e';

  const words    = title.trim().split(' ');
  const mainText = words.slice(0, -2).join(' ');
  const redText  = words.slice(-2).join(' ');

  // ── Search filter state ──────────────────────────────────────
  const [filterCat,    setFilterCat]    = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSearch, setFilterSearch] = useState('');

  const handleSearch = () => {
    const p = new URLSearchParams();
    if (filterSearch.trim()) p.set('search', filterSearch.trim());
    if (filterCat)           p.set('category', filterCat);
    if (filterStatus)        p.set('status', filterStatus);
    router.push(`/plots${p.toString() ? '?' + p.toString() : ''}`);
  };

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <section style={{ position: 'relative', overflow: 'hidden', height: 'calc(100vh - 72px)', minHeight: '560px', maxHeight: 'calc(1080px - 72px)', display: 'flex', flexDirection: 'column', background: '#0D0D0D' }}>

      {/* ── Background ───────────────────────────────────────── */}
      <>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1A1A1A 0%, var(--color-secondary) 60%, #221010 100%)' }} />
        <div style={{ position: 'absolute', right: '-5%', top: '10%', width: '65%', height: '80%', background: 'radial-gradient(ellipse at center, rgba(204,20,20,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {!bgUrl && (
          <>
            <div className="hero-noimage-panel" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '48%', background: 'linear-gradient(160deg, #C01414 0%, #7a0a0a 100%)', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)', opacity: 0.72 }} />
            <div className="hero-noimage-panel" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '48%', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)', pointerEvents: 'none' }}>
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.12 }}>
                <defs><pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.6"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#mapgrid)" />
              </svg>
            </div>
          </>
        )}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '55%', height: '100%', background: 'radial-gradient(ellipse at left center, var(--color-secondary) 30%, transparent 70%)', pointerEvents: 'none' }} />
      </>

      {/* ── Full-bleed image panel (image mode) ──────────────── */}
      {bgUrl && (
        <div className="hero-image-panel" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '55%', zIndex: 2, clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0% 100%)' }}>
          <Image src={bgUrl} alt="Hero" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
          {/* Left-edge blend into dark background */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,13,13,0.85) 0%, rgba(13,13,13,0.3) 30%, transparent 60%)' }} />
          {/* Bottom vignette */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)' }} />
          {/* Bottom-right info overlay */}
          <div style={{ position: 'absolute', bottom: '2.5rem', right: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <div style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.3rem 0.875rem', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ✓ Verified Listings
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {bottomBanner.slice(0, 2).map((b) => (
                <div key={b.label} style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', borderRadius: '8px', padding: '0.4rem 0.75rem', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>{b.value}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'linear-gradient(to bottom, var(--color-primary), #8B0000)', zIndex: 3 }} />

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="container hero-content-container" style={{ position: 'relative', zIndex: 4, flex: 1, display: 'grid', gridTemplateColumns: bgUrl ? '1fr' : '1fr 1fr', alignItems: 'center', gap: '3rem', padding: '5rem 1.5rem 3rem', minHeight: 0 }}>
        <div className="hero-text-col" style={{ maxWidth: bgUrl ? '640px' : 'none' }}>

          {/* Trust badge */}
          <div className="animate-slide-right hero-trust-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(204,20,20,0.12)', border: '1px solid rgba(204,20,20,0.3)', borderRadius: '100px', padding: '0.35rem 0.9rem 0.35rem 0.5rem', marginBottom: '1.75rem', maxWidth: '100%' }}>
            <span style={{ display: 'inline-flex', width: '18px', height: '18px', background: 'var(--color-primary)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {badgeText}
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up delay-100" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.06, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            {mainText}{' '}
            <span style={{ color: '#E03030' }}>{redText}</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-slide-up delay-200" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', maxWidth: '520px', lineHeight: 1.7, fontWeight: 400 }}>
            {subtitle}
          </p>

          {/* ── Search filter widget ───────────────────────────── */}
          <div className="animate-slide-up delay-300 hero-search-widget" style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '1.75rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          }}>

            {/* Category tab row */}
            <div className="hero-tabs-row" style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.6rem 0.75rem' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  className="hero-tab-btn"
                  onClick={() => setFilterCat(cat.slug)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.18s',
                    background: filterCat === cat.slug ? 'var(--color-primary)' : 'transparent',
                    color: filterCat === cat.slug ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="hero-input-row" style={{ display: 'flex', gap: 0, alignItems: 'stretch', padding: '0.75rem' }}>
              {/* Location / Name search */}
              <div className="hero-search-input" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg style={{ position: 'absolute', left: '0.875rem', flexShrink: 0, pointerEvents: 'none' }} width="16" height="16" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  value={filterSearch}
                  onChange={e => setFilterSearch(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Search by location or plot name..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Divider */}
              <div className="hero-input-divider" style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.25rem 0', flexShrink: 0 }} />

              {/* Status select */}
              <div className="hero-status-wrap" style={{ position: 'relative', flexShrink: 0 }}>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: filterStatus ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    padding: '0.75rem 2.25rem 0.75rem 1rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    minWidth: '120px',
                    width: '100%',
                  }}
                >
                  {STATUS_OPTS.map(s => (
                    <option key={s.slug} value={s.slug} style={{ background: 'var(--color-secondary)', color: '#fff' }}>{s.label}</option>
                  ))}
                </select>
                <svg style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {/* Search button */}
              <button
                className="hero-search-btn"
                onClick={handleSearch}
                style={{
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 1.5rem',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.15s, transform 0.1s',
                  flexShrink: 0,
                  marginLeft: '0.5rem',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#A01010'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-primary)'; }}
              >
                Find Plots
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          {/* Secondary CTA buttons */}
          <div className="animate-fade-in delay-400" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0', flexWrap: 'wrap' }}>
            <Link
              href={cta2Url}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.7rem 1.4rem',
                border: '1.5px solid rgba(255,255,255,0.25)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.875rem', fontWeight: 700,
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(8px)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.55)'; el.style.background = 'rgba(255,255,255,0.13)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.25)'; el.style.background = 'rgba(255,255,255,0.07)'; }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 14a19.79 19.79 0 01-3.07-8.67A2 2 0 013.6 3.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 10.91a16 16 0 005 5l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              {cta2Text}
            </Link>
            <Link
              href="/plots"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.7rem 1.4rem',
                border: '1.5px solid rgba(204,20,20,0.5)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.875rem', fontWeight: 700,
                textDecoration: 'none',
                background: 'rgba(204,20,20,0.15)',
                backdropFilter: 'blur(8px)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--color-primary)'; el.style.background = 'rgba(204,20,20,0.3)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(204,20,20,0.5)'; el.style.background = 'rgba(204,20,20,0.15)'; }}
            >
              Browse All Plots
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>

        </div>

        {/* ── Right column: property card (no-image mode only) ── */}
        {!bgUrl && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="animate-fade-in delay-300 animate-float-slow hero-noimage-brandmark" style={{ width: '100%', maxWidth: '390px' }}>

              <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '1.25rem', marginBottom: '0.875rem', boxShadow: '0 20px 48px rgba(0,0,0,0.28)' }}>
                <div style={{ height: '130px', borderRadius: '10px', background: 'linear-gradient(135deg, #FECACA 0%, #FCA5A5 100%)', marginBottom: '1rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {plotImage ? (
                    <Image src={plotImage} alt={plotTitle} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <>
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
                        <defs><pattern id="plotgrid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="var(--color-primary)" strokeWidth="0.6"/></pattern></defs>
                        <rect width="100%" height="100%" fill="url(#plotgrid)" />
                      </svg>
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <svg width="36" height="36" fill="none" stroke="rgba(180,20,20,0.6)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                    </>
                  )}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: plotStatusColor, color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '100px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {plotStatus}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <div>
                    <div style={{ color: 'var(--color-secondary)', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>{plotTitle}</div>
                    <div style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {plotLocation}{plotArea ? ` · ${plotArea}` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--color-primary)', fontWeight: 900, fontSize: '1.05rem' }}>{plotPrice}</div>
                    <div style={{ color: '#9CA3AF', fontSize: '0.65rem' }}>Starting Price</div>
                  </div>
                </div>

                <div style={{ height: '1px', background: '#F3F4F6', margin: '0.75rem 0' }} />

                <div style={{ display: 'flex', gap: '1rem' }}>
                  {[['🛣️', 'Road Access'], ['📋', 'Lalpurja'], ['🏗️', 'Ready to Build']].map(([icon, label]) => (
                    <div key={label as string} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', flex: 1 }}>
                      <span style={{ fontSize: '0.9rem' }}>{icon}</span>
                      <span style={{ fontSize: '0.6rem', color: '#9CA3AF', fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {['✓ Verified Title', '✓ Free Site Visit', '✓ Reg. Support'].map((f) => (
                  <div key={f} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: '100px', padding: '0.35rem 0.85rem', fontSize: '0.68rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {f}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>


      {/* Scroll indicator */}
      <div className="animate-bounce-mouse" style={{ position: 'absolute', bottom: '1.5rem', left: '50%', zIndex: 4 }}>
        <svg width="22" height="34" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" viewBox="0 0 22 36">
          <rect x="1" y="1" width="20" height="34" rx="10" />
          <line x1="11" y1="8" x2="11" y2="15" strokeWidth="2.5" strokeLinecap="round" stroke="rgba(255,255,255,0.5)" />
        </svg>
      </div>

      <style>{`
        .hero-search-widget input::placeholder { color: rgba(255,255,255,0.35); }
        .hero-status-wrap select option { background: var(--color-secondary); color: #fff; }
        @media (max-width: 768px) {
          .hero-image-panel { display: none !important; }
        }

        /* ── Mobile: hero title & badge ─────────────────────────── */
        @media (max-width: 480px) {
          .hero-trust-badge { font-size: 0.65rem !important; }
          .hero-trust-badge span:last-child { font-size: 0.65rem !important; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: calc(100vw - 6rem); }
        }

        /* ── Mobile: stack the search widget vertically ─────────── */
        @media (max-width: 640px) {
          /* Category tabs: wrap to multiple rows, smaller buttons */
          .hero-tabs-row { flex-wrap: wrap !important; gap: 0.35rem !important; padding: 0.625rem !important; }
          .hero-tab-btn  { padding: 0.35rem 0.75rem !important; font-size: 0.75rem !important; }

          /* Input row: stack vertically */
          .hero-input-row { flex-wrap: wrap !important; gap: 0.5rem !important; padding: 0.625rem !important; }

          /* Search text input: full width */
          .hero-search-input { width: 100% !important; flex: none !important; }

          /* Hide the vertical divider */
          .hero-input-divider { display: none !important; }

          /* Status select: full width */
          .hero-status-wrap { width: 100% !important; flex-shrink: 1 !important; }
          .hero-status-wrap select { min-width: 0 !important; padding: 0.75rem 2rem 0.75rem 0.875rem !important; border: 1px solid rgba(255,255,255,0.15) !important; border-radius: 8px !important; background: rgba(255,255,255,0.06) !important; }

          /* Search button: full width */
          .hero-search-btn { width: 100% !important; justify-content: center !important; padding: 0.75rem !important; border-radius: 8px !important; margin-left: 0 !important; }
        }
      `}</style>
    </section>
  );
}
