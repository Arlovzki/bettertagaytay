import { useMemo, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePortal } from '../lib/portal-context';
import { date } from '../lib/format';
import { NATIONAL_URL, SOURCE_CODE_URL } from '../lib/links';
import { CITY_DOCUMENTS } from '../lib/city-finances';

const BETTERGOV_LOGO = '/brand/bettergov-horizontal-primary.png';

const NAV = [
  { to: '/', hash: '', label: '2027 proposals' },
  { to: '/gaa', hash: '', label: 'Budgets 2020–2026' },
  { to: '/city-finances', hash: '', label: 'City finances' },
  { to: '/about', hash: '', label: 'About the data' },
];

export function Masthead() {
  const { config, client } = usePortal();
  const { pathname } = useLocation();
  const today = useMemo(
    () =>
      new Date().toLocaleDateString('en-PH', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    []
  );
  return (
    <>
      {config.buildYourOwnStrip !== false && (
        // Above the masthead, so it scrolls away; a plain link to the source.
        <a
          className="build-strip"
          href={SOURCE_CODE_URL}
          target="_blank"
          rel="noopener"
        >
          <span className="build-strip-title">
            Create your own transparency portal
          </span>
          <span className="build-strip-url">
            {SOURCE_CODE_URL.replace(/^https:\/\//, '')}{' '}
            <span aria-hidden="true">→</span>
          </span>
        </a>
      )}
      <header className="masthead">
        <div className="masthead-top">
          <div className="page masthead-top-inner">
            <span className="muted">{today}</span>
            <span className="masthead-links">
              <a href="https://bettertagaytay.org">BetterTagaytay ↗</a>
              <a href={NATIONAL_URL} target="_blank" rel="noopener">
                National picture <span aria-hidden="true">↗</span>
              </a>
              <a href={`${client.base}/docs`} target="_blank" rel="noopener">
                API <span aria-hidden="true">↗</span>
              </a>
              <a href={SOURCE_CODE_URL} target="_blank" rel="noopener">
                Build your own <span aria-hidden="true">↗</span>
              </a>
            </span>
          </div>
        </div>
        <div className="page masthead-main">
          <Link to="/" className="masthead-title">
            {config.logo && (
              <img src={config.logo} alt="" className="masthead-logo" />
            )}
            <span>
              <span className="masthead-kicker">
                National budgets <span aria-hidden="true">·</span> City finances
              </span>
              <span className="masthead-name">{config.name}</span>
            </span>
          </Link>
          {pathname === '/city-finances' ? (
            <a
              className="masthead-with masthead-city-source"
              href={CITY_DOCUMENTS.sourceUrl}
              target="_blank"
              rel="noopener"
            >
              <span className="label">Official source</span>
              <strong>City Government of Tagaytay ↗</strong>
            </a>
          ) : (
            <a
              className="masthead-with"
              href="https://bettergov.ph"
              target="_blank"
              rel="noopener"
            >
              <span className="label">Data from</span>
              <img
                src={BETTERGOV_LOGO}
                alt="BetterGov.ph"
                width="128"
                height="28"
              />
            </a>
          )}
        </div>
        <nav className="subnav" aria-label="Sections">
          <div className="page subnav-inner">
            {NAV.map(n => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.label}
                  to={{ pathname: n.to, hash: n.hash }}
                  className={active ? 'active' : undefined}
                  aria-current={active ? 'page' : undefined}
                  // Re-selecting a section must scroll even when the hash is unchanged.
                  onClick={() => {
                    if (pathname !== n.to) return;
                    if (n.hash)
                      document
                        .getElementById(n.hash.slice(1))
                        ?.scrollIntoView({ block: 'start' });
                    else window.scrollTo(0, 0);
                  }}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
    </>
  );
}

export function Footer() {
  const { config, scope, client } = usePortal();
  const meta = scope.status === 'ready' ? scope.value.meta : null;
  const { pathname } = useLocation();
  const city = pathname === '/city-finances';
  return (
    <footer className="footer">
      <div className="page footer-inner">
        <div className="footer-top">
          <p className="footer-identity">
            <a href={config.operator.url || 'https://bettertagaytay.org'}>
              {config.operator.name}
            </a>
            <span>Community-run. Not an official city website.</span>
          </p>
          <nav className="footer-nav" aria-label="Footer">
            <Link to="/about">About the data</Link>
            <Link to="/city-finances">City finances</Link>
            {config.operator.email && (
              <a href={`mailto:${config.operator.email}`}>Contact</a>
            )}
          </nav>
        </div>
        <div className="footer-bottom">
          {city ? (
            <p className="footer-source">
              Source:{' '}
              <a href={CITY_DOCUMENTS.sourceUrl}>Tagaytay Full Disclosure</a> ·
              links checked {date(CITY_DOCUMENTS.checkedAt)}.
            </p>
          ) : (
            <p className="footer-source">
              Data: <a href={`${client.base}/docs`}>BetterGov.ph</a>
              {meta && <> · snapshot {date(meta.built_at)}</>}. Amounts are not
              spending.
            </p>
          )}
          <details className="footer-details">
            <summary>Sources, notices and credits</summary>
            <div className="footer-detail-body">
              <p>
                Sources: NEP FY 2027 and House Bill 10858, plus the 2020–2026
                GAA. <a href={NATIONAL_URL}>National budget portal</a>.
              </p>
              <p>
                City finances use the{' '}
                <a href={CITY_DOCUMENTS.sourceUrl}>
                  City Government of Tagaytay’s Full Disclosure documents
                </a>
                . Their summaries and checked PDF copies are separate from the
                national-budget figures.
              </p>
              {meta && <p className="footer-notice">{meta.notice}</p>}
              <p>
                Built on the{' '}
                <a href={SOURCE_CODE_URL}>BetterGov.ph transparency portal</a>,
                under the <a href="/LICENSE.txt">MIT license</a>.
              </p>
              <p>
                Elevation contours: USGS SRTM/GMTED2010 via{' '}
                <a href="https://registry.opendata.aws/terrain-tiles/">
                  Mapzen Terrain Tiles
                </a>
                . Area reference ©{' '}
                <a href="https://www.openstreetmap.org/relation/1491134">
                  OpenStreetMap contributors
                </a>
                .{' '}
                <a href="/brand/terrain-attribution.txt">
                  Terrain processing notes
                </a>
                .
              </p>
            </div>
          </details>
        </div>
      </div>
    </footer>
  );
}

export function PageHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="page-head">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <div className="lede">{children}</div>}
    </div>
  );
}
