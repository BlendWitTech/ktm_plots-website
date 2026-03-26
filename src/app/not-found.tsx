import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: 'var(--color-accent)' }}>
      <div className="container" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>

        {/* Large 404 */}
        <div className="animate-fade-in" style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
          <span style={{
            fontSize: 'clamp(7rem, 20vw, 12rem)',
            fontWeight: 900,
            color: 'rgba(204,20,20,0.07)',
            lineHeight: 1,
            letterSpacing: '-0.05em',
            userSelect: 'none',
            display: 'block',
          }}>
            404
          </span>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--color-primary), #8B0000)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(204,20,20,0.3)',
            }}>
              <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        </div>

        <h1 className="animate-slide-up delay-100" style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: 900,
          color: 'var(--color-secondary)',
          marginBottom: '1rem',
          letterSpacing: '-0.02em',
        }}>
          This plot of land is unmapped
        </h1>

        <p className="animate-fade-in delay-200" style={{
          color: '#6B7280',
          fontSize: '1.05rem',
          lineHeight: 1.75,
          maxWidth: '42ch',
          margin: '0 auto 2.5rem',
        }}>
          The page you're looking for has moved, been removed, or never existed. Let's get you back on solid ground.
        </p>

        <div className="animate-slide-up delay-300" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Go Home
          </Link>
          <Link href="/plots" className="btn-outline-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Browse All Plots
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </Link>
        </div>

        {/* Quick links */}
        <div className="animate-fade-in delay-400" style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
            You might be looking for
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { href: '/plots', label: 'Available Plots' },
              { href: '/about', label: 'About Us' },
              { href: '/services', label: 'Our Services' },
              { href: '/blog', label: 'Blog' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="not-found-pill">
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
