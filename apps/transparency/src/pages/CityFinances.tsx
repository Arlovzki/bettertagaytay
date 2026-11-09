import { lazy, Suspense, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { PageHead } from '../components/Chrome';
import CityDocuments from '../components/CityDocuments';
import CityReportControls from '../components/CityReportControls';
import {
  CITY_FINANCES,
  centavos,
  cityReview,
  citySource,
  percent,
} from '../lib/city-finances';
import { date, php } from '../lib/format';
import { usePageSeo } from '../lib/use-page-seo';

const CityFundHistory = lazy(() => import('../components/CityFundHistory'));

function FinanceBars({
  rows,
  total,
}: {
  rows: { label: string; centavos: number }[];
  total: number;
}) {
  return (
    <ul className="city-bars">
      {rows.map(row => (
        <li key={row.label}>
          <div className="city-bar-label">
            <span>{row.label}</span>
            <strong>{centavos(row.centavos)}</strong>
          </div>
          <span className="sense-track" aria-hidden="true">
            <span style={{ width: `${percent(row.centavos, total)}%` }} />
          </span>
          <span className="city-share">
            {percent(row.centavos, total).toLocaleString('en-PH', {
              maximumFractionDigits: 2,
            })}
            % of the reported total
          </span>
        </li>
      ))}
    </ul>
  );
}

function CityIncomeSummary() {
  const [params, setParams] = useSearchParams();
  const review = cityReview(params.get('period'));
  const source = citySource(review.sourceId);
  const select = (period: string) => {
    const next = new URLSearchParams(params);
    next.set('period', period);
    setParams(next, { preventScrollReset: true });
  };
  const income = review.incomeBreakdown;
  const expense = review.expenseBreakdown;
  const largestIncome = income.rows.reduce((largest, row) =>
    row.centavos > largest.centavos ? row : largest
  );
  const sourceUrl = `${source.url}#page=${review.citedPages[0]}`;
  return (
    <section
      className="section city-report"
      aria-label="Income and expenditure summaries"
    >
      <CityReportControls
        periods={CITY_FINANCES.periods}
        selected={review}
        onSelect={select}
      />
      <div className="city-review-heading">
        <div>
          <h2>Inside the {review.label}</h2>
          <p aria-live="polite">
            {review.scope} · Checked {date(review.checkedOn)}
          </p>
        </div>
      </div>
      <p className="city-period-note">{review.periodBasis}</p>
      <dl className={`city-stats city-stats-${review.metrics.length}`}>
        {review.metrics.map(metric => (
          <div key={metric.id}>
            <dt>{metric.label}</dt>
            <dd
              className={`city-stat${metric.centavos === null ? ' city-stat-missing' : ''}`}
            >
              {metric.centavos === null
                ? centavos(null)
                : php(metric.centavos / 100)}
            </dd>
            {metric.centavos !== null && (
              <dd className="city-exact">{centavos(metric.centavos)}</dd>
            )}
            <dd className="city-stat-help">
              {metric.help}{' '}
              <a
                href={`${source.url}#page=${metric.sourcePage}`}
                target="_blank"
                rel="noopener"
              >
                Source, p. {metric.sourcePage}
              </a>
            </dd>
          </div>
        ))}
      </dl>
      <p className="city-source-line">
        <a href={sourceUrl} target="_blank" rel="noopener">
          Official statement · pages {review.citedPages.join(', ')} ↗
        </a>
        <span>City figures are separate from national proposals.</span>
      </p>
      {review.notes.length > 0 && (
        <div className="city-return-notes">
          {review.notes.map(note => (
            <p key={note}>{note}</p>
          ))}
        </div>
      )}
      <section
        className="section"
        aria-label="Income and expenditure breakdowns"
      >
        <div className="sense-grid city-sense-grid">
          <article className="sense-card">
            <h2>{income.title}</h2>
            <p className="sense-intro">{income.note}</p>
            <FinanceBars rows={income.rows} total={income.totalCentavos} />
            <p className="sense-takeaway">
              <strong>In plain language:</strong> Of every ₱100 in this reported
              income or receipts total, about ₱
              {Math.round(
                percent(largestIncome.centavos, income.totalCentavos)
              )}{' '}
              is listed under <strong>{largestIncome.label}</strong>.
            </p>
          </article>
          <article className="sense-card">
            {expense ? (
              <>
                <h2>{expense.title}</h2>
                <p className="sense-intro">{expense.note}</p>
                <FinanceBars
                  rows={expense.rows}
                  total={expense.totalCentavos}
                />
              </>
            ) : (
              <>
                <h2>No expenditure statement in this PDF</h2>
                <p>
                  This is a receipts-only statement. It does not provide an
                  expenditure total, so the portal does not fill one in.
                </p>
              </>
            )}
            <details className="city-reading-key">
              <summary>What the financial terms mean</summary>
              <dl className="terms city-terms">
                <div>
                  <dt>Operating expenditure</dt>
                  <dd>
                    Costs reported for running city services. Capital
                    expenditure is shown separately.
                  </dd>
                </div>
                <div>
                  <dt>Total expenditure</dt>
                  <dd>
                    The expenditure total in an older report. Its scope can
                    include capital and debt-related costs; it is not relabelled
                    as operating expenditure.
                  </dd>
                </div>
                <div>
                  <dt>Not stated in report</dt>
                  <dd>
                    No numeric amount appears for that field in the selected
                    source. A blank or dash is not treated as zero and does not
                    tell us whether work has started.
                  </dd>
                </div>
              </dl>
            </details>
          </article>
        </div>
        <p className="fine">
          Source:{' '}
          <a href={sourceUrl} target="_blank" rel="noopener">
            {review.label}, pages {review.citedPages.join(', ')}
          </a>
          . Percentages are calculated from the displayed amounts. These are
          city-reported figures, not an independent audit or evidence of project
          completion. Different returns and budget versions are never added
          together.
        </p>
      </section>
      <section
        className="city-method section"
        aria-label="Summary verification"
      >
        <details>
          <summary>How this summary was checked</summary>
          <div className="city-method-body">
            <p>
              The amounts and period headings were checked against the source
              PDF pages. Where an income or expenditure breakdown is shown, its
              rows reconcile to the displayed total. Dates come from the PDF
              heading, which can differ from its website folder. Only reviewed
              periods appear in the summary selector.
            </p>
            <p>
              {review.periodBasis} {review.scope}.
            </p>
            <p>
              Approved budgets, targets, prior-year actuals and variance columns
              are not substituted for the selected return’s actual totals. Older
              total-receipts and total-expenditure layouts retain their own
              labels. Quarterly returns are not added or used to calculate
              year-on-year changes.
            </p>
            <p>
              <a href={source.url} target="_blank" rel="noopener">
                {source.title}
              </a>{' '}
              ·{' '}
              <a href={source.copyUrl} target="_blank" rel="noopener">
                Checked PDF copy
              </a>
            </p>
            <details className="city-fingerprint">
              <summary>File fingerprint</summary>
              <code>{source.sha256}</code>
            </details>
            <p>
              Summary verification applies to the figures presented here. Other
              library PDFs have had their links checked; their financial
              contents have not all been transcribed or reviewed.
            </p>
          </div>
        </details>
        <p className="fine">
          <a
            href={`mailto:arloubeloria@gmail.com?subject=${encodeURIComponent('Correction: Tagaytay city finances')}&body=${encodeURIComponent(`Period: ${review.label}\nPage: https://transparency.bettertagaytay.org/city-finances?period=${review.id}\nReport and page number:\nWhat needs correcting:\nSupporting source:\n`)}`}
          >
            Report incorrect information
          </a>{' '}
          · <Link to="/about">About the portal</Link>
        </p>
      </section>
    </section>
  );
}

export default function CityFinances() {
  usePageSeo();
  const { hash } = useLocation();
  const [params] = useSearchParams();
  const showFund = params.get('report') === 'development';
  const incomeParams = new URLSearchParams(params);
  incomeParams.delete('report');
  const fundParams = new URLSearchParams(params);
  fundParams.set('report', 'development');
  useEffect(() => {
    if (hash)
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ block: 'start' });
  }, [hash]);
  return (
    <main id="main-content" tabIndex={-1} className="page main city-page">
      <PageHead
        eyebrow="City Government of Tagaytay · Full Disclosure"
        title="City finances"
      >
        <p>
          Explore the city’s reported income, expenditure and development
          projects.
        </p>
      </PageHead>
      <nav className="city-report-nav" aria-label="City finance reports">
        <Link
          to={{ search: incomeParams.toString() }}
          preventScrollReset
          aria-current={!showFund ? 'page' : undefined}
        >
          Income and expenditure
        </Link>
        <Link
          to={{ search: fundParams.toString() }}
          preventScrollReset
          aria-current={showFund ? 'page' : undefined}
        >
          Development Fund
        </Link>
      </nav>
      {showFund ? (
        <Suspense
          fallback={
            <p className="state" role="status">
              Loading Development Fund reports…
            </p>
          }
        >
          <CityFundHistory />
        </Suspense>
      ) : (
        <CityIncomeSummary />
      )}
      <CityDocuments />
    </main>
  );
}
