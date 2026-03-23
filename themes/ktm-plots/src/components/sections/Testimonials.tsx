'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import type { Testimonial } from '@/lib/cms';
import { getImageUrl } from '@/lib/cms';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Props {
  testimonials: Testimonial[];
  secData?: Record<string, any>;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" fill={i < rating ? 'var(--color-primary)' : '#444'} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ testimonials, secData = {} }: Props) {
  const list = testimonials.length > 0 ? testimonials : [];
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating]);

  // Auto-advance every 5 seconds (pauses on user interaction)
  useEffect(() => {
    if (list.length <= 1 || paused) return;
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % list.length);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [list.length, paused]);

  // Keyboard navigation
  useEffect(() => {
    if (list.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { setPaused(true); goTo((current - 1 + list.length) % list.length); }
      if (e.key === 'ArrowRight') { setPaused(true); goTo((current + 1) % list.length); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, goTo, list.length]);

  if (list.length === 0) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 40) return;
    setPaused(true);
    if (dx > 0) goTo((current - 1 + list.length) % list.length);
    else goTo((current + 1) % list.length);
  };

  const t = list[current];
  const avatarUrl = getImageUrl(t.avatarUrl);
  const initials = (t.name || '?').split(' ').filter(Boolean).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const pad = (n: number) => String(n + 1).padStart(2, '0');

  return (
    <section style={{ padding: '5rem 0', background: 'var(--color-secondary)' }}>
      <div className="container">
        {/* Header */}
        <ScrollReveal animation="up">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              {secData.label || 'Client Stories'}
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              {secData.title || 'What Our Clients Say'}
            </h2>
            <p style={{ color: '#C8C8C8', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
              {secData.description || 'Hear directly from families and investors who found their perfect plot with KTM Plots.'}
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div
          style={{ maxWidth: '720px', margin: '0 auto', position: 'relative' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '2.5rem',
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(8px)' : 'translateY(0)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {/* Quote icon */}
            <svg width="32" height="32" fill="var(--color-primary)" opacity="0.35" viewBox="0 0 24 24" style={{ marginBottom: '1.25rem' }}>
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>

            {t.rating && <Stars rating={t.rating} />}

            <p style={{ color: '#D1FAE5', fontSize: '1.05rem', lineHeight: 1.9, margin: '1.25rem 0 1.75rem', fontStyle: 'italic' }}>
              &ldquo;{t.content}&rdquo;
            </p>

            {/* Author + slide counter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%', overflow: 'hidden',
                  background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  border: '2px solid rgba(204,20,20,0.4)'
                }}>
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={t.name} width={52} height={52} style={{ objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1rem' }}>{initials}</span>
                  )}
                </div>
                <div>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</div>
                  {t.role && <div style={{ color: '#A0A0A0', fontSize: '0.8rem', marginTop: '2px' }}>{t.role}</div>}
                </div>
              </div>

              {list.length > 1 && (
                <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#666', letterSpacing: '0.05em', flexShrink: 0 }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{pad(current)}</span>
                  {' / '}
                  {pad(list.length - 1)}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          {list.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => { setPaused(true); goTo((current - 1 + list.length) % list.length); }}
                aria-label="Previous testimonial"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>
              </button>

              {/* Dots */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {list.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setPaused(true); goTo(i); }}
                    aria-label={`Go to testimonial ${i + 1}`}
                    style={{
                      width: i === current ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: i === current ? 'var(--color-primary)' : 'rgba(255,255,255,0.25)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => { setPaused(true); goTo((current + 1) % list.length); }}
                aria-label="Next testimonial"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
