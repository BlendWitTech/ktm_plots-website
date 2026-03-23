'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { SiteData } from '@/lib/cms';
import { getImageUrl } from '@/lib/cms';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Props {
  siteData: SiteData;
  secData?: Record<string, any>;
}

// ── Icon map — keys match SERVICE_ICONS names used in the dashboard ──────────
const S = (d: React.ReactNode) => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{d}</svg>;
const ICON_MAP: Record<string, React.ReactNode> = {
  'shield-check':            S(<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>),
  'clock':                   S(<><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>),
  'users':                   S(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>),
  'currency-dollar':         S(<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>),
  'dollar':                  S(<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>),
  'map-pin':                 S(<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>),
  'home':                    S(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>),
  'home-modern':             S(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>),
  'star':                    S(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>),
  'award':                   S(<><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>),
  'check-circle':            S(<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>),
  'arrow-trending-up':       S(<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>),
  'trending-up':             S(<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>),
  'eye':                     S(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>),
  'document-text':           S(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>),
  'building-office':         S(<><path d="M3 21h18M3 7v14M21 7v14M6 3h12a1 1 0 0 1 1 1v3H5V4a1 1 0 0 1 1-1z"/><path d="M9 21v-5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5"/></>),
  'building-storefront':     S(<><path d="M2 7h20M5 7V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2M3 7l2 14h14l2-14"/><path d="M9 21v-8h6v8"/></>),
  'key':                     S(<><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></>),
  'lock-closed':             S(<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>),
  'map':                     S(<><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>),
  'globe-alt':               S(<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>),
  'banknotes':               S(<><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>),
  'credit-card':             S(<><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>),
  'chart-bar':               S(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>),
  'chart-pie':               S(<><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>),
  'calculator':              S(<><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="8" y2="12"/><line x1="12" y1="12" x2="12" y2="12"/><line x1="16" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="16" y2="16"/></>),
  'scale':                   S(<><path d="M12 2L2 19h20L12 2z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>),
  'check-badge':             S(<><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></>),
  'sparkles':                S(<><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/><path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z"/><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z"/></>),
  'heart':                   S(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>),
  'user':                    S(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>),
  'user-group':              S(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>),
  'phone':                   S(<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>),
  'envelope':                S(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>),
  'chat-bubble-left-right':  S(<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>),
  'megaphone':               S(<><path d="M3 11l19-9v18L3 13"/><path d="M11 18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3h5v3z"/></>),
  'bell':                    S(<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>),
  'calendar':                S(<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>),
  'wrench':                  S(<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>),
  'cog-6-tooth':             S(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>),
  'camera':                  S(<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>),
  'video-camera':            S(<><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>),
  'photo':                   S(<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>),
  'cube':                    S(<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>),
  'paint-brush':             S(<><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3z"/><path d="M9 8c-2 3-4 3.5-7 4l8 8c1-.5 3.5-2.5 4-7"/><path d="M14.5 17.5 4.5 15"/></>),
  'scissors':                S(<><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></>),
  'light-bulb':              S(<><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></>),
  'bolt':                    S(<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>),
  'fire':                    S(<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>),
  'truck':                   S(<><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>),
  'sun':                     S(<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>),
  'moon':                    S(<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>),
  'cloud':                   S(<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>),
  'arrows-pointing-out':     S(<><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></>),
  'information-circle':      S(<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>),
};

// ── Animated counter ─────────────────────────────────────────────────────────
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
    <div ref={ref} style={{ textAlign: 'center', padding: '1rem 1.5rem' }}>
      <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
        {isNaN(targetNum) ? value : `${count}${suffix}`}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

// ── Default stats ────────────────────────────────────────────────────────────
const DEFAULT_STATS = [
  { value: '500+', label: 'Plots Sold' },
  { value: '50+',  label: 'Locations' },
  { value: '10+',  label: 'Yrs Experience' },
  { value: '100%', label: 'Legal Titles' },
];

export default function About({ siteData, secData = {} }: Props) {
  const { settings } = siteData;

  const title            = secData.title          || settings.aboutTitle   || "Kathmandu Valley's Most Trusted Land Partner";
  const content          = secData.content        || settings.aboutContent || 'Founded with a vision to make land ownership accessible and transparent, KTM Plots has helped over 500 families and investors secure their piece of the Kathmandu Valley. We specialise in residential, commercial, and agricultural plots across Kathmandu, Lalitpur, Bhaktapur, and surrounding districts.';
  const aboutImageUrl    = getImageUrl(secData.image || settings.aboutImage);
  const sectionLabel     = secData.label          || 'About KTM Plots';
  const secondaryContent = secData.secondaryContent || 'Our team of legal experts, property consultants, and local specialists ensures that every transaction is smooth, secure, and stress-free — from your first site visit to the final registration at the Land Revenue Office.';
  const buttonText       = secData.buttonText     || 'Learn More About Us';
  const buttonUrl        = secData.buttonUrl      || '/about';
  const stats: { value: string; label: string }[] = (secData.stats && secData.stats.length > 0) ? secData.stats : DEFAULT_STATS;

  const features = [
    {
      icon: ICON_MAP[secData.card1Icon || 'shield-check'] ?? ICON_MAP['shield-check'],
      title: secData.card1Title || 'Verified Legal Titles',
      desc:  secData.card1Desc  || 'Every plot we sell comes with a verified Lalpurja and clean ownership record.',
    },
    {
      icon: ICON_MAP[secData.card2Icon || 'clock'] ?? ICON_MAP['clock'],
      title: secData.card2Title || '10+ Years Experience',
      desc:  secData.card2Desc  || 'Over a decade of helping families and investors find the right land in Nepal.',
    },
    {
      icon: ICON_MAP[secData.card3Icon || 'users'] ?? ICON_MAP['users'],
      title: secData.card3Title || 'Dedicated Support',
      desc:  secData.card3Desc  || 'A personal property advisor guides you from first inquiry to final registration.',
    },
    {
      icon: ICON_MAP[secData.card4Icon || 'currency-dollar'] ?? ICON_MAP['currency-dollar'],
      title: secData.card4Title || 'Transparent Pricing',
      desc:  secData.card4Desc  || 'No hidden fees. All prices are published and include applicable government taxes.',
    },
  ];

  return (
    <section id="about" style={{ padding: '5rem 0', background: 'var(--color-accent)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>

          {/* Text content */}
          <ScrollReveal animation="right">
            <div>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.8rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                {sectionLabel}
              </div>
              <h2 className="section-title" style={{ marginBottom: '1rem' }}>
                {title}
              </h2>
              <p style={{ color: '#4B5563', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                {content}
              </p>
              <p style={{ color: '#4B5563', marginBottom: '2rem', lineHeight: 1.8 }}>
                {secondaryContent}
              </p>

              {/* Stats counters — after paragraphs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, marginBottom: '2rem', background: '#FFFFFF', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                {stats.map((s, i) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'stretch', flex: '1 1 auto', minWidth: '80px' }}>
                    {i > 0 && <div style={{ width: '1px', background: '#F3F4F6', alignSelf: 'stretch', flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <AnimatedCounter value={s.value} label={s.label} delay={i * 150} />
                    </div>
                  </div>
                ))}
              </div>

              <Link href={buttonUrl} className="btn-green">
                {buttonText}
              </Link>
            </div>
          </ScrollReveal>

          {/* Image or feature grid */}
          {aboutImageUrl ? (
            <ScrollReveal animation="left">
              <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <Image src={aboutImageUrl} alt="About KTM Plots" fill style={{ objectFit: 'cover' }} />
              </div>
            </ScrollReveal>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {features.map((f, i) => (
                <ScrollReveal key={f.title} animation="scale" delay={i * 80}>
                  <div className="about-feature-card" style={{ height: '100%' }}>
                    <div style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>{f.icon}</div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--color-secondary)' }}>{f.title}</h4>
                    <p style={{ fontSize: '0.825rem', color: '#6B7280', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
