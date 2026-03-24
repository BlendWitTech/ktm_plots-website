export default function ContactLoading() {
  return (
    <>
      {/* Hero band */}
      <div className="shimmer-dark" style={{ height: '180px', width: '100%' }} />

      <section style={{ padding: '4rem 0 5rem', background: 'var(--color-accent)' }}>
        <div className="container">
          {/* Quick action cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="shimmer-bar" style={{ height: '76px', borderRadius: '12px' }} />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            {/* Info column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="shimmer-bar" style={{ height: '24px', width: '220px', borderRadius: '6px' }} />
              <div className="shimmer-bar" style={{ height: '14px', width: '100%', borderRadius: '4px' }} />
              <div className="shimmer-bar" style={{ height: '14px', width: '88%', borderRadius: '4px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="shimmer-bar" style={{ width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                      <div className="shimmer-bar" style={{ height: '10px', width: '60px', borderRadius: '4px' }} />
                      <div className="shimmer-bar" style={{ height: '14px', width: '140px', borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="shimmer-bar" style={{ height: '120px', borderRadius: '12px', marginTop: '0.5rem' }} />
            </div>

            {/* Form column */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="shimmer-bar" style={{ height: '20px', width: '180px', borderRadius: '4px' }} />
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div className="shimmer-bar" style={{ height: '10px', width: '80px', borderRadius: '4px' }} />
                  <div className="shimmer-bar" style={{ height: '42px', borderRadius: '8px' }} />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div className="shimmer-bar" style={{ height: '10px', width: '80px', borderRadius: '4px' }} />
                <div className="shimmer-bar" style={{ height: '100px', borderRadius: '8px' }} />
              </div>
              <div className="shimmer-bar" style={{ height: '44px', borderRadius: '8px' }} />
            </div>
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
      `}</style>
    </>
  );
}
