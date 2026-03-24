import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, getSiteData, getPostCategories, getSection, isSectionEnabled, type PageRecord, getSeoMeta } from '@/lib/cms';
import BlogListingClient from '@/components/blog/BlogListingClient';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta('static', 'blog');
  const title = seo?.title || 'Blog | KTM Plots';
  const description = seo?.description || 'Expert insights on land investment, property buying, and real estate in Nepal.';
  const ogImg = seo?.ogImages?.[0] || seo?.ogImage;
  return {
    title, description,
    ...(seo?.keywords?.length && { keywords: seo.keywords }),
    openGraph: { title, description, type: 'website', ...(ogImg && { images: [{ url: ogImg, width: 1200, height: 630, alt: title }] }) },
    twitter: { card: 'summary_large_image', title, description, ...(ogImg && { images: [ogImg] }) },
  };
}

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

const LIMIT = 9;

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Number(params.page || 1);
  const category = params.category;

  const [{ data: initialPosts, total: initialTotal }, siteData, rawCategories] = await Promise.all([
    getPosts({ page: currentPage, limit: LIMIT, category }),
    getSiteData(),
    getPostCategories(),
  ]);

  const blogCategories = [
    { slug: '', label: 'All Articles' },
    ...rawCategories.map((c) => ({ slug: c.slug, label: c.name })),
  ];

  const listingMode = siteData.settings.listingMode || 'load-more';

  const pages = (siteData as any).pages as PageRecord[] ?? [];
  const show  = (id: string) => isSectionEnabled(pages, 'blog', id);
  const heroSec = getSection(pages, 'blog', 'hero');
  const heroTitle    = heroSec.data.title    || 'Our Blog';
  const heroSubtitle = heroSec.data.subtitle || 'Expert insights, guides, and market updates on land investment in Nepal.';

  return (
    <>
      {/* Header */}
      {show('hero') && <div className="page-hero-band" style={{ background: 'var(--color-secondary)', padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: 'var(--color-primary)' }} />
        <div className="container">
          <div className="tag-label animate-slide-right">Knowledge Hub</div>
          <h1 className="animate-slide-up delay-100" style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem' }}>
            {heroTitle}
          </h1>
          <p className="animate-fade-in delay-200" style={{ color: '#A0A0A0', maxWidth: '480px' }}>
            {heroSubtitle}
          </p>
        </div>
      </div>}

      <section style={{ padding: '3rem 0 5rem', background: 'var(--color-accent)' }}>
        <div className="container">

          {/* Category filter */}
          {blogCategories.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {blogCategories.map((cat) => {
                const href = cat.slug ? `/blog?category=${cat.slug}` : '/blog';
                return (
                  <Link key={cat.slug} href={href}
                    style={{ padding: '0.4rem 1.1rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', background: (category || '') === cat.slug ? 'var(--color-secondary)' : '#FFFFFF', color: (category || '') === cat.slug ? '#fff' : '#4B5563', border: '1px solid', borderColor: (category || '') === cat.slug ? 'var(--color-secondary)' : '#E5E7EB', transition: 'all 0.15s' }}>
                    {cat.label}
                  </Link>
                );
              })}
            </div>
          )}

          <BlogListingClient
            initialPosts={initialPosts}
            initialTotal={initialTotal}
            initialPage={currentPage}
            limit={LIMIT}
            listingMode={listingMode}
            category={category}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  );
}
