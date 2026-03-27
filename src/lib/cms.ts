const API = process.env.NEXT_PUBLIC_CMS_API_URL || process.env.CMS_API_URL || 'http://localhost:3001';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  footerText: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  socialLinks: Record<string, string> | null;
  activeTheme: string | null;
  // Customisable section content (editable via Admin > Settings)
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroBgImage: string | null;
  heroBgVideo: string | null;
  aboutTitle: string | null;
  aboutContent: string | null;
  aboutImage: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  metaDescription: string | null;
  headingFont: string | null;
  bodyFont: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  listingMode: string | null;
}

export interface SiteData {
  settings: SiteSettings;
  menus: Menu[];
  services: Service[];
  testimonials: Testimonial[];
  recentPosts: Post[];
}

export interface Menu {
  id: string;
  name: string;
  slug: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  target?: string;
  children?: MenuItem[];
}

export interface Service {
  id: string;
  title: string;
  slug?: string;
  description: string;
  icon: string | null;
  order?: number;
}

export interface Testimonial {
  id: string;
  name: string;        // mapped from clientName in backend
  role: string | null; // mapped from clientRole in backend
  content: string;
  rating: number | null;
  avatarUrl: string | null; // mapped from clientPhoto in backend
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImageUrl: string | null; // mapped from coverImage in backend
  status: string;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  author?: { name: string };
  categories?: { name: string; slug: string }[];
  seo?: { title?: string; description?: string; keywords?: string[]; ogImage?: string; ogImages?: string[] } | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  featuredImageUrl: string | null; // mapped from coverImage in backend
  images: string[];
  featured: boolean;
  status: string | null;
  location: string | null;
  priceFrom: string | null;
  priceTo: string | null;
  areaFrom: string | null;
  areaTo: string | null;
  facing: string | null;
  roadAccess: string | null;
  attributes: Record<string, string | number | boolean> | null;
  category?: { name: string; slug: string };
  seo?: { title?: string; description?: string; keywords?: string[]; ogImage?: string; ogImages?: string[] } | null;
  createdAt: string;
  plotNumber: string | null;
  landType: string | null;
  latitude: number | null;
  longitude: number | null;
  mapUrl: string | null;
  totalPlots: number | null;
  availablePlots: number | null;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
}

// ─── Fallback data (used when backend is unreachable) ─────────────────────────

const FALLBACK_SITE_DATA: SiteData = {
  settings: {
    siteTitle: 'KTM Plots',
    tagline: "Kathmandu Valley's Trusted Land Partner",
    logoUrl: null,
    faviconUrl: null,
    primaryColor: '#CC1414',
    secondaryColor: '#111827',
    accentColor: null,
    footerText: '© 2025 KTM Plots. All rights reserved.',
    contactEmail: 'info@ktmplots.com.np',
    contactPhone: '+977 9800000000',
    address: 'Kathmandu, Nepal',
    socialLinks: { facebook: '#', instagram: '#', youtube: '#' },
    activeTheme: 'ktm-plots',
    heroTitle: 'Find Your Perfect Plot in Kathmandu Valley',
    heroSubtitle: 'Verified land plots with clear title deeds across Kathmandu, Lalitpur, and Bhaktapur. Your dream home starts here.',
    heroBgImage: null,
    heroBgVideo: null,
    aboutTitle: 'Kathmandu Valley\'s Most Trusted Land Partner',
    aboutContent: 'KTM Plots has been helping families and investors find the right land in the Kathmandu Valley for over a decade. We specialise in verified plots with clear legal documentation, transparent pricing, and end-to-end registration support. Our team of property experts, legal consultants, and site coordinators are with you at every step — from your first site visit to the final deed transfer.',
    aboutImage: null,
    ctaText: 'Browse Available Plots',
    ctaUrl: '/plots',
    metaDescription: 'Find verified land plots in Kathmandu Valley. KTM Plots offers premium residential and commercial plots with clear title deeds and full legal support.',
    headingFont: null,
    bodyFont: null,
    listingMode: null,
  },
  menus: [
    {
      id: 'main-nav',
      name: 'Main Navigation',
      slug: 'main-nav',
      items: [
        { id: '1', label: 'Home', url: '/', order: 1 },
        { id: '2', label: 'About', url: '/about', order: 2 },
        { id: '3', label: 'Plots', url: '/plots', order: 3 },
        { id: '4', label: 'Services', url: '/services', order: 4 },
        { id: '5', label: 'Blog', url: '/blog', order: 5 },
        { id: '6', label: 'Contact', url: '/contact', order: 6 },
      ],
    },
    {
      id: 'footer-links',
      name: 'Footer Links',
      slug: 'footer-links',
      items: [
        { id: '7', label: 'Privacy Policy', url: '/privacy', order: 1 },
        { id: '8', label: 'Terms of Service', url: '/terms', order: 2 },
        { id: '9', label: 'Contact Us', url: '/contact', order: 3 },
      ],
    },
  ],
  services: [
    { id: '1', title: 'Land Plot Sales', slug: 'land-plot-sales', description: 'We offer premium land plots at strategic locations across the Kathmandu Valley with clear legal documentation and hassle-free registration support.', icon: 'map-pin', order: 1 },
    { id: '2', title: 'Legal Documentation', slug: 'legal-documentation', description: 'Full support for land registration, title verification, and ownership transfer. Our legal team ensures a smooth and transparent process.', icon: 'file-text', order: 2 },
    { id: '3', title: 'Site Visit Arrangement', slug: 'site-visit', description: 'We arrange guided site visits with our property experts so you can experience the land, neighbourhood, and access roads before you decide.', icon: 'eye', order: 3 },
    { id: '4', title: 'Investment Consulting', slug: 'investment-consulting', description: 'Expert advice on land value trends, growth corridors, and investment potential in Kathmandu Valley\'s fast-growing areas.', icon: 'trending-up', order: 4 },
    { id: '5', title: 'Home Construction Referral', slug: 'home-construction-referral', description: 'Connect with trusted architects and construction firms to begin building your dream home right after purchase.', icon: 'home', order: 5 },
    { id: '6', title: 'After-Sales Support', slug: 'after-sales-support', description: 'Dedicated post-sale assistance for utility connections, local government processes, and neighbourhood onboarding.', icon: 'headphones', order: 6 },
  ],
  testimonials: [
    { id: '1', name: 'Ramesh Shrestha', role: 'Homeowner, Bhaktapur', content: 'KTM Plots made the entire process incredibly smooth. The legal documentation was handled professionally and we moved into our new plot within weeks. Highly recommended!', rating: 5, avatarUrl: null },
    { id: '2', name: 'Sunita Tamang', role: 'Investor, Lalitpur', content: 'I purchased two plots through KTM Plots for investment. Their team gave me excellent guidance on the most promising growth corridors. Very happy with my decision.', rating: 5, avatarUrl: null },
    { id: '3', name: 'Bikash Adhikari', role: 'First-time Buyer, Kathmandu', content: 'As a first-time buyer I was nervous, but the KTM Plots team guided me through every step. Transparent pricing and no hidden charges — exactly what I needed.', rating: 5, avatarUrl: null },
    { id: '4', name: 'Puja Maharjan', role: 'NRN Buyer, UK', content: 'Bought a plot from the UK without visiting Nepal. KTM Plots handled everything remotely including video site visits and digital documentation. Outstanding service!', rating: 5, avatarUrl: null },
  ],
  recentPosts: [
    { id: '1', title: 'How to Buy Land in Nepal: A Complete Guide for 2024', slug: 'how-to-buy-land-nepal-guide-2024', excerpt: 'Everything you need to know before purchasing land in Nepal — from choosing the right location to completing legal registration.', content: '', featuredImageUrl: null, status: 'published', featured: true, publishedAt: '2024-01-15T00:00:00Z', createdAt: '2024-01-15T00:00:00Z', categories: [{ name: 'Land Buying Guide', slug: 'land-buying-guide' }] },
    { id: '2', title: 'Top 5 Emerging Areas for Land Investment in Kathmandu Valley', slug: 'top-5-emerging-areas-land-investment-kathmandu', excerpt: 'Discover the five fastest-growing areas in Kathmandu Valley where land values are expected to double in the next five years.', content: '', featuredImageUrl: null, status: 'published', featured: true, publishedAt: '2024-02-10T00:00:00Z', createdAt: '2024-02-10T00:00:00Z', categories: [{ name: 'Investment Tips', slug: 'investment-tips' }] },
    { id: '3', title: '5 Things to Check Before Signing a Land Deed', slug: '5-things-check-before-signing-land-deed', excerpt: "Don't sign until you've verified these 5 critical elements of your land registration.", content: '', featuredImageUrl: null, status: 'published', featured: true, publishedAt: '2024-03-05T00:00:00Z', createdAt: '2024-03-05T00:00:00Z', categories: [{ name: 'Land Buying Guide', slug: 'land-buying-guide' }] },
  ],
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function getSiteData(): Promise<SiteData> {
  try {
    const res = await fetch(`${API}/public/site-data`, { next: { revalidate: 10 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    return {
      ...FALLBACK_SITE_DATA,
      ...data,
      settings: { ...FALLBACK_SITE_DATA.settings, ...data.settings },
      menus: data.menus ?? [],
      services: data.services ?? [],
      testimonials: data.testimonials ?? [],
      recentPosts: data.recentPosts ?? [],
    };
  } catch {
    return FALLBACK_SITE_DATA;
  }
}

export async function getFeaturedPlots(): Promise<Project[]> {
  try {
    const res = await fetch(`${API}/plots/public/featured`, { next: { revalidate: 10 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getPlots(params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
}): Promise<ProjectsResponse> {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.category) q.set('category', params.category);
  if (params?.status) q.set('status', params.status);
  if (params?.search) q.set('search', params.search);
  try {
    const res = await fetch(`${API}/plots/public/list?${q}`, { next: { revalidate: 10 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { data: [], total: 0, page: 1, limit: 10 };
    return await res.json();
  } catch {
    return { data: [], total: 0, page: 1, limit: 10 };
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const res = await fetch(`${API}/public/pages/${slug}`, { next: { revalidate: 10 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}


export interface PlotCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export async function getPlotCategories(): Promise<PlotCategory[]> {
  try {
    const res = await fetch(`${API}/plot-categories`, { next: { revalidate: 10 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getPlotBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API}/plots/public/${slug}`, { next: { revalidate: 10 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const p = await res.json();
    if (!p) return null;
    return { ...p, featuredImageUrl: p.featuredImageUrl ?? p.coverImage ?? null, images: p.images ?? p.gallery ?? [] };
  } catch {
    return null;
  }
}

export async function getPostCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 10 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getPosts(params?: {
  page?: number;
  limit?: number;
  category?: string;
}): Promise<{ data: Post[]; total: number }> {
  const q = new URLSearchParams({ status: 'PUBLISHED' });
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.category) q.set('category', params.category);
  try {
    const res = await fetch(`${API}/posts/public?${q}`, { next: { revalidate: 10 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { data: [], total: 0 };
    const json = await res.json();
    // Backend returns { posts, pagination: { total } } — normalise to { data, total }
    const mapPost = (p: any): Post => ({ ...p, featuredImageUrl: p.featuredImageUrl ?? p.coverImage ?? null });
    if (Array.isArray(json)) return { data: json.map(mapPost), total: json.length };
    if (json.posts) return { data: json.posts.map(mapPost), total: json.pagination?.total ?? json.posts.length };
    return { data: (json.data ?? []).map(mapPost), total: json.total ?? 0 };
  } catch {
    return { data: [], total: 0 };
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API}/posts/public/${slug}`, { next: { revalidate: 10 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const p = await res.json();
    if (!p) return null;
    return { ...p, featuredImageUrl: p.featuredImageUrl ?? p.coverImage ?? null };
  } catch {
    return null;
  }
}

export interface SeoMetaData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogImages?: string[];
}

export async function getSeoMeta(pageType: string, pageId?: string): Promise<SeoMetaData | null> {
  try {
    const path = pageId
      ? `${API}/seo-meta/${encodeURIComponent(pageType)}/${encodeURIComponent(pageId)}`
      : `${API}/seo-meta/${encodeURIComponent(pageType)}`;
    const res = await fetch(path, { next: { revalidate: 10 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function submitLead(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const { source, ...rest } = data;
    // Use the local Next.js API proxy so browser requests are same-origin (no CORS).
    // The proxy route forwards server-to-server to the backend.
    const res = await fetch('/api/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rest, originPage: source }),
    });
    const json = await res.json();
    if (!res.ok || json.success === false) return { success: false, message: json.message || 'Failed to submit.' };
    return { success: true, message: json.message };
  } catch {
    return { success: false, message: 'Network error. Please try again.' };
  }
}

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API}/${path.replace(/^\//, '')}`;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-NP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Page Section types & helpers ────────────────────────────────────────────

export interface PageSectionItem {
  id: string;
  enabled: boolean;
  data: Record<string, any>;
}

export interface PageRecord {
  id: string;
  slug: string;
  title: string;
  data: { sections?: PageSectionItem[] } | null;
}

/**
 * Get a section's config from siteData.pages for a given page + section id.
 * Returns { enabled, data } — enabled defaults to true if section isn't stored yet.
 */
export function getSection(
  pages: PageRecord[],
  pageSlug: string,
  sectionId: string
): { enabled: boolean; data: Record<string, any> } {
  const page = pages.find((p) => p.slug === pageSlug);
  const sections: PageSectionItem[] = (page?.data as any)?.sections ?? [];
  const section = sections.find((s) => s.id === sectionId);
  return {
    enabled: section ? section.enabled !== false : true,
    data: section?.data ?? {},
  };
}

/** Shorthand to check if a section is visible. Defaults to true. */
export function isSectionEnabled(
  pages: PageRecord[],
  pageSlug: string,
  sectionId: string
): boolean {
  return getSection(pages, pageSlug, sectionId).enabled;
}

/**
 * Render CMS content (plain text, markdown-like, or HTML) to safe HTML string.
 * - If the content already contains block-level HTML tags, returns it as-is.
 * - Otherwise, parses basic markdown: headings, bold, italic, lists, paragraphs.
 */
export function renderContent(raw: string | null | undefined): string {
  if (!raw) return '';

  // If it already looks like HTML, return as-is
  if (/<(p|h[1-6]|ul|ol|li|div|table|blockquote|pre)\b/i.test(raw)) {
    return raw;
  }

  const lines = raw.split('\n');
  const result: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Inline transforms
    const inline = (s: string) =>
      s
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Headings
    if (/^### /.test(line)) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(`<h3>${inline(line.slice(4))}</h3>`);
      continue;
    }
    if (/^## /.test(line)) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(`<h2>${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (/^# /.test(line)) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(`<h2>${inline(line.slice(2))}</h2>`);
      continue;
    }

    // Unordered list items
    if (/^[-*] /.test(line)) {
      if (!inList) { result.push('<ul>'); inList = true; }
      result.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }

    // Close list if we hit a non-list line
    if (inList) {
      result.push('</ul>');
      inList = false;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      result.push('<hr/>');
      continue;
    }

    // Blank line = paragraph break
    if (line.trim() === '') {
      // skip, handled by paragraph grouping below
      result.push('');
      continue;
    }

    result.push(inline(line));
  }

  if (inList) result.push('</ul>');

  // Group non-empty, non-tag lines into <p> blocks
  const html: string[] = [];
  let para: string[] = [];

  for (const r of result) {
    if (r === '') {
      if (para.length > 0) {
        html.push(`<p>${para.join('<br/>')}</p>`);
        para = [];
      }
    } else if (/^<(h[1-6]|ul|ol|hr|blockquote|pre)/.test(r)) {
      if (para.length > 0) {
        html.push(`<p>${para.join('<br/>')}</p>`);
        para = [];
      }
      html.push(r);
    } else {
      para.push(r);
    }
  }
  if (para.length > 0) html.push(`<p>${para.join('<br/>')}</p>`);

  return html.join('\n');
}
