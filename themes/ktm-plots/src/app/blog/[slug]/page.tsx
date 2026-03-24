import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getPosts, getImageUrl, formatDate, renderContent } from '@/lib/cms';
import BlogComments from '@/components/blog/BlogComments';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  const metaTitle = post.seo?.title || post.title;
  const metaDesc = post.seo?.description || post.excerpt || undefined;
  const imgUrl = getImageUrl(post.seo?.ogImage || post.featuredImageUrl);
  const keywords = post.seo?.keywords;
  const ogImages = post.seo?.ogImages?.length
    ? post.seo.ogImages.map(u => ({ url: u, width: 1200, height: 630, alt: metaTitle }))
    : imgUrl ? [{ url: imgUrl, width: 1200, height: 630, alt: metaTitle }] : undefined;
  return {
    title: metaTitle,
    description: metaDesc,
    ...(keywords?.length && { keywords }),
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      type: 'article',
      ...(ogImages && { images: ogImages }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      ...(imgUrl && { images: [imgUrl] }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, { data: related }] = await Promise.all([
    getPostBySlug(slug),
    getPosts({ limit: 4 }),
  ]);

  if (!post) notFound();

  const imgUrl = getImageUrl(post.featuredImageUrl);
  const relatedPosts = related.filter((p) => p.slug !== slug).slice(0, 3);

  const readTime = Math.max(1, Math.ceil((post.content?.split(' ').length ?? 0) / 200));

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-secondary)', position: 'relative', overflow: 'hidden' }}>
        {/* Background image with overlay */}
        {imgUrl && (
          <>
            <div style={{ position: 'absolute', inset: 0 }}>
              <Image src={imgUrl} alt="" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.92) 100%)' }} />
          </>
        )}
        {!imgUrl && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: 'var(--color-primary)' }} />}

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '1.5rem 1.5rem 3.5rem' }}>
          {/* Breadcrumb */}
          <div className="animate-fade-in" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            <Link href="/blog" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Blog</Link>
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{post.title.slice(0, 40)}{post.title.length > 40 ? '…' : ''}</span>
          </div>

          {/* Category + featured */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {post.categories && post.categories.length > 0 && (
              <span className="animate-slide-right" style={{ fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', background: 'var(--color-primary)', padding: '0.25rem 0.75rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {post.categories[0].name}
              </span>
            )}
            {post.featured && (
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.75rem', borderRadius: '4px', letterSpacing: '0.04em', backdropFilter: 'blur(4px)' }}>
                ★ Featured
              </span>
            )}
          </div>

          <h1 className="animate-slide-up delay-100" style={{ color: '#FFFFFF', fontSize: 'clamp(1.5rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.2, maxWidth: '780px' }}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="animate-fade-in delay-200" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '620px', marginBottom: '1.5rem' }}>
              {post.excerpt}
            </p>
          )}

          {/* Author / date / read time row */}
          <div className="animate-fade-in delay-300" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {post.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', fontWeight: 600 }}>{post.author.name}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {formatDate(post.publishedAt || post.createdAt)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {readTime} min read
            </div>
          </div>
        </div>
      </div>

      {/* ── Article Body ─────────────────────────────────────── */}
      <section style={{ padding: '3rem 0 5rem', background: 'var(--color-accent)' }}>
        <div className="container">
          <div className="blog-post-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2.5rem', alignItems: 'start', maxWidth: '1100px', margin: '0 auto' }}>

            {/* Main column */}
            <div className="animate-fade-in delay-100">
              {/* Article card */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                <div
                  className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-red-600 prose-li:text-slate-600"
                  dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
                />
              </div>

              {/* Tags */}
              {post.categories && post.categories.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, alignSelf: 'center' }}>Tags:</span>
                  {post.categories.map((cat) => (
                    <span key={cat.slug} style={{ background: '#FEE2E2', color: 'var(--color-primary)', fontSize: '0.72rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '9999px', border: '1px solid #FCA5A5' }}>
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Comments */}
              <BlogComments postId={post.id} />

              {/* CTA */}
              <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #8B0000 100%)', borderRadius: '16px', padding: '2.25rem', position: 'relative', overflow: 'hidden', marginTop: '1.5rem' }}>
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', right: '20px', bottom: '-30px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Looking for land?</div>
                  <h3 style={{ color: '#FFFFFF', fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.2rem', lineHeight: 1.3 }}>Find Your Perfect Plot in Kathmandu Valley</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    Browse verified plots with clear legal titles. Free site visits and dedicated advisor support.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link href="/plots" style={{ background: '#FFFFFF', color: 'var(--color-primary)', fontWeight: 800, padding: '0.7rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem' }}>
                      Browse Plots →
                    </Link>
                    <Link href="/contact" className="btn-outline" style={{ padding: '0.7rem 1.25rem', fontSize: '0.875rem', borderRadius: '8px' }}>
                      Free Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="blog-post-sidebar animate-slide-up delay-200" style={{ position: 'sticky', top: '5rem' }}>
              {/* Share + quick links */}
              <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Quick Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <Link href="/plots" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#FEF2F2', borderRadius: '10px', textDecoration: 'none', border: '1px solid #FCA5A5' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 600 }}>Browse</div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)' }}>Available Plots</div>
                    </div>
                  </Link>
                  <Link href="/contact" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#F9FAFB', borderRadius: '10px', textDecoration: 'none', border: '1px solid #E5E7EB' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--color-secondary)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 14a19.79 19.79 0 01-3.07-8.67A2 2 0 013.6 3.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 10.91a16 16 0 005 5l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 600 }}>Free</div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-secondary)' }}>Consultation</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Categories</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {post.categories.map((cat) => (
                      <span key={cat.slug} style={{ background: '#FEF2F2', color: 'var(--color-primary)', fontSize: '0.72rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '9999px', border: '1px solid #FCA5A5' }}>
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related posts mini-list */}
              {relatedPosts.length > 0 && (
                <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>More Articles</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {relatedPosts.map((p) => {
                      const pImg = getImageUrl(p.featuredImageUrl);
                      return (
                        <Link key={p.id} href={`/blog/${p.slug}`} style={{ display: 'flex', gap: '0.75rem', textDecoration: 'none', alignItems: 'flex-start' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(135deg, var(--color-primary), #A01010)', flexShrink: 0, position: 'relative' }}>
                            {pImg && <Image src={pImg} alt={p.title} fill style={{ objectFit: 'cover' }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-secondary)', lineHeight: 1.35, marginBottom: '0.2rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {p.title}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{formatDate(p.publishedAt || p.createdAt)}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
