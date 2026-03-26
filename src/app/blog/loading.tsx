export default function BlogLoading() {
  return (
    <>
      {/* Hero band */}
      <div style={{ background: 'var(--color-secondary)', padding: '4rem 0 3rem' }}>
        <div className="container">
          <div className="shimmer-bar" style={{ height: '12px', width: '80px', borderRadius: '4px', marginBottom: '1rem', background: undefined }} />
          <div className="shimmer-bar" style={{ height: '36px', width: '240px', borderRadius: '6px', marginBottom: '0.875rem', background: undefined }} />
          <div className="shimmer-bar" style={{ height: '16px', width: '360px', borderRadius: '4px', background: undefined }} />
        </div>
      </div>

      <section style={{ padding: '3rem 0 5rem', background: '#fff' }}>
        <div className="container">
          {/* Featured post skeleton */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '2rem', background: '#fff' }}>
            <div className="shimmer-bar" style={{ height: '260px', background: undefined }} />
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="shimmer-bar" style={{ height: '12px', width: '80px', borderRadius: '4px', background: undefined }} />
              <div className="shimmer-bar" style={{ height: '28px', width: '90%', borderRadius: '4px', background: undefined }} />
              <div className="shimmer-bar" style={{ height: '14px', width: '100%', borderRadius: '4px', background: undefined }} />
              <div className="shimmer-bar" style={{ height: '14px', width: '80%', borderRadius: '4px', background: undefined }} />
              <div className="shimmer-bar" style={{ height: '14px', width: '65%', borderRadius: '4px', background: undefined }} />
            </div>
          </div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div className="shimmer-bar" style={{ height: '180px', background: undefined }} />
                <div style={{ padding: '1.1rem 1.25rem' }}>
                  <div className="shimmer-bar" style={{ height: '12px', width: '60px', borderRadius: '4px', marginBottom: '0.5rem', background: undefined }} />
                  <div className="shimmer-bar" style={{ height: '18px', width: '80%', borderRadius: '4px', marginBottom: '0.3rem', background: undefined }} />
                  <div className="shimmer-bar" style={{ height: '18px', width: '55%', borderRadius: '4px', marginBottom: '1rem', background: undefined }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="shimmer-bar" style={{ height: '13px', width: '90px', borderRadius: '4px', background: undefined }} />
                    <div className="shimmer-bar" style={{ height: '13px', width: '60px', borderRadius: '4px', background: undefined }} />
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
