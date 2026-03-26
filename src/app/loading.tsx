export default function GlobalLoading() {
  return (
    <>
      {/* Dark hero band skeleton */}
      <div className="shimmer-dark" style={{ height: '220px', width: '100%' }} />

      {/* Content area skeleton */}
      <div style={{ padding: '3rem 0 5rem', background: '#F8F9FA' }}>
        <div className="container">
          {/* Section heading */}
          <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div className="shimmer-bar" style={{ height: '10px', width: '80px', borderRadius: '4px' }} />
            <div className="shimmer-bar" style={{ height: '28px', width: '260px', borderRadius: '6px' }} />
            <div className="shimmer-bar" style={{ height: '14px', width: '400px', borderRadius: '4px' }} />
          </div>

          {/* Cards row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div className="shimmer-bar" style={{ height: '200px' }} />
                <div style={{ padding: '1.1rem 1.25rem', background: '#fff', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="shimmer-bar" style={{ height: '14px', width: '65%', borderRadius: '4px' }} />
                  <div className="shimmer-bar" style={{ height: '12px', width: '90%', borderRadius: '4px' }} />
                  <div className="shimmer-bar" style={{ height: '12px', width: '75%', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
      `}</style>
    </>
  );
}
