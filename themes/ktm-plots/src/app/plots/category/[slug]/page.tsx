import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPlots, getPlotCategories, getSiteData } from '@/lib/cms';
import PlotListingClient from '@/components/plots/PlotListingClient';

const LIMIT = 9;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getPlotCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: 'Category Not Found' };
  return {
    title: `${category.name} Plots | KTM Plots`,
    description: category.description || `Browse ${category.name} land plots across Kathmandu Valley.`,
  };
}

export async function generateStaticParams() {
  const categories = await getPlotCategories();
  return categories.map((c) => ({ slug: c.slug }));
}


export default async function PlotCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Number(sp.page || 1);

  const [categories, { data: plots, total }, siteData] = await Promise.all([
    getPlotCategories(),
    getPlots({ page, limit: LIMIT, category: slug }),
    getSiteData(),
  ]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const listingMode = siteData.settings.listingMode || 'load-more';

  return (
    <>
      {/* Hero */}
      <div className="page-hero-band" style={{ background: 'var(--color-secondary)', padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: 'var(--color-primary)' }} />
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Link href="/plots" style={{ color: '#A0A0A0', fontSize: '0.8rem', textDecoration: 'none' }}>Plots</Link>
            <span style={{ color: '#555' }}>›</span>
            <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 700 }}>{category.name}</span>
          </div>
          <div className="tag-label animate-slide-right">Land Listings</div>
          <h1 className="animate-slide-up delay-100" style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem' }}>
            {category.name} Plots
          </h1>
          {category.description && (
            <p className="animate-fade-in delay-200" style={{ color: '#A0A0A0', maxWidth: '480px', lineHeight: 1.7 }}>{category.description}</p>
          )}
        </div>
      </div>

      <section style={{ padding: '3rem 0 5rem', background: 'var(--color-accent)' }}>
        <div className="container">
          {/* Category filter tabs */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link href="/plots" style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', background: '#FFFFFF', color: '#4B5563', border: '1px solid #E5E7EB' }}>
              All Plots
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/plots/category/${cat.slug}`}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  background: cat.slug === slug ? 'var(--color-primary)' : '#FFFFFF',
                  color: cat.slug === slug ? '#FFFFFF' : '#4B5563',
                  border: '1px solid',
                  borderColor: cat.slug === slug ? 'var(--color-primary)' : '#E5E7EB',
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <PlotListingClient
            initialPlots={plots}
            initialTotal={total}
            initialPage={page}
            limit={LIMIT}
            listingMode={listingMode}
            category={slug}
            categories={categories}
            currentPage={page}
          />
        </div>
      </section>
    </>
  );
}
