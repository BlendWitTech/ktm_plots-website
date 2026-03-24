export default function BlogPostLoading() {
  return (
    <>
      {/* Hero with background */}
      <div className="shimmer-dark" style={{ minHeight: '380px', width: '100%' }} />

      <div style={{ background: '#F8F9FA', paddingBottom: '5rem' }}>
        <div className="container">
          <div style={{ maxWidth: '760px', margin: '0 auto', paddingTop: '3rem' }}>
            {/* Article body */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[100, 94, 88, 96, 80, 92, 85, 0, 100, 92, 80, 88, 70, 95, 60].map((w, i) =>
                w === 0
                  ? <div key={i} style={{ height: '1.5rem' }} />
                  : <div key={i} className="shimmer-bar" style={{ height: '14px', width: `${w}%`, borderRadius: '4px' }} />
              )}
            </div>

            {/* Comments section */}
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="shimmer-bar" style={{ height: '20px', width: '160px', borderRadius: '4px' }} />
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', gap: '1rem' }}>
                  <div className="shimmer-bar" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="shimmer-bar" style={{ height: '12px', width: '120px', borderRadius: '4px' }} />
                    <div className="shimmer-bar" style={{ height: '12px', width: '90%', borderRadius: '4px' }} />
                    <div className="shimmer-bar" style={{ height: '12px', width: '75%', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
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
