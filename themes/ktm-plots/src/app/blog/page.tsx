import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts, getImageUrl, formatDate, getSiteData, getSection, type PageRecord } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Expert insights on land investment, property buying, and real estate in Nepal.',
};

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

const BLOG_CATEGORIES = [
  { slug: '', label: 'All Articles' },
  { slug: 'land-buying-guide', label: 'Buying Guide' },
  { slug: 'investment-tips', label: 'Investment Tips' },
  { slug: 'market-updates', label: 'Market Updates' },
];

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const category = params.category;
  const [{ data: posts, total }, siteData] = await Promise.all([
    getPosts({ page, limit: 9, category }),
    getSiteData(),
  ]);
  const totalPages = Math.ceil(total / 9);

  const pages = (siteData as any).pages as PageRecord[] ?? [];
  const heroSec = getSection(pages, 'blog', 'hero');
  const heroTitle    = heroSec.data.title    || 'Our Blog';
  const heroSubtitle = heroSec.data.subtitle || 'Expert insights, guides, and market updates on land investment in Nepal.';

  return (
    <>
      {/* Header */}
      <div className="page-hero-band" style={{ background: '#1E1E1E', padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: '#CC1414' }} />
        <div className="container">
          <div className="tag-label">Knowledge Hub</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem' }}>
            {heroTitle}
          </h1>
          <p style={{ color: '#A0A0A0', maxWidth: '480px' }}>
            {heroSubtitle}
          </p>
        </div>
      </div>

      <section style={{ padding: '3rem 0 5rem', background: '#F4F4F4' }}>
        <div className="container">

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {BLOG_CATEGORIES.map((cat) => {
              const href = cat.slug ? `/blog?category=${cat.slug}` : '/blog';
              return (
                <Link key={cat.slug} href={href}
                  style={{ padding: '0.4rem 1.1rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', background: (category || '') === cat.slug ? '#1E1E1E' : '#FFFFFF', color: (category || '') === cat.slug ? '#fff' : '#4B5563', border: '1px solid', borderColor: (category || '') === cat.slug ? '#1E1E1E' : '#E5E7EB', transition: 'all 0.15s' }}>
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: '#6B7280' }}>
              <p>No articles found. <Link href="/blog" style={{ color: '#CC1414', fontWeight: 600 }}>View all →</Link></p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
                {posts.map((post) => {
                  const imgUrl = getImageUrl(post.featuredImageUrl);
                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="blog-card"
                    >
                      {/* Image */}
                      <div style={{ position: 'relative', height: '200px', background: 'linear-gradient(135deg, #1A0505 0%, #A01010 100%)', flexShrink: 0 }}>
                        {imgUrl
                          ? <Image src={imgUrl} alt={post.title} fill style={{ objectFit: 'cover' }} />
                          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="40" height="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
                        }
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                        {/* Category badge */}
                        {post.categories && post.categories.length > 0 && (
                          <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#CC1414', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            {post.categories[0].name}
                          </span>
                        )}
                        {post.featured && (
                          <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#1E1E1E', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', letterSpacing: '0.05em' }}>
                            ★ Featured
                          </span>
                        )}
                        {/* Date overlaid */}
                        <span style={{ position: 'absolute', bottom: '10px', left: '12px', color: 'rgba(255,255,255,0.75)', fontSize: '0.7rem', fontWeight: 500 }}>
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>

                      {/* Content */}
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
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#CC1414', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            Read article
                            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {page > 1 && (
                    <Link href={`/blog?${new URLSearchParams({ page: String(page - 1), ...(category && { category }) })}`}
                      style={{ padding: '0.5rem 1rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', textDecoration: 'none', color: '#4B5563', fontSize: '0.875rem' }}>← Prev</Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link key={p} href={`/blog?${new URLSearchParams({ page: String(p), ...(category && { category }) })}`}
                      style={{ padding: '0.5rem 0.875rem', background: p === page ? '#CC1414' : '#FFFFFF', border: '1px solid', borderColor: p === page ? '#CC1414' : '#E5E7EB', borderRadius: '6px', textDecoration: 'none', color: p === page ? '#FFFFFF' : '#4B5563', fontSize: '0.875rem', fontWeight: p === page ? 700 : 400 }}>
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link href={`/blog?${new URLSearchParams({ page: String(page + 1), ...(category && { category }) })}`}
                      style={{ padding: '0.5rem 1rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', textDecoration: 'none', color: '#4B5563', fontSize: '0.875rem' }}>Next →</Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <style>{`.blog-card{display:flex;flex-direction:column;background:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.07);text-decoration:none;transition:transform 0.22s,box-shadow 0.22s}.blog-card:hover{transform:translateY(-5px);box-shadow:0 14px 36px rgba(0,0,0,0.11)}`}</style>
    </>
  );
}
