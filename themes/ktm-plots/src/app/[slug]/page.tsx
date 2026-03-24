import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/cms';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.content.slice(0, 150).replace(/<[^>]+>/g, '') + '...',
  };
}

export default async function GenericPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  // Prefer section-editor content (data.sections[content].data.body) over legacy page.content
  const sections: any[] = (page as any).data?.sections ?? [];
  const contentSection = sections.find((s: any) => s.id === 'content');
  const heroSection    = sections.find((s: any) => s.id === 'hero');
  const body        = contentSection?.data?.body || page.content;
  const pageTitle   = heroSection?.data?.title    || page.title;
  const pageSubtitle = heroSection?.data?.subtitle || null;

  return (
    <div style={{ paddingBottom: '5rem', background: '#F8F9FA' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-primary)', color: '#fff', padding: '5rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <h1 className="section-title" style={{ color: '#fff', marginBottom: '0.5rem' }}>{pageTitle}</h1>
          {pageSubtitle ? (
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{pageSubtitle}</p>
          ) : (
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
              Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingTop: '4rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <article
            className="prose"
            style={{
              background: '#fff',
              padding: 'clamp(2rem, 5vw, 4rem)',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              lineHeight: 1.8,
              color: '#4B5563',
              fontSize: '1.05rem',
            }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>
      </div>
    </div>
  );
}
