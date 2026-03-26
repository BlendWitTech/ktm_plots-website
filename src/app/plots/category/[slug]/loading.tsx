export default function PlotCategoryLoading() {
  return (
    <>
      {/* Hero band */}
      <div className="shimmer-dark" style={{ height: '180px', width: '100%' }} />

      <section style={{ padding: '3rem 0 5rem', background: 'var(--color-accent)' }}>
        <div className="container">
          {/* Filter bar skeleton */}
          <div style={{ background: '#fff', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="shimmer-bar" style={{ height: '38px', borderRadius: '8px' }} />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="shimmer-bar" style={{ height: '28px', width: `${60 + i * 15}px`, borderRadius: '9999px' }} />
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="shimmer-bar" style={{ height: '14px', width: '140px', borderRadius: '4px', marginBottom: '1.5rem' }} />

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }} className="cat-skel-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div className="shimmer-bar" style={{ height: '220px' }} />
                <div style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="shimmer-bar" style={{ height: '14px', width: '65%', borderRadius: '4px' }} />
                  <div className="shimmer-bar" style={{ height: '12px', width: '90%', borderRadius: '4px' }} />
                  <div className="shimmer-bar" style={{ height: '12px', width: '70%', borderRadius: '4px' }} />
                </div>
              </div>
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
        @media (max-width: 900px) { .cat-skel-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 580px) { .cat-skel-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
