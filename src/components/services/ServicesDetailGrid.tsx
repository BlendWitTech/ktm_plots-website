'use client';

import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export interface ServiceData {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  steps: string[];
}

interface Props {
  services: ServiceData[];
}

export default function ServicesDetailGrid({ services }: Props) {
  return (
    <div className="services-detail-grid">
      {services.map((service, i) => {
        const isRed  = i % 2 === 0;
        const accent = isRed ? 'var(--color-primary)' : 'var(--color-secondary)';
        const stepBg = isRed ? '#FEE2E2' : '#EBEBEB';
        const stepClr = isRed ? 'var(--color-primary)' : 'var(--color-secondary)';
        return (
          <ScrollReveal key={i} animation="scale" delay={Math.min(i % 3 * 80, 240)} style={{ height: '100%' }}>
            <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', borderTop: `4px solid ${accent}`, height: '100%' }}>
              <div style={{ padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ width: '48px', height: '48px', background: isRed ? '#FEE2E2' : '#F3F3F3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: accent }}>
                  {service.icon}
                </div>
                <div style={{ paddingTop: '0.2rem' }}>
                  <h3 style={{ color: 'var(--color-secondary)', fontWeight: 800, fontSize: '1rem', marginBottom: '0.25rem', lineHeight: 1.2 }}>{service.title}</h3>
                  {service.subtitle && <p style={{ color: accent, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{service.subtitle}</p>}
                </div>
              </div>
              <div style={{ padding: '1.5rem 1.75rem', flex: 1 }}>
                <p style={{ color: '#4B5563', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: service.steps.length > 0 ? '1.25rem' : 0 }}>
                  {service.description}
                </p>
                {service.steps.length > 0 && (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {service.steps.map((step, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.82rem', color: '#374151' }}>
                        <span style={{ width: '18px', height: '18px', background: stepBg, color: stepClr, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.65rem', flexShrink: 0, marginTop: '1px' }}>{j + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
