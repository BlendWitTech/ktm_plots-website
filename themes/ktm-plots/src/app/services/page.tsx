import Link from 'next/link';
import { getSiteData, getSection, isSectionEnabled, type PageRecord } from '@/lib/cms';
import ServicesDetailGrid from '@/components/services/ServicesDetailGrid';

export const metadata = { title: 'Our Services | KTM Plots' };

const ALL_SERVICES = [
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Land Plot Sales',
    subtitle: 'Residential · Commercial · Agricultural',
    description: 'We offer verified, legally-clear plots across Kathmandu, Lalitpur, Bhaktapur, and surrounding districts. All plots come with title-verified Lalpurja and are registered with the Land Revenue Office.',
    steps: ['Site selection & shortlisting', 'Legal title verification', 'Price negotiation support', 'Registration at Land Revenue Office'],
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'Legal Documentation',
    subtitle: 'Title Verification · Ownership Transfer',
    description: 'Our legal team handles all paperwork from due diligence and Lalpurja checks to the final deed transfer at the Land Revenue Office. We ensure zero legal complications post-purchase.',
    steps: ['Lalpurja & 4-killa verification', 'Encumbrance & ownership check', 'Deed preparation & review', 'Registration & transfer'],
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: 'Site Visit Arrangement',
    subtitle: 'Guided Visits · Expert Tours',
    description: 'Before you decide, see the plot in person. We arrange private, guided site visits with our property experts who walk you through the plot boundaries, access roads, utilities, and surroundings.',
    steps: ['Schedule a visit at your convenience', 'Expert guide accompanies you', 'Boundary & access walkthrough', 'Post-visit Q&A session'],
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: 'Investment Consulting',
    subtitle: 'Market Trends · ROI Analysis',
    description: 'Not sure which zone offers the best return? Our consultants analyse price trends, infrastructure development plans, and growth corridors to help you invest with confidence.',
    steps: ['Market trend analysis', 'Zone & corridor evaluation', 'Investment return projections', 'Personalised portfolio advice'],
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Construction Referral',
    subtitle: 'Architects · Contractors · Engineers',
    description: 'Once you own the land, we connect you with trusted architects, engineers, and contractors from our vetted partner network to bring your dream home to life.',
    steps: ['Match with suitable professionals', 'Design consultation', 'Building permit assistance', 'Construction supervision referral'],
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
    title: 'After-Sales Support',
    subtitle: 'Post-Registration · Utilities',
    description: 'Our relationship doesn\'t end at registration. We help you navigate utilities connection, local ward office requirements, and any follow-up documentation needed after the sale.',
    steps: ['Electricity & water connection guidance', 'Ward office formalities', 'Boundary wall & access permit', 'Ongoing advisory support'],
  },
];

export default async function ServicesPage() {
  const siteData = await getSiteData();
  const { settings } = siteData;

  const pages = (siteData as any).pages as PageRecord[] ?? [];
  const show  = (id: string) => isSectionEnabled(pages, 'services', id);
  const heroSec = getSection(pages, 'services', 'hero');
  const ctaSec  = getSection(pages, 'services', 'cta');

  const heroTitle    = heroSec.data.title   || 'Full-Service Land Solutions';
  const heroSubtitle = heroSec.data.subtitle || 'From your first inquiry to registration and beyond — we guide you through every step of buying land in Nepal.';
  const ctaHeading   = ctaSec.data.heading  || 'Ready to Get Started?';
  const ctaSubtext   = ctaSec.data.subtext  || settings.tagline || 'Speak with one of our property consultants for a free consultation — no commitments required.';

  // Merge CMS services with the defaults (CMS takes priority if they exist)
  const cmsServices = siteData.services;

  return (
    <>
      {/* Hero */}
      {show('hero') && <section className="page-hero-band" style={{ background: 'var(--color-secondary)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: 'var(--color-primary)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="animate-slide-right" style={{ display: 'inline-block', background: 'rgba(204,20,20,0.15)', border: '1px solid rgba(204,20,20,0.4)', color: '#FF6B6B', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.35rem 1rem', borderRadius: '4px', marginBottom: '1.25rem' }}>
            What We Offer
          </span>
          <h1 className="animate-slide-up delay-100" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.15 }}>
            {heroTitle}
          </h1>
          <p className="animate-fade-in delay-200" style={{ color: '#A0A0A0', fontSize: '1.1rem', maxWidth: '560px', lineHeight: 1.75 }}>
            {heroSubtitle}
          </p>
        </div>
      </section>}

      {/* Services grid */}
      <section style={{ padding: '5rem 0', background: 'var(--color-accent)' }}>
        <div className="container">
          <ServicesDetailGrid services={cmsServices.length > 0 ? cmsServices.map((s: any, i: number) => ({
            icon: ALL_SERVICES[i % ALL_SERVICES.length]?.icon,
            title: s.title,
            subtitle: s.subtitle || '',
            description: s.description,
            steps: Array.isArray(s.processSteps) ? s.processSteps : [],
          })) : ALL_SERVICES} />
        </div>
        <style>{`
          .services-detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem; }
          @media (max-width: 900px) { .services-detail-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 560px) { .services-detail-grid { grid-template-columns: 1fr; } }
        `}</style>
      </section>

      {/* CTA — contact method cards */}
      {show('cta') && <section style={{ padding: '4rem 0 5rem', background: 'var(--color-accent)' }}>
        <div className="container">
          <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 900, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
              {ctaHeading}
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.95rem', margin: 0 }}>{ctaSubtext}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>

            {/* Call */}
            <a href={`tel:${settings.contactPhone || ''}`} className="animate-slide-up delay-100" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '52px', height: '52px', background: '#FEE2E2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Call Us</div>
                <div style={{ fontWeight: 800, color: 'var(--color-secondary)', fontSize: '1rem' }}>{settings.contactPhone || 'Get in touch'}</div>
              </div>
            </a>

            {/* Email */}
            <a href={`mailto:${settings.contactEmail || ''}`} className="animate-slide-up delay-200" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '52px', height: '52px', background: '#FEE2E2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Email Us</div>
                <div style={{ fontWeight: 800, color: 'var(--color-secondary)', fontSize: '1rem' }}>{settings.contactEmail || 'Send a message'}</div>
              </div>
            </a>

            {/* Book a visit */}
            <Link href="/contact" className="animate-slide-up delay-300" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 4px 16px rgba(204,20,20,0.25)' }}>
              <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Book a Visit</div>
                <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1rem' }}>Free Consultation</div>
              </div>
            </Link>

          </div>
        </div>
      </section>}
    </>
  );
}
