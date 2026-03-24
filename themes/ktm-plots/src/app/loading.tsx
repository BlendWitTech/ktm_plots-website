export default function GlobalLoading() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-accent)',
      gap: '1.25rem',
    }}>
      {/* Spinner ring — color comes from --color-primary, changeable via Theme Settings */}
      <div className="ktm-spinner" />

      {/* Brand mark */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 800,
          color: 'var(--color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
        }}>
          KTM Plots
        </span>
        <span style={{
          fontSize: '0.6rem',
          fontWeight: 600,
          color: '#9CA3AF',
          letterSpacing: '0.06em',
        }}>
          Loading...
        </span>
      </div>

      <style>{`
        .ktm-spinner {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 3px solid rgba(0,0,0,0.06);
          border-top-color: var(--color-primary);
          animation: ktm-spin 0.75s linear infinite;
        }
        @keyframes ktm-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
