'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { SiteData, Menu } from '@/lib/cms';
import { getImageUrl } from '@/lib/cms';

interface Props {
  siteData: SiteData;
  menu?: Menu;
}

export default function Header({ siteData, menu }: Props) {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef             = useRef<HTMLElement>(null);
  const pathname              = usePathname();
  const { settings }          = siteData;
  const logoUrl               = getImageUrl(settings.logoUrl);

  const items = menu?.items?.sort((a, b) => a.order - b.order) ?? [
    { id: '1', label: 'Home',     url: '/',         order: 1 },
    { id: '2', label: 'About',    url: '/about',    order: 2 },
    { id: '3', label: 'Plots',    url: '/plots',    order: 3 },
    { id: '4', label: 'Services', url: '/services', order: 4 },
    { id: '5', label: 'Blog',     url: '/blog',     order: 5 },
    { id: '6', label: 'Contact',  url: '/contact',  order: 6 },
  ];

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (url: string) => {
    if (url === '/') return pathname === '/';
    return pathname.startsWith(url);
  };

  return (
    <header
      ref={headerRef}
      style={{
        background: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '3px solid var(--color-primary)',
        transition: 'box-shadow 0.25s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.14)' : '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={settings.siteTitle || 'KTM Plots'}
              width={150}
              height={56}
              style={{ objectFit: 'contain', maxHeight: '56px', width: 'auto' }}
              priority
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'stretch', lineHeight: 1 }}>
              <span style={{ background: 'var(--color-primary)', color: '#fff', fontWeight: 900, fontSize: '1.45rem', letterSpacing: '-0.5px', padding: '6px 12px' }}>
                KTM
              </span>
              <span style={{ background: 'var(--color-secondary)', color: '#fff', fontWeight: 900, fontSize: '1.45rem', letterSpacing: '4px', padding: '6px 12px' }}>
                PLOTS
              </span>
            </div>
          )}
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }} className="desktop-nav">
          {items.map((item) => {
            const active = isActive(item.url);
            const isExternal = item.target === '_blank';
            return (
              <Link
                key={item.id}
                href={item.url}
                target={item.target || undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                style={{
                  color: active ? 'var(--color-primary)' : 'var(--color-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: active ? 700 : 600,
                  transition: 'color 0.2s',
                  position: 'relative',
                  paddingBottom: '2px',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--color-secondary)'; }}
              >
                {item.label}
                {active && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--color-primary)',
                    borderRadius: '1px',
                  }} />
                )}
              </Link>
            );
          })}
          <Link href="/contact" className="btn-primary" style={{ padding: '0.5rem 1.4rem', fontSize: '0.875rem' }}>
            Get a Quote
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
          className="hamburger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg width="26" height="26" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" viewBox="0 0 24 24">
            {open
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="13" x2="21" y2="13"/><line x1="3" y1="19" x2="21" y2="19"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu — animated slide down */}
      <div
        style={{
          background: 'var(--color-secondary)',
          borderTop: open ? '2px solid var(--color-primary)' : 'none',
          maxHeight: open ? '80vh' : '0',
          overflowY: open ? 'auto' : 'hidden',
          overflowX: 'hidden',
          transition: 'max-height 0.3s cubic-bezier(0.22,1,0.36,1)',
        }}
        className="mobile-menu"
        aria-hidden={!open}
      >
        <div style={{ padding: '0.75rem 1.5rem 1.5rem' }}>
          {items.map((item) => {
            const active = isActive(item.url);
            const isExternal = item.target === '_blank';
            return (
              <Link
                key={item.id}
                href={item.url}
                target={item.target || undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: active ? 'var(--color-primary)' : '#E5E7EB',
                  textDecoration: 'none',
                  padding: '0.8rem 0',
                  fontSize: '1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  fontWeight: active ? 700 : 500,
                }}
              >
                {item.label}
                {active && (
                  <svg width="16" height="16" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </Link>
            );
          })}
          <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.25rem' }} onClick={() => setOpen(false)}>
            Get a Quote
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: block !important; }
        }
      `}</style>
    </header>
  );
}
