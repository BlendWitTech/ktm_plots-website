'use client';

import { useRef, useEffect, ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';

type Animation = 'up' | 'right' | 'left' | 'scale' | 'fade';

interface Props {
  children: ReactNode;
  /** Which direction the element reveals from. Default: 'up' */
  animation?: Animation;
  /** Delay in ms before the reveal transition starts */
  delay?: number;
  /** IntersectionObserver threshold (0–1). Default: 0.12 */
  threshold?: number;
  /** Extra className forwarded to the wrapper */
  className?: string;
  /** Inline styles for the wrapper */
  style?: React.CSSProperties;
  /** Element type for the wrapper. Default: 'div' */
  as?: ElementType;
}

/**
 * Wraps children and reveals them with a CSS transition when they enter
 * the viewport, using IntersectionObserver.
 *
 * CSS contract (globals.css):
 *   .sr              — base: opacity 0, transition on opacity + transform
 *   .sr-up/right/left/scale/fade — initial transform
 *   .sr-visible      — opacity 1, transform none
 *   .sr-d0 … .sr-d560 — transition-delay overrides for staggered grids
 */
export default function ScrollReveal({
  children,
  animation = 'up',
  delay = 0,
  threshold = 0.12,
  className = '',
  style,
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If user prefers reduced motion, show immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('sr-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('sr-visible');
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const delayClass = delay ? `sr-d${Math.min(Math.round(delay / 80) * 80, 560)}` : 'sr-d0';

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref as any}
      className={`sr sr-${animation} ${delayClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
