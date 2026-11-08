import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { Banner } from '@bettergov/kapwa/banner';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  loadMarkdownContent,
  type MarkdownContent,
} from '../lib/markdownLoader';
import { createMarkdownComponents } from '../lib/markdownComponents';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { getTypographyTheme } from '../lib/typographyThemes';
import {
  serviceCategories,
  governmentCategories,
  getCategorySubcategories,
  isNestedCategory,
  type Subcategory,
  type CategoryIndex,
} from '../data/yamlLoader';
import SEO from '../components/SEO';
import ServiceGuideOverview from '../components/ServiceGuideOverview';
import { readServiceGuide } from '../lib/serviceGuide';

interface DocumentProps {
  theme?: string;
  categoryType?: 'service' | 'government';
}

export default function Document({
  theme: initialTheme = 'default',
  categoryType,
}: DocumentProps) {
  const { documentSlug, category } = useParams();
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const [markdownContent, setMarkdownContent] =
    useState<MarkdownContent | null>(null);
  const [nestedIndex, setNestedIndex] = useState<CategoryIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const markdownComponents = createMarkdownComponents(
    getTypographyTheme(initialTheme)
  );

  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: 'Home', href: '/' },
  ]);

  useEffect(() => {
    let active = true;
    setNestedIndex(null);
    setMarkdownContent(null);
    if (!documentSlug || !category || !categoryType) {
      setError('notFound');
      setLoading(false);
      return;
    }

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const isGovernment = categoryType === 'government';
        const categories = isGovernment
          ? governmentCategories.categories
          : serviceCategories.categories;
        const sectionLabel = isGovernment ? 'Government' : 'Services';
        const sectionHref = isGovernment ? '/government' : '/services';
        const categoryData = categories.find(c => c.slug === category);
        if (!categoryData) throw new Error('Category not found');

        // If the slug maps to its own index, render it as a nested listing
        if (isNestedCategory(documentSlug)) {
          const index = await getCategorySubcategories(documentSlug);
          if (!active) return;
          setNestedIndex(index);
          setBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: sectionLabel, href: sectionHref },
            {
              label: categoryData?.category ?? category,
              href: `${sectionHref}/${category}`,
            },
            {
              label: documentSlug,
              href: `${sectionHref}/${category}/${documentSlug}`,
            },
          ]);
          return;
        }

        const content = await loadMarkdownContent(
          documentSlug,
          category,
          categoryType,
          lang
        );
        if (!active) return;
        if (!content.content.trim()) throw new Error('Content unavailable');
        setMarkdownContent(content);

        setBreadcrumbs([
          { label: 'Home', href: '/' },
          { label: sectionLabel, href: sectionHref },
          {
            label: categoryData?.category ?? category,
            href: `${sectionHref}/${category}`,
          },
          {
            label: content.title ?? documentSlug,
            href: `${sectionHref}/${category}/${documentSlug}`,
          },
        ]);
      } catch {
        if (active) setError('notFound');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadContent();
    return () => {
      active = false;
    };
  }, [documentSlug, category, categoryType, lang]);

  if (loading) {
    return (
      <Section className="p-3 mb-12">
        <div role="status">
          <Banner type="info" description={t('document.loading')} />
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="p-3 mb-12">
        <SEO title={t('document.notFound')} noIndex />
        <Breadcrumbs className="mb-8" items={breadcrumbs} />
        <Banner
          type="error"
          title={t('document.notFound')}
          description={t('document.recovery')}
          icon
        />
        <div className="flex flex-wrap gap-4 mt-6">
          <Link
            to="/services"
            className="inline-flex min-h-11 items-center font-semibold text-primary-700 underline"
          >
            {t('services.viewAll')}
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center font-semibold text-primary-700 underline"
          >
            {t('nav.home')}
          </Link>
        </div>
      </Section>
    );
  }

  if (nestedIndex) {
    const nestedPages: Subcategory[] = nestedIndex.pages;
    const sectionHref =
      categoryType === 'government' ? '/government' : '/services';
    return (
      <>
        <SEO
          title={documentSlug}
          keywords={`${documentSlug}, government services, local government`}
        />
        <Section className="p-3 mb-12">
          <Breadcrumbs className="mb-8" items={breadcrumbs} />
          {nestedIndex.title && (
            <Heading level={2}>{nestedIndex.title}</Heading>
          )}
          {nestedIndex.description && (
            <Text className="text-gray-600 mb-4">
              {nestedIndex.description}
            </Text>
          )}
          {nestedIndex.layout === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nestedPages.map((page, i) => (
                <Link
                  key={page.slug ?? i}
                  to={`${sectionHref}/${documentSlug}/${page.slug}`}
                  className="block h-full"
                >
                  <Card hoverable className="h-full">
                    <CardContent>
                      <h4 className="text-lg font-medium text-gray-900">
                        {page.name}
                      </h4>
                      {page.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {page.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {nestedPages.map((page, i) => (
                <Link
                  key={page.slug ?? i}
                  to={`${sectionHref}/${documentSlug}/${page.slug}`}
                  className="block"
                >
                  <Card hoverable className="mb-4">
                    <CardContent>
                      <h4 className="text-lg font-medium text-gray-900">
                        {page.name}
                      </h4>
                      {page.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {page.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Section>
      </>
    );
  }

  if (!markdownContent) {
    return null;
  }

  const guide = readServiceGuide(markdownContent.data?.guide);
  const guideTitle = markdownContent.title ?? documentSlug ?? '';
  const articleContent = guide
    ? markdownContent.content.replace(/^#\s+.+\n+/, '')
    : markdownContent.content;

  return (
    <>
      <SEO
        title={markdownContent.title || documentSlug}
        description={
          markdownContent.description ||
          `Government service information for ${documentSlug}`
        }
        keywords={`${documentSlug}, government services, public services, local government`}
      />
      <Section className={guide ? 'mb-12' : 'p-3 mb-12'}>
        <Breadcrumbs className="mb-8" items={breadcrumbs} />
        {markdownContent.isFallbackLang && (
          <Banner
            type="info"
            description={t('document.fallbackNotice')}
            className="mb-4"
          />
        )}
        {guide && (
          <>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900 mb-6">
              {guideTitle}
            </h1>
            <ServiceGuideOverview
              key={`${category}/${documentSlug}`}
              guide={guide}
              title={guideTitle}
            />
          </>
        )}
        <article className="mb-8 markdown-content max-w-4xl">
          {!guide && markdownContent.description && (
            <p className="text-base text-gray-700 mb-6 leading-relaxed">
              {markdownContent.description}
            </p>
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {articleContent}
          </ReactMarkdown>
        </article>
      </Section>
    </>
  );
}
