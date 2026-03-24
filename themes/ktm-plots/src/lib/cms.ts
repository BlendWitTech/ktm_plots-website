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
  seo?: { title?: string; description?: string; ogImage?: string } | null;
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
  seo?: { title?: string; description?: string } | null;
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
    footerText: null,
    contactEmail: null,
    contactPhone: null,
    address: null,
    socialLinks: null,
    activeTheme: 'ktm-plots',
    heroTitle: null,
    heroSubtitle: null,
    heroBgImage: null,
    heroBgVideo: null,
    aboutTitle: null,
    aboutContent: null,
    aboutImage: null,
    ctaText: null,
    ctaUrl: null,
    metaDescription: null,
    headingFont: null,
    bodyFont: null,
    secondaryColor: null,
    accentColor: null,
    listingMode: null,
  },
  menus: [],
  services: [],
  testimonials: [],
  recentPosts: [],
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function getSiteData(): Promise<SiteData> {
  try {
    const res = await fetch(`${API}/public/site-data`, { next: { revalidate: 10 } });
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
    const res = await fetch(`${API}/plots/public/featured`, { next: { revalidate: 10 } });
    if (!res.ok) return [];
    return res.json();
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
    const res = await fetch(`${API}/plots/public/list?${q}`, { next: { revalidate: 10 } });
    if (!res.ok) return { data: [], total: 0, page: 1, limit: 10 };
    return res.json();
  } catch {
    return { data: [], total: 0, page: 1, limit: 10 };
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const res = await fetch(`${API}/public/pages/${slug}`, { next: { revalidate: 10 } });
    if (!res.ok) return null;
    return res.json();
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
    const res = await fetch(`${API}/plot-categories`, { next: { revalidate: 10 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getPlotBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API}/plots/public/${slug}`, { next: { revalidate: 10 } });
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
    const res = await fetch(`${API}/categories`, { next: { revalidate: 10 } });
    if (!res.ok) return [];
    return res.json();
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
    const res = await fetch(`${API}/posts/public?${q}`, { next: { revalidate: 10 } });
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
    const res = await fetch(`${API}/posts/public/${slug}`, { next: { revalidate: 10 } });
    if (!res.ok) return null;
    const p = await res.json();
    if (!p) return null;
    return { ...p, featuredImageUrl: p.featuredImageUrl ?? p.coverImage ?? null };
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
