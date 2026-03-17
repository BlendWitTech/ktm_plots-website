'use client';

import type { Service } from '@/lib/cms';

const ICON_MAP: Record<string, React.ReactNode> = {
  'map-pin': (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  'file-text': (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  'eye': (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  'trending-up': (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  'home': (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  'headphones': (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  ),
};

interface Props {
  services: Service[];
  secData?: Record<string, any>;
}

export default function Services({ services, secData = {} }: Props) {
  const list = services.length > 0 ? services : [
    { id: '1', title: 'Land Plot Sales', slug: 'land-plot-sales', description: 'Premium plots at strategic locations with clear legal documentation.', icon: 'map-pin' },
    { id: '2', title: 'Legal Documentation', slug: 'legal-docs', description: 'Full support for title verification and ownership transfer.', icon: 'file-text' },
    { id: '3', title: 'Site Visit Arrangement', slug: 'site-visit', description: 'Guided visits with our property experts before you decide.', icon: 'eye' },
    { id: '4', title: 'Investment Consulting', slug: 'investment', description: 'Expert advice on land value trends and growth corridors.', icon: 'trending-up' },
    { id: '5', title: 'Construction Referral', slug: 'construction', description: 'Connect with trusted architects to start building right away.', icon: 'home' },
    { id: '6', title: 'After-Sales Support', slug: 'after-sales', description: 'Post-sale assistance for utilities, local government, and more.', icon: 'headphones' },
  ];

  return (
    <section id="services" style={{ padding: '6rem 0', background: '#F8F8F8' }}>
      <div className="container">

        {/* Header */}
        <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(204,20,20,0.08)',
            color: '#CC1414',
            fontWeight: 700,
            letterSpacing: '0.12em',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            borderRadius: '999px',
            padding: '0.35rem 1rem',
            marginBottom: '1rem',
          }}>
            {secData.label || 'What We Offer'}
          </span>
          <h2 className="section-title">{secData.title || 'Our Services'}</h2>
          <p className="section-subtitle" style={{ maxWidth: '520px', margin: '0 auto' }}>
            {secData.subtitle || 'From finding the right plot to completing the registration, we support you at every step of the journey.'}
          </p>
        </div>

        {/* Grid — 3 per row desktop, 2 tablet, 1 mobile */}
        <div className="services-grid">
          {list.map((service, i) => (
            <ServiceCard key={service.id || i} service={service} index={i} />
          ))}
        </div>
      </div>
      <style>{`
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        @media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .services-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

function ServiceCard({ service, index }: { service: any; index: number }) {
  return (
    <div
      className={`animate-slide-up delay-${Math.min(index * 100, 500)}`}
      style={{
        position: 'relative',
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 48px rgba(204,20,20,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #CC1414, #8B0000)',
        borderRadius: '20px 20px 0 0',
      }} />

      {/* Step number */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        right: '1.75rem',
        fontSize: '3rem',
        fontWeight: 800,
        color: 'rgba(204,20,20,0.06)',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Icon */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #CC1414 0%, #8B0000 100%)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        boxShadow: '0 6px 16px rgba(204,20,20,0.25)',
      }}>
        {ICON_MAP[service.icon || ''] ?? ICON_MAP['map-pin']}
      </div>

      <h3 style={{
        fontWeight: 700,
        fontSize: '1.1rem',
        color: '#111827',
        marginBottom: '0.75rem',
        lineHeight: 1.3,
      }}>
        {service.title}
      </h3>

      <p style={{
        fontSize: '0.875rem',
        color: '#6B7280',
        lineHeight: 1.75,
        margin: 0,
      }}>
        {service.description}
      </p>
    </div>
  );
}
