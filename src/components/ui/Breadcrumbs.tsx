import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
  label: string;
  href?: string;
}
interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({
  items,
  className = '',
}: BreadcrumbsProps) {
  const { pathname } = useLocation();
  const { t } = useTranslation('common');
  const segments = pathname.split('/').filter(Boolean);
  const generated: BreadcrumbItem[] = [
    { label: t('nav.home'), href: '/' },
    ...segments.map((segment, index) => ({
      label: segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      href: '/' + segments.slice(0, index + 1).join('/'),
    })),
  ];
  const breadcrumbs = items ?? generated;

  return (
    <nav
      className={`text-sm text-gray-700 ${className}`}
      aria-label={t('nav.breadcrumb')}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {breadcrumbs.map((item, index) => (
          <li
            key={index}
            className="inline-flex items-center gap-2 min-w-0 max-w-full"
          >
            {index === 0 ? (
              <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronRight
                className="h-4 w-4 shrink-0 text-gray-700"
                aria-hidden="true"
              />
            )}
            {item.href && index < breadcrumbs.length - 1 ? (
              <Link
                to={item.href}
                className="inline-flex items-center min-h-11 hover:text-primary-700 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-gray-900 font-medium break-words"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
