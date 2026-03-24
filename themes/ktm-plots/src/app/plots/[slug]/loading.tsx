export default function PlotDetailLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="shimmer-bar" style={{ minHeight: '440px', background: undefined }} />

      {/* Main content skeleton */}
      <section style={{ padding: '2.5rem 0 5rem', background: 'var(--color-accent)' }}>
        <div className="container">
          <div className="plot-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>

            {/* Left column */}
            <div>
              {/* Gallery */}
              <div className="shimmer-bar" style={{ height: '380px', borderRadius: '16px', marginBottom: '1.5rem', background: undefined }} />

              {/* About card */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                <div className="shimmer-bar" style={{ height: '14px', width: '160px', borderRadius: '4px', marginBottom: '1.25rem', background: undefined }} />
                <div className="shimmer-bar" style={{ height: '12px', borderRadius: '4px', marginBottom: '0.5rem', background: undefined }} />
                <div className="shimmer-bar" style={{ height: '12px', width: '85%', borderRadius: '4px', marginBottom: '0.5rem', background: undefined }} />
                <div className="shimmer-bar" style={{ height: '12px', width: '70%', borderRadius: '4px', background: undefined }} />
              </div>

              {/* Specs card */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                <div className="shimmer-bar" style={{ height: '14px', width: '180px', borderRadius: '4px', marginBottom: '1.25rem', background: undefined }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="shimmer-bar" style={{ height: '60px', borderRadius: '10px', background: undefined }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div>
              <div className="shimmer-bar" style={{ height: '320px', borderRadius: '16px', marginBottom: '1.25rem', background: undefined }} />
              <div className="shimmer-bar" style={{ height: '72px', borderRadius: '14px', marginBottom: '1.25rem', background: undefined }} />
              <div className="shimmer-bar" style={{ height: '180px', borderRadius: '14px', background: undefined }} />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .plot-detail-grid { grid-template-columns: 1fr !important; }
        }
        .shimmer-bar {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%) !important;
          background-size: 200% 100% !important;
          animation: shimmer 1.5s infinite !important;
        }
        @keyframes shimmer {
          from { background-position: -200% 0; }
          to   { background-position:  200% 0; }
        }
      `}</style>
    </>
  );
}
