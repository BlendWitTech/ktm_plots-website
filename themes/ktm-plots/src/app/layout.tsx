import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};
import './globals.css';
import { getSiteData } from '@/lib/cms';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  return {
    title: {
      default: settings.siteTitle || 'Mero CMS',
      template: `%s | ${settings.siteTitle || 'Mero CMS'}`,
    },
    description: settings.tagline || 'The modular CMS that adapts to every project',
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}

// Map font name → Google Fonts URL fragment
const GOOGLE_FONTS: Record<string, string> = {
  'Poppins': 'Poppins:wght@300;400;500;600;700;800;900',
  'Montserrat': 'Montserrat:wght@400;500;600;700;800;900',
  'Roboto': 'Roboto:wght@300;400;500;700;900',
  'Nunito': 'Nunito:wght@400;500;600;700;800;900',
  'Lato': 'Lato:wght@300;400;700;900',
  'Playfair Display': 'Playfair+Display:wght@400;500;600;700;800;900',
  'Raleway': 'Raleway:wght@400;500;600;700;800;900',
  'Open Sans': 'Open+Sans:wght@300;400;600;700;800',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = await getSiteData();
  const { settings } = siteData;
  const mainMenu = siteData.menus.find((m) => m.slug === 'main-nav');

  const containerMaxWidth = (settings as any).containerMaxWidth || '1280';
  const containerPaddingX = (settings as any).containerPaddingX || '1.5rem';
  const primaryColor = settings.primaryColor || '#CC1414';
  const secondaryColor = settings.secondaryColor || '#1E1E1E';
  const accentColor = settings.accentColor || '#F4F4F4';

  // Derive a dark variant: simple 15% darkening approximation via mix
  // We embed it directly in CSS vars
  const headingFont = settings.headingFont || '';
  const bodyFont = settings.bodyFont || '';

  // Collect unique Google Fonts to load
  const fontsToLoad = new Set<string>();
  if (headingFont && GOOGLE_FONTS[headingFont]) fontsToLoad.add(GOOGLE_FONTS[headingFont]);
  if (bodyFont && GOOGLE_FONTS[bodyFont]) fontsToLoad.add(GOOGLE_FONTS[bodyFont]);
  const googleFontsUrl = fontsToLoad.size > 0
    ? `https://fonts.googleapis.com/css2?${Array.from(fontsToLoad).map(f => `family=${f}`).join('&')}&display=swap`
    : null;

  const headingFontStack = headingFont
    ? `'${headingFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
    : `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  const bodyFontStack = bodyFont
    ? `'${bodyFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
    : `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

  const cssVars = `:root {
  --container-max-width: ${parseInt(containerMaxWidth)}px;
  --container-padding-x: ${containerPaddingX};
  --color-primary: ${primaryColor};
  --color-primary-dark: color-mix(in srgb, ${primaryColor} 80%, #000);
  --color-primary-light: color-mix(in srgb, ${primaryColor} 80%, #fff);
  --color-secondary: ${secondaryColor};
  --color-secondary-dark: color-mix(in srgb, ${secondaryColor} 80%, #000);
  --color-accent: ${accentColor};
  --font-heading: ${headingFontStack};
  --font-body: ${bodyFontStack};
}`;

  return (
    <html lang="en">
      <head>
        {googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontsUrl} />
          </>
        )}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body>
        <Header siteData={siteData} menu={mainMenu} />
        <main>{children}</main>
        <Footer siteData={siteData} />
        <FloatingActions phone={settings.contactPhone} />
      </body>
    </html>
  );
}
