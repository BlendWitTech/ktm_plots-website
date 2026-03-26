import Link from 'next/link';
import type { SiteData } from '@/lib/cms';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Props { siteData: SiteData; secData?: Record<string, any>; }

export default function CtaStrip({ siteData, secData = {} }: Props) {
  const { settings } = siteData;
  const ctaText             = settings.ctaText || secData.buttons?.[0]?.text || 'Browse Available Plots';
  const ctaUrl              = settings.ctaUrl  || secData.buttons?.[0]?.url  || '/plots';
  const badge               = secData.badge    || 'Start Your Journey';
  const heading             = secData.heading  || 'Secure Your Piece of Kathmandu Valley';
  const secondaryButtonText = secData.secondaryButtonText || 'Schedule a Free Visit';
  const secondaryButtonUrl  = secData.secondaryButtonUrl  || '/contact';

  const stats = [
    { value: '500+',  label: 'Plots Sold' },
    { value: '10+',   label: 'Years' },
    { value: '100%',  label: 'Legal Titles' },
  ];

  return (
    <section style={{ padding: '5rem 0', background: 'var(--color-accent)' }}>
      <div className="container">
        <ScrollReveal animation="scale" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.14)',
        }}>

          {/* Left panel — Red */}
          <div className="cta-left-panel" style={{
            background: 'linear-gradient(140deg, var(--color-primary) 0%, #8B0000 100%)',
            padding: 'clamp(3rem, 5vw, 4.5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Dot texture */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
            {/* Decorative rings */}
            <div style={{ position: 'absolute', bottom: '-70px', right: '-70px', width: '220px', height: '220px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '130px', height: '130px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '0.35rem 1rem', borderRadius: '100px', marginBottom: '1.25rem' }}>
                {badge}
              </div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.5px' }}>
                {heading}
              </h2>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', paddingTop: '1.75rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — Dark */}
          <div className="cta-right-panel" style={{
            background: '#1A1A1A',
            padding: 'clamp(3rem, 5vw, 4.5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1.75rem',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.75, margin: 0 }}>
              {settings.tagline || 'Browse our verified plots or speak with a property consultant for a free consultation and guided site visit.'}
            </p>

            {/* Phone */}
            {settings.contactPhone && (
              <a href={`tel:${settings.contactPhone}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--color-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Call Us Free</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>{settings.contactPhone}</div>
                </div>
              </a>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href={ctaUrl} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', background: 'var(--color-primary)', color: '#FFFFFF', fontWeight: 800, padding: '1rem 2rem', borderRadius: '10px', textDecoration: 'none', fontSize: '0.975rem', boxShadow: '0 4px 16px rgba(204,20,20,0.35)', transition: 'all 0.2s' }}>
                {ctaText}
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>
              <Link href={secondaryButtonUrl} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: 'rgba(255,255,255,0.75)', fontWeight: 600, padding: '1rem 2rem', borderRadius: '10px', textDecoration: 'none', fontSize: '0.975rem', border: '1.5px solid rgba(255,255,255,0.15)', transition: 'all 0.2s' }}>
                {secondaryButtonText}
              </Link>
            </div>
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
}
