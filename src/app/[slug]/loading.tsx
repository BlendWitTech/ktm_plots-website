export default function PageLoading() {
  return (
    <>
      {/* Header band */}
      <div className="shimmer-dark" style={{ padding: '5rem 0 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <div className="shimmer-bar-dark" style={{ height: '28px', width: '240px', borderRadius: '6px' }} />
        <div className="shimmer-bar-dark" style={{ height: '12px', width: '160px', borderRadius: '4px' }} />
      </div>

      {/* Article content */}
      <div style={{ paddingBottom: '5rem', background: '#F8F9FA' }}>
        <div className="container" style={{ paddingTop: '4rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: 'clamp(2rem, 5vw, 4rem)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Paragraph lines */}
            {[100, 95, 88, 92, 80, 96, 85, 70, 90, 82, 60].map((w, i) => (
              <div key={i} className="shimmer-bar" style={{ height: '14px', width: `${w}%`, borderRadius: '4px' }} />
            ))}
            <div style={{ height: '1.5rem' }} />
            {[100, 92, 88, 95, 75, 85].map((w, i) => (
              <div key={i + 20} className="shimmer-bar" style={{ height: '14px', width: `${w}%`, borderRadius: '4px' }} />
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
        .shimmer-bar-dark {
          background: linear-gradient(90deg, rgba(255,255,255,0.12) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.12) 75%);
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
      `}</style>
    </>
  );
}
