import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getSiteData, getSection, isSectionEnabled, type PageRecord, getSeoMeta } from '@/lib/cms';
import ContactForm from './ContactForm';
import ContactActions from './ContactActions';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta('static', 'contact');
  const title = seo?.title || 'Contact Us | KTM Plots';
  const description = seo?.description || 'Get in touch with KTM Plots for a free consultation, site visit, or property inquiry.';
  const ogImg = seo?.ogImages?.[0] || seo?.ogImage;
  return {
    title, description,
    ...(seo?.keywords?.length && { keywords: seo.keywords }),
    openGraph: { title, description, type: 'website', ...(ogImg && { images: [{ url: ogImg, width: 1200, height: 630, alt: title }] }) },
    twitter: { card: 'summary_large_image', title, description, ...(ogImg && { images: [ogImg] }) },
  };
}


export default async function ContactPage() {
  const siteData = await getSiteData();
  const { settings } = siteData;

  const pages = (siteData as any).pages as PageRecord[] ?? [];
  const show  = (id: string) => isSectionEnabled(pages, 'contact', id);
  const heroSec  = getSection(pages, 'contact', 'hero');
  const formSec  = getSection(pages, 'contact', 'form');
  const infoSec  = getSection(pages, 'contact', 'info');
  const mapSec   = getSection(pages, 'contact', 'map');

  const heroTitle        = heroSec.data.title       || 'Contact Us';
  const heroSubtitle     = heroSec.data.subtitle    || "Have a question about a plot or want to schedule a free site visit? Our team is ready to help.";
  const formTitle        = formSec.data.title       || "We\u2019d Love to Hear from You";
  const formDescription  = formSec.data.description || "Whether you're a first-time buyer, an experienced investor, or an NRN looking to invest in Nepal — our team is here to guide you every step of the way.";
  const officeHours      = infoSec.data.hours       || null;
  const mapEmbedUrl      = mapSec.data.embedUrl     || null;

  const contactItems = [
    ...(settings.address ? [{ icon: 'location', label: 'Address', value: settings.address, href: null }] : []),
    ...(settings.contactPhone ? [{ icon: 'phone', label: 'Phone', value: settings.contactPhone, href: `tel:${settings.contactPhone}` }] : []),
    ...(settings.contactEmail ? [{ icon: 'email', label: 'Email', value: settings.contactEmail, href: `mailto:${settings.contactEmail}` }] : []),
  ];

  return (
    <>
      {/* Header */}
      {show('hero') && <div className="page-hero-band" style={{ background: 'var(--color-secondary)', padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        {/* Red left accent — brand marker */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: 'var(--color-primary)' }} />
        <div className="container">
          <div className="tag-label animate-slide-right">Get In Touch</div>
          <h1 className="animate-slide-up delay-100" style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem' }}>{heroTitle}</h1>
          <p className="animate-fade-in delay-200" style={{ color: '#A0A0A0', maxWidth: '480px', lineHeight: 1.7 }}>
            {heroSubtitle}
          </p>
        </div>
      </div>}

      <section style={{ padding: '4rem 0 5rem', background: 'var(--color-accent)' }}>
        <div className="container">
          {/* Quick action cards */}
          <ContactActions />

          <div className="contact-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            {/* Contact info */}
            {show('info') && <div className="animate-slide-right">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>{formTitle}</h2>
              <p style={{ color: '#4B5563', lineHeight: 1.8, marginBottom: '2rem' }}>
                {formDescription}
              </p>

              {contactItems.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  {contactItems.map((item) => (
                    <div key={item.label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '42px', height: '42px', background: 'var(--color-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {item.icon === 'location' && (
                          <svg width="18" height="18" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        )}
                        {item.icon === 'phone' && (
                          <svg width="18" height="18" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 5 5l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        )}
                        {item.icon === 'email' && (
                          <svg width="18" height="18" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>{item.value}</a>
                        ) : (
                          <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem' }}>{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Office hours */}
              <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>Office Hours</h4>
                {officeHours ? (
                  <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{officeHours}</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4B5563' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Sunday – Friday</span><span style={{ fontWeight: 600 }}>9:00 AM – 6:00 PM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Saturday</span><span style={{ fontWeight: 600 }}>10:00 AM – 4:00 PM</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Map embed */}
              {show('map') && mapEmbedUrl && (
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E7EB', marginTop: '0.5rem' }}>
                  <iframe src={mapEmbedUrl} width="100%" height="220" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              )}
            </div>}

            {/* Contact form */}
            {show('form') && <div className="animate-slide-up delay-200">
              <Suspense fallback={<div style={{ height: '400px' }} />}>
                <ContactForm />
              </Suspense>
            </div>}
          </div>
        </div>
      </section>
    </>
  );
}
