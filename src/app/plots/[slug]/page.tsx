import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPlotBySlug, getImageUrl, renderContent } from '@/lib/cms';
import PlotGallery from '@/components/PlotGallery';
import WishlistButton from '@/components/ui/WishlistButton';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const plot = await getPlotBySlug(slug);
  if (!plot) return { title: 'Plot Not Found' };
  const seo = plot.seo;
  const metaTitle = seo?.title || plot.title;
  const description = seo?.description || plot.description || `${plot.title} — verified land plot in Kathmandu Valley.`;
  const ogImgUrl = getImageUrl(seo?.ogImage || plot.featuredImageUrl);
  const ogImages = seo?.ogImages?.length
    ? seo.ogImages.map(u => ({ url: u, width: 1200, height: 630, alt: metaTitle }))
    : ogImgUrl ? [{ url: ogImgUrl, width: 1200, height: 630, alt: metaTitle }] : undefined;
  return {
    title: metaTitle,
    description,
    ...(seo?.keywords?.length && { keywords: seo.keywords }),
    openGraph: { title: metaTitle, description, type: 'article', ...(ogImages && { images: ogImages }) },
    twitter: { card: 'summary_large_image', title: metaTitle, description, ...(ogImgUrl && { images: [ogImgUrl] }) },
  };
}

function SpecItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem', background: '#F9FAFB', borderRadius: '10px', border: '1px solid #F0F0F0' }}>
      <div style={{ width: '34px', height: '34px', background: '#FEE2E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="16" height="16" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24"><path d={icon}/></svg>
      </div>
      <div>
        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{label}</div>
        <div style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: '0.875rem', lineHeight: 1.3 }}>{value}</div>
      </div>
    </div>
  );
}

export default async function PlotDetailPage({ params }: Props) {
  const { slug } = await params;
  const plot = await getPlotBySlug(slug);
  if (!plot) notFound();

  const status = plot.status?.toLowerCase() ?? 'available';
  const heroImgUrl = getImageUrl(plot.featuredImageUrl);
  const extraImages = (plot.images ?? []).map((img: string) => getImageUrl(img)).filter(Boolean) as string[];
  const allImages = [
    ...(heroImgUrl ? [heroImgUrl] : []),
    ...extraImages,
  ];

  const statusConfig = status === 'sold'
    ? { label: 'Sold Out', bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444', darkBg: 'rgba(239,68,68,0.15)', darkColor: '#FCA5A5' }
    : status === 'limited'
    ? { label: 'Limited Availability', bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B', darkBg: 'rgba(245,158,11,0.15)', darkColor: '#FCD34D' }
    : { label: 'Available Now', bg: '#D1FAE5', color: '#065F46', dot: '#10B981', darkBg: 'rgba(16,185,129,0.15)', darkColor: '#6EE7B7' };

  // Specs to display
  const specs: { icon: string; label: string; value: string }[] = [];
  if (plot.location)       specs.push({ icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', label: 'Location', value: plot.location });
  if (plot.category)       specs.push({ icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', label: 'Plot Type', value: plot.category.name });
  if ((plot as any).plotNumber) specs.push({ icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Kitta / Plot No.', value: (plot as any).plotNumber });
  if ((plot as any).landType)   specs.push({ icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Land Type', value: (plot as any).landType });
  if (plot.areaFrom)       specs.push({ icon: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z', label: 'Plot Area', value: `${plot.areaFrom}${plot.areaTo && plot.areaTo !== plot.areaFrom ? ` – ${plot.areaTo}` : ''}` });
  if ((plot as any).totalPlots) specs.push({ icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Total / Available', value: `${(plot as any).totalPlots} Plots${(plot as any).availablePlots != null ? ` (${(plot as any).availablePlots} available)` : ''}` });
  if (plot.priceFrom)      specs.push({ icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', label: 'Starting Price', value: `NPR ${Number(plot.priceFrom).toLocaleString('en-NP')}${plot.priceTo ? ` – ${Number(plot.priceTo).toLocaleString('en-NP')}` : '+'}` });
  if (plot.facing)         specs.push({ icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', label: 'Facing', value: plot.facing });
  if (plot.roadAccess)     specs.push({ icon: 'M3 17l18 0 M5 7h14 M7 12h10', label: 'Road Access', value: plot.roadAccess });

  // Dynamic attributes
  const extraAttrs: { label: string; value: string }[] = [];
  if (plot.attributes && typeof plot.attributes === 'object') {
    for (const [k, v] of Object.entries(plot.attributes)) {
      if (v !== null && v !== undefined && v !== '') {
        const label = k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
        extraAttrs.push({ label, value: String(v) });
      }
    }
  }

  const trustItems = [
    { path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Verified Legal Title (Lalpurja)' },
    { path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'No Hidden Charges' },
    { path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', label: 'Full Registration Support' },
    { path: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Free Site Visit Arranged' },
    { path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Dedicated Advisor Assigned' },
  ];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="plot-hero-wrap animate-fade-in" style={{ position: 'relative', background: '#1A1A1A', minHeight: '440px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
        {/* Background — image or gradient */}
        {heroImgUrl ? (
          <>
            <Image src={heroImgUrl} alt={plot.title} fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.25) 100%)' }} />
          </>
        ) : (
          <>
            {/* No-image fallback — rich gradient with decorative elements */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--color-secondary) 0%, #2D0A0A 50%, #1a0606 100%)' }} />
            <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(204,20,20,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', left: '-30px', bottom: '-30px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(204,20,20,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
            {/* Decorative land plot icon */}
            <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.07 }}>
              <svg width="260" height="260" viewBox="0 0 100 100" fill="none" stroke="var(--color-primary)" strokeWidth="1">
                <rect x="10" y="10" width="80" height="80" rx="2"/>
                <line x1="10" y1="50" x2="90" y2="50"/>
                <line x1="50" y1="10" x2="50" y2="90"/>
                <circle cx="50" cy="50" r="8"/>
                <path d="M20 20 L35 35 M65 20 L80 35 M20 80 L35 65 M65 80 L80 65"/>
              </svg>
            </div>
          </>
        )}

        {/* Left accent bar */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--color-primary)' }} />

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '1.5rem 1.5rem 2.5rem' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            <Link href="/plots" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Plots</Link>
            {plot.category && (
              <>
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                <Link href={`/plots/category/${plot.category.slug}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{plot.category.name}</Link>
              </>
            )}
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>{plot.title}</span>
          </div>

          {/* Status + category badges */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.875rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: statusConfig.darkBg, color: statusConfig.darkColor, border: `1px solid ${statusConfig.darkColor}40`, fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '9999px', backdropFilter: 'blur(8px)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusConfig.dot, display: 'inline-block' }} />
              {statusConfig.label}
            </span>
            {plot.category && (
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.7rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                {plot.category.name}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="animate-slide-up delay-100" style={{ color: '#FFFFFF', fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', fontWeight: 900, marginBottom: '0.75rem', lineHeight: 1.2, maxWidth: '720px', textShadow: heroImgUrl ? '0 2px 12px rgba(0,0,0,0.5)' : 'none' }}>
            {plot.title}
          </h1>

          {/* Location */}
          {plot.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <svg width="14" height="14" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {plot.location}
            </div>
          )}

          {/* Key metrics row */}
          <div className="plot-hero-stats animate-slide-up delay-200" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: '100%', overflow: 'hidden' }}>
            {plot.priceFrom && (
              <div style={{ background: 'rgba(204,20,20,0.2)', border: '1px solid rgba(204,20,20,0.4)', borderRadius: '10px', padding: '0.75rem 1.1rem', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Starting From</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FF8080', lineHeight: 1 }}>
                  NPR {Number(plot.priceFrom).toLocaleString('en-NP')}
                </div>
                {plot.priceTo && (
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.15rem' }}>
                    up to NPR {Number(plot.priceTo).toLocaleString('en-NP')}
                  </div>
                )}
              </div>
            )}
            {plot.areaFrom && (
              <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.75rem 1.1rem', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Plot Area</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
                  {plot.areaFrom}{plot.areaTo && plot.areaTo !== plot.areaFrom ? ` – ${plot.areaTo}` : ''}
                </div>
              </div>
            )}
            {plot.facing && (
              <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.75rem 1.1rem', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Facing</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>{plot.facing}</div>
              </div>
            )}
            {plot.roadAccess && (
              <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.75rem 1.1rem', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Road Access</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>{plot.roadAccess}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <section style={{ padding: '2.5rem 0 5rem', background: 'var(--color-accent)' }}>
        <div className="container">
          <div className="plot-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>

            {/* ── Left column ── */}
            <div className="animate-slide-up">

              {/* Gallery or no-image placeholder */}
              {allImages.length > 0 ? (
                <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', marginBottom: '1.5rem', background: '#fff' }}>
                  <PlotGallery images={allImages} title={plot.title} />
                </div>
              ) : (
                <div style={{ borderRadius: '16px', background: 'linear-gradient(135deg, var(--color-secondary), #2D0A0A)', marginBottom: '1.5rem', padding: '3rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
                  <div style={{ flexShrink: 0, opacity: 0.25 }}>
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="var(--color-primary)" strokeWidth="1.5">
                      <rect x="10" y="10" width="80" height="80" rx="4"/>
                      <line x1="10" y1="50" x2="90" y2="50"/>
                      <line x1="50" y1="10" x2="50" y2="90"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-primary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Property Listing</div>
                    <div style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{plot.title}</div>
                    {plot.location && <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>📍 {plot.location}</div>}
                    <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Contact us to schedule a site visit and see this plot in person.</div>
                  </div>
                </div>
              )}

              {/* About This Plot */}
              {(plot.description || plot.content) && (
                <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '2px solid #F3F4F6' }}>
                    <div style={{ width: '36px', height: '36px', background: '#FEE2E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="17" height="17" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-secondary)', margin: 0 }}>About This Plot</h2>
                  </div>
                  {plot.content ? (
                    <div
                      className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-red-600 prose-li:text-slate-600"
                      dangerouslySetInnerHTML={{ __html: renderContent(plot.content) }}
                    />
                  ) : (
                    <p style={{ color: '#4B5563', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>{plot.description}</p>
                  )}
                </div>
              )}

              {/* Plot Specifications */}
              {specs.length > 0 && (
                <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '2px solid #F3F4F6' }}>
                    <div style={{ width: '36px', height: '36px', background: '#FEE2E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="17" height="17" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    </div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-secondary)', margin: 0 }}>Plot Specifications</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {specs.map((spec) => (
                      <SpecItem key={spec.label} icon={spec.icon} label={spec.label} value={spec.value} />
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Attributes */}
              {extraAttrs.length > 0 && (
                <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '2px solid #F3F4F6' }}>
                    <div style={{ width: '36px', height: '36px', background: '#FEE2E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="17" height="17" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-secondary)', margin: 0 }}>Additional Details</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {extraAttrs.map((attr) => (
                      <div key={attr.label} style={{ padding: '0.875rem', background: '#F9FAFB', borderRadius: '10px', border: '1px solid #F0F0F0' }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{attr.label}</div>
                        <div style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: '0.875rem' }}>{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Map */}
              {(plot as any).mapUrl && (
                <div style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 1.5rem', borderBottom: '2px solid #F3F4F6' }}>
                    <div style={{ width: '36px', height: '36px', background: '#FEE2E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="17" height="17" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-secondary)', margin: 0 }}>Location Map</h2>
                  </div>
                  <div className="plot-map-container" style={{ width: '100%' }}>
                    <iframe
                      src={(plot as any).mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0, display: 'block', width: '100%', height: '100%' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map for ${plot.title}`}
                    />
                  </div>
                </div>
              )}

              {/* Why Buy With KTM Plots */}
              <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius: '16px', padding: '1.75rem 2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '36px', height: '36px', background: 'rgba(204,20,20,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="17" height="17" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  </div>
                  <h3 style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1rem', margin: 0 }}>Why Buy With KTM Plots?</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.6rem' }}>
                  {trustItems.map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '28px', height: '28px', background: 'rgba(204,20,20,0.15)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="13" height="13" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24"><path d={item.path}/></svg>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right column: Sticky sidebar ── */}
            <div className="plot-detail-sidebar animate-slide-up delay-100" style={{ position: 'sticky', top: '5rem' }}>

              {/* Price card */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', marginBottom: '1.25rem' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--color-primary), #8B0000)', padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', right: '20px', bottom: '-30px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                  {plot.priceFrom ? (
                    <>
                      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.3rem' }}>Starting Price</div>
                      <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1, position: 'relative' }}>
                        NPR {Number(plot.priceFrom).toLocaleString('en-NP')}
                      </div>
                      {plot.priceTo && (
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem', fontWeight: 500 }}>
                          Up to NPR {Number(plot.priceTo).toLocaleString('en-NP')}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Price on Request</div>
                  )}
                  <div style={{ marginTop: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusConfig.dot }} />
                    {statusConfig.label}
                  </div>
                </div>

                <div style={{ padding: '1.5rem 1.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.25rem' }}>
                    {plot.areaFrom && (
                      <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '0.75rem', border: '1px solid #F0F0F0' }}>
                        <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Area</div>
                        <div style={{ fontWeight: 800, color: 'var(--color-secondary)', fontSize: '0.85rem', lineHeight: 1.2 }}>
                          {plot.areaFrom}{plot.areaTo && plot.areaTo !== plot.areaFrom ? `–${plot.areaTo}` : ''}
                        </div>
                      </div>
                    )}
                    {plot.category && (
                      <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '0.75rem', border: '1px solid #F0F0F0' }}>
                        <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Type</div>
                        <div style={{ fontWeight: 800, color: 'var(--color-secondary)', fontSize: '0.85rem' }}>{plot.category.name}</div>
                      </div>
                    )}
                    {plot.facing && (
                      <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '0.75rem', border: '1px solid #F0F0F0' }}>
                        <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Facing</div>
                        <div style={{ fontWeight: 800, color: 'var(--color-secondary)', fontSize: '0.85rem' }}>{plot.facing}</div>
                      </div>
                    )}
                    {plot.roadAccess && (
                      <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '0.75rem', border: '1px solid #F0F0F0', gridColumn: plot.facing ? 'auto' : '1 / -1' }}>
                        <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Road</div>
                        <div style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: '0.82rem' }}>{plot.roadAccess}</div>
                      </div>
                    )}
                    {plot.location && (
                      <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '0.75rem', border: '1px solid #F0F0F0', gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Location</div>
                        <div style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <svg width="11" height="11" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {plot.location}
                        </div>
                      </div>
                    )}
                  </div>

                  {status !== 'sold' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <Link
                        href={`/contact?plot=${plot.slug}`}
                        className="btn-primary"
                        style={{ textAlign: 'center', padding: '0.9rem', fontSize: '0.95rem', borderRadius: '10px', fontWeight: 800 }}
                      >
                        Enquire About This Plot
                      </Link>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
                        <Link
                          href="/contact"
                          className="btn-outline-dark"
                          style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.875rem', borderRadius: '10px' }}
                        >
                          Schedule Site Visit
                        </Link>
                        <WishlistButton plotId={plot.id} variant="inline" />
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem', background: '#FEE2E2', borderRadius: '10px' }}>
                      <div style={{ fontWeight: 700, color: '#991B1B', marginBottom: '0.4rem' }}>This plot has been sold</div>
                      <Link href="/plots" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>Browse available plots →</Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick contact */}
              <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.1rem 1.4rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.25rem', display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', background: '#FEE2E2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="19" height="19" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 14a19.79 19.79 0 01-3.07-8.67A2 2 0 013.6 3.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 10.91a16 16 0 005 5l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Have Questions?</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: '0.875rem' }}>Talk to our team now</div>
                </div>
                <Link href="/contact" style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.45rem 0.875rem', borderRadius: '7px', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Contact Us
                </Link>
              </div>

              {/* KTM Guarantee */}
              <div style={{ background: 'var(--color-secondary)', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>
                  KTM Plots Guarantee
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {trustItems.map((item) => (
                    <li key={item.label} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', alignItems: 'center' }}>
                      <svg width="13" height="13" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

    </>
  );
}
