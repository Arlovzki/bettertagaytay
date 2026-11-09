import { useSearchParams } from 'react-router-dom';
import { CITY_DOCUMENTS, filterCityDocuments } from '../lib/city-finances';
import { date } from '../lib/format';

export default function CityDocuments() {
  const [params, setParams] = useSearchParams();
  const documents = CITY_DOCUMENTS.documents;
  const types = [...new Set(documents.map(document => document.title))].sort();
  const quarters = ['Q4', 'Q3', 'Q2', 'Q1', 'annual'];
  const years = [
    ...new Set(documents.map(document => String(document.listingYear))),
  ]
    .sort()
    .reverse();
  const year = years.includes(params.get('documentYear') ?? '')
    ? (params.get('documentYear') ?? '')
    : '';
  const limit = Math.max(24, Number(params.get('limit')) || 24);
  const query = params.get('q') ?? '';
  const rawQuarter = params.get('quarter') ?? '';
  const rawType = params.get('type') ?? '';
  const quarter = quarters.includes(rawQuarter) ? rawQuarter : '';
  const type = types.includes(rawType) ? rawType : '';
  const filtered = filterCityDocuments(documents, {
    query,
    quarter,
    type,
    year,
  });
  const shown = filtered.slice(0, limit);
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.delete('limit');
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const clear = () => {
    const next = new URLSearchParams(params);
    ['q', 'quarter', 'type', 'documentYear', 'limit'].forEach(key =>
      next.delete(key)
    );
    setParams(next, { replace: true, preventScrollReset: true });
  };
  return (
    <section
      id="city-documents"
      className="section city-documents"
      aria-labelledby="city-documents-h"
    >
      <div className="city-section-heading">
        <div>
          <p className="eyebrow">Official document library</p>
          <h2 id="city-documents-h">Read the city’s disclosures</h2>
        </div>
        <a href={CITY_DOCUMENTS.sourceUrl} target="_blank" rel="noopener">
          All years on the city website ↗
        </a>
      </div>
      <p className="city-library-intro">
        {documents.length} PDFs, including older financial statements and
        development-fund reports. Listing year follows the city’s website; the
        report may cover a different period.
      </p>
      <div className="toolbar city-document-filters">
        <label className="field field-grow">
          <span className="label">Find a document</span>
          <input
            type="search"
            value={query}
            placeholder="e.g. education, cash flows"
            onChange={event => change('q', event.target.value)}
          />
        </label>
        <label className="field">
          <span className="label">Listing year</span>
          <select
            value={year}
            onChange={event => change('documentYear', event.target.value)}
          >
            <option value="">All years</option>
            {years.map(value => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="label">Listed quarter</span>
          <select
            value={quarter}
            onChange={event => change('quarter', event.target.value)}
          >
            <option value="">All quarters</option>
            {quarters.map(value => (
              <option key={value} value={value}>
                {value === 'annual' ? 'Not specified' : value}
              </option>
            ))}
          </select>
        </label>
        <label className="field city-type-filter">
          <span className="label">Document type</span>
          <select
            value={type}
            onChange={event => change('type', event.target.value)}
          >
            <option value="">All document types</option>
            {types.map(value => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="city-library-count">
        <p role="status">
          {filtered.length} of {documents.length} documents
        </p>
        {(query || quarter || type || year) && (
          <button type="button" className="link-button" onClick={clear}>
            Clear filters
          </button>
        )}
      </div>
      {filtered.length ? (
        <ul className="city-document-list">
          {shown.map(document => (
            <li key={document.id}>
              <div>
                <h3>
                  <a href={document.url} target="_blank" rel="noopener">
                    {document.title}
                  </a>
                </h3>
                <p>
                  {document.quarter === 'annual'
                    ? `${document.listingYear} listing`
                    : `${document.quarter} · ${document.listingYear} listing`}{' '}
                  · PDF ·{' '}
                  {(document.bytes / 1_000_000).toLocaleString('en-PH', {
                    maximumFractionDigits: 1,
                  })}{' '}
                  MB
                </p>
              </div>
              <a
                className="button button-quiet"
                href={document.url}
                target="_blank"
                rel="noopener"
                aria-label={`Open ${document.title}, ${document.quarter === 'annual' ? `${document.listingYear} listing` : `${document.quarter}, ${document.listingYear} listing`} PDF`}
              >
                Open PDF ↗
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="city-empty">
          <h3>No documents match</h3>
          <p>Try a different keyword or clear the filters.</p>
          <button type="button" className="button button-quiet" onClick={clear}>
            Show all documents
          </button>
        </div>
      )}
      {filtered.length > shown.length && (
        <button
          type="button"
          className="button button-quiet city-load-more"
          onClick={() => {
            const next = new URLSearchParams(params);
            next.set('limit', String(limit + 24));
            setParams(next, { replace: true, preventScrollReset: true });
          }}
        >
          Show more documents ({filtered.length - shown.length} remaining)
        </button>
      )}
      {CITY_DOCUMENTS.unavailableDocuments.length > 0 && (
        <details className="city-unavailable">
          <summary>
            {CITY_DOCUMENTS.unavailableDocuments.length} unavailable PDF{' '}
            {CITY_DOCUMENTS.unavailableDocuments.length === 1
              ? 'link'
              : 'links'}
          </summary>
          <ul className="plain-list">
            {CITY_DOCUMENTS.unavailableDocuments.map(document => (
              <li key={document.url}>
                {document.title} · {document.quarter}, {document.listingYear}{' '}
                listing · {document.reason}.{' '}
                <a
                  href={CITY_DOCUMENTS.sourceUrl}
                  target="_blank"
                  rel="noopener"
                >
                  Check the city’s listing
                </a>
                .
              </li>
            ))}
          </ul>
        </details>
      )}
      <p className="fine">
        PDF links checked {date(CITY_DOCUMENTS.checkedAt)}. Library filters do
        not change the selected summary.
      </p>
    </section>
  );
}
