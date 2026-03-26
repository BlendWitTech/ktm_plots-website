'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Props {
  images: string[];   // all image URLs (featured first)
  title: string;
}

export default function PlotGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/9', background: 'linear-gradient(135deg, #2a0a0a, #A01010)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <svg width="64" height="64" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
    );
  }

  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Main image */}
      <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/9', background: '#1a0505', marginBottom: '0.75rem' }}>
        <Image
          key={active}
          src={images[active]}
          alt={`${title} — image ${active + 1}`}
          fill
          style={{ objectFit: 'cover', transition: 'opacity 0.3s ease' }}
          priority={active === 0}
        />

        {/* Counter badge */}
        <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.875rem', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '999px', backdropFilter: 'blur(4px)' }}>
          {active + 1} / {images.length}
        </div>

        {/* Nav arrows — only shown when >1 image */}
        {images.length > 1 && (
          <>
            <button onClick={prev} aria-label="Previous image" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', backdropFilter: 'blur(4px)' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button onClick={next} aria-label="Next image" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', backdropFilter: 'blur(4px)' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              style={{ flexShrink: 0, width: '72px', height: '54px', borderRadius: '7px', overflow: 'hidden', position: 'relative', border: `2px solid ${i === active ? 'var(--color-primary)' : 'transparent'}`, padding: 0, cursor: 'pointer', background: '#1a0505', transition: 'border-color 0.15s', outline: 'none' }}
            >
              <Image src={src} alt={`Thumbnail ${i + 1}`} fill style={{ objectFit: 'cover', opacity: i === active ? 1 : 0.65, transition: 'opacity 0.15s' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
