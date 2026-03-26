'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ktm-wishlist';

function getWishlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

interface Props {
  plotId: string;
  /** 'card' = absolute-positioned icon overlay (default). 'inline' = full button with label. 'compact' = icon only, same border style as inline */
  variant?: 'card' | 'inline' | 'compact';
}

export default function WishlistButton({ plotId, variant = 'card' }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(getWishlist().includes(plotId));
  }, [plotId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const list = getWishlist();
    const next = list.includes(plotId)
      ? list.filter((id) => id !== plotId)
      : [...list, plotId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(next.includes(plotId));
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={toggle}
        aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px', flexShrink: 0,
          background: saved ? '#FEF2F2' : 'var(--color-accent)',
          border: `1.5px solid ${saved ? '#FCA5A5' : '#E5E7EB'}`,
          borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLElement).style.borderColor = '#FCA5A5'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = saved ? '#FEF2F2' : 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.borderColor = saved ? '#FCA5A5' : '#E5E7EB'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'var(--color-primary)' : 'none'} stroke={saved ? 'var(--color-primary)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={toggle}
        aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.55rem 1rem',
          background: saved ? '#FEF2F2' : 'var(--color-accent)',
          border: `1.5px solid ${saved ? '#FCA5A5' : '#E5E7EB'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.825rem',
          fontWeight: 700,
          color: saved ? 'var(--color-primary)' : '#4B5563',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLElement).style.borderColor = '#FCA5A5'; (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = saved ? '#FEF2F2' : 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.borderColor = saved ? '#FCA5A5' : '#E5E7EB'; (e.currentTarget as HTMLElement).style.color = saved ? 'var(--color-primary)' : '#4B5563'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'var(--color-primary)' : 'none'} stroke={saved ? 'var(--color-primary)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        {saved ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      style={{
        position: 'absolute',
        top: '10px',
        right: '58px',
        zIndex: 10,
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(4px)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s, transform 0.15s',
        padding: 0,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(204,20,20,0.75)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.45)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'var(--color-primary)' : 'none'} stroke={saved ? 'var(--color-primary)' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}
