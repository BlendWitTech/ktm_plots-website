'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/cms';
import { getImageUrl, formatDate } from '@/lib/cms';
import ScrollReveal from '@/components/ui/ScrollReveal';

const API = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

function PostCard({ post, isNew }: { post: Post; isNew?: boolean }) {
  const imgUrl = getImageUrl(post.featuredImageUrl);
  return (
    <div className={isNew ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : undefined}>
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
    </div>
  );
}

interface Props {
  initialPosts: Post[];
  initialTotal: number;
  initialPage: number;
  limit: number;
  listingMode: string;
  category?: string;
  currentPage: number;
}

export default function BlogListingClient({
  initialPosts,
  initialTotal,
  initialPage,
  limit,
  listingMode,
  category,
  currentPage,
}: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  // Sync when server re-renders with new filter/page props
  useEffect(() => {
    setPosts(initialPosts);
    setTotal(initialTotal);
    setPage(initialPage);
    setNewIds(new Set());
  }, [initialPosts, initialTotal, initialPage]);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const qs = new URLSearchParams({ status: 'PUBLISHED', page: String(nextPage), limit: String(limit) });
      if (category) qs.set('category', category);
      const res = await fetch(`${API}/posts/public?${qs}`);
      const json = await res.json();

      const mapPost = (p: any): Post => ({ ...p, featuredImageUrl: p.featuredImageUrl ?? p.coverImage ?? null });
      let incoming: Post[] = [];
      if (Array.isArray(json)) incoming = json.map(mapPost);
      else if (json.posts) incoming = json.posts.map(mapPost);
      else incoming = (json.data ?? []).map(mapPost);

      const newTotal: number = json.pagination?.total ?? json.total ?? total;

      setNewIds(new Set(incoming.map((p) => p.id)));
      setPosts((prev) => [...prev, ...incoming]);
      setTotal(newTotal);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to fetch more posts:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, limit, category, total]);

  // Infinite scroll: observe sentinel
  useEffect(() => {
    if (listingMode !== 'infinite') return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMore();
      },
      { rootMargin: '200px' }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [listingMode, fetchMore]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#6B7280' }}>
        <p>No articles found. <Link href="/blog" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>View all →</Link></p>
      </div>
    );
  }

  return (
    <>
      {/* Pagination mode */}
      {listingMode === 'pagination' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
            {posts.map((post, idx) => (
              <ScrollReveal key={post.id} animation="up" delay={idx * 60}>
                <PostCard post={post} />
              </ScrollReveal>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {currentPage > 1 && (
                <Link
                  href={`/blog?${new URLSearchParams({ page: String(currentPage - 1), ...(category && { category }) })}`}
                  style={{ padding: '0.5rem 1rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', textDecoration: 'none', color: '#4B5563', fontSize: '0.875rem' }}
                >
                  ← Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?${new URLSearchParams({ page: String(p), ...(category && { category }) })}`}
                  style={{ padding: '0.5rem 0.875rem', background: p === currentPage ? 'var(--color-primary)' : '#FFFFFF', border: '1px solid', borderColor: p === currentPage ? 'var(--color-primary)' : '#E5E7EB', borderRadius: '6px', textDecoration: 'none', color: p === currentPage ? '#FFFFFF' : '#4B5563', fontSize: '0.875rem', fontWeight: p === currentPage ? 700 : 400 }}
                >
                  {p}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link
                  href={`/blog?${new URLSearchParams({ page: String(currentPage + 1), ...(category && { category }) })}`}
                  style={{ padding: '0.5rem 1rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', textDecoration: 'none', color: '#4B5563', fontSize: '0.875rem' }}
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        /* Load-more and Infinite modes */
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
            {posts.map((post, idx) => (
              <ScrollReveal key={post.id} animation="up" delay={Math.min(idx, 8) * 60}>
                <PostCard post={post} isNew={newIds.has(post.id)} />
              </ScrollReveal>
            ))}
          </div>

          {/* Load More button */}
          {listingMode === 'load-more' && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              {hasMore ? (
                <button
                  onClick={fetchMore}
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: '#FFFFFF', border: '1.5px solid #E5E7EB', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 700, color: '#374151', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                >
                  {loading ? (
                    <>
                      <svg style={{ animation: 'spin 0.8s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                      Loading…
                    </>
                  ) : (
                    <>
                      Load More Posts
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                    </>
                  )}
                </button>
              ) : (
                <p style={{ color: '#9CA3AF', fontSize: '0.875rem', fontWeight: 600 }}>All posts loaded</p>
              )}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          {listingMode === 'infinite' && (
            <>
              <div ref={sentinelRef} className="h-10" />
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 0' }}>
                  <svg style={{ animation: 'spin 0.8s linear infinite' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                </div>
              )}
              {!hasMore && posts.length > 0 && (
                <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.875rem', fontWeight: 600, paddingTop: '1rem' }}>All posts loaded</p>
              )}
            </>
          )}
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .blog-card { display: flex; flex-direction: column; background: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.07); text-decoration: none; transition: transform 0.22s, box-shadow 0.22s; }
        .blog-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(0,0,0,0.11); }
      `}</style>
    </>
  );
}
