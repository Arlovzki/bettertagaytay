import { useSearchParams } from 'react-router-dom';
import {
  CITY_DEVELOPMENT,
  DEVELOPMENT_PERIODS,
  developmentPeriod,
  type DevelopmentReview,
} from '../lib/city-development';
import {
  CITY_DOCUMENTS,
  CITY_FINANCES,
  centavos,
  cityReview,
} from '../lib/city-finances';
import { date, php } from '../lib/format';
import CityDevelopment from './CityDevelopment';
import CityReportControls from './CityReportControls';

function FundReview({ review }: { review: DevelopmentReview }) {
  const { source, figures } = review;
  const calculated = figures.filter(figure => figure.components.length);
  const pages = review.citedPages.map(page => (
    <a
      key={page}
      href={`${source.url}#page=${page}`}
      target="_blank"
      rel="noopener"
    >
      p. {page} ↗
    </a>
  ));
  const projects = CITY_FINANCES.periods.find(
    period => period.id === review.id
  )?.development;
  return (
    <>
      <div className="city-review-heading">
        <div>
          <h2>Development Fund · {review.label}</h2>
          <p aria-live="polite">Checked {date(CITY_DEVELOPMENT.checkedOn)}</p>
        </div>
      </div>
      <p className="city-period-note">{review.summary}</p>
      <dl className={`city-stats city-stats-${figures.length}`}>
        {figures.map(figure => (
          <div key={figure.id}>
            <dt>{figure.label}</dt>
            <dd
              className={`city-stat${figure.centavos === null ? ' city-stat-missing' : ''}`}
            >
              {figure.centavos === null
                ? centavos(null)
                : php(figure.centavos / 100)}
            </dd>
            {figure.centavos !== null && (
              <dd className="city-exact">{centavos(figure.centavos)}</dd>
            )}
            <dd className="city-stat-help">
              {figure.help}{' '}
              <a
                href={`${source.url}#page=${figure.sourcePage}`}
                target="_blank"
                rel="noopener"
              >
                Source, p. {figure.sourcePage}
              </a>
            </dd>
          </div>
        ))}
      </dl>
      <div className="city-source-line city-fund-sources">
        <span>Official report: {pages}</span>
        <a href={source.copyUrl} target="_blank" rel="noopener">
          Checked PDF copy ↗
        </a>
      </div>
      {review.notes.length > 0 && (
        <div className="city-return-notes">
          {review.notes.map(note => (
            <p key={note}>{note}</p>
          ))}
        </div>
      )}
      {projects ? (
        <CityDevelopment development={projects} />
      ) : (
        calculated.length > 0 && (
          <details className="city-project-details">
            <summary>See the entries used in the calculations</summary>
            {calculated.map(figure => (
              <div className="city-fund-calculation" key={figure.id}>
                <h3>{figure.label}</h3>
                <dl>
                  {figure.components.map(entry => (
                    <div key={entry.label}>
                      <dt>{entry.label}</dt>
                      <dd>{centavos(entry.centavos)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </details>
        )
      )}
      <section
        className="city-method city-fund-method"
        aria-label="Development Fund verification"
      >
        <details>
          <summary>How to read these figures</summary>
          <div className="city-method-body">
            <p>
              Listed cost is the amount shown for a project or programme. Cost
              incurred to date is the cost the city records up to the report
              date. It does not show how much cash was paid or how much work was
              completed.
            </p>
            <p>
              “Not stated in report” means the source gives no numeric amount.
              Blank cells and dashes are left unknown. The summaries keep the
              totals printed in the source and label any sums calculated from
              individual rows.
            </p>
            <p>
              Each report is read on its own. Figures from different periods are
              not added together.
            </p>
            <details className="city-fingerprint">
              <summary>File fingerprint</summary>
              <code>{source.sha256}</code>
            </details>
          </div>
        </details>
        <p className="fine">
          <a
            href={`mailto:arloubeloria@gmail.com?subject=${encodeURIComponent('Correction: Tagaytay Development Fund')}&body=${encodeURIComponent(`Period: ${review.label}\nPage: https://transparency.bettertagaytay.org/city-finances?report=development&fundPeriod=${review.id}\nReport and page number:\nWhat needs correcting:\nSupporting source:\n`)}`}
          >
            Report incorrect information
          </a>
        </p>
      </section>
    </>
  );
}

export default function CityFundHistory() {
  const [params, setParams] = useSearchParams();
  const period = params.get('fundPeriod');
  const income = cityReview(params.get('period'));
  const review = period
    ? developmentPeriod(period)
    : developmentPeriod(income.id, income.year);
  const select = (period: string) => {
    const next = new URLSearchParams(params);
    next.set('fundPeriod', period);
    setParams(next, { preventScrollReset: true });
  };
  return (
    <section
      className="section city-report"
      aria-label="Development Fund summaries"
    >
      <CityReportControls
        periods={DEVELOPMENT_PERIODS}
        selected={review}
        onSelect={select}
      />
      {'source' in review ? (
        <FundReview key={review.id} review={review} />
      ) : (
        <div className="city-empty" role="status">
          <h2>Development Fund · {review.label}</h2>
          <p>
            The city lists this report, but its PDF is unavailable. There is no
            verified summary for this period.
          </p>
          <a href={CITY_DOCUMENTS.sourceUrl} target="_blank" rel="noopener">
            Check the city’s disclosure page ↗
          </a>
        </div>
      )}
    </section>
  );
}
