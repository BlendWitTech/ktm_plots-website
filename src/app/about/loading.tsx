export default function AboutLoading() {
  return (
    <>
      {/* Hero band */}
      <div className="shimmer-dark" style={{ height: '200px', width: '100%' }} />

      {/* Story section */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="shimmer-bar" style={{ height: '28px', width: '180px', borderRadius: '6px' }} />
              <div className="shimmer-bar" style={{ height: '14px', width: '100%', borderRadius: '4px' }} />
              <div className="shimmer-bar" style={{ height: '14px', width: '92%', borderRadius: '4px' }} />
              <div className="shimmer-bar" style={{ height: '14px', width: '85%', borderRadius: '4px' }} />
              <div className="shimmer-bar" style={{ height: '14px', width: '78%', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="shimmer-bar" style={{ height: '90px', borderRadius: '10px' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div style={{ background: 'var(--color-secondary)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div className="shimmer-bar-dark" style={{ height: '32px', width: '80px', borderRadius: '4px' }} />
                <div className="shimmer-bar-dark" style={{ height: '12px', width: '60px', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team section */}
      <section style={{ padding: '5rem 0', background: 'var(--color-accent)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div className="shimmer-bar" style={{ height: '10px', width: '80px', borderRadius: '4px' }} />
            <div className="shimmer-bar" style={{ height: '28px', width: '220px', borderRadius: '6px' }} />
            <div className="shimmer-bar" style={{ height: '14px', width: '320px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div className="shimmer-bar" style={{ width: '72px', height: '72px', borderRadius: '50%' }} />
                <div className="shimmer-bar" style={{ height: '14px', width: '120px', borderRadius: '4px' }} />
                <div className="shimmer-bar" style={{ height: '10px', width: '80px', borderRadius: '4px' }} />
                <div className="shimmer-bar" style={{ height: '12px', width: '100%', borderRadius: '4px' }} />
                <div className="shimmer-bar" style={{ height: '12px', width: '80%', borderRadius: '4px' }} />
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
        .shimmer-bar-dark {
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
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
        @media (max-width: 1024px) { .about-team-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 700px)  { .about-team-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </>
  );
}
