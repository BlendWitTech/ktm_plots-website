'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/cms';
import { getImageUrl, formatDate } from '@/lib/cms';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Props {
  posts: Post[];
  secData?: Record<string, any>;
}

export default function BlogPreview({ posts, secData = {} }: Props) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" style={{ padding: '5rem 0', background: 'var(--color-accent)', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        {/* ── Section Header ─────────────────────────────────────────── */}
        <ScrollReveal animation="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <div className="tag-label" style={{ marginBottom: '0.5rem' }}>
              {secData.label || 'Latest Insights'}
            </div>
            <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>
              {secData.title || 'Expert Knowledge'}
            </h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              {secData.subtitle || 'Expert insights on land investment and property development in Nepal.'}
            </p>
          </div>
          <Link href="/blog" className="btn-green" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
            {secData.viewAllText || 'View All Articles →'}
          </Link>
        </ScrollReveal>

        {/* ── Blog Grid ─────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }} className="blog-redesign-grid">
          {posts.slice(0, 3).map((post, idx) => (
            <BlogCard key={post.id} post={post} delay={idx * 80} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .blog-redesign-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .blog-redesign-grid { 
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 1rem !important;
            padding-bottom: 1rem;
            scrollbar-width: none;
          }
          .blog-redesign-grid::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </section>
  );
}

function BlogCard({ post, delay }: { post: Post; delay: number }) {
  const imgUrl = getImageUrl(post.featuredImageUrl);

  return (
    <ScrollReveal animation="up" delay={delay} className="blog-card-wrap" style={{ display: 'flex', flex: 1 }}>
      <Link
        href={`/blog/${post.slug}`}
        style={{ 
          display: 'flex', flexDirection: 'column', height: '100%', width: '100%',
          background: '#FFFFFF', borderRadius: '14px', overflow: 'hidden', 
          border: 'none', textDecoration: 'none',
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          transition: 'transform 0.22s ease, box-shadow 0.22s ease' 
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(204,20,20,0.13)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        <div style={{ position: 'relative', height: '220px', background: 'linear-gradient(135deg, #2a0a0a 0%, #A01010 100%)', flexShrink: 0 }}>
          {imgUrl ? (
            <Image 
              src={imgUrl} 
              alt={post.title} 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="48" height="48" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
          )}
          
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />

          {post.categories?.[0] && (
            <div style={{ 
              position: 'absolute', top: '12px', left: '12px', 
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', 
              color: '#fff', fontSize: '0.65rem', fontWeight: 700, 
              padding: '0.25rem 0.6rem', borderRadius: '4px', 
              textTransform: 'uppercase', letterSpacing: '0.07em'
            }}>
              {post.categories[0].name}
            </div>
          )}
        </div>

        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', marginBottom: '0.5rem' }}>
             <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
             {formatDate(post.publishedAt || post.createdAt)}
          </div>
          
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '0.5rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.title}
          </h3>

          <p style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.65, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.25rem' }}>
            {post.excerpt}
          </p>

          <div style={{ marginTop: 'auto', paddingTop: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Read Article 
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
      <style jsx>{`
        @media (max-width: 640px) {
          .blog-card-wrap {
            flex: 0 0 82vw;
            min-width: 0;
            scroll-snap-align: start;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </ScrollReveal>
  );
}
