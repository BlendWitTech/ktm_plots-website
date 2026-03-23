'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: 'var(--color-accent)' }}>
      <div className="container" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>

        {/* Icon */}
        <div style={{ width: '80px', height: '80px', margin: '0 auto 2rem', background: 'linear-gradient(135deg, #374151, #1F2937)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}>
          <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: 'var(--color-secondary)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Something went wrong
        </h1>
        <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '42ch', margin: '0 auto 2.5rem' }}>
          We encountered an unexpected error loading this page. Please try again or return home.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            Try Again
          </button>
          <Link href="/" className="btn-outline-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Go Home
          </Link>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
            Quick Navigation
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
