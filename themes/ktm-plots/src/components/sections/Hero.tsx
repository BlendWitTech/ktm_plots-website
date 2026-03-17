'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { SiteData, Project } from '@/lib/cms';
import { getImageUrl } from '@/lib/cms';

interface Stat { value: string; label: string; }
interface Props { siteData: SiteData; stats?: Stat[]; bannerItems?: Stat[]; featuredPlot?: Project | null; }

const DEFAULT_STATS: Stat[] = [
  { value: '500+', label: 'Plots Sold' },
  { value: '50+',  label: 'Locations' },
  { value: '10+',  label: 'Yrs Experience' },
  { value: '100%', label: 'Legal Titles' },
];

function AnimatedCounter({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const targetNum = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTriggered(true); observer.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered) return;
    const timer = setTimeout(() => {
      if (isNaN(targetNum)) return;
      const duration = 1800;
      const start = performance.now();
      const animate = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setCount(Math.floor(ease * targetNum));
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [triggered, targetNum, delay]);

  return (
    <div ref={ref} className="text-center">
      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#CC1414', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
        {isNaN(targetNum) ? value : `${count}${suffix}`}
      </div>
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

export default function Hero({ siteData, stats, bannerItems, featuredPlot }: Props) {
  const { settings } = siteData;
  const title       = settings.heroTitle    || 'Find Your Perfect Land Plot';
  const subtitle    = settings.heroSubtitle || 'Premium plots with clear legal titles, transparent pricing, and full registration support across Kathmandu Valley.';
  const bgUrl       = getImageUrl(settings.heroBgImage);
  const ctaText     = settings.ctaText  || 'Browse Plots';
  const ctaUrl      = settings.ctaUrl   || '/plots';
  const cta2Text    = (settings as any).cta2Text  || 'Free Consultation';
  const cta2Url     = (settings as any).cta2Url   || '/contact';
  const badgeText   = (settings as any).heroBadge || settings.tagline || "Kathmandu Valley's Trusted Land Partner";
  const heroStats   = (stats && stats.length > 0) ? stats : DEFAULT_STATS;

  const DEFAULT_BANNER: Stat[] = [
    { value: '🏡', label: 'Free Site Visit' },
    { value: '📋', label: 'Clear Legal Title' },
    { value: '💳', label: 'Easy Installments' },
    { value: '📞', label: '24/7 Support' },
  ];
  const bottomBanner = (bannerItems && bannerItems.length > 0) ? bannerItems : DEFAULT_BANNER;

  // Featured plot card data (falls back to hardcoded defaults)
  const plotTitle    = featuredPlot?.title    || 'Bhaisepati Residential';
  const plotLocation = featuredPlot?.location || 'Lalitpur · 4 Ana';
  const plotPrice    = featuredPlot?.priceFrom || 'NPR 45L';
  const plotArea     = featuredPlot?.areaFrom  || null;
  const plotStatus   = featuredPlot?.status    || 'Available';
  const plotImage    = featuredPlot?.featuredImageUrl ? getImageUrl(featuredPlot.featuredImageUrl) : null;
  const plotStatusColor = plotStatus?.toLowerCase() === 'sold'   ? '#ef4444'
                        : plotStatus?.toLowerCase() === 'limited' ? '#f59e0b'
                        : '#22c55e';

  const words    = title.trim().split(' ');
  const mainText = words.slice(0, -2).join(' ');
  const redText  = words.slice(-2).join(' ');

  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0D0D0D' }}>

      {/* ── Background ──────────────────────────────────────────── */}
      {bgUrl ? (
        <>
          <Image src={bgUrl} alt="Hero background" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.75) 45%, rgba(10,10,10,0.35) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '220px', background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)' }} />
        </>
      ) : (
        <>
          {/* Base: softer dark, not pitch black */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1A1A1A 0%, #1E1E1E 60%, #221010 100%)' }} />
          {/* Subtle red glow — very soft */}
          <div style={{ position: 'absolute', right: '-5%', top: '10%', width: '65%', height: '80%', background: 'radial-gradient(ellipse at center, rgba(204,20,20,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
          {/* Diagonal red panel — softer and less opaque */}
          <div className="hero-noimage-panel" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '48%', background: 'linear-gradient(160deg, #C01414 0%, #7a0a0a 100%)', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)', opacity: 0.72 }} />
          {/* Map grid texture on red panel */}
          <div className="hero-noimage-panel" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '48%', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)', pointerEvents: 'none' }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.12 }}>
              <defs>
                <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.6"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapgrid)" />
            </svg>
          </div>
          {/* Left blend */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '55%', height: '100%', background: 'radial-gradient(ellipse at left center, #1E1E1E 30%, transparent 70%)', pointerEvents: 'none' }} />
        </>
      )}

      {/* Subtle dot texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none', zIndex: 1 }} />

      {/* Red left accent bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'linear-gradient(to bottom, #CC1414, #8B0000)', zIndex: 3 }} />

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="container hero-content-container" style={{ position: 'relative', zIndex: 4, flex: 1, display: 'flex', alignItems: 'center', padding: '7rem 1.5rem 5rem' }}>
        <div className="hero-text-col" style={{ maxWidth: bgUrl ? '640px' : '50%' }}>

          {/* Trust badge */}
          <div className="animate-slide-right" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(204,20,20,0.12)', border: '1px solid rgba(204,20,20,0.3)', borderRadius: '100px', padding: '0.35rem 0.9rem 0.35rem 0.5rem', marginBottom: '2rem', whiteSpace: 'nowrap' }}>
            <span style={{ display: 'inline-flex', width: '18px', height: '18px', background: '#CC1414', borderRadius: '50%', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {badgeText}
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up delay-100" style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.06, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            {mainText}{' '}
            <span style={{ color: '#E03030' }}>{redText}</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-slide-up delay-200" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.55)', marginBottom: '2.75rem', maxWidth: '520px', lineHeight: 1.85, fontWeight: 400 }}>
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="animate-slide-up delay-300 hero-cta-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '4.5rem' }}>
            <Link
              href={ctaUrl}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#CC1414', color: '#fff', fontWeight: 700, padding: '0.95rem 2.2rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.95rem', boxShadow: '0 8px 28px rgba(204,20,20,0.45)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 14px 36px rgba(204,20,20,0.55)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = '0 8px 28px rgba(204,20,20,0.45)'; }}
            >
              {ctaText}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link
              href={cta2Url}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600, padding: '0.95rem 2.2rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.95rem', border: '1.5px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)', transition: 'background 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.12)'; el.style.borderColor = 'rgba(255,255,255,0.4)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.06)'; el.style.borderColor = 'rgba(255,255,255,0.18)'; }}
            >
              {cta2Text}
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-slide-up delay-400 hero-stats-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
            {heroStats.map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
                {i > 0 && <div className="hero-stats-divider" style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 1.75rem', alignSelf: 'stretch' }} />}
                <AnimatedCounter value={s.value} label={s.label} delay={i * 120} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column: floating property showcase (no-image mode) ── */}
        {!bgUrl && (
          <div className="animate-fade-in delay-300 hero-noimage-brandmark" style={{ position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: '390px', maxWidth: '42%' }}>

            {/* Main property card — white */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              padding: '1.25rem',
              marginBottom: '0.875rem',
              boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
            }}>
              {/* Plot image / placeholder */}
              <div style={{ height: '130px', borderRadius: '10px', background: 'linear-gradient(135deg, #FECACA 0%, #FCA5A5 100%)', marginBottom: '1rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {plotImage ? (
                  <Image src={plotImage} alt={plotTitle} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <>
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
                      <defs>
                        <pattern id="plotgrid" width="28" height="28" patternUnits="userSpaceOnUse">
                          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#CC1414" strokeWidth="0.6"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#plotgrid)" />
                    </svg>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <svg width="36" height="36" fill="none" stroke="rgba(180,20,20,0.6)" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                  </>
                )}
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: plotStatusColor, color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '100px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {plotStatus}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <div>
                  <div style={{ color: '#1E1E1E', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>{plotTitle}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {plotLocation}{plotArea ? ` · ${plotArea}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#CC1414', fontWeight: 900, fontSize: '1.05rem' }}>{plotPrice}</div>
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

            {/* Feature pills */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {['✓ Verified Title', '✓ Free Site Visit', '✓ Reg. Support'].map((f) => (
                <div key={f} style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.8)',
                  borderRadius: '100px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  {f}
                </div>
              ))}
            </div>

            {/* Bottom counter badge */}
            <div style={{ marginTop: '0.875rem', background: '#CC1414', borderRadius: '12px', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', boxShadow: '0 8px 24px rgba(204,20,20,0.35)' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>50+ Active Listings</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem' }}>Across Kathmandu Valley</div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── Bottom stats strip (image mode) ─────────────────────── */}
      {bgUrl && bottomBanner.length > 0 && (
        <div style={{ position: 'relative', zIndex: 4, borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', padding: '1.25rem 0' }}>
          <div className="container hero-banner-strip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', padding: '0 1.5rem' }}>
            {bottomBanner.map((b) => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{b.value}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em' }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <div className="animate-bounce-mouse" style={{ position: 'absolute', bottom: bgUrl ? '5rem' : '2.5rem', left: '50%', zIndex: 4 }}>
        <svg width="22" height="34" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" viewBox="0 0 22 36">
          <rect x="1" y="1" width="20" height="34" rx="10" />
          <line x1="11" y1="8" x2="11" y2="15" strokeWidth="2.5" strokeLinecap="round" stroke="rgba(255,255,255,0.5)" />
        </svg>
      </div>
    </section>
  );
}
