'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  phone?: string | null;
}

/**
 * FloatingActions — renders two fixed overlays:
 * 1. Back-to-top button — appears after scrolling 400px, smooth-scrolls to top
 * 2. Mobile CTA strip — appears after 800px, shows "Call Us" + "Request a Quote"
 *    Hidden on desktop (>= 768px)
 */
export default function FloatingActions({ phone }: Props) {
  const [showBackTop, setShowBackTop] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setShowBackTop(y > 400);
        setShowMobileCta(y > 800);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* ── Back-to-top button ─────────────────────────────────── */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="back-top-btn"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '1.5rem',
          zIndex: 200,
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'var(--color-secondary)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          transition: 'opacity 0.25s ease, transform 0.25s ease, background 0.2s',
          opacity: showBackTop ? 1 : 0,
          transform: showBackTop ? 'translateY(0)' : 'translateY(12px)',
          pointerEvents: showBackTop ? 'auto' : 'none',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-primary)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-secondary)'; }}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>

      {/* ── Mobile CTA strip (hidden on desktop via CSS) ───────── */}
      <div
        className="mobile-cta-strip"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 199,
          padding: '0.75rem 1rem',
          background: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '0.75rem',
          transition: 'transform 0.3s ease',
          transform: showMobileCta ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {phone && (
          <a
            href={`tel:${phone}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: 'var(--color-accent)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--color-secondary)',
              fontWeight: 700,
              fontSize: '0.875rem',
              border: '1px solid #E5E7EB',
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            Call Us
          </a>
        )}
        <Link
          href="/contact"
          style={{
            flex: phone ? 2 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'var(--color-primary)',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.875rem',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Request a Quote
        </Link>
      </div>

      {/* Hide mobile CTA strip on desktop */}
      <style>{`
        @media (min-width: 768px) {
          .mobile-cta-strip { display: none !important; }
        }
      `}</style>
    </>
  );
}
