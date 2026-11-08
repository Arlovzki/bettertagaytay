import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Briefcase,
  GraduationCap,
  RefreshCw,
  Building2,
  Accessibility,
  FileText,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  loadServiceIndex,
  searchServices,
  type ServiceSearchResult,
} from '../../lib/serviceSearch';
import { popularTasks } from '../../data/popularTasks';
import { landscape } from '../../data/landscape';
import terrain from '../../data/terrain.json';
import RidgeDivider from '../ui/RidgeDivider';
import ContourBackdrop from '../ui/ContourBackdrop';

const taskIcons = {
  business: Briefcase,
  renewal: RefreshCw,
  building: Building2,
  education: GraduationCap,
  assistance: Accessibility,
  forms: FileText,
};

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary-100 text-primary-900 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function Hero() {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [allServices, setAllServices] = useState<ServiceSearchResult[]>([]);
  const [activeResult, setActiveResult] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  // Build search index from category index.yaml files
  useEffect(() => {
    let active = true;
    loadServiceIndex()
      .then(pages => {
        if (active) setAllServices(pages);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = searchServices(allServices, query).slice(0, 8);
  const expanded = showDropdown && query.trim().length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/services?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = (page: ServiceSearchResult) => {
    setShowDropdown(false);
    setQuery('');
    navigate(`/services/${page.categorySlug}/${page.slug}`);
  };

  return (
    <section className="relative bg-gray-50" aria-labelledby="hero-title">
      <ContourBackdrop />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-9 pb-8 sm:pt-12 lg:pt-14 lg:pb-12">
        <div className="grid lg:grid-cols-[1.18fr_1fr] gap-9 lg:gap-16 items-center">
          <div className="min-w-0">
            <a
              href={terrain.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs leading-5 text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-primary-700 transition-colors mb-3"
            >
              {t('terrain.heroReference', { interval: terrain.intervalMetres })}
            </a>
            <h1
              id="hero-title"
              className="text-[2.5rem] sm:text-5xl xl:text-[3.75rem] font-extrabold tracking-tight leading-[1.08] text-primary-900 mb-5 text-balance"
            >
              {t('hero.title')}
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 max-w-lg mb-7">
              {t('hero.subtitle')}
            </p>
            <label
              htmlFor="hero-search"
              className="block text-gray-900 font-semibold text-sm mb-2"
            >
              {t('hero.findService')}
            </label>

            {/* Search input + live dropdown */}
            <div className="relative mb-7">
              <form
                role="search"
                aria-label={t('hero.findService')}
                onSubmit={handleSearch}
                className="flex gap-2"
              >
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 pointer-events-none" />
                  <input
                    ref={inputRef}
                    id="hero-search"
                    type="search"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={expanded}
                    aria-controls="hero-search-results"
                    aria-activedescendant={
                      expanded && activeResult >= 0
                        ? `hero-result-${activeResult}`
                        : undefined
                    }
                    value={query}
                    onChange={e => {
                      setQuery(e.target.value);
                      setActiveResult(-1);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={event => {
                      if (event.key === 'Escape') {
                        setShowDropdown(false);
                        setActiveResult(-1);
                      }
                      if (
                        event.key === 'ArrowDown' ||
                        event.key === 'ArrowUp'
                      ) {
                        event.preventDefault();
                        setShowDropdown(true);
                        setActiveResult(index =>
                          results.length
                            ? (index +
                                (event.key === 'ArrowDown'
                                  ? 1
                                  : results.length - 1) +
                                results.length) %
                              results.length
                            : -1
                        );
                      }
                      if (
                        event.key === 'Enter' &&
                        expanded &&
                        results[activeResult]
                      ) {
                        event.preventDefault();
                        handleSelect(results[activeResult]);
                      }
                      if (event.key === 'Tab') setShowDropdown(false);
                    }}
                    placeholder={t(
                      'hero.searchPlaceholder',
                      'Search for a service...'
                    )}
                    className="w-full min-h-12 border border-gray-500 bg-white rounded-lg pl-10 pr-3 py-3 text-base text-gray-800 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  aria-label={t('search.submit')}
                  className="flex items-center justify-center min-h-12 px-4 shrink-0 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800 transition-colors"
                >
                  {t('search.submit')}
                </button>
              </form>

              {expanded && (
                <div
                  ref={dropdownRef}
                  id="hero-search-results"
                  role="listbox"
                  aria-label={t('search.title')}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-40 max-h-80 overflow-y-auto"
                >
                  {results.map((page, index) => (
                    <button
                      key={`${page.categorySlug}/${page.slug}`}
                      id={`hero-result-${index}`}
                      type="button"
                      role="option"
                      aria-selected={activeResult === index}
                      tabIndex={-1}
                      onMouseDown={e => {
                        e.preventDefault();
                      }}
                      onClick={() => handleSelect(page)}
                      className={`w-full min-h-11 text-left px-4 py-3 text-sm hover:bg-primary-50 transition-colors flex items-center gap-2 ${activeResult === index ? 'bg-primary-50' : ''}`}
                    >
                      <Search className="h-3.5 w-3.5 text-primary-400 shrink-0" />
                      <span className="text-gray-800 flex-1">
                        {highlight(page.name, query)}
                      </span>
                      <span className="text-xs text-gray-700 max-w-24 shrink-0">
                        {page.categoryName}
                      </span>
                    </button>
                  ))}
                  {!results.length && (
                    <div
                      className="px-4 py-3 text-sm text-gray-700"
                      role="status"
                    >
                      {t('search.empty')}
                    </div>
                  )}
                </div>
              )}
            </div>

            <h2 className="text-sm font-semibold text-gray-600 mb-1">
              {t('hero.commonTasks')}
            </h2>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-x-5">
              {popularTasks.map(task => {
                const Icon = taskIcons[task.icon];
                return (
                  <Link
                    key={task.key}
                    to={task.href}
                    className="group flex min-h-14 items-center gap-3 py-3 border-b border-gray-300 hover:text-primary-700 transition-colors text-left"
                  >
                    <Icon
                      className="h-5 w-5 text-primary-700 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-primary-700 leading-snug">
                      {t(`tasks.${task.key}`)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          <figure className="min-w-0 lg:self-stretch flex flex-col">
            <div className="relative flex-1 overflow-hidden rounded-xl bg-primary-100 min-h-60 lg:min-h-[420px]">
              <img
                src="/images/tagaytay-ridge-960.webp"
                srcSet="/images/tagaytay-ridge-480.webp 480w, /images/tagaytay-ridge-960.webp 960w, /images/tagaytay-ridge-1440.webp 1440w"
                sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, calc(100vw - 48px)"
                alt={t('hero.landscapeAlt')}
                width="1440"
                height="1080"
                fetchPriority="high"
                className="w-full h-64 sm:h-80 lg:absolute lg:h-full object-cover object-[57%_60%]"
              />
              <span className="absolute left-4 bottom-4 bg-white text-primary-900 text-xs font-semibold rounded-md px-3 py-2">
                {t('hero.landscapeLocation')}
              </span>
            </div>
            <figcaption className="text-xs leading-relaxed text-gray-600 mt-3">
              {t('hero.landscapeCaption')}{' '}
              <a
                href={landscape.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-primary-700"
              >
                {landscape.author}
              </a>
              {' · '}
              <a
                href={landscape.licenseUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-primary-700"
              >
                {landscape.license}
              </a>
              {' · '}
              {t('hero.landscapeAdaptation')}
            </figcaption>
          </figure>
        </div>
      </div>
      <RidgeDivider />
    </section>
  );
}
