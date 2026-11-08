import { useState, useEffect, useRef } from 'react';
import {
  X,
  Menu,
  ChevronDown,
  Phone,
  Thermometer,
  Clock,
  DollarSign,
} from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import { useFooterBlend } from '../../hooks/useFooterBlend';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useLiveData,
  weatherSource,
  forexSource,
} from '../../hooks/useLiveData';

function formatDatetime() {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Manila',
  };
  return {
    full:
      new Intl.DateTimeFormat('en-PH', { ...options, year: 'numeric' }).format(
        now
      ) + ' PHT',
    compact: new Intl.DateTimeFormat('en-PH', options).format(now) + ' PHT',
    iso: now.toISOString(),
  };
}

const HOTLINES = [
  { labelKey: 'hotlines.police', number: '(046) 413-1282', tel: '0464131282' },
  {
    labelKey: 'hotlines.hospital',
    number: '(046) 423-3195',
    tel: '0464233195',
  },
  { labelKey: 'hotlines.fire', number: '(046) 483-1193', tel: '0464831193' },
  { labelKey: 'hotlines.cdrrmo', number: '(046) 483-0446', tel: '0464830446' },
  { labelKey: 'hotlines.cho', number: '(046) 483-0604', tel: '0464830604' },
  { labelKey: 'hotlines.cswdo', number: '(046) 483-0494', tel: '0464830494' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hotlinesOpen, setHotlinesOpen] = useState(false);
  const [datetime, setDatetime] = useState(formatDatetime());
  const navRef = useRef<HTMLElement>(null);
  const blendFooter = useFooterBlend(navRef);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const hotlineToggleRef = useRef<HTMLButtonElement>(null);
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const weather = useLiveData(weatherSource);
  const forex = useLiveData(forexSource);

  useEffect(() => {
    const timer = setInterval(() => setDatetime(formatDatetime()), 60_000);
    const closeOutside = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setActiveMenu(null);
        setIsOpen(false);
        setHotlinesOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => {
      clearInterval(timer);
      document.removeEventListener('pointerdown', closeOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveMenu(null);
    setHotlinesOpen(false);
  }, [location.pathname, location.hash]);

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMenu(null);
    setHotlinesOpen(false);
  };
  const toggleNavigation = (menu: string) => {
    setActiveMenu(current => (current === menu ? null : menu));
    setHotlinesOpen(false);
  };
  const isActive = (href: string) =>
    href === '/'
      ? location.pathname === '/'
      : !href.includes('#') && location.pathname.startsWith(href);
  const label = (item: { label: string; translationKey?: string }) =>
    item.translationKey ? t(item.translationKey, item.label) : item.label;
  const languages = (
    <div
      className="flex items-center rounded-lg border border-gray-300 overflow-hidden"
      aria-label={t('nav.language')}
    >
      {(['en', 'fil'] as const).map(lang => (
        <button
          key={lang}
          type="button"
          lang={lang}
          aria-label={lang === 'en' ? 'English' : 'Filipino'}
          aria-pressed={i18n.resolvedLanguage === lang}
          onClick={() => void i18n.changeLanguage(lang)}
          className={`min-h-11 min-w-11 px-3 text-xs font-bold ${i18n.resolvedLanguage === lang ? 'bg-primary-700 text-white' : 'bg-white text-gray-700 hover:bg-primary-50'}`}
        >
          {lang === 'en' ? 'EN' : 'FIL'}
        </button>
      ))}
    </div>
  );

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 shrink-0"
      data-footer-blend={blendFooter}
      onKeyDown={event => {
        if (event.key !== 'Escape') return;
        if (hotlinesOpen) hotlineToggleRef.current?.focus();
        else if (isOpen) mobileToggleRef.current?.focus();
        else if (activeMenu)
          navRef.current
            ?.querySelector<HTMLButtonElement>(
              `button[aria-controls="desktop-${activeMenu}"]`
            )
            ?.focus();
        closeMenu();
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setActiveMenu(null);
          setHotlinesOpen(false);
        }
      }}
    >
      <div
        className="header-landscape-base absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-200 ${blendFooter ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      />
      <div
        className={`relative border-b border-gray-200 text-xs text-gray-700 transition-colors duration-200 ${blendFooter ? 'bg-transparent' : 'bg-gray-50'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-[auto_1fr] sm:flex sm:flex-wrap sm:justify-end items-center gap-x-4 pb-1 sm:pb-0">
          <span className="order-1 sm:order-2 inline-flex items-center gap-1.5 min-h-11">
            <Thermometer className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Tagaytay{' '}
            {weather.data
              ? `${weather.data.temp}°C`
              : t(weather.error ? 'liveData.unavailable' : 'liveData.loading')}
          </span>
          <span className="order-3 sm:order-1 inline-flex items-center gap-1.5 min-h-7">
            <DollarSign className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {forex.data
              ? `1 USD = ₱${forex.data}`
              : t(
                  forex.error
                    ? 'liveData.ratesUnavailable'
                    : 'liveData.ratesLoading'
                )}
          </span>
          <time
            dateTime={datetime.iso}
            className="order-4 sm:order-3 inline-flex items-center justify-self-end gap-1.5 min-h-7 text-right"
          >
            <Clock
              className="hidden sm:block h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <span className="sm:hidden">{datetime.compact}</span>
            <span className="hidden sm:inline">{datetime.full}</span>
          </time>
          <div className="relative order-2 sm:order-4 justify-self-end">
            <button
              ref={hotlineToggleRef}
              type="button"
              aria-label={t('nav.emergencyHotlines')}
              aria-expanded={hotlinesOpen}
              aria-controls="emergency-hotlines"
              onClick={() => {
                setHotlinesOpen(!hotlinesOpen);
                setIsOpen(false);
                setActiveMenu(null);
              }}
              className="flex items-center gap-2 min-h-11 text-primary-800 font-semibold hover:underline"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sm:hidden">{t('nav.emergencyShort')}</span>
              <span className="hidden sm:inline">
                {t('nav.emergencyHotlines')}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${hotlinesOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {hotlinesOpen && (
              <div
                id="emergency-hotlines"
                role="region"
                aria-label={t('nav.emergencyHotlines')}
                className="absolute top-full right-0 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-300 bg-white p-2 shadow-lg"
              >
                {HOTLINES.map(h => (
                  <a
                    key={h.labelKey}
                    href={`tel:${h.tel}`}
                    className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-sm hover:bg-primary-50"
                  >
                    <strong>{t(h.labelKey)}</strong>
                    <span className="tabular-nums">{h.number}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[4.5rem] sm:h-20 gap-4">
          <Link
            to="/"
            className="flex items-center shrink-0"
            onClick={closeMenu}
          >
            <img
              src="/logo.png"
              alt="BetterTagaytay"
              className="h-12 sm:h-14 w-auto"
              width="1692"
              height="608"
            />
          </Link>
          <nav
            aria-label={t('nav.primary')}
            className="hidden xl:flex items-center gap-1"
          >
            {mainNavigation.map(item => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={activeMenu === item.label}
                      aria-controls={`desktop-${item.label}`}
                      onClick={() => toggleNavigation(item.label)}
                      className={`flex min-h-11 items-center gap-1 px-3 text-sm font-medium rounded-lg hover:bg-primary-50 ${isActive(item.href) ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}`}
                    >
                      {label(item)}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${activeMenu === item.label ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    {activeMenu === item.label && (
                      <div
                        id={`desktop-${item.label}`}
                        className="absolute top-full left-0 pt-1 w-64 z-50"
                      >
                        <ul className="py-1 bg-white rounded-xl shadow-lg border border-gray-300 max-h-[65vh] overflow-y-auto">
                          <li>
                            <Link
                              to={item.href}
                              onClick={closeMenu}
                              className="flex min-h-11 items-center px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
                            >
                              {t('nav.overview', { section: label(item) })}
                            </Link>
                          </li>
                          {item.children.map(child => (
                            <li key={child.href}>
                              <Link
                                to={child.href}
                                onClick={closeMenu}
                                aria-current={
                                  location.pathname === child.href
                                    ? 'page'
                                    : undefined
                                }
                                className="flex min-h-11 items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                              >
                                {label(child)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    onClick={closeMenu}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`inline-flex min-h-11 items-center px-3 text-sm font-medium rounded-lg hover:bg-primary-50 ${isActive(item.href) ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}`}
                  >
                    {label(item)}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">{languages}</div>
            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                setActiveMenu(null);
                setHotlinesOpen(false);
              }}
              aria-label={t(isOpen ? 'nav.closeMenu' : 'nav.openMenu')}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              className="xl:hidden flex items-center justify-center w-11 h-11 rounded-lg text-gray-700 hover:bg-primary-50"
            >
              {isOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {isOpen && (
          <nav
            id="mobile-navigation"
            aria-label={t('nav.primary')}
            className="xl:hidden border-t border-gray-200 bg-white max-h-[calc(100dvh-11rem)] overflow-y-auto"
          >
            <div className="px-4 py-3 space-y-1">
              {mainNavigation.map(item => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={activeMenu === item.label}
                        aria-controls={`mobile-${item.label}`}
                        onClick={() => toggleNavigation(item.label)}
                        className="w-full flex justify-between items-center min-h-11 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg"
                      >
                        {label(item)}
                        <ChevronDown
                          className={`h-4 w-4 ${activeMenu === item.label ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      {activeMenu === item.label && (
                        <ul id={`mobile-${item.label}`} className="ml-4 mt-1">
                          <li>
                            <Link
                              to={item.href}
                              onClick={closeMenu}
                              className="flex min-h-11 items-center px-3 py-2 text-sm font-semibold text-primary-700"
                            >
                              {t('nav.overview', { section: label(item) })}
                            </Link>
                          </li>
                          {item.children.map(child => (
                            <li key={child.href}>
                              <Link
                                to={child.href}
                                onClick={closeMenu}
                                className="flex min-h-11 items-center px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded-lg"
                              >
                                {label(child)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={closeMenu}
                      className="flex min-h-11 items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg"
                    >
                      {label(item)}
                    </Link>
                  )}
                </div>
              ))}
              <div className="sm:hidden pt-3 border-t border-gray-200">
                {languages}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
