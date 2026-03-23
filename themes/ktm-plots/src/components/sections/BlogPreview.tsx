'use client';
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
    <section style={{ padding: '5rem 0', background: '#FFFFFF' }}>
      <div className="container">
        <ScrollReveal animation="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              {secData.label || 'Latest Articles'}
            </div>
            <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>{secData.title || 'From Our Blog'}</h2>
            <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>{secData.subtitle || 'Expert insights on land investment and property in Nepal'}</p>
          </div>
          <Link href="/blog" className="btn-green" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
            {secData.viewAllText || 'All Articles →'}
          </Link>
        </ScrollReveal>

        {/* Featured first post + 2 smaller posts */}
        <div className="blog-preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }}>

          {/* Featured post — spans 2 cols, horizontal layout */}
          {posts[0] && <FeaturedPost post={posts[0]} />}

          {/* Remaining posts — vertical cards */}
          <ScrollReveal animation="left" delay={160} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {posts.slice(1, 3).map((post) => {
              const imgUrl = getImageUrl(post.featuredImageUrl);
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column', background: '#FFFFFF', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.22s, box-shadow 0.22s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(204,20,20,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div style={{ position: 'relative', height: '130px', background: 'linear-gradient(135deg, #1A0505, #A01010)', flexShrink: 0 }}>
                    {imgUrl
                      ? <Image src={imgUrl} alt={post.title} fill style={{ objectFit: 'cover' }} />
                      : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="32" height="32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
                    }
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                    {post.categories && post.categories.length > 0 && (
                      <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(204,20,20,0.9)', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        {post.categories[0].name}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '0.875rem 1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827', lineHeight: 1.35, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.625rem', paddingTop: '0.625rem', borderTop: '1px solid #F3F4F6' }}>
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{formatDate(post.publishedAt || post.createdAt)}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)' }}>Read →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  const imgUrl = getImageUrl(post.featuredImageUrl);
  return (
    <ScrollReveal animation="right" className="blog-preview-featured" style={{ gridColumn: '1 / span 2' }}>
      <Link
        href={`/blog/${post.slug}`}
        style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#FFFFFF', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform 0.22s, box-shadow 0.22s' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(204,20,20,0.12)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
      >
        <div style={{ position: 'relative', minHeight: '260px', background: 'linear-gradient(135deg, #1A0505 0%, #A01010 100%)' }}>
          {imgUrl
            ? <Image src={imgUrl} alt={post.title} fill style={{ objectFit: 'cover' }} />
            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="48" height="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
          }
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 100%)' }} />
          <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--color-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.25rem 0.7rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Featured
          </div>
        </div>
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {post.categories && post.categories.length > 0 && (
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', display: 'block' }}>
              {post.categories[0].name}
            </span>
          )}
          <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: '#111827', marginBottom: '0.75rem', lineHeight: 1.35 }}>{post.title}</h3>
          {post.excerpt && (
            <p style={{ fontSize: '0.825rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.excerpt}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{formatDate(post.publishedAt || post.createdAt)}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Read article
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}
