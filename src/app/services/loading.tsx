export default function ServicesLoading() {
  return (
    <>
      {/* Hero band */}
      <div className="shimmer-dark" style={{ minHeight: '220px', width: '100%' }} />

      {/* Services grid */}
      <section style={{ padding: '5rem 0', background: 'var(--color-accent)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }} className="services-skel-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div className="shimmer-bar" style={{ width: '52px', height: '52px', borderRadius: '12px' }} />
                <div className="shimmer-bar" style={{ height: '18px', width: '70%', borderRadius: '4px' }} />
                <div className="shimmer-bar" style={{ height: '11px', width: '50%', borderRadius: '4px' }} />
                <div className="shimmer-bar" style={{ height: '12px', width: '100%', borderRadius: '4px' }} />
                <div className="shimmer-bar" style={{ height: '12px', width: '90%', borderRadius: '4px' }} />
                <div className="shimmer-bar" style={{ height: '12px', width: '80%', borderRadius: '4px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {[...Array(4)].map((_, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="shimmer-bar" style={{ width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0 }} />
                      <div className="shimmer-bar" style={{ height: '11px', width: `${60 + j * 8}%`, borderRadius: '4px' }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: '4rem 0 5rem', background: 'var(--color-accent)', borderTop: '1px solid #E5E7EB' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div className="shimmer-bar" style={{ height: '24px', width: '200px', borderRadius: '6px' }} />
            <div className="shimmer-bar" style={{ height: '14px', width: '320px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="shimmer-bar" style={{ height: '88px', borderRadius: '12px' }} />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .shimmer-bar {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%) !important;
          background-size: 200% 100% !important;
          animation: shimmer 1.5s infinite !important;
        }
        .shimmer-dark {
          background: linear-gradient(90deg, #1a1a2e 25%, #2a2a3e 50%, #1a1a2e 75%);
          background-size: 200% 100%;
          animation: shimmer 1.8s infinite;
        }
        @keyframes shimmer {
          from { background-position: -200% 0; }
          to   { background-position:  200% 0; }
        }
        @media (max-width: 900px) { .services-skel-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .services-skel-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
