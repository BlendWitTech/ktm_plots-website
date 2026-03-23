export default function PlotsLoading() {
  return (
    <>
      {/* Header band skeleton */}
      <div style={{ background: 'var(--color-secondary)', padding: '4rem 0 3rem' }}>
        <div className="container">
          <div className="shimmer-bar" style={{ height: '12px', width: '100px', borderRadius: '4px', marginBottom: '1rem', background: undefined }} />
          <div className="shimmer-bar" style={{ height: '36px', width: '280px', borderRadius: '6px', marginBottom: '0.875rem', background: undefined }} />
          <div className="shimmer-bar" style={{ height: '16px', width: '400px', borderRadius: '4px', background: undefined }} />
        </div>
      </div>

      <section style={{ padding: '3rem 0 5rem', background: 'var(--color-accent)' }}>
        <div className="container">
          {/* Filter bar skeleton */}
          <div style={{ background: '#fff', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="shimmer-bar" style={{ height: '40px', borderRadius: '8px', marginBottom: '1rem', background: undefined }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[80, 100, 110, 90, 95].map((w, i) => (
                <div key={i} className="shimmer-bar" style={{ height: '30px', width: `${w}px`, borderRadius: '999px', background: undefined }} />
              ))}
            </div>
          </div>

          {/* Cards grid skeleton */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                <div className="shimmer-bar" style={{ height: '220px', background: undefined }} />
                <div style={{ padding: '1.1rem 1.25rem' }}>
                  <div className="shimmer-bar" style={{ height: '18px', width: '70%', borderRadius: '4px', marginBottom: '0.5rem', background: undefined }} />
                  <div className="shimmer-bar" style={{ height: '13px', width: '90%', borderRadius: '4px', marginBottom: '0.3rem', background: undefined }} />
                  <div className="shimmer-bar" style={{ height: '13px', width: '60%', borderRadius: '4px', marginBottom: '1.25rem', background: undefined }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="shimmer-bar" style={{ height: '14px', width: '80px', borderRadius: '4px', background: undefined }} />
                    <div className="shimmer-bar" style={{ height: '14px', width: '90px', borderRadius: '4px', background: undefined }} />
                  </div>
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
        @keyframes shimmer {
          from { background-position: -200% 0; }
          to   { background-position:  200% 0; }
        }
      `}</style>
    </>
  );
}
