import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  noIndex?: boolean;
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = 'BetterTagaytay.org',
  noIndex = false,
}: SEOProps) {
  const { pathname } = useLocation();
  const { i18n } = useTranslation('common');
  const defaultTitle = 'BetterTagaytay.org | Transparency Portal';
  const defaultDescription =
    import.meta.env.VITE_SITE_DESCRIPTION ||
    'A community transparency portal for Tagaytay City, Cavite. Find government services, officials, budgets, and public information.';
  const defaultKeywords =
    import.meta.env.VITE_SITE_KEYWORDS ||
    'government, local government, services, public services, civic services';

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;
  const baseUrl =
    import.meta.env.VITE_WEBSITE_URL || 'https://bettertagaytay.org';
  const fullUrl = url || new URL(pathname, baseUrl).href;
  const fullImage =
    image ||
    import.meta.env.VITE_OG_IMAGE_URL ||
    new URL('/logo.png', baseUrl).href;
  const twitterHandle = import.meta.env.VITE_TWITTER_HANDLE || '';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={siteName} />
      <meta
        name="robots"
        content={noIndex ? 'noindex, follow' : 'index, follow'}
      />
      <meta
        name="language"
        content={i18n.resolvedLanguage === 'fil' ? 'Filipino' : 'English'}
      />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteName} />
      <meta
        property="og:locale"
        content={i18n.resolvedLanguage === 'fil' ? 'fil_PH' : 'en_PH'}
      />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={fullImage} />
      {twitterHandle && (
        <meta property="twitter:site" content={twitterHandle} />
      )}

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#0066eb" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </Helmet>
  );
}
