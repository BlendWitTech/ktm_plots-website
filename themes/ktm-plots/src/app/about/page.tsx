import type { Metadata } from 'next';
import Image from 'next/image';
import { getSiteData, getImageUrl, getSection, isSectionEnabled, type PageRecord } from '@/lib/cms';
import Services from '@/components/sections/Services';
import AnimatedStatsStrip from '@/components/ui/AnimatedStatsStrip';
import Link from 'next/link';
import TeamSocialIcons from '@/components/ui/TeamSocialIcons';

export const metadata: Metadata = {
  title: 'About Us',
  description: "Learn about KTM Plots — our story, mission, and the team behind Kathmandu Valley's trusted land partner.",
};

// Fallback team if CMS team module is not enabled or empty
const FALLBACK_TEAM = [
  { name: 'Rajesh Gurung',  role: 'CEO & Founder',             bio: '15+ years in Nepali real estate. Expert in land law and property valuation.', image: null },
  { name: 'Sushila Karki',  role: 'Head of Legal',             bio: 'Specialises in land title verification, registration, and property dispute resolution.', image: null },
  { name: 'Bikram Thapa',   role: 'Senior Property Consultant', bio: 'Deep knowledge of growth corridors across Kathmandu, Lalitpur, and Bhaktapur.', image: null },
  { name: 'Anita Shrestha', role: 'Customer Relations',         bio: 'Dedicated to providing a smooth experience from inquiry to final handover.', image: null },
];

function initials(name: string | null | undefined) {
  return (name || '?').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export default async function AboutPage() {
  const siteData = await getSiteData();
  const pages    = (siteData as any).pages as PageRecord[] ?? [];

  // CMS team — falls back to hardcoded if not seeded
  const cmsTeam: any[] = (siteData as any).team ?? [];
  const teamList = cmsTeam.length > 0 ? cmsTeam : FALLBACK_TEAM;

  const show = (id: string) => isSectionEnabled(pages, 'about', id);

  // About page section overrides
  const heroSec  = getSection(pages, 'about', 'hero');
  const heroTitle    = heroSec.data.title    || "Kathmandu Valley's Trusted Land Partner";
  const heroSubtitle = heroSec.data.subtitle || 'Over a decade of helping families and investors secure their perfect plot in Nepal with transparency, legality, and care.';
  const heroBgUrl    = heroSec.data.bgImage  ? getImageUrl(heroSec.data.bgImage) : null;

  const ctaSec      = getSection(pages, 'about', 'cta');
  const ctaTitle    = ctaSec.data.title    || 'Ready to Find Your Plot?';
  const ctaSubtitle = ctaSec.data.subtitle || 'Browse our available plots or get in touch for a free consultation.';
  const ctaBtn      = ctaSec.data.button          as { text?: string; url?: string } | undefined;
  const ctaSecBtn   = ctaSec.data.secondaryButton as { text?: string; url?: string } | undefined;

  const storySec = getSection(pages, 'about', 'story');
  const storyTitle   = storySec.data.title   || 'Our Story';
  const storyContent = storySec.data.content || null;
  const storyImage   = storySec.data.image   ? getImageUrl(storySec.data.image) : null;
  const valueCards = [
    { title: storySec.data.card1Title || 'Our Mission', text: storySec.data.card1Text || 'To make land ownership simple, transparent, and accessible for every Nepali family and investor.' },
    { title: storySec.data.card2Title || 'Our Vision',  text: storySec.data.card2Text || 'A Nepal where every land transaction is backed by verified titles, fair prices, and professional guidance.' },
    { title: storySec.data.card3Title || 'Our Values',  text: storySec.data.card3Text || 'Transparency · Integrity · Legal Compliance · Customer First · Community Growth' },
  ];

  const servicesSec = getSection(pages, 'about', 'services');

  const teamSec     = getSection(pages, 'about', 'team');
  const teamTitle   = teamSec.data.title    || 'Meet Our Team';
  const teamSubtitle = teamSec.data.subtitle || 'The experts dedicated to finding you the perfect plot';

  // Stats from page sections or fallback
  const statsSec = getSection(pages, 'about', 'stats');
  const stats: Array<{ value: string; label: string }> = statsSec.data.items || [
    { value: '500+',  label: 'Plots Sold' },
    { value: '50+',   label: 'Locations' },
    { value: '10+',   label: 'Years Experience' },
    { value: '100%',  label: 'Legal Titles' },
    { value: '1000+', label: 'Happy Clients' },
  ];

  return (
    <>
      {/* Page hero */}
      {show('hero') && <div className="page-hero-band" style={{ background: 'var(--color-secondary)', padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: 'var(--color-primary)' }} />
        {heroBgUrl ? (
          <>
            <Image src={heroBgUrl} alt="About hero background" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.55) 100%)' }} />
          </>
        ) : (
          <div className="about-hero-panel" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%', background: 'linear-gradient(155deg,var(--color-primary),#8B0000)', clipPath: 'polygon(20% 0,100% 0,100% 100%,0% 100%)', opacity: 0.85 }} />
        )}
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="tag-label animate-slide-right">About Us</div>
          <h1 className="animate-slide-up delay-100" style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem', maxWidth: '620px' }}>
            {heroTitle}
          </h1>
          <p className="animate-slide-up delay-200" style={{ color: '#A0A0A0', maxWidth: '540px', lineHeight: 1.75 }}>
            {heroSubtitle}
          </p>
        </div>
      </div>}

      {/* Story section */}
      {show('story') && <section style={{ padding: '5rem 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            <div className="animate-slide-right">
              <h2 className="section-title">{storyTitle}</h2>
              {storyContent ? (
                <div className="prose" dangerouslySetInnerHTML={{ __html: storyContent }} />
              ) : (
                <>
                  <p style={{ color: '#4B5563', lineHeight: 1.8, marginBottom: '1rem' }}>
                    KTM Plots was founded with a simple belief: buying land in Nepal should be transparent, legal, and accessible to everyone — not just those with connections.
                  </p>
                  <p style={{ color: '#4B5563', lineHeight: 1.8, marginBottom: '1rem' }}>
                    We started with a small team of property consultants and legal experts in Kathmandu, and have grown to serve clients across Nepal and internationally, including NRNs investing from abroad.
                  </p>
                  <p style={{ color: '#4B5563', lineHeight: 1.8 }}>
                    Today, KTM Plots manages over 50 active plot locations across Kathmandu, Lalitpur, and Bhaktapur, with a reputation built entirely on trust, verified titles, and honest dealing.
                  </p>
                </>
              )}
            </div>

            {/* Story image OR Mission/Values */}
            {storyImage ? (
              <div className="animate-slide-up delay-100" style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
                <Image src={storyImage} alt="About KTM Plots" fill style={{ objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {valueCards.map((v, i) => (
                  <div key={v.title} className={`animate-scale-in delay-${Math.min(i * 100, 300)}`} style={{ background: 'var(--color-accent)', borderRadius: '10px', padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
                    <h4 style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{v.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7 }}>{v.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>}

      {/* Stats — CMS driven, animated on scroll */}
      {show('stats') && <AnimatedStatsStrip stats={stats} />}

      {/* Team — from CMS TeamMember records */}
      {show('team') && <section style={{ padding: '5rem 0', background: 'var(--color-accent)' }}>
        <div className="container">
          <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="tag-label">Our People</div>
            <h2 className="section-title">{teamTitle}</h2>
            <p className="section-subtitle">{teamSubtitle}</p>
          </div>
          <div className="team-grid">
            {teamList.map((member: any, idx: number) => {
              const photoUrl = member.image ? getImageUrl(member.image) : null;
              return (
                <div key={member.name} className={`animate-slide-up delay-${Math.min(idx * 100, 400)}`} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: '3px solid var(--color-primary)' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--color-secondary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', position: 'relative', flexShrink: 0 }}>
                    {photoUrl ? (
                      <Image src={photoUrl} alt={member.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800 }}>{initials(member.name)}</span>
                    )}
                  </div>
                  <h4 style={{ fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '0.25rem' }}>{member.name}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{member.role}</div>
                  <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.65, marginBottom: '1rem' }}>{member.bio}</p>
                  {/* Contact & social icons — only when configured; CSS hover via global style */}
                  <TeamSocialIcons links={member.socialLinks || {}} />
                </div>
              );
            })}
          </div>
          <style>{`
            .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
            @media (max-width: 1024px) { .team-grid { grid-template-columns: repeat(3, 1fr); } }
            @media (max-width: 700px)  { .team-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 420px)  { .team-grid { grid-template-columns: 1fr; } }
            .team-social-icon { color: #9CA3AF; transition: color 0.2s; }
            .team-social-icon:hover { color: var(--color-primary); }
          `}</style>
        </div>
      </section>}

      {/* Services */}
      {show('services') && <Services services={siteData.services} secData={servicesSec.data} />}

      {/* CTA — horizontal action bar */}
      {show('cta') && <section style={{ padding: '3rem 0', background: '#FFFFFF', borderTop: '1px solid #F0F0F0' }}>
        <div className="container">
          <div className="animate-scale-in" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            background: '#F9F9F9',
            border: '1px solid #EBEBEB',
            borderTop: '4px solid var(--color-primary)',
            borderRadius: '12px',
            padding: 'clamp(1.75rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem)',
          }}>
            <div>
              <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 900, color: 'var(--color-secondary)', marginBottom: '0.35rem' }}>
                {ctaTitle}
              </h3>
              <p style={{ color: '#6B7280', fontSize: '0.95rem', margin: 0 }}>
                {ctaSubtitle}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', flexShrink: 0 }}>
              <Link href={ctaBtn?.url || '/plots'} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                {ctaBtn?.text || 'Browse Plots'}
              </Link>
              {(ctaSecBtn?.text || ctaSecBtn?.url) && (
                <Link href={ctaSecBtn.url || '/contact'} className="btn-outline" style={{ whiteSpace: 'nowrap' }}>
                  {ctaSecBtn.text || 'Contact Us'}
                </Link>
              )}
              {!ctaSecBtn?.text && !ctaSecBtn?.url && (
                <Link href="/contact" className="btn-outline" style={{ whiteSpace: 'nowrap' }}>
                  Contact Us
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>}
    </>
  );
}
