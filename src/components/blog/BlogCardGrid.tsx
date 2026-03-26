'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/cms';
import { getImageUrl, formatDate } from '@/lib/cms';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Props {
  posts: Post[];
}

export default function BlogCardGrid({ posts }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
      {posts.map((post, idx) => {
        const imgUrl = getImageUrl(post.featuredImageUrl);
        return (
          <ScrollReveal key={post.id} animation="up" delay={idx * 60}>
            <Link href={`/blog/${post.slug}`} className="blog-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'relative', height: '200px', background: 'linear-gradient(135deg, #1A0505 0%, #A01010 100%)', flexShrink: 0 }}>
                {imgUrl
                  ? <Image src={imgUrl} alt={post.title} fill style={{ objectFit: 'cover' }} />
                  : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="40" height="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    </div>
                }
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                {post.categories && post.categories.length > 0 && (
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--color-primary)', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    {post.categories[0].name}
                  </span>
                )}
                {post.featured && (
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--color-secondary)', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', letterSpacing: '0.05em' }}>
                    ★ Featured
                  </span>
                )}
                <span style={{ position: 'absolute', bottom: '10px', left: '12px', color: 'rgba(255,255,255,0.75)', fontSize: '0.7rem', fontWeight: 500 }}>
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
              </div>

              <div style={{ padding: '1.1rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontWeight: 700, fontSize: '0.975rem', color: '#111827', marginBottom: '0.5rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h2>
                {post.excerpt && (
                  <p style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.65, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.excerpt}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid #F3F4F6' }}>
                  {post.author
                    ? <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>By {post.author.name}</span>
                    : <span />
                  }
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Read article
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
